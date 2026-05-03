#!/usr/bin/env bash
set -euo pipefail
SCRIPT_NAME="rotate-keys"
usage(){ cat <<'HELP'
Uso: rotate-keys.sh --scope <service|tenant> --key-id <id> [--env dev|stage|prod] [--json]

Contrato:
  Entrada: scope y key-id requeridos.
  Salida: resultado de rotación con nueva versión lógica.

Códigos:
  0 OK
  2 Uso inválido
  3 Dependencia no disponible
  4 Política de seguridad bloquea rotación
  5 Error interno
HELP
}
SCOPE=""; KEY_ID=""; ENVIRONMENT="dev"; JSON=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --scope) SCOPE="${2:-}"; shift 2;;
    --key-id) KEY_ID="${2:-}"; shift 2;;
    --env) ENVIRONMENT="${2:-}"; shift 2;;
    --json) JSON=true; shift;;
    --help|-h) usage; exit 0;;
    *) echo "Parámetro desconocido: $1" >&2; exit 2;;
  esac
done
[[ -n "$SCOPE" && -n "$KEY_ID" ]] || { echo "--scope y --key-id requeridos" >&2; exit 2; }
TS="$(date -u +%FT%TZ)"
NEW_VERSION="v$(date -u +%Y%m%d%H%M%S)"
if [[ "$JSON" == true ]]; then
  printf '{"script":"%s","scope":"%s","key_id":"%s","env":"%s","new_version":"%s","timestamp":"%s"}\n' "$SCRIPT_NAME" "$SCOPE" "$KEY_ID" "$ENVIRONMENT" "$NEW_VERSION" "$TS"
else
  echo "[$SCRIPT_NAME] scope=$SCOPE key_id=$KEY_ID env=$ENVIRONMENT new_version=$NEW_VERSION timestamp=$TS"
fi
