# 06 — Federated Certification Checks — TAMV MD-X4

> **Estado:** `stable` · **Versión:** 1.0 · **Dominio:** DM-X4-04 Educación/UTAMV + DM-X4-07 Infra
> **Última actualización:** 2026-03-01 · **Ref:** MD-X4 Wiki Master Update

---

## 1. Visión general

El sistema de certificaciones federadas de TAMV permite emitir, verificar y revocar certificados académicos con trazabilidad blockchain a través del módulo BookPI. El proceso involucra:

| Componente | Rol | Ubicación |
|-----------|-----|-----------|
| `UniversitySystem` | Motor de progreso y emisión local | `src/systems/UniversitySystem.ts` |
| `BookPIPanel` | UI de trazabilidad y verificación | `src/components/panels/BookPIPanel.tsx` |
| `bookpi-certify` Edge fn | Emisión con firma blockchain (pendiente) | `supabase/functions/bookpi-certify/` |
| `bookpi-verify` Edge fn | Verificación pública (pendiente) | `supabase/functions/bookpi-verify/` |
| `enrollments` table | Progreso de curso en BD | Supabase PostgreSQL |
| `certificates` table | Registro canónico de certificados | Supabase PostgreSQL |

---

## 2. Schema de base de datos — Certificaciones

### 2.1 Tabla `courses`

```sql
CREATE TABLE public.courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  short_description TEXT,
  level           TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  category        TEXT CHECK (category IN ('fundamentos', 'desarrollo', 'ia', 'seguridad', 'audio', 'xr', 'gobernanza', 'economia')),
  duration_minutes INTEGER,
  is_free         BOOLEAN DEFAULT true,
  price           NUMERIC DEFAULT 0,
  certification_included BOOLEAN DEFAULT false,
  prerequisites   TEXT[],
  tags            TEXT[],
  rating          NUMERIC(3,2) DEFAULT 0,
  enrollment_count INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_select_all" ON public.courses FOR SELECT USING (true);
```

### 2.2 Tabla `enrollments`

```sql
CREATE TABLE public.enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id       UUID NOT NULL REFERENCES public.courses(id),
  status          TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in-progress', 'completed', 'certified', 'dropped')),
  progress        NUMERIC(5,2) DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  completed_lessons TEXT[],
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  certificate_url TEXT,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enrollments_own" ON public.enrollments
  FOR ALL USING (auth.uid() = user_id);
```

### 2.3 Tabla `certificates`

```sql
CREATE TABLE public.certificates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  course_id       UUID NOT NULL REFERENCES public.courses(id),
  course_name     TEXT NOT NULL,
  user_name       TEXT NOT NULL,
  issued_at       TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  verification_url TEXT NOT NULL,
  blockchain_tx_hash TEXT,
  ipfs_hash       TEXT,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  revoked_at      TIMESTAMPTZ,
  revocation_reason TEXT,
  metadata        JSONB
);

CREATE INDEX idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX idx_certificates_course_id ON public.certificates(course_id);

-- RLS: verificación pública (sin autenticación)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certificates_select_public" ON public.certificates
  FOR SELECT USING (status = 'active');
CREATE POLICY "certificates_own" ON public.certificates
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 3. Flujo de certificación

### 3.1 Flujo completo: enroll → progreso → certificado

```
1. Usuario accede a /university
   → UniversitySystem.getAllCourses() → lista de cursos

2. Enroll en curso
   → UniversitySystem.enrollUser(userId, courseId)
     → INSERT public.enrollments (status: 'enrolled')
     → INSERT analytics_events (event_name: 'course_enrolled')

3. Completar lecciones
   → UniversitySystem.updateLessonProgress(userId, courseId, lessonId)
     → UPDATE enrollments.completed_lessons += lessonId
     → UPDATE enrollments.progress = completedLessons/totalLessons * 100
     → INSERT analytics_events (event_name: 'lesson_completed')

