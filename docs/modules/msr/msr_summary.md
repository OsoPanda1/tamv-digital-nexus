# MSR / Economía — Resumen

> **Estado:** `beta` · **Dominio:** DM-X4-05 Economía · **Canon:** inmutable (lógica económica sin acceso DAO)

## Definición

MSR (Motor de Estado, Reglas y Rutas) es a la vez el dominio económico de TAMV y el framework arquitectónico que gobierna el estado de toda la plataforma.

### MSR como dominio económico

Gestiona el sistema de tokens TCEP (créditos de plataforma) y TAU (tokens de acción universal), el ledger de transacciones, membresías y checkout Stripe.

### MSR como framework arquitectónico

Define los contratos de estado, reglas invariantes y registro de rutas del sistema completo. Ver `src/lib/msr.ts`.

## Tokens del ecosistema

| Token | Tipo | Uso | Generación |
|-------|------|-----|-----------|
| **TCEP** | Crédito de plataforma | Compras, gifts, suscripciones | Actividad, compras |
| **TAU** | Token de Acción Universal | Features premium, gobernanza | Compra, logros |

## Tiers de membresía

| Tier | Descripción |
|------|-------------|
| `free` | Acceso básico |
| `premium` | Funcionalidades avanzadas |
| `vip` | Experiencias exclusivas |
| `elite` | Acceso completo + beneficios |
| `celestial` | Tier máximo de usuario |
| `enterprise` | Organizaciones y federaciones |

## Cell mapping

| Cell | Artefacto | Estado |
|------|-----------|--------|
| `cell-economy` | `src/systems/EconomySystem.ts`, `src/pages/Economy.tsx` | beta |
| `cell-wallet` | `src/stores/tamvStore.ts` (wallet slice) | stable |
| `cell-stripe` | `src/components/stripe/StripeCheckout.tsx` | beta |
| `cell-gifts` | `src/components/gifts/`, `src/pages/Gifts.tsx` | stable |
| `cell-monetization` | `src/pages/Monetization.tsx` | beta |

## MSR Rules

- `MSR-ECONOMY-01`: Mutación económica requiere confirmación en BD antes de UI
- `MSR-ECONOMY-02`: Webhooks Stripe idempotentes (deduplicación por event_id)

## Flujo de compra

```
StripeCheckout → create-checkout (Edge fn)
  → Stripe API → session
    → Redirect Stripe
      → stripe-webhook (Edge fn)
        → UPDATE tcep_wallets
        → INSERT transactions
          → Fusion Core notify → UI update
```

## Restricción DAO

**Los DAOs no tienen poder sobre lógica económica:**
- No pueden cambiar comisiones, precios, ni reparto de TAU/TCEP.
- Solo pueden opinar sobre tipos de productos permitidos en el marketplace.

## Referencias

- `src/systems/EconomySystem.ts`
- `src/lib/msr.ts` (contratos y esquemas)
- `supabase/functions/create-checkout/`
- `docs/13_economico_financiero_tamv.md`
