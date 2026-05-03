#!/usr/bin/env bash
set -euo pipefail
SCRIPT_NAME="canary-weights"
usage(){ cat <<'HELP'
Uso: canary-weights.sh --service <name> --stable <0-100> --canary <0-100> [--json]

Contrato:
  Entrada: pesos enteros stable/canary que sumen 100.
  Salida: distribución aplicada.

Códigos:
  0 OK
  2 Uso inválido
  3 Dependencia no disponible
  4 Violación de política de despliegue
  5 Error interno
HELP
}
SERVICE=""; STABLE=""; CANARY=""; JSON=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --service) SERVICE="${2:-}"; shift 2;;
    --stable) STABLE="${2:-}"; shift 2;;
    --canary) CANARY="${2:-}"; shift 2;;
    --json) JSON=true; shift;;
    --help|-h) usage; exit 0;;
    *) echo "Parámetro desconocido: $1" >&2; exit 2;;
  esac
done
[[ -n "$SERVICE" && -n "$STABLE" && -n "$CANARY" ]] || { echo "Parámetros requeridos faltantes" >&2; exit 2; }
if (( STABLE + CANARY != 100 )); then echo "Los pesos deben sumar 100" >&2; exit 4; fi
TS="$(date -u +%FT%TZ)"
if [[ "$JSON" == true ]]; then
  printf '{"script":"%s","service":"%s","stable":%s,"canary":%s,"timestamp":"%s"}\n' "$SCRIPT_NAME" "$SERVICE" "$STABLE" "$CANARY" "$TS"
else
  echo "[$SCRIPT_NAME] service=$SERVICE stable=$STABLE canary=$CANARY timestamp=$TS"
fi
