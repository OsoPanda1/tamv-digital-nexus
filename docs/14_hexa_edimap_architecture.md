# 14 — HEXA-EDIMAP: Arquitectura Operativa Adaptativa Gobernada

> **Estado:** `stable` · **Versión:** 1.0.0 · **Clasificación:** Especificación Fundacional Arquitectónica  
> **Integración TAMV:** Mapeado a DM-X4, MSR, Guardianías y Constitution Engine  
> **Canon Prevalente:** `SOUL.md`, `MASTER_CANON_OPENCLAW_TAMV.md`

---

## 1. DECLARACIÓN FUNDACIONAL

HEXA-EDIMAP es un **sistema operativo arquitectónico** diseñado para entornos donde:

- Existen decisiones críticas en tiempo real (guardianías TAMV)
- Se requiere memoria histórica íntegra (THE SOF Shadow Engine)
- La evolución normativa es frecuente (MSR Rules versioning)
- Hay exigencia regulatoria o económica (UTAMV/BookPI compliance)
- El aprendizaje debe estar gobernado (Isabella AI + bóveda)

Su base conceptual extiende la Arquitectura Hexagonal de Alistair Cockburn y los principios de Clean Architecture, incorporando:

- **Event Sourcing** como fuente de verdad (THE SOF Event Store)
- **Pipeline dual hot/cold** (MD-X4 Pipeline A/B extendido)
- **Gobernanza versionada de reglas** (MSR + Constitution Engine)
- **Memoria estructurada obligatoria** (Audit trail TAMV)
- **Promoción controlada de plantillas** (Template governance)

---

## 2. FILOSOFÍA DEL SISTEMA

### 2.1 Separación Temporal

HEXA-EDIMAP no solo separa infraestructura del dominio. Separa explícitamente:

1. **Presente operativo** → Pipeline HOT (decisiones inmediatas)
2. **Historia estructurada** → Event Store + THE SOF
3. **Evolución normativa** → MSR Rules + Constitution Engine
4. **Aprendizaje analítico** → Pipeline COLD (Isabella Analytics)

> La arquitectura tradicional protege capas. HEXA-EDIMAP protege **tiempos**.

### 2.2 Gobernanza Antes que Autonomía

El sistema **PUEDE**:
- Ajustar parámetros dentro de rangos definidos (MSR dynamic rules)
- Detectar anomalías (Radares TAMV)
- Proponer nuevas plantillas (Isabella proposals)

El sistema **NO PUEDE**:
- Cambiar su marco estructural (Canon lock)
- Auto-promover reglas críticas (Human approval required)
- Alterar límites regulatorios (Legal constraints)

### 2.3 Trazabilidad como Principio Ontológico

> Nada ocurre sin evento.  
> Nada cambia sin versión.  
> Nada evoluciona sin promoción.

---

## 3. VISIÓN Y MISIÓN EN CONTEXTO TAMV

### Visión
Desarrollar sistemas TAMV capaces de evolucionar sin perder estabilidad estructural ni gobernanza, manteniendo la integridad de los 177 repositorios federados.

### Misión
Implementar arquitectura hexagonal extendida sobre DM-X4 con:

- Doble pipeline (hot/cold) integrado a MD-X4 Pipeline A/B
- Memoria estructurada vía THE SOF Shadow Engine
- Motor de aprendizaje controlado (Isabella AI)
- Marco jurídico compatible (UTAMV legal framework)
- Modelo económico versionado (MSR Economic Rules)

---

## 4. ALCANCE DEL SISTEMA

### HEXA-EDIMAP es aplicable a:

| Dominio TAMV | Aplicabilidad | Estado |
|--------------|---------------|--------|
| Plataformas económicas digitales | UTAMV/BookPI/MSR Economy | ✅ Activo |
| Sistemas regulatorios | Constitution Engine + QC-TAMV-01 | ✅ Activo |
| FinTech | Stripe Integration + Tau marketplace | ✅ Activo |
| Plataformas de reputación | Social Core + Radares | ✅ Activo |
| Sistemas de scoring | MSR Rules + Guardianías | ✅ Activo |
| Plataformas XR con gobernanza | MD-X4 Pipeline + Ethics | ✅ Activo |
| Infraestructura crítica | Anubis + Dekateotl + TEE | ✅ Activo |

