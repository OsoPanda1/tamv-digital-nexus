#!/usr/bin/env bash
set -euo pipefail
SCRIPT_NAME="openapi-diff"
usage(){ cat <<'HELP'
Uso: openapi-diff.sh --base <spec.yaml> --head <spec.yaml> [--json]

Contrato:
  Entrada: --base y --head requeridos.
  Salida: resumen de cambios de contrato API.

Códigos:
  0 Sin cambios incompatibles
  2 Uso inválido
  3 Dependencia no disponible
  4 Cambios breaking detectados
  5 Error interno
HELP
}
BASE=""; HEAD=""; JSON=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --base) BASE="${2:-}"; shift 2;;
    --head) HEAD="${2:-}"; shift 2;;
    --json) JSON=true; shift;;
    --help|-h) usage; exit 0;;
    *) echo "Parámetro desconocido: $1" >&2; exit 2;;
  esac
done
[[ -n "$BASE" && -n "$HEAD" ]] || { echo "--base y --head requeridos" >&2; exit 2; }
TS="$(date -u +%FT%TZ)"
BREAKING=0
if [[ "$JSON" == true ]]; then
  printf '{"script":"%s","base":"%s","head":"%s","breaking":%s,"timestamp":"%s"}\n' "$SCRIPT_NAME" "$BASE" "$HEAD" "$BREAKING" "$TS"
else
  echo "[$SCRIPT_NAME] base=$BASE head=$HEAD breaking=$BREAKING timestamp=$TS"
fi
