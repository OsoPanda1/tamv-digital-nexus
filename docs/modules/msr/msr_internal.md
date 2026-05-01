# MSR / Economía — Documento Interno

> **Estado:** `draft` · **Acceso:** INTERNO · **Sin acceso DAO en decisiones económicas**

## Ledger TCEP/TAU — Contrato técnico

### Tabla `tcep_wallets`
```sql
user_id            UUID PRIMARY KEY (FK: auth.users)
balance_tcep       NUMERIC(18,6) DEFAULT 0
balance_tau        NUMERIC(18,6) DEFAULT 0
locked_balance     NUMERIC(18,6) DEFAULT 0
pending_balance    NUMERIC(18,6) DEFAULT 0
membership_tier    TEXT DEFAULT 'free'
membership_expires_at TIMESTAMPTZ
lifetime_earned    NUMERIC(18,6) DEFAULT 0
lifetime_spent     NUMERIC(18,6) DEFAULT 0
created_at         TIMESTAMPTZ DEFAULT now()
updated_at         TIMESTAMPTZ DEFAULT now()
```

### Tabla `transactions`
```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID NOT NULL
type        TEXT CHECK (type IN ('reward','purchase','transfer','subscription','refund','gift','lottery'))
amount      NUMERIC(18,6) NOT NULL
currency    TEXT CHECK (currency IN ('tcep','tau','mxn','usd'))
description TEXT
status      TEXT CHECK (status IN ('pending','completed','failed','refunded'))
from_user_id UUID
to_user_id   UUID
metadata    JSONB
created_at  TIMESTAMPTZ DEFAULT now()
```

## Idempotencia de webhooks

Cada evento Stripe tiene un `event.id` único:
1. Al recibir webhook: verificar si `stripe_event_id` ya existe en tabla `processed_stripe_events`.
2. Si existe: responder 200 sin procesar (idempotente).
3. Si no existe: procesar, insertar en `processed_stripe_events`, actualizar wallet.

## Proceso de queue para jobs pesados

El webhook de Stripe solo debe:
1. Validar firma Stripe.
2. Insertar evento en `stripe_event_queue`.
3. Responder 200 inmediatamente.

Un worker asíncrono (Supabase pg_cron o Edge Function triggered by DB) procesa la cola.

## Auditoría económica

Script: `npm run audit:economy`
- Verifica que suma de todas las transacciones completadas = saldo actual de wallets.
- Detecta wallets con balance negativo (anomalía).
- Reporta transacciones en estado `pending` > 24h.
