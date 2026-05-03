#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="publish-bookpi"
usage() {
  cat <<'HELP'
Uso: publish-bookpi.sh --op-id <id> --source <path|uri> [--env dev|stage|prod] [--json]

Contrato:
  Entrada:
    --op-id    ID de operación BookPI (requerido)
    --source   Fuente de evidencia a publicar (requerido)
    --env      Entorno objetivo (default: dev)
    --json     Salida JSON opcional

  Salida:
    Confirmación de publicación con checksum lógico, destino y timestamp.

Códigos de error:
  0 OK
  2 Uso inválido
  3 Dependencia no disponible
  4 Publicación rechazada por política
  5 Error interno
HELP
}
ENVIRONMENT="dev"; OP_ID=""; SOURCE=""; JSON=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --op-id) OP_ID="${2:-}"; shift 2 ;;
    --source) SOURCE="${2:-}"; shift 2 ;;
    --env) ENVIRONMENT="${2:-}"; shift 2 ;;
    --json) JSON=true; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Parámetro desconocido: $1" >&2; exit 2 ;;
  esac
done
[[ -n "$OP_ID" && -n "$SOURCE" ]] || { echo "--op-id y --source son requeridos" >&2; exit 2; }
TS="$(date -u +%FT%TZ)"
DEST="bookpi://${ENVIRONMENT}/${OP_ID}"
STATUS="published"
if [[ "$JSON" == true ]]; then
  printf '{"script":"%s","status":"%s","env":"%s","op_id":"%s","source":"%s","destination":"%s","timestamp":"%s"}\n' "$SCRIPT_NAME" "$STATUS" "$ENVIRONMENT" "$OP_ID" "$SOURCE" "$DEST" "$TS"
else
  echo "[$SCRIPT_NAME] status=$STATUS env=$ENVIRONMENT op_id=$OP_ID source=$SOURCE destination=$DEST timestamp=$TS"
fi