4. Completar curso (progress = 100%)
   → UniversitySystem.completeCourse(userId, courseId)
     → UPDATE enrollments.status = 'completed'
     → Si course.certificationIncluded:
         → POST /functions/v1/bookpi-certify (Edge fn)
           → Generar certificate (SHA3-256 hash, Ed25519 firma)
           → Anclar en blockchain (IPFS + tx hash)
           → INSERT public.certificates
           → UPDATE enrollments.status = 'certified'
           → UPDATE enrollments.certificate_url
         → INSERT analytics_events (event_name: 'certificate_issued')
```

### 3.2 Verificación federada de certificado

```
Verificador externo / Empleador / Sistema federado
  → GET /functions/v1/bookpi-verify?certId=<uuid>
    → SELECT FROM public.certificates WHERE id = certId AND status = 'active'
      → Verificar blockchain_tx_hash en chain
        → Verificar ipfs_hash en IPFS
          → Response:
            {
              "valid": true,
              "holder": { "displayName": "...", "userId": "uuid" },
              "course": { "title": "...", "completedAt": "ISO8601" },
              "blockchainVerified": true,
              "ipfsVerified": true,
              "issuedAt": "ISO8601"
            }
```

---

## 4. Edge Functions de certificación (spec)

### 4.1 `bookpi-certify` (pendiente de implementar)

```
POST /functions/v1/bookpi-certify
Authorization: Bearer <user_jwt>

Body:
{
  "userId": "uuid",
  "courseId": "uuid",
  "completedAt": "ISO8601"
}

Response (201):
{
  "certificateId": "uuid",
  "verificationUrl": "https://tamv.network/certificates/<id>",
  "blockchainTxHash": "0x...",
  "ipfsHash": "Qm...",
  "issuedAt": "ISO8601"
}
```

**Pasos internos:**
1. Verificar que `enrollments.status = 'completed'` para el par user/course.
2. Verificar que `enrollments.progress = 100`.
3. Generar hash SHA3-256 del certificado (userId + courseId + issuedAt).
4. Firmar con Ed25519 (clave privada en vault Supabase).
5. Publicar en IPFS → obtener `ipfsHash`.
6. Registrar en blockchain → obtener `txHash`.
7. INSERT en `public.certificates`.
8. Retornar datos del certificado.

### 4.2 `bookpi-verify` (pendiente de implementar)

```
GET /functions/v1/bookpi-verify?certId=<uuid>
(Sin autenticación — verificación pública)

