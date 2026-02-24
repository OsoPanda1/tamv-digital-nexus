# Guardianías TAMV — Resumen

> **Estado:** `stable` · **Dominio:** DM-X4-03 Seguridad · **Canon:** inmutable

## Definición

Las Guardianías son los sistemas de protección civilizatoria de TAMV. Cada guardianía representa una capa de defensa especializada dentro del sistema DEKATEOTL de 11 capas.

## Guardianías canónicas (no renombrables)

| Guardianía | Rol | Capa DEKATEOTL |
|-----------|-----|----------------|
| **Anubis** | Centinela principal — detección y respuesta | 1 (identity) + 11 (self-healing) |
| **Horus** | Vigilancia en tiempo real | 2 (behavior) + 4 (pattern recognition) |
| **Osiris** | Consenso distribuido y auditoría | 10 (distributed-consensus) |
| **Dekateotl** | Orquestador de las 11 capas | Meta-capa |
| **Aztek Gods** | Protección cultural y de identidad civilizatoria | 7 (identity-bifurcation) |
| **Tenochtitlan** | Capa territorial y geopolítica | Conceptual |
| **Quetzalcóatl** | Guardián de la sabiduría y el conocimiento | Conceptual |
| **Ojo de Ra** | Visión omnidireccional | 3 (quantum-anomaly) |
| **MOS** | Monitor de operaciones de seguridad | 9 (continuous-audit) |
| **EOCT** | Engine de operaciones críticas y triage | 8 (deepfake-detection) |
| **ID-NVIDA** | Verificación de identidad digital | 6 (blockchain-reputation) |

## Cell mapping en repo

| Cell | Artefacto | Estado |
|------|-----------|--------|
| `cell-anubis` | `src/systems/AnubisSecuritySystem.ts` | stable |
| `cell-dekateotl` | `supabase/functions/dekateotl-security/` | stable |
| `cell-dekateotl-enhanced` | `supabase/functions/dekateotl-security-enhanced/` | beta |
| `cell-crisis` | `src/pages/Crisis.tsx`, `src/components/crisis/` | beta |

## MSR Rules aplicables

- `MSR-SECURITY-01`: nombres canónicos inmutables
- `MSR-INFRA-01`: validación Zod en edge functions de seguridad
- `MSR-INFRA-02`: CORS unificado

## Referencias

- `src/systems/AnubisSecuritySystem.ts`
- `src/systems/FederationSystem.ts` (federaciones ANUBIS, HORUS)
- `docs/08_seguridad_sentinel_y_radares.md`
