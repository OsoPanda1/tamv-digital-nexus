# Content Sync & DigyTAMV Spec — TAMV MD-X4

> **Módulo:** M06_CONTENT · **Estado:** `draft` · **Acceso:** INTERNO
> **Dominio:** DM-X4-07 Infra / APIs

---

## 1. Descripción

Content Sync es el sistema que clasifica, indexa y sincroniza toda la documentación y contenido técnico del ecosistema TAMV, haciéndolo accesible para desarrolladores, agentes IA (DigyTAMV) y la comunidad.

---

## 2. Clasificación de contenido

### 2.1 Tipos de documento

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `doc_tech` | Documentación técnica de sistemas | `msr_internal.md` |
| `marketing` | Material de comunicación pública | `ia_public.md` |
| `blueprint` | Planes y especificaciones de diseño | `XR-PERFORMANCE-GUIDELINES.md` |
| `legal` | Textos legales (requiere `TODO_REVIEW_LEGAL`) | `docs/12_juridico_tamv.md` |
| `governance` | Reglas de gobernanza y DAOs | `MASTER_CANON_OPENCLAW_TAMV.md` |
| `deprecated` | Documentos obsoletos | marcados explícitamente |

### 2.2 Campo `module_target`

Cada documento debe declarar su módulo objetivo:

| Value | Dominio |
|-------|---------|
| `core` | DM-X4-01 |
| `ia` | DM-X4-02 |
| `security` | DM-X4-03 |
| `education` | DM-X4-04 |
| `economy` | DM-X4-05 |
| `xr` | DM-X4-06 |
| `infra` | DM-X4-07 |
| `governance` | Transversal |

### 2.3 Semáforo de madurez

| Estado | Descripción |
|--------|-------------|
| `draft` | Borrador en construcción |
| `validated` | Revisado y aprobado por el equipo técnico |
| `canon` | Aprobado y promovido a nivel canónico |
| `deprecated` | Obsoleto, no usar |

---

## 3. Edge Function: `tamv-content-sync`

### Contrato de entrada
```json
{
  "action": "sync | classify | index | search",
  "filters": {
    "type": "doc_tech | marketing | blueprint | ...",
    "module_target": "ia | economy | ...",
    "status": "draft | validated | canon"
  },
  "query": "string (para search)",
  "userId": "uuid"
}
```

### Contrato de salida
```json
{
  "success": true,
  "items": [
    {
      "id": "uuid",
      "title": "string",
      "path": "docs/...",
      "type": "doc_tech",
      "module_target": "ia",
      "status": "validated",
      "updatedAt": "ISO8601"
    }
  ],
  "total": 42
}
```

---

## 4. DigyTAMV — Memoria de IA

DigyTAMV es el índice de contenido técnico accesible por agentes IA (incluyendo Isabella y THE SOF) para navegar la memoria documental del ecosistema.

### Estructura de entrada DigyTAMV

```
docs/
  devhub/           ← APIs y referencias técnicas
  modules/          ← Documentación por dominio
  repo-unification/ ← Mapas de convergencia
  online/           ← TAMV ONLINE journeys

02_MODULOS/
  M01_QC/           ← QA Constitucional
  M02_SOCIAL/       ← Social + Presencia
  M03_XR/           ← XR + MD-X4
  M04_ECONOMIA/     ← Economía + TAU
  M05_IA_TAMVAI/    ← Isabella + THE SOF
  M06_CONTENT/      ← Content Sync
```

### Proceso de indexación

1. Escanear archivos `.md` en paths autorizados.
2. Extraer frontmatter (estado, tipo, module_target).
3. Generar embeddings para búsqueda semántica (futuro).
4. Almacenar índice en tabla `content_index` (Supabase).
5. Actualizar al detectar cambios vía webhook GitHub.

---

## 5. DevHub — Inventario técnico

### Categorías del DevHub

| Categoría | Archivos | Estado |
|-----------|---------|--------|
| APIs (TAMV OS, AI, MSR/BookPI, XR) | `docs/devhub/*.md` | parcial |
| SDKs y ejemplos | pendiente | planificado |
| Módulos del cliente civilizatorio | `docs/modules/**` | en progreso |
| Normas (QC-TAMV, política datos) | `02_MODULOS/M01_QC/` | parcial |
| ADRs y blueprints | `02_MODULOS/M**/INTERNO/` | en progreso |

### Plantilla mínima para entrada DevHub

```markdown
# [Nombre del Endpoint / Sistema]
**Status:** draft | validated | canon
**Endpoint:** GET|POST /api/...
**Auth:** Bearer token | public | admin
**Rate limit:** N req/min

## Payload
```json
{}
```

## Response
```json
{}
```

## Errors
| Code | Description |
|------|-------------|
| 400 | Invalid payload |
| 401 | Unauthorized |

## Example
```
curl -X POST ...
```
```

---

## 6. Verificación de consistencia

Script: `npm run check:docs-sync` (pendiente de implementar)

Verificaciones:
1. Todos los endpoints expuestos en código tienen entrada en DevHub.
2. No hay docs huérfanos (sin código asociado).
3. Todos los docs de tipo `doc_tech` tienen `module_target` definido.
4. No hay docs con estado vacío.
