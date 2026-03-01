# INTEGRATION_WAVES

## Objetivo
Ejecución por olas para converger 177 repositorios al monorepo funcional `tamv-digital-nexus` sin ruptura de canon ni regresiones operativas.

## Ola 0 — Gobierno y trazabilidad (actual)
- Canon operativo (`MASTER_CANON_OPENCLAW_TAMV.md`).
- Índice y mapa (`TAMV_DOCUMENTATION_INDEX.md`, `TAMV_CONTENT_MAP.md`).
- Registro 177 slots (`REPO_REGISTRY_177.csv`).

**Salida:** base de control instalada.

## Ola 1 — Descubrimiento remoto completo
- Extraer catálogo GitHub del owner (nombre, lenguaje, topics, actividad, rama principal).
- Clasificar cada repo con score de afinidad canónica.
- Marcar candidatos de absorción inmediata.

**Gate:** 100% de repos clasificados.

## Ola 2 — Contract-first unification
- Estandarizar contratos API (TAMV, TAMVAI, BookPI).
- Definir ownership por dominio y matriz de dependencias.
- Publicar mapa de riesgos y orden de migración.

**Gate:** contratos versionados + dependencias cerradas.

## Ola 3 — Convergencia de código por dominio
- Integrar primero APIs y shared libs.
- Integrar IA/seguridad con pruebas de regresión.
- Integrar UX/XR y flujos TAMV ONLINE.

**Gate:** build/test green por dominio + rollback validado.

## Ola 4 — Hardening Tier 3 y operación continua
- Seguridad runtime, observabilidad, auditoría periódica.
- Política de secretos y blast radius.
- Runbooks de incidentes.

**Gate:** checklist Tier 3 completo.
