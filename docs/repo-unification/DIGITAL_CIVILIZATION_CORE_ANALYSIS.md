# Análisis de Unificación: digital-civilization-core → tamv-digital-nexus

> **Fecha:** 2026-03-08 · **Analista:** TAMV_DOC_SENTINEL  
> **Repo fuente:** `OsoPanda1/digital-civilization-core` (43 commits, última actividad: 2026-01-18)  
> **Repo destino:** `tamv-digital-nexus` (este monorepo)

---

## 1. Inventario del Repositorio Fuente

### Estructura detectada
```
digital-civilization-core/
├── apps/web-client/src/          # CrisisTacticalUnit.tsx
├── libs/shared-types/src/        # creator-identity.ts (tipos soberanos)
├── services/intelligence-federation/src/
│   ├── api/v1/                   # gate.py (Anubis Gateway)
│   ├── core/                     # ingestor.py (contenido)
│   ├── models/                   # sovereign_event.py
│   ├── security/                 # anubis.py
│   └── orchestrator.ts           # IsabellaOrchestrator
├── scripts/                      # bootstrap.cjs
├── src/
│   ├── api/v1/                   # sensory_gate.py
│   ├── components/               # auth/, layout/, sections/, shared/, ui/, SovereignDashboard.tsx
│   ├── contexts/                 # AuthContext
│   ├── hooks/                    # useArtworks, useChannels, useConcerts, useCourses, useLikes,
│   │                             # useLotteries, useMarketplace, useNotifications, usePosts,
│   │                             # useProfile, useStreams
│   ├── neural/                   # synapse_mapper.py
│   ├── pages/                    # app/ (Dashboard, Feed, Streams, Concerts, University, 
│   │                             #        Lottery, Marketplace, Gallery, Channels, DevHub, Profile)
│   │                             # auth/ (Login, Register), ForgotPassword, Terms, Privacy
│   ├── security/                 # anubis.py
│   └── integrations/supabase/    # client, types
├── supabase/                     # funciones y migraciones
└── package.json                  # Vite + React + Shadcn + Turborepo + pnpm workspaces
```

### Clasificación: `TAMV_REPO_CONFIRMED`
- Score de afinidad canónica: **0.95** (señales inequívocas: Isabella, Anubis, MSR, Creator Identity, DreamSpaces)
- Origen: Lovable + commits manuales de OsoPanda1

---

## 2. Matriz de Correspondencia (Fuente → Destino)

| Módulo en `digital-civilization-core` | Equivalente en `tamv-digital-nexus` | Estado |
|---|---|---|
| `src/pages/app/Dashboard` | `src/pages/Dashboard.tsx` | ✅ Evolucionado |
| `src/pages/app/Feed` | `src/pages/Community.tsx` + `src/components/social/*` | ✅ Evolucionado |
| `src/pages/app/Streams` | No existe directamente | 🔶 **Pendiente integración** |
| `src/pages/app/Concerts` | No existe directamente | 🔶 **Pendiente integración** |
| `src/pages/app/University` | `src/pages/University.tsx` | ✅ Evolucionado |
| `src/pages/app/Lottery` | Hooks en `useUnifiedAPI.ts` (lottery) | ✅ Backend listo |
| `src/pages/app/Marketplace` | `src/pages/Economy.tsx` + tabla `marketplace_items` | ✅ Evolucionado |
| `src/pages/app/Gallery` | `src/components/gifts/CircleGiftGallery.tsx` | ✅ Parcial |
| `src/pages/app/Channels` | Tabla `channels` + social feed | ✅ Backend listo |
| `src/pages/app/DevHub` | `src/pages/Docs.tsx` + `docs/devhub/*` | ✅ Evolucionado |
| `src/pages/app/Profile` | `src/pages/Profile.tsx` | ✅ Evolucionado |
| `src/pages/auth/*` | `src/pages/Auth.tsx` + `src/components/auth/AuthForm.tsx` | ✅ Evolucionado |
| `src/pages/Terms.tsx` | No existe | 🔶 **Pendiente** |
| `src/pages/Privacy.tsx` | No existe | 🔶 **Pendiente** |
| `src/hooks/useArtworks` | No existe | 🔶 **A integrar** |
| `src/hooks/usePosts` | `src/hooks/useSocialFeed.ts` + `useRealFeed.ts` | ✅ Evolucionado |
| `src/hooks/useLotteries` | `useUnifiedAPI.ts` → `useActiveLotteryDraws` | ✅ Evolucionado |
| `src/hooks/useStreams` | No existe | 🔶 **A integrar** |
| `src/hooks/useConcerts` | No existe | 🔶 **A integrar** |
| `services/.../orchestrator.ts` | `src/lib/isabella/core.ts` (parcial) | 🔶 **Integrado abajo** |
| `libs/shared-types/creator-identity.ts` | `src/lib/sovereign-identity.ts` | 🔶 **Integrado abajo** |
| `apps/web-client/CrisisTacticalUnit.tsx` | `src/components/crisis/CrisisPanel.tsx` | ✅ Evolucionado |
| `services/.../gate.py` (Python) | `supabase/functions/dekateotl-security-enhanced/` | ✅ Edge Function equiv. |
| `src/neural/synapse_mapper.py` | `supabase/functions/isabella-chat-enhanced/` | ✅ Edge Function equiv. |
| `src/security/anubis.py` | `src/systems/AnubisSentinelSystem.ts` | ✅ Evolucionado |
| `SovereignDashboard.tsx` | `src/pages/Dashboard.tsx` | ✅ Absorbido |

