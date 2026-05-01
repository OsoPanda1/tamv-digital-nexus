# Guardianías: Puente HEXA-EDIMAP

> **Estado:** `stable` · **Versión:** 1.0.0 · **Clasificación:** Integración Arquitectónica  
> **Relación:** HEXA-EDIMAP Guardian Pattern ↔ TAMV Guardianías Implementadas

---

## Resumen Ejecutivo

Este documento establece el puente conceptual y técnico entre el patrón `Guardian` de HEXA-EDIMAP y las guardianías implementadas en TAMV (Anubis, Dekateotl, Horus, Osiris).

| Concepto HEXA-EDIMAP | Implementación TAMV | Estado |
|----------------------|---------------------|--------|
| `Guardian` interface | `AnubisSecuritySystem` | ✅ Implementado |
| `evaluate(context)` | `validateOperation()` / `checkThreats()` | ✅ Equivalente |
| `Decision` type | `SecurityDecision` | ✅ Equivalente |
| `EconomicGuardian` | MSR Rules + Economic Checks | 🟡 Parcial |
| Composite Guardian | Guardian Chain TAMV | 🔴 Por definir |

---

## Patrón HEXA-EDIMAP: Guardian

### Interface Base

```typescript
// HEXA-EDIMAP Standard Interface
interface Guardian {
  evaluate(context: GuardianContext): GuardianDecision;
  getActiveRuleVersion(): string;
  getLastReason(): string | null;
}

type GuardianDecision = "ALLOW" | "HOLD" | "BLOCK";

interface GuardianContext {
  timestamp: Date;
  actor: string;
  action: string;
  payload: any;
  riskScore?: number;
  metadata?: Record<string, any>;
}
```

### Responsabilidades

1. **Evaluación Síncrona** → Debe responder en < 10ms
2. **Decisión Ternaria** → ALLOW (continuar), HOLD (revisar), BLOCK (denegar)
3. **Trazabilidad** → Cada decisión se registra con razón
4. **Versionado** → Las reglas están versionadas (`EconomicPolicy.v1`)

---

## Mapeo a Guardianías TAMV

### Anubis Security System

```typescript
// src/systems/AnubisSecuritySystem.ts - Adaptación HEXA-EDIMAP

import { Guardian, GuardianDecision, GuardianContext } from "../../lib/guardians/base";

/**
 * Anubis adaptado al patrón Guardian de HEXA-EDIMAP
 * 
 * Responsabilidades:
 * - Pre-flight security checks
 * - Threat detection
 * - Quantum-resistant validation
 */
export class AnubisGuardianAdapter implements Guardian {
  private anubis: AnubisSecuritySystem;
  private ruleVersion = "SecurityPolicy.v2.1";
  private lastReason: string | null = null;

  constructor(anubisInstance: AnubisSecuritySystem) {
    this.anubis = anubisInstance;
  }

  evaluate(context: GuardianContext): GuardianDecision {
    // Adaptación de contexto TAMV a evaluación Anubis
    const threatLevel = this.anubis.checkThreats({
      userId: context.actor,
      action: context.action,
      payload: context.payload,
      timestamp: context.timestamp
    });

    const isValid = this.anubis.validateOperation({
      signature: context.payload.signature,
      quantumResistant: true
    });

    // Mapeo de resultado Anubis a decisión HEXA-EDIMAP
    if (!isValid || threatLevel === "CRITICAL") {
      this.lastReason = `Anubis validation failed: ${threatLevel}`;
      return "BLOCK";
    }

    if (threatLevel === "ELEVATED" || context.riskScore && context.riskScore > 0.7) {
      this.lastReason = `Elevated threat detected: ${threatLevel}`;
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

### Dekateotl Security

```typescript
// Adaptación Dekateotl al patrón Guardian

/**
 * DekateotlGuardian - Protección post-cuántica y TEE
 * 
 * HEXA-EDIMAP: Guardian especializado en criptografía
 */
export class DekateotlGuardian implements Guardian {
  private ruleVersion = "CryptoPolicy.v1.5";
  private lastReason: string | null = null;

  constructor(
    private teeClient: TEEClient,
    private pqCrypto: PostQuantumCrypto
  ) {}

