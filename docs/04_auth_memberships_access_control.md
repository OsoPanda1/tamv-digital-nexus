# 04 — Auth, Memberships & Access Control — TAMV MD-X4

> **Estado:** `stable` · **Versión:** 1.0 · **Dominio:** DM-X4-01 Core / DM-X4-05 Economía
> **Última actualización:** 2026-03-01 · **Ref:** MD-X4 Wiki Master Update

---

## 1. Visión general

El sistema de autenticación y control de acceso de TAMV se apoya en tres pilares:

| Pilar | Tecnología | Ubicación |
|-------|-----------|-----------|
| Autenticación | Supabase Auth (JWT) | `src/hooks/useAuth.ts`, `src/pages/Auth.tsx` |
| Membresías | `tcep_wallets.membership_tier` + Stripe | `src/systems/EconomySystem.ts`, `supabase/functions/create-checkout/` |
| Control de acceso | Supabase RLS + `RouterGuard` MSR | `src/App.tsx`, `src/core/RouterGuard` (conceptual) |

---

## 2. Flujo de autenticación

### 2.1 Login / Signup

```
AuthForm (src/components/auth/AuthForm.tsx)
  → supabase.auth.signInWithPassword({ email, password })
    → JWT emitido por Supabase Auth
      → onAuthStateChange trigger
        → useAuth.user actualizado
          → useTAMVStore.setUser() + isAuthenticated: true
            → Navigate('/dashboard')
```

Para registro:
```
AuthForm → supabase.auth.signUp({ email, password, options.data.display_name })
  → Supabase crea user en auth.users
    → Trigger de Supabase crea perfil en public.profiles
      → Redirect a /auth (para login)
```

### 2.2 Hook `useAuth` — `src/hooks/useAuth.ts`

```typescript
interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}
```

**Comportamiento:**
- Escucha `onAuthStateChange` antes de `getSession()` para evitar race conditions.
- `signOut()` limpia JWT; Zustand store limpia estado vía `useTAMVStore.logout()`.
- No persiste JWT directamente — Supabase lo gestiona en `localStorage`.

---

## 3. Tiers de membresía

### 3.1 Definición de tiers

| Tier | Nombre | Descripción | Precio ref. |
|------|--------|-------------|-------------|
| `free` | Ciudadano | Acceso básico al ecosistema | Gratis |
| `premium` | Explorador | Acceso completo a DreamSpaces y contenido premium | ~MXN 199/mes |
| `vip` | Guardián | Funciones avanzadas de Isabella + prioridad de soporte | ~MXN 499/mes |
| `elite` | Arquitecto | Acceso a herramientas de creación y gobernanza básica | ~MXN 999/mes |
| `celestial` | Civilizador | Acceso total + gobernanza avanzada + TAU bonus | ~MXN 1999/mes |
| `enterprise` | Federado | Planes corporativos y API access extendido | Negociado |

> **NOTA:** Los precios son referencias; los valores canónicos están en Stripe (variables de entorno). No se deben hardcodear en frontend.

### 3.2 Estado de membresía en MSR

```typescript
// src/stores/tamvStore.ts — Wallet slice
interface Wallet {
  balanceTCEP: number;
  balanceTAU: number;
  lockedBalance: number;
  membershipTier: 'free' | 'premium' | 'vip' | 'elite' | 'celestial' | 'enterprise';
  lifetimeEarned: number;
  lifetimeSpent: number;
}
```

### 3.3 Actualización de membresía

```
stripe-webhook (checkout.session.completed)
  → Verificar firma Stripe
  → Verificar idempotencia (processed_stripe_events)
  → UPDATE public.tcep_wallets SET membership_tier = 'premium' WHERE user_id = ?
  → INSERT public.transactions (type='subscription', status='completed')
  → Notificar via tamv-fusion-core
```

---

## 4. Control de acceso — Tabla de rutas

| Ruta | Auth requerida | Tier mínimo | Cell responsable |
|------|---------------|-------------|-----------------|
| `/` | ❌ | — | `cell-router` |
| `/auth` | ❌ | — | `cell-auth` |
| `/onboarding` | ✅ | `free` | `cell-onboarding` |
| `/dashboard` | ✅ | `free` | `cell-router` |
| `/profile` | ✅ | `free` | `cell-profile` |
| `/isabella` | ❌ | — (básico) | `cell-isabella-page` |
| `/university` | ❌ | — | `cell-university-page` |
| `/bookpi` | ❌ | — | `cell-bookpi-page` |
| `/community` | ❌ | — | `cell-community-page` |
| `/docs` | ❌ | — | `cell-docs-page` |
| `/metaverse` | ❌ | — (básico) | `cell-metaverse-page` |
| `/dream-spaces` | ❌ | — (básico) | `cell-dreamspaces-page` |
| `/3d-space` | ❌ | — | `cell-3dspace-page` |
| `/kaos` | ❌ | — | `cell-kaos-page` |
| `/economy` | ✅ | `free` | `cell-economy-page` |
| `/gifts` | ✅ | `free` | `cell-gifts-page` |
| `/monetization` | ✅ | `free` | `cell-monetization-page` |
| `/anubis` | ✅ | `free` | `cell-anubis-page` |
| `/crisis` | ✅ | `free` | `cell-crisis` |
| `/ecosystem` | ❌ | — | `cell-ecosystem-page` |
| `/governance` | ✅ | `elite` | `cell-governance-page` |
| `/admin` | ✅ | `admin` role | `cell-admin-page` |

