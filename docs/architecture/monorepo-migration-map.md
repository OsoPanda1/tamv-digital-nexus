# Monorepo Migration Map

## Objetivo
Definir el mapa de transición sin breaking changes para reorganizar el repositorio por dominios operativos.

## Regla de no breaking move (por fases)

### Fase A — Estructura
- Crear carpetas destino y documentación de contratos.
- Permitir referencia dual cuando la fuente operativa aún vive en su ubicación original.
- No modificar lógica de negocio ni comportamiento runtime.

### Fase B — Paths
- Migrar/importar paths de manera controlada con aliases temporales.
- Validar compatibilidad hacia atrás antes de retirar rutas antiguas.
- Ejecutar cambios por lotes pequeños y auditables.

### Fase C — Pipelines por servicio
- Separar CI/CD por servicio/aplicación.
- Definir ownership, SLOs y versionado de contrato por unidad.
- Retirar dualidad de origen cuando existan pipelines estables y validados.

## Tabla de transición (origen actual → destino objetivo)

| Origen actual | Destino objetivo | Estado inicial | Notas |
|---|---|---|---|
| `src/` | `apps/web/src/` | Aplicado en Fase A | Movimiento estructural sin reescritura lógica |
| `supabase/functions/*` | `services/*` | Referencia dual (documental) | Fuente operativa se mantiene en `supabase/functions/*` durante Fase A |
| `k8s/` | `infra/` | Pendiente | Consolidación IaC en Fase B/C |
| `public/models/` | `xr-assets/` | Pendiente | Migración de activos por lotes con control de peso |
| `src/lib/domains/` | `domains/` | Pendiente | Extraer contratos de dominio sin romper imports |
| utilidades compartidas en `src/lib/*` | `packages/` | Pendiente | Publicar APIs internas antes del cambio de rutas |
| capacidades QC/quantum distribuidas | `quantum/` | Pendiente | Consolidación por contratos y pipelines dedicados |

## Trazabilidad
- Fecha de actualización: 2026-05-03
- Alcance: Fase A (estructura y documentación)
