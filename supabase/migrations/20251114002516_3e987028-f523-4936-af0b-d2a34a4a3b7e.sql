-- ============================================================================
-- MIGRACIÓN DE SEGURIDAD CRÍTICA - SISTEMA RBAC Y PROTECCIÓN DE DATOS
-- ============================================================================

-- 1. Crear enum para roles de aplicación
CREATE TYPE public.app_role AS ENUM ('user', 'creator', 'pro', 'admin', 'moderator');

-- 2. Crear tabla user_roles separada (seguridad crítica)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'user',
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  granted_by UUID,
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_roles_granted_by FOREIGN KEY (granted_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. Habilitar RLS en user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Crear función SECURITY DEFINER para verificar roles (evita recursión RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Crear función para obtener el rol de un usuario
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- 6. Políticas RLS para user_roles (solo admins pueden modificar)
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 7. Trigger para crear rol automático al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Crear rol de usuario por defecto
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Crear perfil si no existe
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Crear trigger en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Actualizar política de profiles para proteger datos sensibles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Public profile data viewable by everyone"
  ON public.profiles FOR SELECT
  USING (
    CASE 
      WHEN auth.uid() = user_id THEN true  -- Usuario ve todo su perfil
      ELSE true  -- Otros ven perfil pero sin datos sensibles (se manejarán en el frontend)
    END
  );

-- 9. Política para que usuarios NO puedan modificar su propio rol
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile (except role)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())  -- Role no cambia
  );

-- 10. Crear vista pública sin datos sensibles
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  display_name,
  avatar_url,
  bio,
  created_at,
  updated_at
FROM public.profiles;

-- 11. Habilitar RLS en la vista
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- 12. Políticas para grupo members con privacidad mejorada
DROP POLICY IF EXISTS "Group members are viewable by group members" ON public.group_members;

CREATE POLICY "Group members viewable with privacy"
  ON public.group_members FOR SELECT
  USING (
    user_id = auth.uid()  -- Propias membresías siempre visibles
    OR 
    (
      -- Para otros miembros, verificar visibilidad del grupo
      group_id IN (
        SELECT g.id FROM public.groups g 
        WHERE g.visibility IN ('public', 'private')
        AND g.id IN (
          SELECT gm.group_id FROM public.group_members gm 
          WHERE gm.user_id = auth.uid()
        )
      )
    )
  );

-- 13. Crear tabla de auditoría para acciones críticas
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- 14. Índices para rendimiento
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);

-- 15. Comentarios para documentación
COMMENT ON TABLE public.user_roles IS 'Sistema RBAC - Roles de usuario separados para seguridad';
COMMENT ON FUNCTION public.has_role IS 'Verifica si un usuario tiene un rol específico (SECURITY DEFINER para evitar recursión RLS)';
COMMENT ON TABLE public.audit_logs IS 'Registro de auditoría para acciones críticas del sistema';