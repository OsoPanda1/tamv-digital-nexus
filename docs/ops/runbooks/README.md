# Runbooks operativos canónicos

Este directorio contiene playbooks 1:1 para los scripts canónicos en `scripts/`.

## Matriz de ejecución por entorno y permisos mínimos

| Script | Dev | Stage | Prod | Permisos mínimos requeridos |
|---|---|---|---|---|
| `pi-check.sh` | ✅ | ✅ | ✅ | Lectura de metadata de despliegue, lectura de políticas PI, acceso de solo lectura a BookPI. |
| `publish-bookpi.sh` | ✅ | ✅ | ✅ | `bookpi:write`, acceso a artefacto fuente, firma de servicio. |
| `openapi-diff.sh` | ✅ | ✅ | ✅ | Lectura de specs OpenAPI y repositorio. |
| `canary-weights.sh` | ✅ | ✅ | ✅ | `traffic:write` sobre gateway/service mesh, `deploy:read`. |
| `rotate-keys.sh` | ✅ | ✅ | ✅ | `kms:rotate`, `kms:describe`, `audit:write`. |
| `drain-dlq.sh` | ✅ | ✅ | ✅ | `queue:consume`, `queue:requeue`, `queue:read_metrics`. |

## Checklist de evidencia BookPI por operación

Para **toda** operación se debe registrar:

1. `operation_id`, `script`, `actor`, `entorno`, `timestamp_utc`.
2. `input_contract`: parámetros usados (sin secretos), versión de script y hash de commit.
3. `result_contract`: estado, códigos de salida, métricas, incidentes.
4. `artifacts`: rutas/logs/JSON exportado, hash SHA-256 de evidencia.
5. `approval_trace`: ticket/cambio asociado y responsable aprobador (si aplica).

| Qué se registra | Dónde | Retención |
|---|---|---|
| Evento operacional mínimo (metadatos + resultado) | BookPI (`event_type=ops_script_execution`) | 7 años |
| Logs detallados (stdout/stderr + JSON) | Storage de auditoría (`docs/ops/evidence` o bucket de auditoría) + referencia en BookPI | 18 meses |
| Evidencia de aprobación/cambio | Sistema ITSM/GRC enlazado en `approval_trace` | 7 años |
| Huella criptográfica (SHA-256/SHA3) | Campo `payload_hash` del evento BookPI | 7 años |

> Nota: en producción, anonimizar o excluir secretos/PII antes de publicar evidencia.