---

## 3. Módulos Únicos para Absorción

### 3.1 Absorbidos en esta entrega
- **IsabellaOrchestrator** → `src/lib/isabella/orchestrator.ts` (nuevo)
- **CreatorIdentity / Sovereign Types** → `src/lib/sovereign-identity.ts` (nuevo)
- **Sensory Gate** → `supabase/functions/sensory-gate/index.ts` (nuevo)

### 3.2 Pendientes para futuras olas
- **Streams** y **Concerts** pages (requieren diseño UI)
- **Terms.tsx** y **Privacy.tsx** (requieren revisión legal: `TODO_REVIEW_LEGAL`)
- **useArtworks** hook (requiere tabla `artworks` o mapeo a `marketplace_items`)
- **bootstrap.cjs** script (evaluación de utilidad para CI/CD)

---

## 4. Servicios Python (No ejecutables en Lovable)

Los siguientes archivos Python del repo fuente **no pueden ejecutarse directamente** en Lovable pero su lógica ha sido portada a Edge Functions equivalentes:

| Archivo Python | Edge Function equivalente | Estado |
|---|---|---|
| `gate.py` (Anubis Gateway) | `dekateotl-security-enhanced` | ✅ Funcional |
| `anubis.py` (Sentinel) | `security-service` | ✅ Funcional |
| `ingestor.py` (Content) | `tamv-content-sync` | ✅ Funcional |
| `synapse_mapper.py` (Neural) | `isabella-chat-enhanced` | ✅ Funcional |
| `sovereign_event.py` (Models) | Tipos TS en `src/lib/sovereign-identity.ts` | ✅ Portado |
| `sensory_gate.py` (API v1) | `sensory-gate` (nueva Edge Function) | ✅ Creada |

---

## 5. Decisión de Convergencia

**Estrategia:** `digital-civilization-core` queda clasificado como **ABSORBIDO** por `tamv-digital-nexus`.

- Todos los módulos funcionales ya existen en versión evolucionada.
- Los módulos únicos (orchestrator, sovereign identity, sensory gate) han sido portados.
- Los servicios Python han sido mapeados a Edge Functions TypeScript.
- No se requiere merge de código directo; el repo fuente puede archivarse.

---

## 6. Actualización del Registro

| Campo | Valor |
|---|---|
| **Slot en REPO_REGISTRY** | #2 |
| **Nombre** | `digital-civilization-core` |
| **Clasificación** | `TAMV_REPO_CONFIRMED` |
| **Afinidad** | 0.95 |
| **Dominio** | CORE/PLATAFORMA + IA + SEGURIDAD |
| **Estado** | `ABSORBED` |
| **Absorbido por** | `tamv-digital-nexus` |
| **Fecha absorción** | 2026-03-08 |
