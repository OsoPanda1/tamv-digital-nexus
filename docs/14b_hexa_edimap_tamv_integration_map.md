# 14b — Mapa de Integración HEXA-EDIMAP ↔ TAMV MD-X4

> **Estado:** `stable` · **Versión:** 1.0.0 · **Tipo:** Cross-Reference Técnico  
> **Propósito:** Mapeo detallado de conceptos HEXA-EDIMAP a implementaciones TAMV existentes

---

## Resumen de Integración

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    HEXA-EDIMAP → TAMV MAPPING                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────┐          ┌─────────────────────┐              │
│  │   HEXA-EDIMAP       │          │   TAMV MD-X4        │              │
│  │   Concept           │─────────►│   Implementation    │              │
│  └─────────────────────┘          └─────────────────────┘              │
│                                                                         │
│  Hot Pipeline          ────────►   MD-X4 Pipeline A (Datos)            │
│  Cold Pipeline         ────────►   MD-X4 Pipeline B + Isabella AI      │
│  Event Store           ────────►   THE SOF Shadow Engine               │
│  Guardian (Abstract)   ────────►   AnubisSecuritySystem                │
│  Guardian (Economic)   ────────►   EconomicGuardian (MSR)              │
│  Template              ────────►   MSR Rule Versioned                  │
│  Constitution          ────────►   Constitution Engine (QC-TAMV-01)    │
│  Promotion Engine      ────────►   Governance/PromotionService         │
│  DomainEvent           ────────►   SOFEvent + DomainEvent              │
│  CorrelationID         ────────►   trace_id / request_id               │
│  CausationID           ────────►   parent_event_id                     │
│  Drift Detection       ────────►   Radares Anomalía + Isabella         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Tabla Maestra de Mapeo

### Componentes Core

| HEXA-EDIMAP | TAMV Equivalente | Archivo(s) | Estado |
|-------------|------------------|------------|--------|
| `DomainEvent` | `SOFEvent` + Props | `src/lib/sof/types.ts` (conceptual) | 🟡 Por definir |
| `Guardian` (Interface) | `AnubisSecuritySystem` | `src/systems/AnubisSecuritySystem.ts` | ✅ Implementado |
| `EconomicGuardian` | `MSR.economicGuardian` | `src/lib/msr.ts` | 🟡 Parcial |
| `HotPipeline` | Pipeline A extendido | `src/lib/pipeline/hot.ts` (nuevo) | 🔴 Por crear |
| `ColdPipeline` | Isabella Analytics + Radares | `supabase/functions/analytics-*` | 🟡 Parcial |
| `EventStorePort` | Supabase + THE SOF | `src/lib/db.ts` + Edge Functions | ✅ Implementado |
| `Template` | `MSRRule` versionado | `src/lib/msr.ts` | 🟡 Parcial |
| `PromotionService` | Governance Panel | `src/components/governance/` | 🟡 Esqueleto |

### Puertos y Adaptadores

| Puerto HEXA-EDIMAP | TAMV Adapter | Tecnología | Ruta |
|--------------------|--------------|------------|------|
| `Inbound: HTTP API` | REST Routes | React + Fetch | `src/api/` |
| `Inbound: WebSocket` | Supabase Realtime | WS + Postgres | `src/lib/realtime.ts` |
| `Inbound: XR` | MD-X4 Pipeline B | Three.js + R3F | `src/systems/` |
| `Outbound: EventStore` | Supabase Events | PostgreSQL | `supabase/migrations/` |
| `Outbound: Repository` | Supabase Client | PostgreSQL | `src/lib/db.ts` |
| `Outbound: EventBus` | Realtime + WebSocket | Supabase | `src/lib/realtime.ts` |
| `Outbound: Analytics` | Isabella Edge | Deno/Edge | `supabase/functions/isabella-*` |

---

## Mapeo Detallado: Guardianías

### Jerarquía de Guardianes

```
Guardian (HEXA-EDIMAP Interface)
    │
    ├──► AnubisSecuritySystem (TAMV)
    │       ├── Pre-flight checks
    │       ├── Threat detection
    │       └── Quantum-resistant validation
    │
    ├──► EconomicGuardian (HEXA-EDIMAP Pattern)
    │       └── Implemented via MSR Rules
    │
    ├──► DekateotlSecurity (TAMV)
    │       ├── Post-quantum cryptography
    │       └── TEE operations
    │
    └──► HorusSentinel (TAMV)
            ├── Anomaly detection
            └── Predictive alerts
```

