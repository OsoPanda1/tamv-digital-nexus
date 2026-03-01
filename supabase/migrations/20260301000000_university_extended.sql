-- ============================================================================
-- TAMV UTAMV University Extended Schema
-- Lessons, lesson progress, and certificates tables
-- ============================================================================

-- ============================================
-- TABLE: course_lessons
-- Individual lesson records per course
-- ============================================
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  lesson_order INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  lesson_type TEXT NOT NULL DEFAULT 'video' CHECK (lesson_type IN ('video', 'text', 'quiz', 'practice')),
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Course lessons are viewable by everyone"
  ON public.course_lessons FOR SELECT
  USING (true);

CREATE POLICY "Instructors can manage their course lessons"
  ON public.course_lessons FOR ALL
  USING (
    course_id IN (
      SELECT id FROM public.courses WHERE instructor_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON public.course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_order ON public.course_lessons(course_id, lesson_order);

CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE: lesson_progress
-- Per-user lesson completion tracking
-- ============================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lesson progress"
  ON public.lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress"
  ON public.lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course_id ON public.lesson_progress(user_id, course_id);

-- ============================================
-- TABLE: course_certificates
-- BookPI-linked certificates per user per course
-- ============================================
CREATE TABLE IF NOT EXISTS public.course_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  course_title TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verification_url TEXT NOT NULL,
  bookpi_event_id UUID,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificates"
  ON public.course_certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates"
  ON public.course_certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_course_certificates_user_id ON public.course_certificates(user_id);

-- ============================================
-- Seed canonical UTAMV courses
-- ============================================
INSERT INTO public.courses (id, instructor_id, title, description, category, level, duration_hours, price, is_published, enrollment_count)
VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'Introducción al Metaverso TAMV',
    'Fundamentos de la civilización digital, navegación cuántica y primeros pasos en el ecosistema TAMV MD-X5™',
    'Fundamentos',
    'beginner',
    4,
    0.00,
    true,
    15420
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'Co-creación en Dream Spaces',
    'Técnicas avanzadas de colaboración sensorial, construcción colectiva 3D/4D y experiencias inmersivas XR',
    'Colaboración',
    'intermediate',
    6,
    0.00,
    true,
    8750
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'Desarrollo con TAMV API DM-X7™',
    'Construye aplicaciones conectadas al ecosistema usando la API Unificada Omni-Modus',
    'Desarrollo',
    'advanced',
    12,
    499.00,
    true,
    3200
  ),
  (
    '00000000-0000-0000-0001-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'Seguridad Cuántica con DEKATEOTL',
    'Protección post-cuántica Kyber-1024, identidad digital soberana y gestión de amenazas con Anubis Sentinel',
    'Seguridad',
    'advanced',
    8,
    699.00,
    true,
    1850
  ),
  (
    '00000000-0000-0000-0001-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'Audio Espacial con KAOS',
    'Diseño sonoro 4D, paisajes acústicos binaurales y experiencias de audio inmersivo HRTF',
    'Audio',
    'intermediate',
    10,
    0.00,
    true,
    5600
  ),
  (
    '00000000-0000-0000-0001-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'Isabella AI: Integración y Personalización',
    'Configura tu asistente IA multimodal, trazabilidad emocional EOCT™ y mentoring personalizado',
    'IA',
    'intermediate',
    5,
    0.00,
    true,
    9200
  )
ON CONFLICT (id) DO NOTHING;

-- Seed lessons for course 1
INSERT INTO public.course_lessons (course_id, title, lesson_order, duration_minutes, lesson_type, is_free_preview)
VALUES
  ('00000000-0000-0000-0001-000000000001', '¿Qué es TAMV MD-X5™?', 1, 15, 'video', true),
  ('00000000-0000-0000-0001-000000000001', 'Navegación del Dashboard', 2, 20, 'video', true),
  ('00000000-0000-0000-0001-000000000001', 'Tu ID-NVIDA™ Soberana', 3, 25, 'video', false),
  ('00000000-0000-0000-0001-000000000001', 'Wallet TCEP y Economía MSR', 4, 30, 'video', false),
  ('00000000-0000-0000-0001-000000000001', 'Isabella AI: Tu Mentora Digital', 5, 20, 'practice', false),
  ('00000000-0000-0000-0001-000000000001', 'Dream Spaces y Metaverso', 6, 25, 'video', false),
  ('00000000-0000-0000-0001-000000000001', 'Gobernanza CITEMESH DAO', 7, 15, 'text', false),
  ('00000000-0000-0000-0001-000000000001', 'Evaluación Final', 8, 30, 'quiz', false)
ON CONFLICT DO NOTHING;

-- Seed lessons for course 2
INSERT INTO public.course_lessons (course_id, title, lesson_order, duration_minutes, lesson_type, is_free_preview)
VALUES
  ('00000000-0000-0000-0001-000000000002', 'Fundamentos de DreamSpaces', 1, 20, 'video', true),
  ('00000000-0000-0000-0001-000000000002', 'Diseño de Espacios 3D', 2, 30, 'video', false),
  ('00000000-0000-0000-0001-000000000002', 'Audio Espacial Binaural', 3, 25, 'practice', false),
  ('00000000-0000-0000-0001-000000000002', 'Colaboración Multi-usuario', 4, 30, 'video', false),
  ('00000000-0000-0000-0001-000000000002', 'Evaluación Intermedia', 5, 20, 'quiz', false)
ON CONFLICT DO NOTHING;

-- Seed lessons for course 3
INSERT INTO public.course_lessons (course_id, title, lesson_order, duration_minutes, lesson_type, is_free_preview)
VALUES
  ('00000000-0000-0000-0001-000000000003', 'Arquitectura DM-X7™ Overview', 1, 30, 'video', true),
  ('00000000-0000-0000-0001-000000000003', 'Autenticación y ID-NVIDA', 2, 45, 'video', false),
  ('00000000-0000-0000-0001-000000000003', 'TCEP Economy Endpoints', 3, 40, 'practice', false),
  ('00000000-0000-0000-0001-000000000003', 'DAO & Governance API', 4, 35, 'video', false),
  ('00000000-0000-0000-0001-000000000003', 'MSR Immutable Ledger', 5, 30, 'video', false),
  ('00000000-0000-0000-0001-000000000003', 'Proyecto Final: dApp TAMV', 6, 60, 'practice', false)
ON CONFLICT DO NOTHING;

-- Seed lessons for course 4
INSERT INTO public.course_lessons (course_id, title, lesson_order, duration_minutes, lesson_type, is_free_preview)
VALUES
  ('00000000-0000-0000-0001-000000000004', 'Criptografía Post-Cuántica', 1, 30, 'video', true),
  ('00000000-0000-0000-0001-000000000004', 'Anubis Sentinel Architecture', 2, 40, 'video', false),
  ('00000000-0000-0000-0001-000000000004', 'Zero Trust en TAMV', 3, 25, 'text', false),
  ('00000000-0000-0000-0001-000000000004', 'Práctica: Audit Trail BookPI', 4, 35, 'practice', false)
ON CONFLICT DO NOTHING;

-- Seed lessons for course 5
INSERT INTO public.course_lessons (course_id, title, lesson_order, duration_minutes, lesson_type, is_free_preview)
VALUES
  ('00000000-0000-0000-0001-000000000005', 'Fundamentos Audio Binaural', 1, 25, 'video', true),
  ('00000000-0000-0000-0001-000000000005', 'HRTF Panning & Spatialization', 2, 30, 'video', false),
  ('00000000-0000-0000-0001-000000000005', 'Paisajes Sonoros Inmersivos', 3, 35, 'practice', false)
ON CONFLICT DO NOTHING;

-- Seed lessons for course 6
INSERT INTO public.course_lessons (course_id, title, lesson_order, duration_minutes, lesson_type, is_free_preview)
VALUES
  ('00000000-0000-0000-0001-000000000006', 'Isabella Prime Architecture', 1, 20, 'video', true),
  ('00000000-0000-0000-0001-000000000006', 'Emotional Analysis EOCT™', 2, 25, 'video', false),
  ('00000000-0000-0000-0001-000000000006', 'Práctica: Tu Isabella Personal', 3, 30, 'practice', false)
ON CONFLICT DO NOTHING;

-- Add course_enrollments update policy that was missing
CREATE POLICY "Users can update their own enrollments"
  ON public.course_enrollments FOR UPDATE
  USING (auth.uid() = user_id);