### No es recomendable para:
- CRUD simples sin gobernanza
- Aplicaciones de baja criticidad
- MVP de bajo riesgo sin requerimientos de auditoría

---

## 5. MODELO ARQUITECTÓNICO GLOBAL

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         HEXA-EDIMAP sobre TAMV                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────┐         ┌─────────────────┐                      │
│   │  PRIMARIOS      │         │  ADAPTERS       │                      │
│   │  (Inbound Ports)│         │  (Implement)    │                      │
│   │  • HTTP API     │◄────────│  • REST Adapter │                      │
│   │  • WebSocket    │◄────────│  • WS Adapter   │                      │
│   │  • CLI          │◄────────│  • CLI Adapter  │                      │
│   │  • XR Interface │◄────────│  • XR Adapter   │                      │
│   └────────┬────────┘         └─────────────────┘                      │
│            │                                                            │
│            ▼                                                            │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │                    [ HOT PIPELINE ]                      │         │
│   │  ┌──────────────┐  ┌─────────────┐  ┌─────────────────┐  │         │
│   │  │   USE CASE   │─►│  GUARDIAN   │─►│    DECISION     │  │         │
│   │  │   (MSR)      │  │  (Anubis)   │  │  ALLOW/HOLD/BLK │  │         │
│   │  └──────────────┘  └─────────────┘  └────────┬────────┘  │         │
│   └───────────────────────────────────────────────┼───────────┘         │
│                                                   │                     │
│                        ┌──────────────────────────┘                     │
│                        ▼                                                │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │                    EVENT STORE (THE SOF)                 │         │
│   │  ┌────────────────────────────────────────────────────┐  │         │
│   │  │  • Domain Event v1 (EconomicPolicy.v1)             │  │         │
│   │  │  • Domain Event v2 (EconomicPolicy.v1)             │  │         │
│   │  │  • Correlation ID / Causation ID                   │  │         │
│   │  │  • Timestamp + Rule Version                        │  │         │
│   │  └────────────────────────────────────────────────────┘  │         │
│   └──────────────────────────────┬───────────────────────────┘         │
│                                  │                                      │
│                                  ▼                                      │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │                   [ COLD PIPELINE ]                      │         │
│   │  ┌──────────────┐  ┌─────────────┐  ┌─────────────────┐  │         │
│   │  │  AGGREGATION │─►│  ANALYTICS  │─►│  TEMPLATE PROP  │  │         │
│   │  │  (Temporal)  │  │  (Isabella) │  │  (Promoción)    │  │         │
│   │  └──────────────┘  └─────────────┘  └────────┬────────┘  │         │
│   └───────────────────────────────────────────────┼───────────┘         │
│                                                   │                     │
│                        ┌──────────────────────────┘                     │
│                        ▼                                                │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │              PLANTILLAS / GOBERNANZA                     │         │
│   │  ┌──────────────┐  ┌─────────────┐  ┌─────────────────┐  │         │
│   │  │   MSR RULES  │  │ CONSTITUTION│  │   PROMOTION     │  │         │
│   │  │  (Versioned) │  │   ENGINE    │  │    ENGINE       │  │         │
│   │  └──────────────┘  └─────────────┘  └─────────────────┘  │         │
│   └──────────────────────────────────────────────────────────┘         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. COMPONENTES DEL SISTEMA

### 6.1 Dominio (DM-X4 Cells)

Contiene:
- **Entidades** → DM-X4 domain models
- **Value Objects** → MSR contracts
- **Casos de uso** → UseCase implementations
- **Guardianías** → Anubis, Dekateotl, Horus, Osiris
- **Eventos de dominio** → THE SOF events

> No conoce infraestructura. Regla de HEXA-EDIMAP: Dependency Inversion.

