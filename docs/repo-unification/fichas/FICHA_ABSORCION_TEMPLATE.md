# Ficha de Absorción — {{source_id}}

## 1. Identificación
- **Source ID:** {{source_id}}
- **Repositorio (URL):** {{url}}
- **Ref evaluada (tag/commit):** {{ref}}
- **Responsable documental:** {{owner}}
- **Fecha UTC:** {{date_utc}}

## 2. Estado de absorción
- **Estado:** `draft | validated | integrated | rejected`
- **Fase actual:** `discovery | scoring | sandbox-import | contract-fit | security-license-gate | merge`
- **Score total (0-100):** {{score_total}}

## 3. Dominio TAMV destino
- **Dominio objetivo:** {{tamv_target_domain}}
- **Justificación de encaje:** {{fit_rationale}}

## 4. Riesgo y licencia
- **Licencia:** {{license}}
- **Riesgo global:** `low | medium | high | critical`
- **Riesgos clave:**
  - {{risk_1}}
  - {{risk_2}}

## 5. AuditBundle (BookPI-ready)
- **AuditBundle ref:** {{audit_bundle_ref}}
- **BookPI-ready:** `true | false`
- **Contenido mínimo verificado:**
  - `manifest.json`
  - `evidence/`
  - `decision.md`

## 6. Gate y decisión
- **Contract Fit:** `fit | fit-with-gaps | no-fit`
- **Security/License Gate:** `pass | fail`
- **Decisión final:** `continue | integrate | reject`
- **Motivo de decisión:** {{decision_rationale}}

## 7. Rechazo automático (si aplica)
Marcar `true/false`:
- **Licencia incompatible:** {{reject_incompatible_license}}
- **Dependencias críticas sin mantenimiento:** {{reject_unmaintained_critical_dependencies}}
- **Breach/vulnerabilidad crítica sin remediación:** {{reject_unremediated_critical_breach}}

> Si cualquiera es `true`, el estado final DEBE ser `rejected`.

## 8. Trazabilidad
| Timestamp UTC | Cambio de estado | Actor | Evidencia |
|---|---|---|---|
| {{ts_1}} | {{state_change_1}} | {{actor_1}} | {{evidence_1}} |