Response (200):
{
  "valid": true | false,
  "holder": { "displayName": "string", "userId": "uuid" },
  "course": { "title": "string", "level": "string", "completedAt": "ISO8601" },
  "issuedAt": "ISO8601",
  "expiresAt": "ISO8601 | null",
  "blockchainVerified": true,
  "verificationUrl": "https://tamv.network/certificates/<id>"
}
```

---

## 5. Sistema local (UniversitySystem)

### 5.1 Funciones clave

| Método | Descripción |
|--------|-------------|
| `getAllCourses()` | Retorna todos los cursos disponibles |
| `enrollUser(userId, courseId)` | Inscribe al usuario si no está ya inscrito |
| `updateLessonProgress(userId, courseId, lessonId)` | Actualiza lecciones completadas y % progreso |
| `completeCourse(userId, courseId)` | Marca como completado y genera certificado si aplica |
| `verifyCertificate(certId)` | Verifica si un certificado es válido en la instancia local |
| `getStatistics()` | Retorna métricas del sistema universitario |

### 5.2 Estado persistido

```typescript
// localStorage 'university-data' (temporal — migrar a Supabase)
{
  enrollments: Enrollment[];
  certificates: Certificate[];
}
```

> **TODO:** Migrar `UniversitySystem` de localStorage a Supabase (`enrollments`, `certificates` tables) para persistencia real y federación.

---

## 6. BookPI — Trazabilidad y Propiedad Intelectual

### 6.1 Eventos BookPI

| Evento | SHA3-256 | DOI | Verificable |
|--------|---------|-----|------------|
| Consentimiento de datos | ✅ | ✅ opcional | ✅ |
| Acceso a datos de usuario | ✅ | ❌ | ✅ |
| Exportación de datos | ✅ | ✅ | ✅ |
| Emisión de certificado | ✅ | ✅ | ✅ blockchain |
| Escaneo de seguridad | ✅ | ❌ | ✅ |

### 6.2 UI de verificación — `BookPIPanel`

El panel BookPI (`src/components/panels/BookPIPanel.tsx`) provee:
- Lista de eventos PI con hash y timestamp.
- Detalle de evento seleccionado (hash, DOI, metadata).
- Descarga de evidencia en PDF.
- Generación de QR para verificación.
- Estadísticas de integridad.

---

## 7. Comprobaciones de certificación federada

Las comprobaciones federadas verifican que certificados emitidos en TAMV sean reconocidos por sistemas externos del ecosistema de 177 repositorios:

### 7.1 Protocolo de verificación cross-federation

```
Sistema externo (federado)
  → POST /functions/v1/tamv-unified-api
    {
      "action": "education.verifyCertificate",
      "domain": "DM-X4-04-EDUCATION",
      "payload": { "certId": "uuid" }
    }
      → tamv-unified-api → bookpi-verify
        → Response con validez y datos
```

### 7.2 Estados de certificado en federación

| Estado | Descripción | Acción requerida |
|--------|-------------|-----------------|
| `active` | Certificado válido y verificable | Aceptar |
| `revoked` | Certificado revocado por TAMV | Rechazar |
| `expired` | Certificado fuera de vigencia | Solicitar renovación |
| `pending_blockchain` | En proceso de anclaje | Esperar y re-verificar |

---

## 8. Analytics de certificación

| Evento | Tabla | Cuándo |
|--------|-------|--------|
| `course_enrolled` | `analytics_events` | Al inscribirse |
| `lesson_completed` | `analytics_events` | Al completar lección |
| `course_completed` | `analytics_events` | Al alcanzar 100% |
| `certificate_issued` | `analytics_events` | Al emitir certificado |
| `certificate_verified` | `analytics_events` | Al verificar externamente |

---

## 9. Estado de implementación

| Componente | Estado | Acción pendiente |
|-----------|--------|-----------------|
| `UniversitySystem` local | ✅ Operativo | Migrar a Supabase |
| `BookPIPanel` UI | ✅ Operativo | Conectar a BD real |
| Schema `courses` | ⚠️ Pendiente migración | Ejecutar SQL en Supabase |
| Schema `enrollments` | ⚠️ Pendiente migración | Ejecutar SQL en Supabase |
| Schema `certificates` | ⚠️ Pendiente migración | Ejecutar SQL en Supabase |
| Edge fn `bookpi-certify` | ❌ No implementado | Implementar + blockchain |
| Edge fn `bookpi-verify` | ❌ No implementado | Implementar |
| Anclaje blockchain | ❌ No implementado | Definir chain objetivo |
| IPFS integration | ❌ No implementado | Definir proveedor |

---

## 10. Referencias

- `src/systems/UniversitySystem.ts` — Motor universitario
- `src/pages/University.tsx` — Página de cursos
- `src/pages/BookPI.tsx` — Página de trazabilidad
- `src/components/panels/BookPIPanel.tsx` — UI BookPI
- `docs/devhub/bookpi_api.md` — API DevHub (parcial)
- `02_MODULOS/M05_IA_TAMVAI/INTERNO/QC-TAMV-01-v1.1.md` — Marco de calidad
- `docs/02_arquitectura_tamv_mdx4.md` → DM-X4-04
- `DEPLOYMENT_GUIDE.md` — Configuración de tablas
