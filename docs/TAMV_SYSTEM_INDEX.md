# TAMV System Index

- **Index version:** `v2026.05.03`
- **Fecha de corte (UTC):** `2026-05-03`
- **Modo:** `DOCUMENTAL_ONLY`
- **Fuentes canónicas obligatorias para todas las entradas:** `SOUL.md`, `docs/MASTER_CANON_OPENCLAW_TAMV.md`

## Tabla maestra por módulo

| ID | Módulo | Capa / Dominio | Owner | Estado | Madurez | Rutas de código (indicativas) | Endpoints/Funciones | Métricas clave | Runbooks / Operación | Fuentes canónicas | Gaps accionables |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DM-X4-01 | TAMV Core OS / Nexus | Core plataforma | TAMV Core / Plataforma | active | beta | `src/stores/tamvStore.ts`, `src/systems/FederationSystem.ts`, `src/pages/*` | Gateway/IGU (documental), contratos `docs/TAMV_OPENAPI_SPEC_v3.1.0.yaml` | Uptime plataforma, errores de routing, coherencia de estado MSR | `docs/TAMV_UNIFIED_API_MASTER_TECHNICAL_v3.md`, `docs/02_arquitectura_tamv_mdx4.md` | `SOUL.md`; `docs/MASTER_CANON_OPENCLAW_TAMV.md` | Definir owner nominal por célula y SLO/SLA operativos ejecutables por entorno. |
| DM-X4-02 | IA / Isabella / THE SOF | IA + Orquestación | DAO-Ética/IA + AI Systems | active | beta | `src/components/IsabellaChat.tsx`, `src/hooks/useIsabellaChatQuantum.ts`, `supabase/functions/isabella-chat-enhanced/`, `supabase/functions/isabella-tts/`, `supabase/functions/tamv-fusion-core/` | `isabella-chat-enhanced`, `isabella-tts`, `tamv-fusion-core` | p95 respuesta chat+audio (<4–5s objetivo), hit ratio cache TTS, tasa fallback texto | `docs/07_isabella_multiagente_y_boveda.md`, `docs/modules/ia/ia_internal.md`, `docs/sofreports/THESOF_STATE_REPORT.md` | `SOUL.md`; `docs/MASTER_CANON_OPENCLAW_TAMV.md` | Formalizar política de retención/log IA y límites de tokens por request; cerrar revisión DAO-Ética/IA. |
| DM-X4-03 | Guardianías + Seguridad | Seguridad civilizatoria | DAO-Seguridad / Sentinel | active | prod-ready | `src/systems/AnubisSecuritySystem.ts`, `supabase/functions/dekateotl-security/`, `supabase/functions/dekateotl-security-enhanced/`, `src/components/crisis/` | `dekateotl-security`, `dekateotl-security-enhanced` | Severidad de amenazas, tiempo de contención, cobertura auditoría continua | `docs/08_seguridad_sentinel_y_radares.md`, `docs/modules/guardianias/guardianias_internal.md` | `SOUL.md`; `docs/MASTER_CANON_OPENCLAW_TAMV.md` | Completar capas planificadas (post-quantum crypto, deepfake detection) y evidencias de attestation TEE. |
| DM-X4-04 | UTAMV / BookPI | Educación + certificación | UTAMV/BookPI Team | planned | prototype | `docs/devhub/bookpi_api.md`, referencias en arquitectura unificada | `bookpi` API (draft) | Tasa de certificación, integridad de credenciales, latencia emisión/verificación | `docs/06_federated_certification.md`, `docs/devhub/bookpi_api.md` | `SOUL.md`; `docs/MASTER_CANON_OPENCLAW_TAMV.md` | Completar contrato API y trazabilidad técnica de implementación (hoy mayormente documental). |
| DM-X4-05 | MSR / Economía TCEP-TAU | Economía + estado/reglas | Economy + MSR Core | active | beta | `src/lib/msr.ts`, `src/systems/EconomySystem.ts`, `src/components/stripe/StripeCheckout.tsx`, `supabase/functions/create-checkout/` | `create-checkout`, `stripe-webhook` | Consistencia ledger, idempotencia webhooks, pendientes >24h, balances negativos | `docs/13_economico_financiero_tamv.md`, `docs/modules/msr/msr_internal.md` | `SOUL.md`; `docs/MASTER_CANON_OPENCLAW_TAMV.md` | Publicar runbook formal de reconciliación y automatizar auditoría económica continua. |
| DM-X4-06 | Render XR / MD-X4 Pipelines | XR + pipeline sensorial | XR/Experience Team | active | beta | `src/pages/Metaverse.tsx`, `src/pages/DreamSpaces.tsx`, `src/systems/ThreeSceneManager.tsx`, `src/stores/xrStore.ts` | `kaos-audio-system` | FPS >=45 objetivo, LCP rutas XR, memoria Three.js, leaks de geometría | `docs/09_motor_mdx4_y_pipelines.md`, `docs/modules/render/render_internal.md` | `SOUL.md`; `docs/MASTER_CANON_OPENCLAW_TAMV.md` | Cerrar deuda de code-splitting XR, aplicar LOD automático y tablero de performance continuo. |
| DM-X4-03R | Radares / Observabilidad avanzada | Seguridad + observabilidad | Sentinel / Horus Tower | draft | prototype | (pendiente de aterrizaje técnico en `src/**`), base documental en `docs/modules/radares/` | (pendiente) | Cobertura sensores, detección temprana, correlación multi-dominio | `docs/modules/radares/radares_internal.md`, `docs/08_seguridad_sentinel_y_radares.md` | `SOUL.md`; `docs/MASTER_CANON_OPENCLAW_TAMV.md` | Definir artefactos de código, contratos de evento y KPIs medibles para operación real. |

## Versionado y diff

### Versión actual
- `v2026.05.03` (2026-05-03 UTC)

### Historial
| Versión | Fecha | Tipo de cambio | Resumen |
|---|---|---|---|
| `v2026.05.03` | 2026-05-03 | baseline | Primera publicación del índice maestro por módulo (MD + JSON) con referencias canónicas y gaps accionables. |

### Diff vs versión anterior
- **Anterior:** N/A (no existe versión previa registrada).
- **Actual (`v2026.05.03`) agrega:**
  - Tabla maestra homogénea por módulo (ID, capa, owner, estado, rutas, endpoints, métricas, runbooks).
  - Campo de madurez (`prototype`, `beta`, `prod-ready`).
  - Gaps accionables por dominio.
  - Estructura paralela en `docs/TAMV_SYSTEM_INDEX.json` para consumo de Studio/búsqueda.
