# Marketplace & TAU Spec — TAMV MD-X4

> **Módulo:** M04_ECONOMIA · **Estado:** `draft` · **Acceso:** INTERNO
> **Dominio:** DM-X4-05 MSR / Economía

---

## 1. Flujos de compra

### 1.1 Compra con Stripe → Membership

```
1. Usuario selecciona plan en /monetization o /economy
2. StripeCheckout.tsx → supabase.functions.invoke('create-checkout', {
     priceId: 'price_xxx',
     userId: 'uuid',
     returnUrl: window.location.origin + '/economy'
   })
3. create-checkout Edge fn:
   a. Validar payload (Zod)
   b. Stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { userId, membershipTier }
      })
   c. Retornar { url: session.url }
4. Frontend: window.location.href = url (redirect a Stripe)
5. Usuario completa pago en Stripe
6. stripe-webhook Edge fn recibe 'checkout.session.completed':
   a. Verificar firma Stripe (STRIPE_WEBHOOK_SECRET)
   b. Verificar idempotencia (stripe_event_id en DB)
   c. UPDATE tcep_wallets SET membership_tier = ? WHERE user_id = ?
   d. INSERT transactions (type='subscription', status='completed')
   e. INSERT processed_stripe_events (stripe_event_id)
   f. Notificar via Fusion Core (opcional)
7. Usuario redirigido a returnUrl con parámetro de éxito
```

### 1.2 Compra de TAU

```
1. Usuario elige cantidad de TAU en /economy
2. Mismo flujo Stripe (mode: 'payment', no subscription)
3. stripe-webhook: UPDATE tcep_wallets SET balance_tau += amount
4. INSERT transactions (type='purchase', currency='tau')
```

### 1.3 Consumo de TAU (gift premium)

```
1. Usuario envía gift premium desde /gifts
2. Frontend: verifica balance_tau >= gift.cost
3. supabase.from('transactions').insert({
     type: 'gift',
     amount: -gift.cost,
     currency: 'tau',
     from_user_id: sender.id,
     to_user_id: receiver.id
   })
4. UPDATE tcep_wallets SET balance_tau -= cost WHERE user_id = sender
5. UPDATE tcep_wallets SET balance_tau += reward WHERE user_id = receiver
   (reward = gift.cost * 0.9, el 10% es comisión plataforma)
6. Supabase Realtime → notificación al receptor
```

---

## 2. Idempotencia de webhooks

### Tabla `processed_stripe_events`
```sql
CREATE TABLE processed_stripe_events (
  stripe_event_id TEXT PRIMARY KEY,
  processed_at    TIMESTAMPTZ DEFAULT now(),
  event_type      TEXT NOT NULL
);
```

### Algoritmo
```typescript
const eventId = stripeEvent.id;
const { data: existing } = await supabase
  .from('processed_stripe_events')
  .select('stripe_event_id')
  .eq('stripe_event_id', eventId)
  .single();

if (existing) {
  return new Response('Already processed', { status: 200 });
}
// ... procesar
await supabase.from('processed_stripe_events').insert({ stripe_event_id: eventId, event_type: stripeEvent.type });
```

---

## 3. Queue para jobs pesados

El webhook de Stripe debe ser ligero:

```
stripe-webhook (Edge fn)
  1. Verificar firma — < 10ms
  2. Verificar idempotencia — < 20ms
  3. INSERT stripe_event_queue — < 30ms
  4. Respond 200 — total < 100ms

stripe-event-processor (pg_cron / trigger)
  - Procesa cola cada 30 segundos
  - Actualiza wallets, envía notificaciones, etc.
```

---

## 4. Esquema de transacciones completo

Ver `src/lib/msr.ts` → `TransactionRow`, `WalletRow`.

---

## 5. Métricas de calidad

| Métrica | Target |
|---------|--------|
| Tiempo proceso webhook | < 500ms |
| Tasa de duplicados procesados | 0% |
| Transacciones pending > 24h | 0 |
| Consistencia ledger (suma tx = balance) | 100% |

---

## 6. Restricción DAO

**Sin acceso DAO a decisiones económicas:**
- Comisiones: fijadas por TAMV (10% en gifts, variable en marketplace).
- Precios de membresía: fijados por TAMV.
- Reparto de TAU: algoritmo interno.

**DAO-Marketplace** (si se crea) puede opinar sobre:
- Tipos de productos permitidos en el marketplace.
- Categorías y etiquetas de contenido.