### Implementación de EconomicGuardian en TAMV

```typescript
// src/lib/msr.ts - Extensión HEXA-EDIMAP

/**
 * EconomicGuardian implementa el patrón HEXA-EDIMAP
 * para protección de operaciones económicas.
 * 
 * @implements Guardian (HEXA-EDIMAP)
 */
export interface Guardian {
  evaluate(context: GuardianContext): GuardianDecision;
  getActiveRuleVersion(): string;
  getLastReason(): string | null;
}

export type GuardianDecision = "ALLOW" | "HOLD" | "BLOCK";

export interface GuardianContext {
  userId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  riskScore: number;
  previousTransactions: number;
}

/**
 * EconomicGuardian - Protección de transferencias Tau
 * Reglas: BLOCK si > maxTransfer, HOLD si > 80% maxTransfer
 */
export class EconomicGuardian implements Guardian {
  private ruleVersion = "EconomicPolicy.v1";
  private lastReason: string | null = null;

  constructor(
    private maxTransfer: number,
    private dailyLimit: number
  ) {}

  evaluate(ctx: GuardianContext): GuardianDecision {
    // Verificación de límite absoluto
    if (ctx.amount > this.maxTransfer) {
      this.lastReason = `Amount ${ctx.amount} exceeds maxTransfer ${this.maxTransfer}`;
      return "BLOCK";
    }

    // Verificación de umbral de precaución (80%)
    if (ctx.amount > this.maxTransfer * 0.8) {
      this.lastReason = `Amount ${ctx.amount} exceeds 80% threshold of ${this.maxTransfer}`;
      return "HOLD";
    }

    // Verificación de límite diario
    if (ctx.previousTransactions + ctx.amount > this.dailyLimit) {
      this.lastReason = `Daily limit ${this.dailyLimit} would be exceeded`;
      return "HOLD";
    }

    this.lastReason = null;
    return "ALLOW";
  }

  getActiveRuleVersion(): string {
    return this.ruleVersion;
  }

  getLastReason(): string | null {
    return this.lastReason;
  }
}
```

---

## Mapeo Detallado: Pipelines

### Hot Pipeline (Decisiones Inmediatas)

```typescript
// src/lib/pipeline/hot.ts - Implementación HEXA-EDIMAP

import { Guardian, GuardianDecision } from "../msr";
import { EventStorePort } from "../ports/eventstore";
import { EventBusPort } from "../ports/eventbus";

/**
 * HotPipeline implementa el pipeline de decisión inmediata
 * según especificación HEXA-EDIMAP §7
 * 
 * Objetivo: Latencia < 100ms p95
 */
export class HotPipeline {
  constructor(
    private eventStore: EventStorePort,
    private eventBus: EventBusPort
  ) {}

  async execute<TInput, TResult>(
    command: Command<TInput, TResult>,
    guardian: Guardian,
    context: TInput
  ): Promise<HotPipelineResult<TResult>> {
    const correlationId = generateCorrelationId();
    const startTime = performance.now();

    try {
      // 1. Evaluación de guardianía (síncrona, rápida)
      const decision = guardian.evaluate(context);

      if (decision === "BLOCK") {
        await this.logBlockedCommand(command, guardian, context, correlationId);
        return {
          status: "BLOCKED",
          correlationId,
          latencyMs: performance.now() - startTime,
          reason: guardian.getLastReason()
        };
      }

      // 2. Ejecución del caso de uso
      const result = await command.execute(context);

      // 3. Generación de evento de dominio
      const event: DomainEvent = {
        id: crypto.randomUUID(),
        name: command.eventName,
        payload: result,
        version: "v1",
        ruleVersion: guardian.getActiveRuleVersion(),
        correlationId,
        causationId: command.id,
        timestamp: new Date(),
        metadata: {
          latencyMs: performance.now() - startTime,
          guardianDecision: decision
        }
      };

      // 4. Persistencia síncrona en Event Store
      await this.eventStore.append(event);

      // 5. Publicación asíncrona (non-blocking)
      this.eventBus.publish(event).catch(console.error);

      return {
        status: decision === "HOLD" ? "HELD" : "COMPLETED",
        correlationId,
        eventId: event.id,
        data: result,
        latencyMs: performance.now() - startTime
      };

    } catch (error) {
      await this.logError(command, error, correlationId);
      throw error;
    }
  }

  private async logBlockedCommand(
    command: Command<any, any>,
    guardian: Guardian,
    context: any,
    correlationId: string
  ): Promise<void> {
    const blockedEvent: DomainEvent = {
      id: crypto.randomUUID(),
      name: "CommandBlockedByGuardian",
      payload: {
        command: command.name,
        context,
        reason: guardian.getLastReason(),
        ruleVersion: guardian.getActiveRuleVersion()
      },
      version: "v1",
      ruleVersion: guardian.getActiveRuleVersion(),
      correlationId,
      timestamp: new Date()
    };

    await this.eventStore.append(blockedEvent);
  }
}
```