### 6.2 Puertos (Ports)

#### Puertos de Entrada (Inbound)
| Puerto | Implementación TAMV | Ruta |
|--------|---------------------|------|
| HTTP API | REST Adapter | `src/api/` |
| WebSocket | Realtime Adapter | Supabase Realtime |
| CLI | Scripts/Edge Functions | `scripts/`, `supabase/functions/` |
| XR Interface | MD-X4 Pipeline B | `src/systems/ThreeSceneManager.tsx` |
| Scheduler | Cron Edge Functions | `supabase/functions/cron-*` |

#### Puertos de Salida (Outbound)
| Puerto | Implementación TAMV | Ruta |
|--------|---------------------|------|
| EventStorePort | THE SOF Shadow Engine | `src/lib/sof/` (conceptual) |
| RepositoryPort | Supabase/PostgreSQL | `src/lib/db.ts` |
| EventBusPort | Supabase Realtime + WebSocket | `src/lib/realtime.ts` |
| NotificationPort | Notification System | `src/components/notifications/` |
| AnalyticsPort | Isabella Analytics | Edge Functions `analytics-*` |

### 6.3 Adaptadores (TAMV Implementation)

| Adaptador | Tecnología | Ruta |
|-----------|------------|------|
| PostgreSQL Adapter | Supabase PG | `src/lib/db.ts` |
| Kafka Adapter | Supabase Realtime (equivalente) | `src/lib/realtime.ts` |
| REST Adapter | React Query + Fetch | `src/hooks/use*.ts` |
| Mongo Projection Adapter | Supabase Projections | Edge functions |
| Prometheus Metrics Adapter | Custom Metrics | `src/lib/metrics.ts` |

---

## 7. PIPELINE CALIENTE (HOT)

### Objetivo
Tomar decisiones inmediatas con latencia mínima (< 100ms p95).

### Características
- Evaluación de guardianías (Anubis pre-flight)
- Aplicación de reglas vigentes (MSR active rules)
- Persistencia de eventos (THE SOF append)
- Publicación asíncrona (EventBus fire-and-forget)

### Flujo Operativo TAMV
```
Command (User Action)
  → UseCase (DM-X4 Cell)
     → Guardian (Anubis/Dekateotl)
        → Decision (ALLOW/HOLD/BLOCK)
           → DomainEvent (THE SOF)
              → Persist (Event Store)
                 → Publish (Realtime)
                    → Projection Update
```

### Implementación en DM-X4
```typescript
// src/lib/msr.ts (extracto conceptual HEXA-EDIMAP)
export interface HotPipelineContext {
  correlationId: string;
  causationId?: string;
  timestamp: Date;
  ruleVersion: string;  // "EconomicPolicy.v1"
  guardianDecision: "ALLOW" | "HOLD" | "BLOCK";
}

export async function hotPipelineExecute<T>(
  command: Command<T>,
  guardian: Guardian,
  eventStore: EventStorePort
): Promise<PipelineResult> {
  // 1. Evaluación síncrona de guardianía
  const decision = guardian.evaluate(command.context);
  
  if (decision === "BLOCK") {
    return { status: "blocked", reason: guardian.lastReason };
  }
  
  // 2. Ejecución de caso de uso
  const result = await command.execute();
  
  // 3. Generación de evento de dominio
  const event = new DomainEvent({
    id: crypto.randomUUID(),
    name: command.eventName,
    payload: result,
    version: "v1",
    ruleVersion: guardian.activeRuleVersion,
    correlationId: command.correlationId,
    causationId: command.id,
    timestamp: new Date()
  });
  
  // 4. Persistencia síncrona en Event Store
  await eventStore.append(event);
  
  // 5. Publicación asíncrona
  eventBus.publish(event); // Non-blocking
  
  return { status: decision, eventId: event.id };
}
```

### Restricciones HOT
- ❌ No análisis histórico pesado
- ❌ No agregaciones complejas
- ❌ No simulaciones
- ❌ No acceso a pipeline cold

---

