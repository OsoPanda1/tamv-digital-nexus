# BookPI API — DevHub

> **Status:** `draft` · **Versión:** 0.1 · **Dominio:** DM-X4-04 Educación/UTAMV

---

## Descripción

BookPI es el motor de certificaciones blockchain de TAMV. Gestiona la emisión, verificación y revocación de certificados académicos del ecosistema UTAMV.

---

## Endpoints (via Supabase DB directa + futuros Edge fns)

### 1. Enrollar en curso

```
supabase.from('enrollments').insert({
  user_id: uuid,
  course_id: string,
  enrolled_at: ISO8601
})
```

### 2. Actualizar progreso

```
supabase.from('course_progress').upsert({
  user_id: uuid,
  course_id: string,
  progress: number (0-100),
  last_accessed: ISO8601
})
```

### 3. Emitir certificado (futuro Edge fn)

```
POST /functions/v1/bookpi-certify
{
  "userId": "uuid",
  "courseId": "string",
  "completedAt": "ISO8601"
}
```

Response:
```json
{
  "certificateId": "uuid",
  "blockchainTxHash": "0x...",
  "certificateUrl": "https://...",
  "issuedAt": "ISO8601"
}
```

### 4. Verificar certificado (público)

```
GET /functions/v1/bookpi-verify?certId=uuid
```

Response:
```json
{
  "valid": true,
  "holder": { "displayName": "string", "userId": "uuid" },
  "course": { "title": "string", "completedAt": "ISO8601" },
  "blockchainVerified": true
}
```

---

## Eventos de analytics

Cada acción BookPI registra en `analytics_events`:

| event_type | Cuándo |
|-----------|--------|
| `course_enrolled` | Al inscribirse |
| `lesson_completed` | Al completar lección |
| `course_completed` | Al alcanzar 100% |
| `certificate_issued` | Al emitir certificado |

---

## TODO

- Definir schema completo de tablas `courses`, `enrollments`, `certificates`.
- Implementar Edge fn `bookpi-certify` con firma blockchain.
- Integrar con UTAMV journeys (`docs/online/journeys/`).
