#!/usr/bin/env bash
set -euo pipefail

OLD_SPEC="${1:-docs/TAMV_OPENAPI_SPEC_v3.1.0.yaml}"
NEW_SPEC="${2:-packages/contracts/openapi/tamv.v1.yaml}"
REPORT_DIR="${3:-artifacts/openapi-diff}"
REPORT_FILE="$REPORT_DIR/report.md"

mkdir -p "$REPORT_DIR"

{
  echo "# OpenAPI Breaking-Change Report"
  echo
  echo "- Baseline: $OLD_SPEC"
  echo "- Candidate: $NEW_SPEC"
  echo
} > "$REPORT_FILE"

set +e
DIFF_OUTPUT=$(npx -y @openapitools/openapi-diff "$OLD_SPEC" "$NEW_SPEC" --fail-on-incompatible 2>&1)
EXIT_CODE=$?
set -e

{
  echo '```'
  echo "$DIFF_OUTPUT"
  echo '```'
} >> "$REPORT_FILE"

if [[ $EXIT_CODE -ne 0 ]]; then
  echo "❌ Breaking changes detected or diff failed. See $REPORT_FILE"
  exit $EXIT_CODE
fi

echo "✅ No breaking changes detected. Report: $REPORT_FILE"