> **Tier mínimo = `free`** significa que cualquier usuario autenticado puede acceder independientemente de membresía pagada.

---

## 5. Control de acceso — Row Level Security (RLS)

### 5.1 Políticas activas

| Tabla | Política | Condición |
|-------|---------|-----------|
| `profiles` | SELECT (todos) | `USING (true)` |
| `profiles` | UPDATE (propio) | `USING (auth.uid() = user_id)` |
| `posts` | SELECT (públicos) | `USING (visibility = 'public')` |
| `posts` | SELECT (propios) | `USING (auth.uid() = author_id)` |
| `posts` | INSERT | `WITH CHECK (auth.uid() = author_id)` |
| `transactions` | SELECT | `USING (auth.uid() = user_id)` |
| `tcep_wallets` | SELECT | `USING (auth.uid() = user_id)` |
| `tcep_wallets` | UPDATE | Solo via Edge Functions (service role) |
| `analytics_events` | INSERT | `WITH CHECK (auth.uid() = user_id)` |
| `enrollments` | SELECT/INSERT | `USING (auth.uid() = user_id)` |
| `notifications` | SELECT/UPDATE | `USING (auth.uid() = user_id)` |

### 5.2 Regla invariante (MSR-AUTH-01)

> **Toda mutación económica** (wallet, transactions) debe realizarse exclusivamente via Edge Functions con `service_role` key. El frontend nunca escribe directamente en `tcep_wallets`.

```typescript
// CORRECTO — via Edge Function con service_role
const { data } = await supabase.functions.invoke('create-checkout', { body: payload });

// INCORRECTO — nunca hacer esto desde el frontend
await supabase.from('tcep_wallets').update({ balance_tcep: newBalance });
```

---

## 6. Roles de usuario

### 6.1 Definición de roles

| Rol | Descripción | Permisos clave |
|-----|-------------|----------------|
| `public` | Usuario registrado básico | Lectura general, post en feed, acceso a cursos gratuitos |
| `creator` | Creador de contenido | Todo `public` + publicar cursos, monetizar contenido |
| `pro` | Profesional | Todo `creator` + acceso a herramientas avanzadas |
| `admin` | Administrador | Acceso total, incluyendo `/admin` |

### 6.2 Almacenamiento de rol

```sql
-- public.profiles
role TEXT DEFAULT 'public' CHECK (role IN ('public', 'creator', 'pro', 'admin'))
```

```typescript
// src/stores/tamvStore.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: 'public' | 'creator' | 'pro' | 'admin';
  ...
}
```

---

## 7. Flujo completo: registro → membresía → acceso premium

```
1. Usuario se registra (/auth) → role: 'public', tier: 'free'
2. Onboarding (/onboarding) → configura perfil, sensorPermissions
3. Accede a /monetization → ve planes de membresía
4. StripeCheckout → create-checkout Edge fn → Stripe
5. Pago completado → stripe-webhook → UPDATE tcep_wallets.membership_tier = 'premium'
6. Refetch wallet → useTAMVStore actualizado
7. Acceso habilitado a features premium (DreamSpaces avanzados, Isabella sin límite, etc.)
```

---

## 8. Guardas de ruta — implementación canónica

```typescript
// Patrón en src/App.tsx (invariante L2 del QC-TAMV-01)
// BrowserRouter solo aquí. RouterGuard envuelve rutas protegidas.

<Route path="/economy" element={
  <RequireAuth>
    <Economy />
  </RequireAuth>
} />

<Route path="/admin" element={
  <RequireRole role="admin">
    <Admin />
  </RequireRole>
} />
```

> **Nota:** `RequireAuth` y `RequireRole` son componentes wrapper que verifican `useAuth().isAuthenticated` y `useTAMVStore().user.role` respectivamente. Redirigen a `/auth` si no cumplen.

---

## 9. Referencias

- `src/hooks/useAuth.ts` — Hook de autenticación
- `src/components/auth/AuthForm.tsx` — Formulario de login/registro
- `src/stores/tamvStore.ts` — Estado global (user, wallet, tier)
- `supabase/functions/create-checkout/` — Stripe checkout
- `supabase/functions/stripe-webhook/` — Actualización de membresía
- `DEPLOYMENT_GUIDE.md` — Configuración de RLS y tablas
- `02_MODULOS/M04_ECONOMIA/INTERNO/MARKETPLACE-TAU-SPEC.md` — Spec de economía
- `docs/02_arquitectura_tamv_mdx4.md` — Arquitectura base
