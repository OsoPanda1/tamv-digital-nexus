# MDX5_FUNCTIONAL_IMPLEMENTATION_RUNBOOK

## Estado
- **Versión:** v1.0-operational-doc
- **Fecha:** 2026-03-17
- **Modo:** DOCUMENTAL_ONLY (ejecución de código pendiente de autorización explícita)
- **Objetivo:** convertir la unificación de 177 repos en una secuencia operativa verificable, con entregables funcionales por sprint.

---

## 0) Qué sí resuelve este runbook

Este documento **no repite visión**. Define:
1. **Backlog de implementación** con rutas concretas de archivos.
2. **Comandos de ejecución** (lint, check, test, build, auditoría).
3. **Matriz de migración repo→paquete** para convergencia monorepo.
4. **Gates obligatorios** para aceptar cada integración.
5. **Definition of Done** por módulo crítico (API, IA, XR, mercado, DAO).

---

## 1) Target monorepo funcional (estructura propuesta)

```text
/apps
  /web                 # NextJS/React/Tailwind (UX principal)
  /api                 # Node + Fastify/Express style REST API
  /admin               # dashboard técnico + observabilidad
/packages
  /domain-core         # tipos canon, entidades y contratos
  /territory-engine    # places, twins, rutas, eventos
  /realito-ai          # orquestación Isabella/Realito
  /route-ga            # optimizador genético de rutas
  /economy-billing     # merchants/subscriptions/stripe
  /dao-governance      # proposal/vote/execution logs
  /xr-kit              # componentes inmersivos reutilizables
  /security-kit        # auth, rate-limit, guards, policies
  /observability       # logs, metrics, traces, alerts
/infrastructure
  /prisma              # schema + migrations + seeds
  /k8s                 # manifests operativos
  /docker              # compose/containers
/docs
  /repo-unification    # control documental y trazabilidad
```