### Cold Pipeline (Análisis y Aprendizaje)

```typescript
// src/lib/pipeline/cold.ts - Implementación HEXA-EDIMAP

import { IsabellaAnalytics } from "../ai/isabella";
import { EventStorePort } from "../ports/eventstore";
import { PromotionService } from "../governance/promotion";

/**
 * ColdPipeline implementa el análisis histórico
 * según especificación HEXA-EDIMAP §8
 * 
 * Objetivo: Detección de drift, propuestas de optimización
 */
export class ColdPipeline {
  constructor(
    private eventStore: EventStorePort,
    private analytics: IsabellaAnalytics,
    private promotionService: PromotionService
  ) {}

  /**
   * Analiza una ventana temporal de eventos
   */
  async analyze(window: TimeWindow): Promise<ColdAnalysisResult> {
    // 1. Agregación de eventos (batch query)
    const events = await this.eventStore.readWindow({
      from: window.from,
      to: window.to,
      types: ["TokensTransferred", "CommandBlockedByGuardian"]
    });

    // 2. Análisis estadístico
    const stats = this.calculateStats(events);

    // 3. Detección de drift
    const driftScore = this.calculateDrift(stats);

    // 4. Generación de propuesta si es necesario
    if (driftScore > 0.7) {
      const proposal = await this.generateProposal(stats);
      
      return {
        status: "DRIFT_DETECTED",
        driftScore,
        proposal,
        metrics: stats
      };
    }

    return {
      status: "STABLE",
      driftScore,
      metrics: stats
    };
  }

  private calculateStats(events: DomainEvent[]): EventStats {
    const total = events.length;
    const blocked = events.filter(e => e.name === "CommandBlockedByGuardian").length;
    const completed = events.filter(e => e.name === "TokensTransferred").length;

    return {
      total,
      blocked,
      completed,
      blockRate: blocked / total,
      avgAmount: this.calculateAvgAmount(events),
      latencyP95: this.calculateP95Latency(events)
    };
  }

  private calculateDrift(stats: EventStats): number {
    // Algoritmo de detección de drift
    // Retorna valor 0-1 donde > 0.7 indica drift significativo
    const baselineBlockRate = 0.05; // 5% baseline
    const drift = Math.abs(stats.blockRate - baselineBlockRate) / baselineBlockRate;
    return Math.min(drift, 1);
  }

  private async generateProposal(stats: EventStats): Promise<TemplateProposal> {
    // Consulta a Isabella para generar propuesta optimizada
    const recommendation = await this.analytics.recommendPolicyAdjustment(stats);

    return {
      template: "EconomicPolicy",
      currentVersion: "v1",
      proposedVersion: "v2",
      suggestedParams: {
        maxTransfer: recommendation.newMaxTransfer,
        dailyLimit: recommendation.newDailyLimit
      },
      confidence: recommendation.confidence,
      simulationResults: recommendation.simulation,
      requiresHumanApproval: true
    };
  }
}
```

---

## Mapeo: Event Store ↔ THE SOF

### Estructura de Evento Unificada