## 8. PIPELINE FRÍO (COLD)

### Objetivo
Analizar comportamiento histórico para aprendizaje estructurado y propuesta de evolución normativa.

### Funciones
- **Agregación temporal** → Windowed queries sobre Event Store
- **Análisis estadístico** → Drift detection, anomaly scoring
- **Detección de drift** → Reglas vs. comportamiento real
- **Simulación de impacto** → What-if sobre propuestas
- **Generación de propuestas** → Nuevas plantillas de reglas

### Implementación TAMV (Isabella Analytics)
```typescript
// infrastructure/analytics/ColdPipeline.ts
export class ColdPipeline {
  constructor(
    private eventStore: EventStorePort,
    private analyticsEngine: IsabellaAnalytics,
    private promotionService: PromotionService
  ) {}

  async analyze(window: TimeWindow): Promise<AnalysisResult> {
    // 1. Agregación de eventos
    const events = await this.eventStore.readWindow(window);
    
    // 2. Análisis por Isabella
    const analysis = this.analyticsEngine.analyze(events);
    
    // 3. Detección de anomalías
    if (analysis.driftScore > 0.7) {
      return {
        status: "DRIFT_DETECTED",
        proposal: this.generateProposal(analysis)
      };
    }
    
    // 4. Métricas operativas
    return {
      status: "STABLE",
      metrics: analysis.metrics
    };
  }

  private generateProposal(analysis: Analysis): TemplateProposal {
    return {
      template: "EconomicPolicy",
      currentVersion: "v1",
      proposedVersion: "v2",
      suggestedParams: analysis.optimalParams,
      confidence: analysis.confidence,
      simulationResults: analysis.simulation,
      requiresHumanApproval: true // Siempre
    };
  }
}
```

### Restricciones COLD
- ❌ No modifica directamente el pipeline caliente
- ❌ No ejecuta cambios en producción
- ✅ Solo genera propuestas para promoción

---

## 9. MEMORIA ESTRUCTURADA (THE SOF Event Store)

Fuente de verdad única: **THE SOF Shadow Engine**

Cada evento contiene:

| Campo | Descripción | Ejemplo TAMV |
|-------|-------------|--------------|
| `id` | UUID v4 único | `"evt_abc123..."` |
| `type` | Nombre del evento | `"TokensTransferred"` |
| `payload` | Datos del evento | `{ amount: 100, from: "u1", to: "u2" }` |
| `timestamp` | ISO 8601 UTC | `"2026-03-02T08:00:00Z"` |
| `version` | Versión del esquema | `"v1"` |
| `ruleVersion` | Plantilla aplicada | `"EconomicPolicy.v1"` |
| `correlationId` | ID de trazabilidad | `"corr_xyz789..."` |
| `causationId` | ID del evento causante | `"evt_prev456..."` |

### Capacidades
- **Replay total** → Reconstrucción de estado en cualquier punto temporal
- **Auditoría completa** → Cumplimiento regulatorio UTAMV
- **Simulación retrospectiva** → What-if sobre datos históricos
- **Reconstrucción de estado** → Proyecciones recreables

---

## 10. PLANTILLAS (MSR Rules Versioned)

Las plantillas son reglas versionadas formalmente dentro del MSR.

### Ejemplos en TAMV

| Plantilla | Versión Actual | Descripción |
|-----------|----------------|-------------|
| `EconomicPolicy` | v1 | Reglas de transferencia Tau |
| `RiskThresholds` | v3 | Umbrales de riesgo guardianías |
| `BehaviorRules` | v2 | Reglas de conducta XR |
| `AuthPolicies` | v2 | Políticas de autenticación |
| `ContentModeration` | v1 | Reglas de moderación social |

### Estructura de Plantilla
```typescript
interface Template {
  identifier: string;           // "EconomicPolicy"
  version: string;              // "v1.2.3"
  parameters: Record<string, any>; // { maxTransfer: 1000, fee: 0.01 }
  allowedRanges: {              // Rangos operativos permitidos
    [key: string]: { min: number; max: number }
  };
  promotionDate?: Date;         // Fecha de activación
  author: string;               // "constitution-engine" o humano
  justification: string;        // Razón del cambio
  supportingMetrics: Metric[];  // Métricas que respaldan la versión
  status: "draft" | "simulated" | "approved" | "active" | "deprecated";
}
```