### Regla de migración
Cada repo externo se integra en uno de estos destinos:
- **apps/** si trae UI o servicio ejecutable completo.
- **packages/** si aporta librería reusable.
- **infrastructure/** si aporta despliegue/infra.

---

## 2) Backlog ejecutable por fases (90 días)

## Fase 1 (Días 1–14) — Foundation que compila

### Entregable F1-A: API mínima operativa
- Endpoints obligatorios en `/apps/api`:
  - `GET /health`
  - `GET /api/places`
  - `GET /api/merchants`
  - `POST /api/experience/optimize-route`
  - `POST /api/realito/chat`
  - `POST /api/billing/checkout`

**DoD**
- Contratos OpenAPI versionados.
- Respuestas tipadas y validadas.
- Pruebas de contrato mínimas por endpoint.

### Entregable F1-B: Data layer real
- Prisma con modelos base:
  - `User`, `Merchant`, `MerchantUser`, `Place`, `DigitalTwin`, `Proposal`, `Vote`.
- Seeds mínimos reproducibles para demo funcional.

**DoD**
- `prisma migrate deploy` sin errores.
- Seed reproducible en entorno local y CI.

### Entregable F1-C: Seguridad baseline
- JWT para rutas protegidas.
- Rate limit Redis por endpoint sensible.
- Helmet + CORS por entorno.

**DoD**
- Test de rechazo para requests sin token.
- Test de rate-limit en endpoint IA.

---

## Fase 2 (Días 15–35) — Flujo producto end-to-end

### Entregable F2-A: Route Genetic Optimizer funcional
- Servicio `route-ga` con score multi-factor:
  - diversity, crowd, merchantBalance, timeFit, affinity, immersion, stopCount.

**DoD**
- Endpoint retorna `suggestedRoute` con fitness score.
- Test de regresión del algoritmo con casos fijos.

### Entregable F2-B: Isabella Realito MVP
- Modos: `ROUTE_PLANNER`, `STORYTELLER`, `FAQ`, `SYSTEM`.
- Historial contextual por sesión.

**DoD**
- `POST /api/realito/chat` responde estructura completa:
  - `reply`, `suggestedRoute`, `highlightTwins`, `followUpQuestions`.

### Entregable F2-C: Marketplace con Stripe
- Checkout de plan `Basic/Premium/Elite`.
- Persistencia de suscripción por merchant.

**DoD**
- Checkout test en sandbox Stripe.
- Webhook idempotente validado.

---

## Fase 3 (Días 36–60) — UX visual y territorio

### Entregable F3-A: Dashboard TAMV live
- KPIs conectados a API real:
  - users, xrWorlds, merchants, digitalTwins, routesGenerated, aiRequests, economyVolume.

### Entregable F3-B: Territory Explorer interactivo
- Capas: Places, Merchants, Twins, Routes, Events.
- Filtros + búsqueda + selección contextual.

### Entregable F3-C: XR Worlds Gallery
- Visual-first (90% visual).
- Categorías: XR Cities, Events, DreamSpaces, Digital Institutions.

**DoD Fase 3**
- Demo navegable completa sin mocks críticos.
- Lighthouse/performance baseline acordado.

---

## Fase 4 (Días 61–90) — Gobernanza + hardening

### Entregable F4-A: DAO Governance base
- `Proposal` + `Vote` + resultado auditable.

### Entregable F4-B: Observabilidad y resiliencia
- Dashboard de errores + trazas + alertas.
- Runbook de rollback por dominio.

### Entregable F4-C: Release candidate monorepo
- Corte funcional integrado de dominios troncales.

**DoD Fase 4**
- SLO mínimos definidos.
- CI verde (lint/check/test/build + gates de seguridad).

---

## 3) Pipeline de integración de repos (177 -> monorepo)

Para cada repo externo aplicar esta secuencia invariable:

1. **Discovery**
   - registrar metadatos en `REPO_REGISTRY_177.csv`.
2. **Classification**
   - asignar dominio y destino (`apps|packages|infrastructure`).
3. **Contract mapping**
   - mapear endpoints/eventos/modelos al canon MD-X5.
4. **Code import**
   - incorporar código con historial preservado cuando sea viable.
5. **Refactor to boundary**
   - adaptar a límites de contexto.
6. **Quality gates**
   - lint + typecheck + test + scan semántico.
7. **Acceptance**
   - merge sólo si cumple DoD de fase.

---

## 4) Comandos operativos de verificación (repositorio actual)

```bash
npm run lint:constitution
npm run scan:semantics
npm run check
npm run test
npm run build
npm run check:architecture
npm run audit:deca-v
```

### Gate mínimo de merge
Se rechaza integración si falla cualquiera de:
- lint constitucional
- typecheck
- tests
- build
- check arquitectura

---

## 5) Matriz de ownership técnico

| Dominio | Owner técnico | Gate principal |
|---|---|---|
| API/Infra | Platform Lead | contratos + resiliencia |
| IA Isabella/Realito | AI Lead | calidad de respuesta + seguridad |
| Territory + Route GA | Geo/Optimization Lead | precisión + performance |
| Economy/Billing | FinOps Lead | idempotencia + auditoría |
| XR Worlds | XR Lead | fps + estabilidad visual |
| DAO | Governance Lead | auditabilidad de voto |
| Security | Security Lead | auth/rate-limit/policies |

> Si no existe owner asignado, el módulo no entra en sprint de integración.

---

## 6) Riesgos de ejecución y mitigación inmediata

1. **Riesgo:** integración sin contratos.
   - **Mitigación:** contract-first obligatorio antes de importar código.
2. **Riesgo:** deuda de dependencias heterogéneas.
   - **Mitigación:** baseline único de Node/TS/ESLint/Prisma.
3. **Riesgo:** regresiones entre dominios.
   - **Mitigación:** tests de contrato + smoke tests end-to-end por ola.
4. **Riesgo:** seguridad dispareja por servicio.
   - **Mitigación:** `security-kit` central con políticas comunes.

---

## 7) Checklist de inicio inmediato (semana actual)

- [ ] Completar metadata real de los 177 repos en `REPO_REGISTRY_177.csv`.
- [ ] Añadir columna `target_path` (apps/packages/infrastructure).
- [ ] Añadir columna `integration_wave` (1..4).
- [ ] Marcar `blockers` por repo (deps, licencia, seguridad, abandono).
- [ ] Definir 20 repos de mayor impacto para Ola 1.
- [ ] Generar primer tablero de avance en `docs/repo-unification/`.

---

## 8) Criterio de éxito global

La unificación se considera lograda cuando:
1. El monorepo compila y pasa gates en CI.
2. Los endpoints troncales MD-X5 están operativos con data real.
3. Isabella/Realito, Territory Explorer y Marketplace funcionan end-to-end.
4. Existe trazabilidad completa repo-origen -> módulo-destino -> release.