```typescript
// src/lib/events/types.ts - Unificación HEXA-EDIMAP + TAMV

/**
 * DomainEvent - Unión de HEXA-EDIMAP + THE SOF
 * 
 * HEXA-EDIMAP requiere:
 * - id, type, payload, timestamp, version
 * - ruleVersion, correlationId, causationId
 * 
 * THE SOF añade:
 * - sofId, shadowCopy, auditTrail
 */
export interface DomainEvent {
  // HEXA-EDIMAP Core
  id: string;                    // UUID v4
  type: string;                  // Nombre del evento
  payload: Record<string, any>;  // Datos específicos
  timestamp: Date;               // ISO 8601 UTC
  version: string;               // Versión del esquema
  
  // HEXA-EDIMAP Governance
  ruleVersion: string;           // "EconomicPolicy.v1"
  correlationId: string;         // Trazabilidad transaccional
  causationId?: string;          // Evento causante (chain)
  
  // THE SOF Extensions
  sofId?: string;                // ID en Shadow Engine
  shadowCopy?: boolean;          // Si está en cold storage
  auditTrail?: AuditEntry[];     // Historial de auditoría
  
  // Metadata operacional
  metadata?: {
    latencyMs?: number;
    guardianDecision?: "ALLOW" | "HOLD" | "BLOCK";
    source?: string;             // "hot-pipeline" | "cold-pipeline"
  };
}

interface AuditEntry {
  timestamp: Date;
  action: "created" | "archived" | "verified";
  actor: string;
  signature?: string;            // Firma criptográfica
}
```

### Operaciones del Event Store

```typescript
// src/lib/ports/eventstore.ts

export interface EventStorePort {
  // HEXA-EDIMAP Core
  append(event: DomainEvent): Promise<void>;
  read(id: string): Promise<DomainEvent | null>;
  readWindow(window: TimeWindow): Promise<DomainEvent[]>;
  
  // TAMV/THE SOF Extensions
  replay(from?: Date, to?: Date): AsyncGenerator<DomainEvent>;
  snapshot(streamId: string): Promise<EventSnapshot>;
  verifyIntegrity(eventId: string): Promise<boolean>;
}

export interface TimeWindow {
  from: Date;
  to: Date;
  types?: string[];  // Filtro opcional por tipo
}
```

---

## Mapeo: Templates ↔ MSR Rules

### Estructura Unificada

```typescript
// src/lib/msr.ts - Extensión Template HEXA-EDIMAP

/**
 * Template HEXA-EDIMAP implementado sobre MSR Rules
 */
export interface Template {
  // Identificación
  identifier: string;           // "EconomicPolicy", "AuthPolicy"
  version: string;              // Semver: "1.2.3"
  
  // Contenido
  parameters: Record<string, ParamValue>;
  allowedRanges: ParamRanges;   // Límites operativos
  
  // Gobernanza
  status: TemplateStatus;
  author: string;               // Autor de la versión
  justification: string;        // Razón del cambio
  supportingMetrics: Metric[];  // Evidencia
  
  // Promoción
  promotionDate?: Date;
  approvedBy?: string[];        // Firmas de aprobación
  
  // Trazabilidad
  parentVersion?: string;       // Versión anterior
  createdAt: Date;
}

type TemplateStatus = 
  | "draft"        // En desarrollo
  | "simulated"    // Simulado, esperando validación
  | "approved"     // Aprobado, no activo aún
  | "active"       // En producción
  | "deprecated";  // Reemplazado

type ParamValue = string | number | boolean | string[];

interface ParamRanges {
  [key: string]: {
    min: number;
    max: number;
    step?: number;
  };
}

/**
 * Ejemplo: EconomicPolicy Template
 */
export const EconomicPolicyV1: Template = {
  identifier: "EconomicPolicy",
  version: "1.0.0",
  parameters: {
    maxTransfer: 10000,          // Tau
    dailyLimit: 50000,
    feePercentage: 0.01,
    holdThreshold: 0.8           // 80% de maxTransfer
  },
  allowedRanges: {
    maxTransfer: { min: 1000, max: 100000 },
    dailyLimit: { min: 5000, max: 500000 },
    feePercentage: { min: 0, max: 0.1, step: 0.001 },
    holdThreshold: { min: 0.5, max: 0.95, step: 0.05 }
  },
  status: "active",
  author: "constitution-engine",
  justification: "Initial economic policy for Tau token",
  supportingMetrics: [],
  promotionDate: new Date("2026-01-01"),
  approvedBy: ["founder", "economy-council"],
  createdAt: new Date("2026-01-01")
};
```

---

## Rutas de Implementación Propuestas

### Estructura de Archivos HEXA-EDIMAP en TAMV