### Proceso de Promoción TAMV
```
1. PROPUESTA
   ↓ Cold Pipeline detecta optimización
   ↓ Genera TemplateProposal v(N+1)
   
2. SIMULACIÓN
   ↓ Simulación sobre datos históricos (72h)
   ↓ Validación de impacto económico/social
   
3. CONSTITUTION CHECK
   ↓ Constitution Engine valida contra QC-TAMV-01
   ↓ Verifica rangos permitidos
   
4. APROBACIÓN HUMANA
   ↓ Review por Governance Panel
   ↓ Firma digital / Consensus
   
5. PUBLICACIÓN
   ↓ Promoción a "active"
   ↓ Evento TemplatePromoted al Event Store
   ↓ Notificación a Hot Pipeline
```

---

## 11. MODELO ECONÓMICO (UTAMV/MSR)

HEXA-EDIMAP integra el modelo económico TAMV:

### Componentes Económicos
- **Tau (τ)** - Token interno de utilidad
- **Reglas de emisión** - MSR Economic Rules
- **Reglas de transferencia** - EconomicGuardian
- **Límites dinámicos** - Hot pipeline adjustable params
- **Penalizaciones** - Automatic via guardianías

### Lo que NUNCA permite
- ❌ Auto-modificación estructural económica
- ❌ Cambio de supply cap sin aprobación
- ❌ Modificación de contratos inteligentes en caliente

### Lo que SÍ permite
- ✅ Ajustes paramétricos dentro de bandas definidas
- ✅ Modificación de fees dentro de rangos
- ✅ Adaptación de thresholds por volumen

---

## 12. MARCO JURÍDICO-LEGAL (UTAMV)

Compatible con:
- **Derecho a explicación** → Cada decisión trazable a regla + versión
- **Auditoría regulatoria** → Event Store inmutable
- **Versionado obligatorio** → Todas las reglas versionadas
- **Separación de datos personales** → PII en tier separado

### Cada decisión es explicable
```typescript
interface DecisionExplanation {
  decisionId: string;
  rule: string;              // "EconomicPolicy.v1"
  ruleVersion: string;       // "v1"
  context: any;              // Datos de entrada
  guardian: string;          // "EconomicGuardian"
  outcome: "ALLOW" | "HOLD" | "BLOCK";
  timestamp: Date;
  correlationId: string;     // Para trazabilidad completa
}
```

---

## 13. INTEGRACIÓN CON ARQUITECTURA TAMV EXISTENTE

### Mapeo HEXA-EDIMAP ↔ TAMV

| HEXA-EDIMAP | Componente TAMV | Estado |
|-------------|-----------------|--------|
| Hot Pipeline | MD-X4 Pipeline A (Datos) | ✅ Mapeado |
| Cold Pipeline | MD-X4 Pipeline B extendido + Isabella Analytics | ✅ Mapeado |
| Event Store | THE SOF Shadow Engine | ✅ Mapeado |
| Guardianías | Anubis, Dekateotl, Horus, Osiris | ✅ Mapeado |
| Plantillas | MSR Rules + Constitution Engine | ✅ Mapeado |
| Promoción | Promotion Service (nuevo) | 📋 Por implementar |
| Puertos | DM-X4 Cells + Edge Functions | ✅ Mapeado |
| Adaptadores | Repositories + API clients | ✅ Mapeado |