  evaluate(context: GuardianContext): GuardianDecision {
    // Verificación TEE
    const teeValid = this.teeClient.verifyAttestation(context.payload.teeProof);
    
    if (!teeValid) {
      this.lastReason = "TEE attestation failed";
      return "BLOCK";
    }

    // Verificación post-cuántica
    const pqValid = this.pqCrypto.verifySignature(
      context.payload.signature,
      context.payload.data
    );

    if (!pqValid) {
      this.lastReason = "Post-quantum signature invalid";
      return "BLOCK";
    }

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

### Horus Sentinel (Análisis Predictivo)

```typescript
// Adaptación Horus al patrón Guardian

/**
 * HorusGuardian - Detección de anomalías predictiva
 * 
 * HEXA-EDIMAP: Guardian con capacidad predictiva
 * Integración: Cold Pipeline → Hot Pipeline insights
 */
export class HorusGuardian implements Guardian {
  private ruleVersion = "AnomalyPolicy.v3";
  private lastReason: string | null = null;

  constructor(
    private anomalyModel: AnomalyDetectionModel,
    private coldPipelineMetrics: ColdMetricsClient
  ) {}

  evaluate(context: GuardianContext): GuardianDecision {
    // Análisis en tiempo real
    const anomalyScore = this.anomalyModel.score({
      userId: context.actor,
      action: context.action,
      timestamp: context.timestamp,
      pattern: context.payload
    });

    // Consulta a métricas del Cold Pipeline
    const driftScore = this.coldPipelineMetrics.getDriftScore(context.actor);

    // Decisión combinada
    if (anomalyScore > 0.9 || driftScore > 0.8) {
      this.lastReason = `Critical anomaly: score=${anomalyScore}, drift=${driftScore}`;
      return "BLOCK";
    }

    if (anomalyScore > 0.7 || driftScore > 0.6) {
      this.lastReason = `Elevated anomaly: score=${anomalyScore}`;
      return "HOLD";
    }

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

## Composite Guardian: Cadena de Guardianías

HEXA-EDIMAP permite componer guardianías en cadena para evaluaciones complejas.

```typescript
// src/lib/guardians/composite.ts

/**
 * CompositeGuardian - Cadena de guardianías TAMV
 * 
 * Evalúa múltiples guardianes en orden:
 * 1. Anubis (Seguridad base)
 * 2. Dekateotl (Criptografía)
 * 3. Horus (Anomalías)
 * 4. EconomicGuardian (Reglas económicas)
 */
export class CompositeGuardian implements Guardian {
  private lastReason: string | null = null;
  private ruleVersions: string[] = [];

  constructor(
    private guardians: Guardian[],
    private mode: "strict" | "lenient" = "strict"
  ) {
    this.ruleVersions = guardians.map(g => g.getActiveRuleVersion());
  }

  evaluate(context: GuardianContext): GuardianDecision {
    for (const guardian of this.guardians) {
      const decision = guardian.evaluate(context);

      // Modo estricto: cualquier BLOCK o HOLD detiene
      if (this.mode === "strict" && decision !== "ALLOW") {
        this.lastReason = `${guardian.constructor.name}: ${guardian.getLastReason()}`;
        return decision;
      }

      // Modo lenient: solo BLOCK detiene
      if (this.mode === "lenient" && decision === "BLOCK") {
        this.lastReason = `${guardian.constructor.name}: ${guardian.getLastReason()}`;
        return "BLOCK";
      }
    }

    this.lastReason = null;
    return "ALLOW";
  }

  getActiveRuleVersion(): string {
    return this.ruleVersions.join(" + ");
  }

  getLastReason(): string | null {
    return this.lastReason;
  }
}

// Uso en TAMV
export function createTAMVGuardianChain(): CompositeGuardian {
  return new CompositeGuardian([
    new AnubisGuardianAdapter(anubis),
    new DekateotlGuardian(teeClient, pqCrypto),
    new HorusGuardian(anomalyModel, metricsClient),
    new EconomicGuardian(10000, 50000) // maxTransfer, dailyLimit
  ], "strict");
}
```

---

## Integration con Hot Pipeline

```typescript
// Ejemplo de uso en Hot Pipeline con guardianías TAMV

import { HotPipeline } from "../../lib/pipeline/hot";
import { createTAMVGuardianChain } from "./composite";

const guardianChain = createTAMVGuardianChain();
const hotPipeline = new HotPipeline(eventStore, eventBus);

// Transferencia de Tau con protección completa
async function transferTau(input: TransferInput) {
  const result = await hotPipeline.execute(
    transferCommand,
    guardianChain,  // Todas las guardianías TAMV
    input
  );

  if (result.status === "BLOCKED") {
    await notifySecurityTeam({
      correlationId: result.correlationId,
      reason: result.reason,
      input
    });
  }

  return result;
}
```

---

## Matriz de Decisiones

| Guardianía | ALLOW | HOLD | BLOCK | Latencia |
|------------|-------|------|-------|----------|
| Anubis | Validación OK | Riesgo medio | Amenaza crítica | < 5ms |
| Dekateotl | TEE + PQ OK | — | TEE/PQ falla | < 3ms |
| Horus | Score < 0.7 | 0.7-0.9 | > 0.9 | < 10ms |
| Economic | Dentro límites | > 80% límite | > límite | < 1ms |
| **Cadena** | Todos ALLOW | Primer HOLD | Primer BLOCK | < 20ms |

---

## Eventos de Guardianía

Cada evaluación genera eventos para el Event Store:

```typescript
interface GuardianEvaluationEvent extends DomainEvent {
  type: "GuardianEvaluation";
  payload: {
    guardianType: string;        // "Anubis", "Economic", etc.
    decision: "ALLOW" | "HOLD" | "BLOCK";
    reason?: string;
    context: GuardianContext;
    latencyMs: number;
  };
  ruleVersion: string;
}

interface GuardianChainEvent extends DomainEvent {
  type: "GuardianChainEvaluation";
  payload: {
    chain: string[];             // ["Anubis", "Dekateotl", ...]
    finalDecision: "ALLOW" | "HOLD" | "BLOCK";
    individualDecisions: Record<string, string>;
    totalLatencyMs: number;
  };
}
```

---

## Referencias

| Documento | Descripción |
|-----------|-------------|
| `14_hexa_edimap_architecture.md` | §6.4 Guardianías, §7 Hot Pipeline |
| `14b_hexa_edimap_tamv_integration_map.md` | Mapeo técnico detallado |
| `guardianias_summary.md` | Resumen de guardianías TAMV |
| `guardianias_internal.md` | Detalles internos de implementación |
| `08_seguridad_sentinel_y_radares.md` | Seguridad y radares |

---

*Puente arquitectónico v1.0.0 — Documento de integración continua*
