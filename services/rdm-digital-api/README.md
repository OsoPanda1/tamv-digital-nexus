# rdm-digital-api

Servicio Supabase Edge para el MVP **RDM Digital — Sistema Operativo Territorial**.

## Endpoints

- `POST /auth/register` — crea identidad territorial y wallet MSR.
- `POST /economy/reward` — incrementa wallet y registra transacción con evidencia `bookpi:*`.
- `POST /commerce/create` — registra comercio conectable.
- `GET /places` — lista lugares territoriales.
- `POST /ai/ask` — respuesta contextual usando lugares registrados.
- `POST /payments/create` — crea payment intent Stripe si `STRIPE_SECRET` existe; si no, usa sandbox seguro.
- `POST /webhooks/stripe` — receptor placeholder con `TODO_REVIEW_LEGAL` para firma live.

## Variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (preferida para Edge runtime)
- `SUPABASE_ANON_KEY` (fallback)
- `STRIPE_SECRET` (opcional; sin ella opera en sandbox)

## Migración

Aplicar `supabase/migrations/20260515000000_rdm_digital_os.sql` antes de usar la función.
