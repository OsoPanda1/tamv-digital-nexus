# Runbook: publish-bookpi

## Objetivo
Operar el script `scripts/publish-bookpi.sh` de manera trazable y auditable.

## Precondiciones
- Acceso al entorno objetivo (dev|stage|prod).
- Permisos mínimos definidos en `docs/ops/runbooks/README.md`.
- Ticket de cambio/incidente vinculado.

## Ejecución
1. Revisar ayuda: `./scripts/publish-bookpi.sh --help`
2. Ejecutar con parámetros mínimos y `--json` para evidencia estructurada.
3. Guardar salida JSON y asociarla al `operation_id`.

## Validación
- Código de salida `0`.
- Contrato de salida contiene `script`, `status` (o equivalente) y `timestamp`.
- Evento BookPI publicado/referenciado.

## Rollback / remediación
- Si falla con código `2`: corregir parámetros y reintentar.
- Si falla con código `3`: restaurar dependencias del runner.
- Si falla con código `4`: escalar a seguridad/plataforma según política.
- Si falla con código `5`: abrir incidente y adjuntar logs completos.

## Evidencia requerida (BookPI)
- `operation_id`, parámetros no sensibles, salida JSON, código de salida, hash de evidencia y enlace a ticket.
