# TAMV Unified API — DevHub

> **Status:** `validated` · **Versión:** 1.0 · **Dominio:** DM-X4-07 Infra

---

## Endpoint

```
POST https://<project>.supabase.co/functions/v1/tamv-unified-api
```

## Auth

```
Authorization: Bearer <supabase_anon_key_or_user_jwt>
Content-Type: application/json
```

## Descripción

Gateway unificado para acciones transversales del ecosistema TAMV. Enruta al dominio correcto según `action`.

---

## Payload

```json
{
  "action": "string",
  "domain": "DM-X4-01-CORE | DM-X4-02-IA | DM-X4-03-SECURITY | DM-X4-04-EDUCATION | DM-X4-05-ECONOMY | DM-X4-06-XR | DM-X4-07-INFRA",
  "payload": {},
  "userId": "uuid (opcional si auth token incluido)"
}
```

## Response

```json
{
  "success": true,
  "data": {},
  "domain": "DM-X4-XX-NAME",
  "action": "string",
  "processedAt": "2026-02-24T12:00:00Z",
  "traceId": "uuid"
}
```

## Errors

| Código | Descripción |
|--------|-------------|
| 400 | Payload inválido (validación Zod) |
| 401 | Token ausente o inválido |
| 403 | Acción no permitida para este rol |
| 404 | Dominio o acción no existe |
| 429 | Rate limit excedido |
| 500 | Error interno del servidor |

---

## Acciones disponibles

### `ping`
Verifica conectividad.
```json
{ "action": "ping", "domain": "DM-X4-07-INFRA", "payload": {} }
```
Response: `{ "data": { "pong": true, "timestamp": "..." } }`

### `federation.status`
Estado de las federaciones activas.
```json
{ "action": "federation.status", "domain": "DM-X4-07-INFRA", "payload": {} }
```

### `user.profile`
Perfil del usuario autenticado.
```json
{ "action": "user.profile", "domain": "DM-X4-01-CORE", "payload": {} }
```

---

## Rate limits

| Endpoint | Límite |
|----------|--------|
| Anón | 60 req/min |
| Autenticado | 300 req/min |
| Admin | 1000 req/min |

---

## Ejemplo

```bash
curl -X POST https://<project>.supabase.co/functions/v1/tamv-unified-api \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action":"ping","domain":"DM-X4-07-INFRA","payload":{}}'
```