```
src/
├── lib/
│   ├── pipeline/
│   │   ├── hot.ts              # Hot Pipeline (HEXA-EDIMAP §7)
│   │   ├── cold.ts             # Cold Pipeline (HEXA-EDIMAP §8)
│   │   └── types.ts            # Tipos compartidos
│   │
│   ├── ports/
│   │   ├── eventstore.ts       # EventStorePort interface
│   │   ├── eventbus.ts         # EventBusPort interface
│   │   ├── repository.ts       # RepositoryPort interface
│   │   └── analytics.ts        # AnalyticsPort interface
│   │
│   ├── adapters/
│   │   ├── supabase/
│   │   │   ├── eventstore.ts   # PostgreSQL implementation
│   │   │   └── repository.ts   # Supabase client impl
│   │   └── realtime/
│   │       └── eventbus.ts     # Realtime/WebSocket impl
│   │
│   ├── guardians/
│   │   ├── base.ts             # Guardian interface
│   │   ├── economic.ts         # EconomicGuardian
│   │   └── composite.ts        # Multi-guardian chain
│   │
│   ├── events/
│   │   ├── types.ts            # DomainEvent unified
│   │   ├── serializer.ts       # JSON serialization
│   │   └── validator.ts        # Schema validation
│   │
│   └── governance/
│       ├── template.ts         # Template management
│       ├── promotion.ts        # PromotionService
│       └── constitution.ts     # Constitution Engine bridge
│
├── components/
│   └── governance/
│       ├── HexaEdimapDashboard.tsx    # Métricas operativas
│       ├── TemplateManager.tsx        # Gestión de plantillas
│       ├── PromotionQueue.tsx         # Cola de promociones
│       └── GuardianMonitor.tsx        # Estado de guardianías
│
supabase/
├── functions/
│   ├── analytics-cold/         # Cold Pipeline Edge Functions
│   │   ├── index.ts
│   │   └── drift-detection.ts
│   │
│   └── governance-promote/     # Promotion Engine
│       ├── index.ts
│       └── constitution-check.ts
│
└── docs/
    ├── 14_hexa_edimap_architecture.md      # Este documento
    └── 14b_hexa_edimap_tamv_integration_map.md  # Este mapa
```

---

## Checklist de Implementación

### Fase 1: Hot Pipeline (Sprint 1-2)
- [ ] Implementar `Guardian` interface base
- [ ] Implementar `EconomicGuardian` con rangos configurables
- [ ] Crear `HotPipeline` con latencia < 100ms target
- [ ] Integrar con `AnubisSecuritySystem` existente
- [ ] Event Store append síncrono
- [ ] Event Bus publish asíncrono

### Fase 2: Event Store (Sprint 2-3)
- [ ] Unificar `DomainEvent` con THE SOF
- [ ] Implementar `EventStorePort` sobre Supabase
- [ ] Agregar correlationId/causationId a eventos existentes
- [ ] Crear índices para queries temporales
- [ ] Implementar replay capability

### Fase 3: Cold Pipeline (Sprint 3-4)
- [ ] Extender Isabella Analytics para análisis histórico
- [ ] Implementar `ColdPipeline.analyze()`
- [ ] Agregación temporal de eventos
- [ ] Algoritmo de drift detection
- [ ] Generación de propuestas

### Fase 4: Templates (Sprint 4-5)
- [ ] Extender MSR Rules con versioning
- [ ] Crear `Template` interface
- [ ] Migrar reglas existentes a formato Template
- [ ] Validación de rangos permitidos
- [ ] Historial de versiones

### Fase 5: Promotion Engine (Sprint 5-6)
- [ ] Implementar `PromotionService`
- [ ] Integración con Constitution Engine
- [ ] Workflow de aprobación humana
- [ ] Simulación de impacto
- [ ] Activación controlada

### Fase 6: Observabilidad (Sprint 6)
- [ ] Dashboard HEXA-EDIMAP
- [ ] Métricas: p95 latency, block ratio, drift score
- [ ] Alertas configurables
- [ ] Audit trail completo

---

## Referencias Cruzadas

| Documento HEXA-EDIMAP | Sección TAMV | Archivo |
|-----------------------|--------------|---------|
| §7 Hot Pipeline | Pipeline A | `docs/09_motor_mdx4_y_pipelines.md` §2 |
| §8 Cold Pipeline | Isabella + Radares | `docs/modules/ia/`, `docs/modules/radares/` |
| §9 Event Store | THE SOF | `docs/sofreports/THESOF_STATE_REPORT.md` |
| §10 Templates | MSR Rules | `docs/modules/msr/` |
| §12 Legal | UTAMV | `docs/12_juridico_tamv.md` |
| §13 Repo | Estructura propuesta | Este documento §5 |

---

*Mapa de integración v1.0.0 - Documento vivo, actualizar con cada implementación.*
