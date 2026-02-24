#!/usr/bin/env bash
set -euo pipefail

CYCLES="${DECA_V_CYCLES:-10}"

if ! [[ "$CYCLES" =~ ^[0-9]+$ ]] || [ "$CYCLES" -lt 1 ]; then
  echo "[DECA-V] Invalid DECA_V_CYCLES value: '$CYCLES'"
  exit 1
fi

COMMANDS=(
  "npm run lint"
  "npm run typecheck"
  "npm run test"
  "npm run build"
)

echo "[DECA-V] Starting constitutional audit shield"
echo "[DECA-V] Cycles: $CYCLES"
echo "[DECA-V] Commands: ${COMMANDS[*]}"

for ((cycle=1; cycle<=CYCLES; cycle++)); do
  echo
  echo "[DECA-V] ===== Cycle $cycle/$CYCLES ====="

  for cmd in "${COMMANDS[@]}"; do
    echo "[DECA-V][cycle:$cycle] -> $cmd"
    if ! eval "$cmd"; then
      echo "[DECA-V] FAIL: '$cmd' failed in cycle $cycle"
      exit 1
    fi
  done

  echo "[DECA-V] Cycle $cycle completed"
done

echo

echo "[DECA-V] PERFECTION CONFIRMED: all cycles passed"
