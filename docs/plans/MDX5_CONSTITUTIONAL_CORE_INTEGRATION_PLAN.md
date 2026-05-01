# MDX5 Constitutional Core Integration Plan (Nexus Federado)

## Estado
- **Versión:** 0.1
- **Fecha:** 2026-05-01
- **Modo:** Documental (sin cambios directos a lógica productiva)
- **Objetivo:** convertir el marco constitucional en *Layer 0* obligatorio para toda ejecución TAMV.

---

## 1) Radiografía extrema del Nexus

El repositorio ya opera como ecosistema federado de múltiples capas (UI, runtime, systems, funciones serverless, infraestructura y canon documental). La ventaja estratégica es que el marco doctrinal existe; la brecha actual es de **acoplamiento obligatorio en runtime**.

### Fortalezas estructurales
- Documentación canónica amplia y modular (`docs/**`, `wikitamv/**`, `repo-unification/**`).
- Frontend y runtime con componentes/hook/sistemas especializados (`src/components/**`, `src/hooks/**`, `src/lib/**`, `src/systems/**`).
- Backends desacoplados por dominio en `supabase/functions/**`.
- Capas de despliegue y observabilidad (`k8s/**`, CI/CD, monitoreo).

### Fracturas probables
- Ausencia de un **gatekeeper único** de autorización constitucional para todos los flujos.
- Validación heterogénea en hooks/services/functions (riesgo de bypass).
- Audit trail disperso (sin cadena inmutable transversal).
- Falta de contexto de ejecución estandarizado (actor/intent/domain/origin/risk/correlation).

### Diagnóstico
La civilización digital está construida, pero el núcleo constitucional aún no actúa como sistema nervioso forzoso.

---

## 2) Núcleo constitucional objetivo

### Arquitectura por capas
1. **Layer 0 — Constitutional Layer**: única autoridad de permiso/denegación.
2. **Layer 1 — Meta-Orchestrator**: enruta intents permitidos.
3. **Layer 2 — Domain Systems**: ejecución por dominio (economía, XR, social, IA, governance, etc.).
4. **Layer 3 — Interfaces**: hooks UI, functions, agentes, cron, webhooks.

### Principios de endurecimiento
- No simplificar ni eliminar sistemas existentes.
- Forzar un contrato unificado de ejecución:
  - `TAMVExecutionRequest`
  - `ExecutionPermit`
  - `ConstitutionalGuard`
  - `ConstitutionEngine`
  - `AuditTrail` inmutable
- Política por defecto: **deny-by-default**.

---

## 3) Diseño MDX5-Constitucional propuesto

## Estructura sugerida
```txt
src/lib/core/
  constitutional-layer/
    types.ts
    executionContext.ts
    constitutionalGuard.ts
    constitutionEngine.ts
    policyRegistry.ts
    enforcementPipeline.ts
    auditTrail.ts
  orchestration/
    metaOrchestrator.ts
    domainRouter.ts
    pipelineResolver.ts
    intentRegistry.ts
  runtime/
    unifiedAPI.ts
    actorResolver.ts
    contextAdapters.ts
```

### Contrato mínimo transversal
- `actor`: id, tipo, roles, memberships, federación.
- `intent`: acción de negocio explícita y estable.
- `domain`: economía/xr/governance/social/ia/security/etc.
- `payload`: cuerpo funcional.
- `context`: origen, riesgo, IP, user-agent, correlation/trace IDs.

### Gatekeeper universal (`ConstitutionalGuard`)
- Validación estructural del request.
- Evaluación de políticas por prioridad.
- Emisión de `ExecutionPermit` con `constraints`.
- Denegación inmediata + evento de violación.

### Motor declarativo (`ConstitutionEngine`)
- Registro de políticas por dominio/intent.
- Prioridad determinística.
- Efectos: `allow`, `deny`, `modify` (vía constraints).
- Resultado mínimo: `{ allowed, constraints, policyId }`.

### Registro de políticas (`PolicyRegistry`)
- Fase 1: policies en código para bootstrap.
- Fase 2: policies en BD (`tamv_policies`) o archivos versionados derivados del canon.
- Trazabilidad: policy ↔ artículo canónico (`docs/**`, `wikitamv/**`).

### Cadena de auditoría inmutable (`AuditTrail`)
- Hash por evento con encadenamiento (`prevHash`).
- Eventos: `permit`, `violation`, `execution_result`.
- Persistencia sugerida: `tamv_audit_trail` + logs estructurados para observabilidad.

---

## 4) Integración irreversible por superficies

### A) Runtime
- `UnifiedAPI.execute(request)` como puerta lógica única.
- Todo consumidor (UI, functions, agentes, jobs) debe invocar `UnifiedAPI`.

### B) Orquestación
- `MetaOrchestrator.dispatch(req, permit)` + `DomainRouter.route(...)`.
- Sistemas existentes conservan complejidad; adoptan `handleIntent(intent, payload, permit)`.

### C) Supabase Functions
- Derivar `actor` desde request (roles/memberships/federación).
- Traducir request HTTP a `TAMVExecutionRequest`.
- Bloquear ejecución directa fuera del guard.

### D) Hooks/UI
- Evitar llamadas directas a endpoints de dominio.
- `useUnifiedAPI`/adapters como patrón obligatorio.

### E) IA / XR / Governance
- Pipelines éticos y de seguridad se convierten en policies ejecutables.
- Sin `ExecutionPermit`, no hay invocación a motor IA/XR sensible.

---

## 5) Plan de migración por fases (sin ruptura)

### Fase 0 — Cartografía constitucional
- Construir `TAMV_INTENT_REGISTRY` (intent/domain/origin/criticality/policies).
- Inventario de bypasses potenciales por ruta.

### Fase 1 — Bootstrap de core
- Añadir `constitutional-layer`, `orchestration`, `runtime`.
- Tests de autorización, prioridad de policy y hash-chain.

### Fase 2 — Hooks críticos
- Migrar hooks sensibles (wallet, governance, social, XR, IA) a `UnifiedAPI`.

### Fase 3 — Supabase Functions
- Normalizar actor/context e integrar guard en cada función.

### Fase 4 — Systems
- Adoptar contrato `handleIntent` con `ExecutionPermit` y constraints.

### Fase 5 — Política viva
- Sincronizar policies con canon documental y gobernanza interna.

---

## 6) Criterios de éxito (Definition of Done)
- 100% de intents críticos pasan por `ConstitutionalGuard`.
- 0 rutas de ejecución productiva sin `ExecutionPermit`.
- Audit trail encadenado para toda acción sensible.
- Policy coverage mapeada por dominio con trazabilidad documental.
- Mecanismo de bloqueo automático ante violaciones de Layer 0.

---

## 7) Dominio recomendado para piloto

**Recomendado: Economía (wallet + transferencias)**, por combinar:
- Riesgo alto.
- Reglas claras de autorización.
- Excelente relación valor/visibilidad para validar el marco.

### Alcance mínimo del piloto
- 2–3 intents económicos.
- 2 hooks + 2 funciones Supabase + 1 sistema de dominio.
- Métricas: latencia de guard, tasa de deny legítimo, completitud de auditoría.

---

## 8) Entregables documentales siguientes
1. `docs/plans/TAMV_INTENT_REGISTRY_TEMPLATE.md`
2. `docs/plans/TAMV_POLICY_MAPPING_MATRIX.md`
3. `docs/plans/ECONOMY_CONSTITUTIONAL_PILOT_SPEC.md`
4. `docs/devhub/CONSTITUTIONAL_EXECUTION_STANDARD.md`

