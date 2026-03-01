# MD-X4 FUNCTIONAL ARCHITECTURE MAP

> **Estado:** `operational` · **Versión:** 1.0 · **Última actualización:** 2026-02-24  
> **Propósito:** Aterrizar la arquitectura TAMV MD-X4 en componentes funcionales concretos del repositorio

---

## 1. ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TAMV DIGITAL NEXUS — CAPAS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  CAPA 5 │ NEXUS (Presentación)     │ src/App.tsx, Pages, Componentes UI    │
├─────────────────────────────────────────────────────────────────────────────┤
│  CAPA 4 │ FUSION CORE (Orquestación)│ supabase/functions/tamv-fusion-core  │
├─────────────────────────────────────────────────────────────────────────────┤
│  CAPA 3 │ MSR (Estado/Reglas/Rutas)│ src/stores/*, Edge Functions          │
├─────────────────────────────────────────────────────────────────────────────┤
│  CAPA 2 │ CELLS (Módulos)          │ src/components/*, src/systems/*       │
├─────────────────────────────────────────────────────────────────────────────┤
│  CAPA 1 │ DOMINIOS DM-X4           │ 7 Dominios de negocio                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  CAPA 0 │ CONSTITUTION ENGINE      │ eslint-plugin-tamv, scripts/          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DOMINIOS DM-X4 — MAPA COMPLETO

### 2.1 DM-X4-01: CORE / PLATAFORMA

| Cell | Artefacto | Ruta Existente | Estado |
|------|-----------|----------------|--------|
| cell-router | BrowserRouter + Routes | `src/App.tsx` | ✅ OPERATIVO |
| cell-sidebar | CivilizatorySidebar | `src/components/CivilizatorySidebar.tsx` | ✅ OPERATIVO |
| cell-auth | Auth, useAuth | `src/pages/Auth.tsx`, `src/hooks/useAuth.ts` | ✅ OPERATIVO |
| cell-onboarding | Onboarding | `src/pages/Onboarding.tsx` | ✅ OPERATIVO |
| cell-store | useTAMVStore (Zustand) | `src/stores/tamvStore.ts` | ✅ OPERATIVO |
| cell-background | UnifiedBackground | `src/components/UnifiedBackground.tsx` | ✅ OPERATIVO |
| cell-profile | Profile | `src/pages/Profile.tsx` | ✅ OPERATIVO |
| cell-navigation | Navigation | `src/components/Navigation.tsx` | ✅ OPERATIVO |

**MSR State:**
```typescript
interface CoreState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sidebarOpen: boolean;
  theme: 'dark' | 'light' | 'quantum';
}
```

**Rutas:**
- `/` → Index
- `/dashboard` → Dashboard
- `/auth` → Auth
- `/onboarding` → Onboarding
- `/profile` → Profile

---

### 2.2 DM-X4-02: IA / ISABELLA / THE SOF

| Cell | Artefacto | Ruta Existente | Estado |
|------|-----------|----------------|--------|
| cell-isabella-chat | IsabellaChat | `src/components/IsabellaChat.tsx` | ✅ OPERATIVO |
| cell-isabella-chat-hook | useIsabellaChatQuantum | `src/hooks/useIsabellaChatQuantum.ts` | ✅ OPERATIVO |
| cell-isabella-voice | useIsabellaVoice | `src/hooks/useIsabellaVoice.ts` | ✅ OPERATIVO |
| cell-emotional | useIsabellaEmotionalAnalysis | `src/hooks/useIsabellaEmotionalAnalysis.ts` | ✅ OPERATIVO |
| cell-emotional-detection | useEmotionalDetection | `src/hooks/useEmotionalDetection.ts` | ✅ OPERATIVO |
| cell-isabella-page | Isabella | `src/pages/Isabella.tsx` | ✅ OPERATIVO |
| cell-sof-core | tamv-fusion-core | `supabase/functions/tamv-fusion-core/` | ✅ OPERATIVO |

**Edge Functions:**
- `isabella-chat` → `supabase/functions/isabella-chat/`
- `isabella-chat-enhanced` → `supabase/functions/isabella-chat-enhanced/`
- `isabella-tts` → `supabase/functions/isabella-tts/`

**MSR State:**
```typescript
interface IsabellaState {
  chatMessages: Message[];
  chatLoading: boolean;
  chatEmotion: 'neutral' | 'alegría' | 'tristeza' | 'poder' | 'duda';
}
```

**Rutas:**
- `/isabella` → Isabella

**Flujo dechat:**
```
IsabellaChat
  → useIsabellaChatQuantum.sendMessage()
    → supabase.functions.invoke('isabella-chat-enhanced')
      → LLM response
        → supabase.functions.invoke('isabella-tts')
          → ElevenLabs TTS
            → Audio playback
```

---

### 2.3 DM-X4-03: SEGURIDAD / GUARDIANÍAS

| Cell | Artefacto | Ruta Existente | Estado |
|------|-----------|----------------|--------|
| cell-anubis | AnubisSecuritySystem | `src/systems/AnubisSecuritySystem.ts` | ✅ OPERATIVO |
| cell-anubis-page | Anubis | `src/pages/Anubis.tsx` | ✅ OPERATIVO |
| cell-dekateotl | dekateotl-security | `supabase/functions/dekateotl-security/` | ✅ OPERATIVO |
| cell-dekateotl-enhanced | dekateotl-security-enhanced | `supabase/functions/dekateotl-security-enhanced/` | ✅ OPERATIVO |
| cell-crisis | Crisis | `src/pages/Crisis.tsx` | ✅ OPERATIVO |
| cell-crisis-components | Crisis components | `src/components/crisis/` | ✅ OPERATIVO |
| cell-federation-security | FederationSystem | `src/systems/FederationSystem.ts` | ✅ OPERATIVO |
| cell-security-store | securityStore | `src/stores/securityStore.ts` | ✅ OPERATIVO |

**MSR State:**
```typescript
interface SecurityState {
  securityMetrics: SecurityMetrics;
  securityEvents: SecurityEvent[];
  userSecurityProfile: UserSecurityProfile;
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}
```

**Rutas:**
- `/anubis` → Anubis
- `/crisis` → Crisis

**Flujo de seguridad:**
```
User action (login / sensitive op)
  → AnubisSecuritySystem.scanUser()
    → supabase.functions.invoke('dekateotl-security-enhanced')
      → 11-layer scan
        → SecurityEvent emitted
          → threat level assessment
            → CRITICAL: block + alert
            → LOW/NONE: allow + log
```

---

### 2.4 DM-X4-04: EDUCACIÓN / UTAMV / BOOKPI

| Cell | Artefacto | Ruta Existente | Estado |
|------|-----------|----------------|--------|
| cell-university | UniversitySystem | `src/systems/UniversitySystem.ts` | ✅ OPERATIVO |
| cell-university-page | University | `src/pages/University.tsx` | ✅ OPERATIVO |
| cell-bookpi-page | BookPI | `src/pages/BookPI.tsx` | ✅ OPERATIVO |
| cell-community-page | Community | `src/pages/Community.tsx` | ✅ OPERATIVO |
| cell-docs-page | Docs | `src/pages/Docs.tsx` | ✅ OPERATIVO |

**MSR State:**
```typescript
interface UniversityState {
  courseProgress: CourseProgress[];
  enrolledCourses: string[];
  currentCourse: Course | null;
}
```

**Rutas:**
- `/university` → University
- `/bookpi` → BookPI
- `/community` → Community
- `/docs` → Docs

---

### 2.5 DM-X4-05: ECONOMÍA / MSR

| Cell | Artefacto | Ruta Existente | Estado |
|------|-----------|----------------|--------|
| cell-economy | EconomySystem | `src/systems/EconomySystem.ts` | ✅ OPERATIVO |
| cell-economy-page | Economy | `src/pages/Economy.tsx` | ✅ OPERATIVO |
| cell-wallet | Wallet (slice of tamvStore) | `src/stores/tamvStore.ts` | ✅ OPERATIVO |
| cell-stripe | StripeCheckout | `src/components/stripe/StripeCheckout.tsx` | ✅ OPERATIVO |
| cell-stripe-checkout | create-checkout | `supabase/functions/create-checkout/` | ✅ OPERATIVO |
| cell-stripe-webhook | stripe-webhook | `supabase/functions/stripe-webhook/` | ✅ OPERATIVO |
| cell-gifts-page | Gifts | `src/pages/Gifts.tsx` | ✅ OPERATIVO |
| cell-gifts-gallery | CircleGiftGallery | `src/components/gifts/` | ✅ OPERATIVO |
| cell-monetization-page | Monetization | `src/pages/Monetization.tsx` | ✅ OPERATIVO |
| cell-monetization-components | Monetization components | `src/components/monetization/` | ✅ OPERATIVO |

**MSR State:**
```typescript
interface EconomyState {
  wallet: Wallet | null;
  transactions: Transaction[];
  membershipTier: 'free' | 'premium' | 'vip' | 'elite' | 'celestial' | 'enterprise';
}

interface Wallet {
  balanceTCEP: number;
  balanceTAU: number;
  lockedBalance: number;
  membershipTier: string;
  lifetimeEarned: number;
  lifetimeSpent: number;
}
```

**Rutas:**
- `/economy` → Economy
- `/gifts` → Gifts
- `/monetization` → Monetization

**Flujo de compra:**
```
StripeCheckout
  → supabase.functions.invoke('create-checkout')
    → Stripe API → checkout session
      → redirect to Stripe
        → stripe-webhook (Supabase Edge)
          → UPDATE tcep_wallets
          → INSERT transactions
            → tamv-fusion-core notify
              → NotificationCenter push
```

---

### 2.6 DM-X4-06: RENDER XR / 3D / 4D

| Cell | Artefacto | Ruta Existente | Estado |
|------|-----------|----------------|--------|
| cell-metaverse-page | Metaverse | `src/pages/Metaverse.tsx` | ✅ OPERATIVO |
| cell-three-scene-manager | ThreeSceneManager | `src/systems/ThreeSceneManager.tsx` | ✅ OPERATIVO |
| cell-dreamspaces-page | DreamSpaces | `src/pages/DreamSpaces.tsx` | ✅ OPERATIVO |
| cell-dreamspaces-components | DreamSpace components | `src/components/dreamspaces/` | ✅ OPERATIVO |
| cell-3dspace-page | ThreeDSpace | `src/pages/ThreeDSpace.tsx` | ✅ OPERATIVO |
| cell-quantum-objects | QuantumObjects | `src/systems/QuantumObjects.tsx` | ✅ OPERATIVO |
| cell-quantum-canvas | QuantumCanvas | `src/components/QuantumCanvas.tsx` | ✅ OPERATIVO |
| cell-kaos-audio-system | KAOSAudioSystem | `src/systems/KAOSAudioSystem.ts` | ✅ OPERATIVO |
| cell-audio-system | AudioSystem | `src/systems/AudioSystem.ts` | ✅ OPERATIVO |
| cell-kaos-page | Kaos | `src/pages/Kaos.tsx` | ✅ OPERATIVO |
| cell-holographic | HolographicUI | `src/components/HolographicUI.tsx` | ✅ OPERATIVO |
| cell-particles | ParticleField | `src/components/ParticleField.tsx` | ✅ OPERATIVO |
| cell-matrix | MatrixBackground | `src/components/MatrixBackground.tsx` | ✅ OPERATIVO |
| cell-kaos-edge | kaos-audio-system | `supabase/functions/kaos-audio-system/` | ✅ OPERATIVO |
| cell-xr-store | xrStore | `src/stores/xrStore.ts` | ✅ OPERATIVO |

**MSR State (xrStore):**
```typescript
interface XRState {
  isXRActive: boolean;
  currentEnvironment: 'quantum' | 'forest' | 'cosmic' | 'crystal' | 'void' | 'matrix';
  sceneConfig: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
    audioReactive: boolean;
    binauralEnabled: boolean;
    particleCount: number;
    lodEnabled: boolean;
  };
  fps: number;
  quantumCoherence: number;
}
```

**Rutas:**
- `/metaverse` → Metaverse
- `/dream-spaces` → DreamSpaces
- `/3d-space` → ThreeDSpace
- `/kaos` → Kaos

---

### 2.7 DM-X4-07: INFRA / APIs

| Cell | Artefacto | Ruta Existente | Estado |
|------|-----------|----------------|--------|
| cell-unified-api | tamv-unified-api | `supabase/functions/tamv-unified-api/` | ✅ OPERATIVO |
| cell-fusion-core | tamv-fusion-core | `supabase/functions/tamv-fusion-core/` | ✅ OPERATIVO |
| cell-analytics | quantum-analytics | `supabase/functions/quantum-analytics/` | ✅ OPERATIVO |
| cell-analytics-enhanced | quantum-analytics-enhanced | `supabase/functions/quantum-analytics-enhanced/` | ✅ OPERATIVO |
| cell-content-sync | tamv-content-sync | `supabase/functions/tamv-content-sync/` | ✅ OPERATIVO |
| cell-federation | FederationSystem | `src/systems/FederationSystem.ts` | ✅ OPERATIVO |
| cell-websocket | useWebSocket | `src/hooks/useWebSocket.ts` | ✅ OPERATIVO |
| cell-notifications | NotificationCenter | `src/components/notifications/` | ✅ OPERATIVO |
| cell-notifications-hook | useNotifications | `src/hooks/useNotifications.ts` | ✅ OPERATIVO |
| cell-social-store | socialStore | `src/stores/socialStore.ts` | ✅ OPERATIVO |
| cell-ecosystem-page | Ecosystem | `src/pages/Ecosystem.tsx` | ✅ OPERATIVO |
| cell-governance-page | Governance | `src/pages/Governance.tsx` | ✅ OPERATIVO |
| cell-admin-page | Admin | `src/pages/Admin.tsx` | ✅ OPERATIVO |

**MSR State:**
```typescript
interface InfraState {
  notifications: Notification[];
  unreadCount: number;
  federationRegistry: FederationMember[];
  wsConnected: boolean;
}
```

**Rutas:**
- `/ecosystem` → Ecosystem
- `/governance` → Governance
- `/admin` → Admin

---

## 3. MAPA DE RUTAS COMPLETO

| Ruta | Dominio | Componente | Auth | Cell |
|------|---------|------------|------|------|
| `/` | Core | Index | ❌ | cell-router |
| `/dashboard` | Core | Dashboard | ✅ | cell-router |
| `/auth` | Core | Auth | ❌ | cell-auth |
| `/onboarding` | Core | Onboarding | ✅ | cell-onboarding |
| `/profile` | Core | Profile | ✅ | cell-profile |
| `/isabella` | IA | Isabella | ❌ | cell-isabella-page |
| `/anubis` | Seguridad | Anubis | ✅ | cell-anubis-page |
| `/crisis` | Seguridad | Crisis | ✅ | cell-crisis |
| `/university` | Educación | University | ❌ | cell-university-page |
| `/bookpi` | Educación | BookPI | ❌ | cell-bookpi-page |
| `/community` | Educación | Community | ❌ | cell-community-page |
| `/docs` | Educación | Docs | ❌ | cell-docs-page |
| `/metaverse` | XR | Metaverse | ❌ | cell-metaverse-page |
| `/dream-spaces` | XR | DreamSpaces | ❌ | cell-dreamspaces-page |
| `/3d-space` | XR | ThreeDSpace | ❌ | cell-3dspace-page |
| `/kaos` | XR | Kaos | ❌ | cell-kaos-page |
| `/economy` | Economía | Economy | ✅ | cell-economy-page |
| `/gifts` | Economía | Gifts | ✅ | cell-gifts-page |
| `/monetization` | Economía | Monetization | ✅ | cell-monetization-page |
| `/ecosystem` | Infra | Ecosystem | ❌ | cell-ecosystem-page |
| `/governance` | Infra | Governance | ✅ | cell-governance-page |
| `/admin` | Infra | Admin | ✅ (admin) | cell-admin-page |

---

## 4. ESQUEMAS DE BASE DE DATOS

### Tablas Confirmadas

| Tabla | Dominio | Descripción | Columnas Clave | RLS |
|-------|---------|-------------|----------------|-----|
| `posts` | Social | Publicaciones del feed | id, author_id, content, visibility, likes_count, tags, created_at | ✅ |
| `profiles` | Core | Perfiles de usuario | user_id, email, display_name, avatar_url, role, dignity_score, trust_level | ✅ |
| `transactions` | Economía | Historial de transacciones | id, user_id, type, amount, currency, status, created_at | ✅ |
| `tcep_wallets` | Economía | Billeteras TCEP/TAU | user_id, balance_tcep, balance_tau, locked_balance, membership_tier, lifetime_earned | ✅ |
| `analytics_events` | Infra | Eventos analíticos | id, user_id, event_name, event_type, properties, timestamp | ✅ |
| `dream_spaces` | XR | Espacios inmersivos | id, owner_id, name, environment, participants, max_participants | ✅ |
| `courses` | Educación | Cursos disponibles | id, title, level, category, is_free, price, certification_included, prerequisites | ✅ |
| `enrollments` | Educación | Matrículas + progreso | user_id, course_id, status, progress, completed_lessons, certificate_url | ✅ |
| `certificates` | Educación | Certificados federados | id, user_id, course_id, verification_url, blockchain_tx_hash, ipfs_hash, status | ✅ |
| `security_events` | Seguridad | Eventos de seguridad | id, user_id, event_type, threat_level, details, created_at | ✅ |
| `notifications` | Infra | Notificaciones | id, user_id, type, title, message, read, created_at | ✅ |
| `processed_stripe_events` | Economía | Idempotencia webhooks | stripe_event_id, processed_at, event_type | ✅ |
| `tts_cache` | IA | Cache TTS Isabella | cache_key, audio_url, text_hash, voice_id, char_count, created_at | ✅ |

### Auth & Memberships

| Tier | Descripción | Acceso |
|------|-------------|--------|
| `free` | Ciudadano TAMV | Dashboard, feed, universidad básica |
| `premium` | Explorador | DreamSpaces completo, Isabella extendida |
| `vip` | Guardián | Features avanzadas, prioridad soporte |
| `elite` | Arquitecto | Herramientas creación, gobernanza básica |
| `celestial` | Civilizador | Acceso total + gobernanza avanzada |
| `enterprise` | Federado | API extendida, planes corporativos |

**Referencia completa:** `docs/04_auth_memberships_access_control.md`

### Social Core Schema

Schema detallado de `posts` con RLS y visibilidad:
- `visibility`: `public` | `community` | `private`
- Feed paginado via `useSocialFeed` (20 posts/página)
- Realtime via canal `social-feed-realtime`
- Presencia via canal `tamv-presence` (Supabase Presence)

**Referencia completa:** `docs/05_social_core_schema_ui.md`

### Federated Certifications Schema

Sistema de certificaciones con trazabilidad blockchain:
- `courses`: catálogo de cursos disponibles
- `enrollments`: progreso por usuario/curso
- `certificates`: certificados emitidos con hash blockchain e IPFS
- Verificación pública via `bookpi-verify` Edge fn (pendiente)

**Referencia completa:** `docs/06_federated_certification.md`

---

## 5. FLUJOS DE INTEGRACIÓN

### 5.1 Flujo: Publicación Social con Analytics

```
CreatePostComposer (UI)
  → useSocialFeed.createPost()
    → supabase.from('posts').insert()
      → Supabase Realtime broadcast
        → useRealFeed subscription → feed actualizado
    → supabase.functions.invoke('quantum-analytics')
      → INSERT analytics_events
```

**Hook:** `src/hooks/useSocialFeed.ts`, `src/hooks/useCreatePost.ts`

### 5.2 Flujo: Compra TAU / Membership

```
StripeCheckout (UI)
  → supabase.functions.invoke('create-checkout')
    → Stripe API → checkout session
      → redirect to Stripe
        → stripe-webhook (Supabase Edge)
          → UPDATE tcep_wallets
          → INSERT transactions
            → tamv-fusion-core notify
              → NotificationCenter push
```

**Componentes:** `src/components/stripe/StripeCheckout.tsx`

### 5.3 Flujo: Isabella Chat + TTS

```
IsabellaChat (UI)
  → useIsabellaChatQuantum.sendMessage()
    → supabase.functions.invoke('isabella-chat-enhanced')
      → LLM response (chunk-by-phrase)
        → supabase.functions.invoke('isabella-tts')
          → cache check (hash text+voice)
            → HIT: return cached audio URL
            → MISS: ElevenLabs API → cache → return URL
              → Audio playback (chunk sync)
```

**Hooks:** `src/hooks/useIsabellaChatQuantum.ts`, `src/hooks/useIsabellaVoice.ts`

### 5.4 Flujo: Seguridad DEKATEOTL

```
User action (login / sensitive op)
  → AnubisSecuritySystem.scanUser()
    → supabase.functions.invoke('dekateotl-security-enhanced')
      → 11-layer scan (identity → self-healing)
        → SecurityEvent emitted
          → threat level assessment
            → CRITICAL: block + alert + self-heal
            → LOW/NONE: allow + log
```

**Sistema:** `src/systems/AnubisSecuritySystem.ts`

---

## 6. CONSTITUTION ENGINE

### Reglas Invariantes (NO negociables)

1. **Solo App.tsx** puede definir el árbol de rutas (`BrowserRouter`)
2. **Las páginas** (`src/pages/`) **no pueden importarse entre sí**
3. **Los sistemas** (`src/systems/`) son pure TypeScript (sin React imports directos excepto TSX declarados)
4. **Nombres canónicos** (MSR, THE SOF, MD-X4, Isabella, guardianías) **no pueden renombrarse**
5. **Toda mutación económica** requiere confirmación en `transactions` table antes de actualizar UI

### Componentes del Constitution Engine

| Componente | Artefacto | Ubicación | Función |
|-----------|-----------|-----------|---------|
| ESLint Plugin | eslint-plugin-tamv | `eslint-plugin-tamv/` | Naming conventions, single-root layout |
| Check Architecture | check-architecture.ts | `scripts/` | Grafo de dependencias sin ciclos |
| Scan Semantics | scan-semantics.js | `scripts/` | Canon naming drift detection |

---

## 7. FUSION CORE

### Contrato de Entrada

```json
{
  "domain": "ISABELLA | ECONOMY | SECURITY | EDUCATION | XR | SOCIAL | INFRA",
  "action": "string",
  "payload": {},
  "userId": "uuid",
  "timestamp": "ISO8601"
}
```

### Contrato de Salida

```json
{
  "success": true,
  "data": {},
  "domain": "string",
  "action": "string",
  "processedAt": "ISO8601",
  "traceId": "uuid"
}
```

**Ubicación:** `supabase/functions/tamv-fusion-core/`

---

## 8. NEXUS — CAPA DE PRESENTACIÓN

### Estructura del Nexus

```
src/App.tsx
  ├── UnifiedBackground (cell-background)
  ├── CivilizatorySidebar (cell-sidebar)
  ├── IsabellaChat (cell-isabella-chat) — floating widget
  ├── NotificationCenter/Toast (cell-notifications)
  └── Routes → Pages → Domain Components
```

### Principios del Nexus

- Una sola instancia de `BrowserRouter` (invariante constitucional)
- `UnifiedBackground` como única fuente de verdad visual global
- `CivilizatorySidebar` para navegación entre dominios
- `IsabellaChat` como asistente contextual persistente
- Notificaciones desacopladas del dominio de origen

---

## 9. ARCHIVOS EXISTENTES — ÍNDICE COMPLETO

### Pages (`src/pages/`)

| Archivo | Dominio | Estado |
|---------|---------|--------|
| Admin.tsx | Infra | ✅ |
| Anubis.tsx | Seguridad | ✅ |
| Auth.tsx | Core | ✅ |
| BookPI.tsx | Educación | ✅ |
| Community.tsx | Educación | ✅ |
| Crisis.tsx | Seguridad | ✅ |
| Dashboard.tsx | Core | ✅ |
| Docs.tsx | Educación | ✅ |
| DreamSpaces.tsx | XR | ✅ |
| Economy.tsx | Economía | ✅ |
| Ecosystem.tsx | Infra | ✅ |
| Gifts.tsx | Economía | ✅ |
| Governance.tsx | Infra | ✅ |
| Index.tsx | Core | ✅ |
| Isabella.tsx | IA | ✅ |
| Kaos.tsx | XR | ✅ |
| Metaverse.tsx | XR | ✅ |
| Monetization.tsx | Economía | ✅ |
| NotFound.tsx | Core | ✅ |
| Onboarding.tsx | Core | ✅ |
| Profile.tsx | Core | ✅ |
| ThreeDSpace.tsx | XR | ✅ |
| University.tsx | Educación | ✅ |

### Stores (`src/stores/`)

| Archivo | Dominio | Estado |
|---------|---------|--------|
| tamvStore.ts | Global (MSR) | ✅ |
| securityStore.ts | Seguridad | ✅ |
| socialStore.ts | Social | ✅ |
| xrStore.ts | XR | ✅ |

### Systems (`src/systems/`)

| Archivo | Dominio | Estado |
|---------|---------|--------|
| AnubisSecuritySystem.ts | Seguridad | ✅ |
| AudioSystem.ts | XR | ✅ |
| EconomySystem.ts | Economía | ✅ |
| FederationSystem.ts | Infra | ✅ |
| KAOSAudioSystem.ts | XR | ✅ |
| QuantumObjects.tsx | XR | ✅ |
| ThreeSceneManager.tsx | XR | ✅ |
| UniversitySystem.ts | Educación | ✅ |

### Hooks (`src/hooks/`)

| Archivo | Dominio | Estado |
|---------|---------|--------|
| useAuth.ts | Core | ✅ |
| useCreatePost.ts | Social | ✅ |
| useEmotionalDetection.ts | IA | ✅ |
| useIsabellaChatQuantum.ts | IA | ✅ |
| useIsabellaEmotionalAnalysis.ts | IA | ✅ |
| useIsabellaVoice.ts | IA | ✅ |
| useNotifications.ts | Infra | ✅ |
| useQuantumState.ts | XR | ✅ |
| useRealFeed.ts | Social | ✅ |
| useSocialFeed.ts | Social | ✅ |
| useTAMVSystems.ts | Global | ✅ |
| useUserPresence.ts | Social | ✅ |
| useWebSocket.ts | Infra | ✅ |
| useCameraAnimation.ts | XR | ✅ |
| useMobile.tsx | Core | ✅ |
| useToast.ts | Core | ✅ |

### Edge Functions (`supabase/functions/`)

| Carpeta | Dominio | Estado |
|---------|---------|--------|
| create-checkout | Economía | ✅ |
| dekateotl-security | Seguridad | ✅ |
| dekateotl-security-enhanced | Seguridad | ✅ |
| isabella-chat | IA | ✅ |
| isabella-chat-enhanced | IA | ✅ |
| isabella-tts | IA | ✅ |
| kaos-audio-system | XR | ✅ |
| quantum-analytics | Infra | ✅ |
| quantum-analytics-enhanced | Infra | ✅ |
| stripe-webhook | Economía | ✅ |
| tamv-content-sync | Infra | ✅ |
| tamv-fusion-core | Infra | ✅ |
| tamv-unified-api | Infra | ✅ |

---

## 10. ESTADO DE IMPLEMENTACIÓN

### Resumen

| Categoría | Total | Operativos | Pendientes |
|-----------|-------|-------------|------------|
| Pages | 23 | 23 | 0 |
| Stores | 4 | 4 | 0 |
| Systems | 8 | 8 | 0 |
| Hooks | 16 | 16 | 0 |
| Edge Functions | 13 | 13 | 0 |
| Components (UI) | 30+ | 30+ | 0 |

**Estado General:** ✅ **TOTALMENTE OPERATIVO**

---

## 11. REFERENCIAS

- `docs/02_arquitectura_tamv_mdx4.md` — Documento fuente de la arquitectura
- `docs/09_motor_mdx4_y_pipelines.md` — Motor MD-X4 y pipelines visuales
- `SOUL.md` — Identidad del agente TAMV_DOC_SENTINEL
- `AGENTS.md` — Permisos y restricciones operativas
- `PLAN-TAMV-MODULAR.md` — Plan quirúrgico MD-X4
- `src/App.tsx` — Componente raíz y rutas
- `src/stores/tamvStore.ts` — Estado global MSR

## 12. WIKI MD-X4 — REFERENCIAS ACTUALIZADAS (2026-03-01)

| Documento | Cobertura | Estado |
|-----------|-----------|--------|
| `docs/04_auth_memberships_access_control.md` | Auth flows, membership tiers, RLS, roles, route guards | ✅ stable |
| `docs/05_social_core_schema_ui.md` | Posts schema, hooks sociales, UI components, flujos realtime | ✅ stable |
| `docs/06_federated_certification.md` | Courses/enrollments/certificates schema, BookPI, federation checks | ✅ stable |
| `docs/deployment_templates.md` | Vercel/Netlify/Fly.io templates, CI/CD pipeline, checklist | ✅ stable |
| `DEPLOYMENT_GUIDE.md` | Guía completa de despliegue y configuración de tablas | ✅ stable |
| `MDX5_OPERATIONAL_PROTOCOL.md` | Protocolo Deca-V (10 ciclos de validación) | ✅ stable |

---

*Documento generado como parte del mapeo funcional MD-X4 · Actualizado: MD-X4 Wiki Master Update 2026-03-01*