### Diagrama de Integración
```
┌─────────────────────────────────────────────────────────────────┐
│                     TAMV MD-X4 + HEXA-EDIMAP                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   NEXUS UI   │◄──►│  FUSION CORE │◄──►│   DM-X4      │      │
│  │   (React)    │    │  (Orquest)   │    │   DOMAINS    │      │
│  └──────────────┘    └──────────────┘    └──────┬───────┘      │
│                                                  │              │
│                           ┌──────────────────────┘              │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              HEXA-EDIMAP LAYER                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │    HOT      │  │  THE SOF    │  │     COLD        │  │   │
│  │  │  PIPELINE   │◄►│ EVENT STORE │◄►│   PIPELINE      │  │   │
│  │  │  (Anubis)   │  │ (Shadow Eng)│  │ (Isabella AI)   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              MSR + CONSTITUTION ENGINE                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │   RULES     │  │  PROMOTION  │  │     QC-TAMV     │  │   │
│  │  │ (Versioned) │  │   ENGINE    │  │      -01        │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 14. MÉTRICAS OPERATIVAS OFICIALES

Monitorear continuamente:

| Métrica | Target | Alerta |
|---------|--------|--------|
| p95 hot latency | < 100ms | > 200ms |
| Event append throughput | > 1000 evt/s | < 500 evt/s |
| Cold backlog depth | < 10k events | > 50k |
| Template promotion frequency | < 1/semana | > 3/semana |
| Drift score | < 0.3 | > 0.7 |
| Guardian block ratio | < 5% | > 15% |
| Economic imbalance ratio | < 1% | > 5% |

### Dashboard HEXA-EDIMAP
Ubicación propuesta: `src/components/governance/HexaEdimapDashboard.tsx`

---

## 15. RIESGOS ESTRUCTURALES Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación TAMV |
|--------|--------------|---------|-----------------|
| Complejidad organizacional | Media | Alto | Documentación canon, training |
| Coste de infraestructura | Media | Medio | Proyecciones incrementales |
| Sobrediseño | Alta | Medio | HEXA-EDIMAP-Lite para MVP |
| Saturación de eventos | Baja | Alto | Sharding + TTL policies |
| Gobernanza burocrática | Media | Medio | Automatización de validaciones |

### HEXA-EDIMAP-Lite
Versión reducida para dominios no críticos:
- Solo Hot Pipeline
- Event Store simplificado
- Sin Cold Pipeline
- Promoción manual únicamente

---

## 16. CONCLUSIÓN OFICIAL

HEXA-EDIMAP no es solo arquitectura. Es:

> **Un modelo operativo temporal.**  
> **Una infraestructura de memoria.**  
> **Un marco de evolución gobernada.**  
> **Un sistema capaz de aprender sin perder control.**

Permite que TAMV:
- **Actúe** con precisión (Hot Pipeline + Guardianías)
- **Recuerde** con fidelidad (THE SOF Event Store)
- **Aprenda** con análisis (Cold Pipeline + Isabella)
- **Evolucione** con autorización (Promotion Engine + Constitution)

Esto define su naturaleza como **Sistema Operativo Adaptativo Gobernado** integrado a la infraestructura civilizatoria TAMV.

---

## 17. REFERENCIAS CRUZADAS CANON

| Documento | Relación |
|-----------|----------|
| `SOUL.md` | Canon fundacional, valores operativos |
| `MASTER_CANON_OPENCLAW_TAMV.md` | Prevalencia de dominios |
| `docs/02_arquitectura_tamv_mdx4.md` | Arquitectura base DM-X4 |
| `docs/09_motor_mdx4_y_pipelines.md` | Pipelines A/B |
| `docs/modules/msr/` | Motor de reglas |
| `docs/modules/guardianias/` | Guardianías implementadas |
| `docs/modules/ia/` | Isabella AI |
| `02_MODULOS/M01_QC/INTERNO/TEE-AUDIT-RUNBOOK.md` | Auditoría |
| `MDX5_OPERATIONAL_PROTOCOL.md` | Protocolo Deca-V |

---

## 18. HISTORIAL DE VERSIONES

| Versión | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0.0 | 2026-03-02 | Especificación fundacional | TAMV_DOC_SENTINEL |

---

*Documento integrado al canon TAMV bajo principio de trazabilidad.  
Cualquier modificación requiere revisión constitucional (QC-TAMV-01).*
