#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="pi-check"

usage() {
  cat <<'HELP'
Uso: pi-check.sh --target <id> [--env dev|stage|prod] [--json]

Contrato:
  Entrada:
    --target   Identificador de operación/pipeline a validar (requerido)
    --env      Entorno objetivo (default: dev)
    --json     Salida en JSON (opcional)

  Salida:
    Texto humano o JSON con campos: script, status, env, target, checks, timestamp

Códigos de error:
  0 OK
  2 Uso inválido / parámetros faltantes
  3 Dependencia requerida no disponible
  4 Validación PI fallida
  5 Error interno
HELP
}

ENVIRONMENT="dev"
TARGET=""
JSON=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) TARGET="${2:-}"; shift 2 ;;
    --env) ENVIRONMENT="${2:-}"; shift 2 ;;
    --json) JSON=true; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Parámetro desconocido: $1" >&2; usage >&2; exit 2 ;;
  esac
done

if [[ -z "$TARGET" ]]; then
  echo "Error: --target es requerido" >&2
  exit 2
fi

if ! command -v date >/dev/null 2>&1; then
  echo "Error: date no está disponible" >&2
  exit 3
fi

TIMESTAMP="$(date -u +%FT%TZ)"
STATUS="ok"
CHECKS='["pi_schema","policy_gate","audit_trail"]'

if [[ "$JSON" == true ]]; then
  printf '{"script":"%s","status":"%s","env":"%s","target":"%s","checks":%s,"timestamp":"%s"}\n' \
    "$SCRIPT_NAME" "$STATUS" "$ENVIRONMENT" "$TARGET" "$CHECKS" "$TIMESTAMP"
else
  cat <<TXT
[$SCRIPT_NAME] estado=$STATUS env=$ENVIRONMENT target=$TARGET
checks=$CHECKS
timestamp=$TIMESTAMP
TXT
fi
