# 08 — Seguridad: Sentinel y Radares

> **Estado:** `draft` · **Versión:** 1.0 · **Origen:** Master Canon TAMV

> **Ver especificación técnica completa:** [`docs/TAMV_UNIFIED_API_MASTER_TECHNICAL_v3.md`](../TAMV_UNIFIED_API_MASTER_TECHNICAL_v3.md) — Capítulos 6 (Seguridad y Guardianías) y 9 (OpenAPI) con QuantumSecurityLayer™, Anubis Sentinel™ 4 capas, y especificación criptográfica post-cuántica

---

## 1. Anubis Security System

Centinela principal del ecosistema TAMV. Implementa el sistema DEKATEOTL de 11 capas de protección.

**Artefacto:** `src/systems/AnubisSecuritySystem.ts`

### Tipos de eventos de seguridad

| Tipo | Descripción |
|------|-------------|
| `threat` | Amenaza activa detectada |
| `alert` | Alerta de comportamiento sospechoso |
| `scan` | Escaneo preventivo |
| `block` | Acceso bloqueado |
| `healing` | Auto-sanación ejecutada |
| `audit` | Auditoría de actividad |

### Niveles de amenaza

```
none → low → medium → high → critical
```

### Métricas de seguridad (`SecurityMetrics`)

```typescript
{
  threatsBlocked: number,
  activeScans: number,
  protectionLevel: number,    // 0-100
  pendingAlerts: number,
  systemHealth: number,       // 0-100
  quantumShield: number,      // 0-100
  lastScanTime: number        // timestamp
}
```

---

## 2. DEKATEOTL — 11 capas

| Capa | Nombre | Función |
|------|--------|---------|
| 1 | `identity` | Verificación de identidad |
| 2 | `behavior` | Análisis de comportamiento |
| 3 | `quantum-anomaly` | Detección de anomalías cuánticas |
| 4 | `post-quantum-crypto` | Criptografía post-cuántica |
| 5 | `emotional-biometric` | Biometría emocional |
| 6 | `blockchain-reputation` | Reputación en blockchain |
| 7 | `identity-bifurcation` | Detección de suplantación |
| 8 | `deepfake-detection` | Detección de deepfakes |
| 9 | `continuous-audit` | Auditoría continua |
| 10 | `distributed-consensus` | Consenso distribuido |
| 11 | `self-healing` | Auto-sanación |

---

## 3. Radares canónicos

Los radares son sistemas de vigilancia específicos por dominio:

| Radar | Dominio vigilado | Estado |
|-------|-----------------|--------|
| **Anubis** | Seguridad general | stable |
| **Horus** | Vigilancia en tiempo real | stable |
| **Osiris** | Consenso y auditoría | conceptual |
| **Ojo de Ra** | Anomalías cuánticas | conceptual |
| **MOS** | Operaciones de seguridad | conceptual |
| **EOCT** | Operaciones críticas | conceptual |
| **ID-NVIDA** | Identidad digital | conceptual |

---

## 4. Edge Functions de seguridad

| Función | Descripción | Estado |
|---------|-------------|--------|
| `dekateotl-security` | Escaneo básico 11 capas | stable |
| `dekateotl-security-enhanced` | Análisis avanzado + behavioral | beta |

---

## 5. Security Store

```typescript
// src/stores/securityStore.ts
{
  metrics: SecurityMetrics | null,
  events: SecurityEvent[],        // últimos 200
  currentThreatLevel: ThreatLevel,
  scanActive: boolean
}
```

---

## 6. Constitution Engine — invariantes de seguridad

- `MSR-SECURITY-01`: Nombres canónicos de guardianías inmutables.
- `MSR-INFRA-01`: Validación Zod en todas las Edge Functions.
- `MSR-INFRA-02`: CORS unificado por entorno.

---

## 7. TEE Audit

Ver `02_MODULOS/M01_QC/INTERNO/TEE-AUDIT-RUNBOOK.md` para el proceso completo de auditoría en Trusted Execution Environment.

---

## 8. Crisis Management

Sistema de respuesta a emergencias civilizatorias:
- **Ruta:** `/crisis`
- **Artefactos:** `src/pages/Crisis.tsx`, `src/components/crisis/`
- **Integración:** Notificaciones vía `useNotifications` + seguridad Anubis

---

## 9. Referencias

- `src/systems/AnubisSecuritySystem.ts`
- `src/stores/securityStore.ts`
- `supabase/functions/dekateotl-security/`
- `docs/modules/guardianias/guardianias_summary.md`
- `02_MODULOS/M01_QC/INTERNO/TEE-AUDIT-RUNBOOK.md`
