# Interconexión profunda TAMV ↔ Linear (repo por repo)

**Fecha:** 2026-05-24  
**Modo:** DOCUMENTAL_ONLY  
**Estado:** Propuesta de implementación (sin ejecución forzada)

---

## 1) Diagnóstico actual del workspace

### Estado confirmado
- Repositorio pivote local: `tamv-digital-nexus`.
- Registro objetivo: 177 slots en `REPO_REGISTRY_177.csv`.
- Estado de descubrimiento: 1 repo confirmado + 1 absorbido (`digital-civilization-core`) + 175 pendientes.

### Vacío principal para interconexión con Linear
No existe, en el estado actual del repo, un manifiesto formal de sincronización **Source-of-Truth** entre:
1) `REPO_REGISTRY_177.csv`,
2) `federated_sources.json`,
3) entidades de seguimiento operativo (Linear: Team, Project, Epic, Issue, Cycle).

**Conclusión:** hoy hay trazabilidad documental de absorción, pero no hay trazabilidad de ejecución repo-a-repo en un gestor transversal.

---

## 2) Arquitectura objetivo (repo por repo, orientada a canon)

## 2.1 Principio rector
Cada repositorio candidato (slot 1..177) debe tener un **gemelo operativo en Linear** con identificador estable y bidireccional.

## 2.2 Entidades canónicas de enlace
- **Repo Slot** (fuente): `slot`, `repo_name`, `classification`, `status`.
- **Absorción TAMV** (gobernanza): etapas `Discovery→Scoring→Sandbox Import→Contract Fit→Security/License Gate→Merge`.
- **Linear mirror** (ejecución): Project + Epic + Issue set + etiquetas de dominio/riesgo.

## 2.3 Clave de correlación obligatoria
`tamv_repo_key = "slot:<N>|repo:<repo_name>"`

Esta clave debe vivir en:
- campos de metadata local (`federated_sources.json` extendido),
- etiquetas/título de Epic en Linear,
- cualquier reporte de avance.

---

## 3) Modelo de datos mínimo para sincronización con Linear

## 3.1 Extensión recomendada de `federated_sources.json`
Agregar por cada source:

```json
{
  "tamv_repo_key": "slot:2|repo:digital-civilization-core",
  "linear": {
    "team_key": "TAMV",
    "project_id": "<linear_project_id>",
    "epic_id": "<linear_epic_id>",
    "issue_ids": ["<issue_a>", "<issue_b>"],
    "last_sync_utc": "2026-05-24T00:00:00Z",
    "sync_status": "planned"
  }
}
```

`sync_status` propuesto: `planned | linked | in_progress | blocked | done`.

## 3.2 Normalización de estados (TAMV ↔ Linear)

| TAMV ingest state | Linear status sugerido |
|---|---|
| `draft` | Backlog / Triage |
| `validated` | In Progress |
| `integrated` | Done |
| `rejected` | Canceled |

## 3.3 Taxonomía de labels en Linear
- `tamv-domain:<core|ia|security|online_edu|economy|render|infra>`
- `tamv-risk:<low|medium|high|critical>`
- `tamv-class:<confirmed|possible|uncertain|non_tamv>`
- `tamv-protocol:v1.0.0`

---

## 4) Diseño operativo “repo por repo”

## 4.1 Estructura recomendada en Linear
- **Proyecto macro:** `TAMV Repo Federation 177`.
- **1 Epic por repo-slot descubierto** (ej. `S002 digital-civilization-core`).
- **6 issues hijas por Epic** (una por cada etapa del protocolo de ingestión).

## 4.2 Plantilla de issues por repo
1. `Discovery`  
2. `Scoring`  
3. `Sandbox Import`  
4. `Contract Fit`  
5. `Security/License Gate`  
6. `Merge + AuditBundle`

Cada issue debe contener:
- `tamv_repo_key`
- evidencia/fuente
- criterio de salida
- riesgo actual
- bloqueo (si aplica)

## 4.3 Dependencias entre issues
Dependencia estricta secuencial:
`1 -> 2 -> 3 -> 4 -> 5 -> 6`

Esto alinea ejecución real con `federated-ingestion-protocol.md` y evita “merge” sin gates.

---

## 5) Implementación por olas (sin romper canon)

## Ola 0 — Preparación (1–2 días)
- Definir Team/Project en Linear.
- Registrar diccionario oficial de estados y labels.
- Crear script documental para generar payload por slot.

## Ola 1 — Repos confirmados (3–5 días)
- Cargar slot 1 y slot 2 como pilotos.
- Validar sincronización bidireccional manual.
- Ajustar plantilla de Epic/Issues.

## Ola 2 — Descubrimiento masivo (1–2 semanas)
- Desbloquear escaneo remoto.
- Poblar slots 3..177 con clasificaciones preliminares.
- Crear Epics solo para `TAMV_REPO_CONFIRMED` y `TAMV_REPO_POSSIBLE`.

## Ola 3 — Ejecución continua
- Ejecutar ciclo semanal de actualización de estado.
- Publicar tablero ejecutivo: avance por dominio, riesgo y tasa de rechazo.

---

## 6) Métricas de control (KPIs)

- **Cobertura de enlace:** `% slots con epic_id`.
- **Trazabilidad completa:** `% repos con issue de 6/6 etapas`.
- **Tiempo medio de absorción:** `draft -> integrated`.
- **Tasa de rechazo automática:** `% repos rejected por licencia/seguridad`.
- **Backlog crítico:** `# repos high/critical risk sin Security Gate completado`.

---

## 7) Riesgos y mitigaciones

1. **Riesgo:** divergencia de estados TAMV vs Linear.  
   **Mitigación:** mapeo único de estados + sync_status explícito.

2. **Riesgo:** ruido por crear issues para repos no confirmados.  
   **Mitigación:** gate de creación por clasificación y score.

3. **Riesgo:** pérdida de evidencia audit trail.  
   **Mitigación:** `audit_bundle_ref` obligatorio antes de cerrar `Merge`.

4. **Riesgo:** sobrecarga operativa en 177 slots.  
   **Mitigación:** ejecución por olas y automatización de plantillas.

---

## 8) Plan mínimo accionable inmediato

1. Añadir bloque `linear` en `federated_sources.json` para slot 1 y 2.
2. Crear `Linear Project: TAMV Repo Federation 177`.
3. Crear 2 Epics piloto (S001/S002) con 6 issues cada una.
4. Aplicar labels canon y dependencias secuenciales.
5. Validar reporte semanal cruzado (`REPO_REGISTRY_177.csv` vs Linear export).

---

## 9) Entregables documentales siguientes (recomendados)

- `docs/repo-unification/linear-sync-schema.v1.json` (contrato de sincronización).
- `docs/repo-unification/linear-epic-issue-templates.md` (plantillas estandarizadas).
- `docs/repo-unification/linear-weekly-governance-dashboard.md` (formato de comité).

---

## 10) Cierre ejecutivo

La interconexión “repo por repo” con Linear es viable **sin tocar lógica productiva** y encaja con el modo `DOCUMENTAL_ONLY`: primero se institucionaliza el gemelo operativo por repositorio y luego se escala el pipeline de absorción con trazabilidad total de canon, riesgo y evidencia.
