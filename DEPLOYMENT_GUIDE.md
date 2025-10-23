# 🚀 TAMV MD-X4™ — Guía de Despliegue Completa

Esta guía proporciona instrucciones paso a paso para desplegar el ecosistema TAMV MD-X4™ en producción.

---

## 📋 **Pre-requisitos**

### **Herramientas Necesarias**
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Cuenta de Lovable (opcional, para CI/CD automático)
- Dominio personalizado (opcional)

### **Servicios de Cloud**
El proyecto utiliza **Lovable Cloud**, que incluye:
- ✅ PostgreSQL Database
- ✅ Supabase Auth
- ✅ Edge Functions
- ✅ Storage
- ✅ Lovable AI Gateway

---

## 🎯 **Opción 1: Despliegue Automático con Lovable**

### **Paso 1: Push a Lovable**
```bash
# Si usas Lovable como editor
# Los cambios se despliegan automáticamente al hacer commit
# No se requiere configuración adicional
```

### **Paso 2: Configurar Dominio Personalizado**
1. Ve a **Project Settings → Domains**
2. Agrega tu dominio: `app.tudominio.com`
3. Configura los registros DNS:
   ```
   Tipo: CNAME
   Nombre: app
   Valor: cname.lovable.app
   ```
4. Espera la propagación DNS (5-30 minutos)

### **Paso 3: Verificar Edge Functions**
```bash
# Las edge functions se despliegan automáticamente
# Verifica que estén activas en:
# Settings → Functions
```

---

## 🔧 **Opción 2: Despliegue Manual a Vercel**

### **Paso 1: Instalar Vercel CLI**
```bash
npm install -g vercel
```

### **Paso 2: Configurar Variables de Entorno**
Crea un archivo `.env.production`:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu_key_aqui
VITE_SUPABASE_PROJECT_ID=tu_project_id
```

### **Paso 3: Desplegar**
```bash
# Login a Vercel
vercel login

# Deploy
vercel --prod
```

### **Paso 4: Configurar Rewrites (vercel.json)**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🌐 **Opción 3: Despliegue a Netlify**

### **Paso 1: Instalar Netlify CLI**
```bash
npm install -g netlify-cli
```

### **Paso 2: Build**
```bash
npm run build
```

### **Paso 3: Desplegar**
```bash
# Login a Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### **Paso 4: Configurar Redirects (_redirects)**
```
/*    /index.html   200
```

---

## 🗄️ **Configuración de Base de Datos**

### **Paso 1: Tablas Requeridas**

El proyecto requiere las siguientes tablas en Supabase:

#### **profiles**
```sql
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'public' CHECK (role IN ('public', 'creator', 'pro', 'admin')),
  id_nvida JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

#### **analytics_events**
```sql
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_timestamp ON public.analytics_events(timestamp);
```

#### **user_metrics**
```sql
CREATE TABLE public.user_metrics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  quantum_coherence INTEGER DEFAULT 0 CHECK (quantum_coherence >= 0 AND quantum_coherence <= 100),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.user_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own metrics" ON public.user_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can update metrics" ON public.user_metrics
  FOR UPDATE USING (true);
```

#### **security_scans**
```sql
CREATE TABLE public.security_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  scan_type TEXT NOT NULL,
  threat_level TEXT NOT NULL CHECK (threat_level IN ('none', 'low', 'medium', 'high', 'critical')),
  threat_score INTEGER,
  threats TEXT[],
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_security_scans_user_id ON public.security_scans(user_id);
```

#### **ai_interactions**
```sql
CREATE TABLE public.ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  ai_agent TEXT DEFAULT 'isabella',
  interaction_type TEXT,
  duration_ms INTEGER,
  sentiment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_ai_interactions_user_id ON public.ai_interactions(user_id);
```

### **Paso 2: Ejecutar Migraciones**
Las migraciones se pueden ejecutar:
1. Desde el editor SQL de Supabase
2. Con `supabase db push` si usas CLI local

---

## 🔐 **Configuración de Seguridad**

### **1. Row Level Security (RLS)**
Asegúrate de que TODAS las tablas tengan RLS habilitado:
```sql
ALTER TABLE public.tu_tabla ENABLE ROW LEVEL SECURITY;
```

### **2. Configurar Auth**
En Lovable Cloud → Settings → Auth:
- ✅ Enable Email Signup
- ✅ Auto Confirm Email (para desarrollo)
- ✅ Enable JWT expiration
- JWT expiration: 3600 segundos

### **3. CORS**
Ya configurado en las Edge Functions con:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

---

## 🎨 **Assets y Recursos**

### **Imágenes**
Las imágenes están en `/src/assets/`:
- `hero-quantum.jpg` - Hero background
- `metaverse-space.jpg` - Metaverse background

### **Fuentes**
Para la intro cinemática 3D, descarga la fuente Inter Bold:
```bash
# Descargar de Google Fonts y colocar en:
public/fonts/inter_bold.json
```

### **Audio (Opcional)**
Para audio espacial:
```
public/audio/quantum-intro.ogg
```

---

## 📊 **Monitoreo y Analytics**

### **1. Logs de Edge Functions**
Ver logs en tiempo real:
```bash
# En Lovable Cloud
Settings → Functions → Ver Logs
```

### **2. Analytics Dashboard**
Métricas disponibles en:
```
https://tu-app.com/dashboard
```

### **3. Métricas Clave**
- Total de usuarios
- Coherencia cuántica promedio
- Interacciones con Isabella AI
- Eventos de seguridad
- Uso de Dream Spaces

---

## 🔄 **CI/CD con GitHub Actions**

### **Paso 1: Crear workflow (.github/workflows/deploy.yml)**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### **Paso 2: Configurar Secrets**
En GitHub → Settings → Secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## ✅ **Checklist de Despliegue**

### **Pre-Deploy**
- [ ] Build exitoso: `npm run build`
- [ ] Tests pasando (si los hay)
- [ ] Variables de entorno configuradas
- [ ] Edge functions desplegadas
- [ ] RLS habilitado en todas las tablas

### **Deploy**
- [ ] Aplicación desplegada
- [ ] DNS propagado (si usas dominio custom)
- [ ] SSL/HTTPS activo
- [ ] Edge functions accesibles

### **Post-Deploy**
- [ ] Verificar login/signup
- [ ] Probar Isabella AI
- [ ] Verificar Dream Spaces
- [ ] Revisar logs de edge functions
- [ ] Confirmar analytics funcionando

---

## 🐛 **Troubleshooting**

### **Problema: Build falla**
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Problema: Edge functions no responden**
1. Verificar que estén desplegadas: `Settings → Functions`
2. Revisar logs en Lovable Cloud
3. Verificar CORS headers

### **Problema: 404 en rutas**
Asegúrate de configurar rewrites/redirects según el proveedor.

---

## 📞 **Soporte**

Si encuentras problemas durante el despliegue:
- GitHub Issues: [tu-repo]/issues
- Email: dev@tamv.network
- Discord: [tu-servidor-discord]

---

**¡Tu ecosistema TAMV está listo para producción! 🚀🌌**
