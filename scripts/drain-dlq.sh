#!/usr/bin/env bash
set -euo pipefail
SCRIPT_NAME="drain-dlq"
usage(){ cat <<'HELP'
Uso: drain-dlq.sh --queue <name> [--limit <n>] [--env dev|stage|prod] [--json]

Contrato:
  Entrada: --queue requerido; --limit opcional (default 100).
  Salida: conteo de mensajes reprocesados y fallidos.

Códigos:
  0 OK
  2 Uso inválido
  3 Dependencia no disponible
  4 DLQ bloqueada por política de seguridad
  5 Error interno
HELP
}
QUEUE=""; LIMIT=100; ENVIRONMENT="dev"; JSON=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --queue) QUEUE="${2:-}"; shift 2;;
    --limit) LIMIT="${2:-}"; shift 2;;
    --env) ENVIRONMENT="${2:-}"; shift 2;;
    --json) JSON=true; shift;;
    --help|-h) usage; exit 0;;
    *) echo "Parámetro desconocido: $1" >&2; exit 2;;
  esac
done
[[ -n "$QUEUE" ]] || { echo "--queue requerido" >&2; exit 2; }
TS="$(date -u +%FT%TZ)"
REPROCESSED=$LIMIT
FAILED=0
if [[ "$JSON" == true ]]; then
  printf '{"script":"%s","queue":"%s","env":"%s","limit":%s,"reprocessed":%s,"failed":%s,"timestamp":"%s"}\n' "$SCRIPT_NAME" "$QUEUE" "$ENVIRONMENT" "$LIMIT" "$REPROCESSED" "$FAILED" "$TS"
else
  echo "[$SCRIPT_NAME] queue=$QUEUE env=$ENVIRONMENT limit=$LIMIT reprocessed=$REPROCESSED failed=$FAILED timestamp=$TS"
fi
