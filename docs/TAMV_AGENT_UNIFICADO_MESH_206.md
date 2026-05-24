# TAMV Agent Unificado (1 binario, 206 repos)

## Objetivo

Estandarizar un único binario `tamv-agent` en Rust para los 206 repositorios TAMV, con operación **sin nube** y capacidades de:

- Gossip antientropía (push/pull híbrido).
- Cadena auditada de token `1→206→1`.
- Autorreparación distribuida en topologías BLE/Wi‑Fi mesh.
- Autenticación e integridad de mensajes mediante HMAC.

Este diseño respeta el modo documental del workspace (`MODE=DOCUMENTAL_ONLY`), manteniendo el cambio en artefactos de documentación y plan de implementación.

---

## 1) Principios de diseño

1. **Binario único, configuración por nodo**: mismo ejecutable para todos los repos, variando sólo `config.toml`.
2. **Sin punto central**: coherencia eventual emergente a través de reglas homogéneas.
3. **Seguridad por defecto**: firma HMAC, nonces y ventanas temporales anti‑replay.
4. **Persistencia resiliente**: `state.json` con escritura atómica.
5. **Interoperabilidad de stack**: sidecar agnóstico a Node.js, Python, Go, etc.

---

## 2) Arquitectura del `tamv-agent`

### Runtime Rust

- **Tokio**: loop asíncrono, timers, sockets y colas internas.
- **Serde**: serialización de mensajes (`JSON`) y configuración (`TOML`).
- **HMAC** (`ring::hmac` o equivalente): autenticación de cada frame de control.

### Módulos internos sugeridos

- `config`: carga/validación de `config.toml`.
- `state`: lectura/escritura atómica de `state.json`.
- `transport`: abstracción de enlace (Wi‑Fi/BLE) con API uniforme.
- `gossip`: reconciliación anti‑entropía.
- `chain`: orquestación de `CHAIN_STEP` y `CHAIN_REPORT`.
- `security`: firma/verificación HMAC, nonces, control de ventana temporal.
- `health`: heartbeats, scoring de enlaces y selección adaptativa de peers.

---

## 3) Despliegue estándar en 206 repos

Cada repo TAMV incorpora:

- `config.toml` (identidad + parámetros de malla).
- `state.json` (estado persistente local del agente).
- Script/servicio de arranque que garantice que `tamv-agent` permanezca vivo.

Modos de ejecución admitidos:

1. **Sidecar Docker** (`app` + `agent`).
2. **Servicio systemd** (bare metal).
3. **Proceso independiente** lanzado por CI/CD o entrypoint local.

---

## 4) Contrato de configuración (`config.toml`)

```toml
[node]
id = 1
next_id = 2
prev_id = 206

[mesh]
interface = "wlan0"   # o "hci0"
gossip_interval_ms = 1500
secret_key = "BASE64_HMAC_KEY"

[agent]
retry_limit = 3
chain_timeout_ms = 120000
```

Reglas:

- `id` en rango `[1,206]`.
- `next_id = (id % 206) + 1`.
- `prev_id = ((id + 204) % 206) + 1`.
- `secret_key` se provisiona fuera de la malla (no por gossip).

---

## 5) Modelo de estado (`state.json`)

Estructura mínima:

- `local_id`.
- `registry`: mapa `id -> {status,last_seen,chain_seen,break_meta}`.
- `current_round`.

Convenciones:

- `status ∈ {UP,DOWN,UNKNOWN}`.
- `last_seen`: timestamp de último mensaje válido de ese nodo.
- `chain_seen`: última ronda donde se observó tránsito de cadena.
- `break_meta`: evidencia de ruptura, skip aplicado y origen del reporte.

Persistencia:

- Escritura a archivo temporal + `fsync` + rename atómico.
- Recuperación en arranque: si hay corrupción parcial, restaurar último snapshot íntegro.

---

## 6) Protocolo de mensajes

Todos los mensajes comparten:

- `from_id`
- `timestamp`
- `nonce` (o secuencia monotónica)
- `signature = HMAC(secret_key, payload_normalizado)`

Tipos:

1. `HELLO`
   - Descubrimiento/presencia.
2. `STATE_SYNC`
   - Subconjunto de estado + versión/checksum para anti‑entropía.
3. `CHAIN_STEP`
   - Token de ronda con `chain_start/current/next/round_id`.
4. `CHAIN_REPORT`
   - Resultado de ronda (`complete_cycle`, `path`, `breaks`).

Política de validación:

- Firma inválida ⇒ descartar.
- Timestamp fuera de ventana ⇒ descartar.
- Nonce repetido reciente ⇒ descartar (anti‑replay).

---

## 7) Gossip antientropía (push/pull híbrido)

Cada `gossip_interval_ms`:

1. Seleccionar `k` peers (`k ≈ log(N)`).
2. Enviar `STATE_SYNC` parcial.
3. Resolver divergencias por política determinista (LWW + checksum/versionado).
4. Si deriva grande, elevar a sync completo entre ese par.

Optimización recomendada para enlaces BLE:

- Resúmenes compactos (filtros/sets comprimidos).
- Priorización de frames pequeños (`HELLO`, diff ligero) frente a reportes pesados.

---

## 8) Cadena auditada `1→206→1`

### Flujo nominal

1. Nodo iniciador (por convención `1`) crea `CHAIN_STEP(round_id nuevo)`.
2. Cada nodo valida, marca `chain_seen`, re‑firma y reenvía a `next_id`.
3. Al cerrar ciclo en `chain_start`, se emite `CHAIN_REPORT(complete_cycle=true)`.

### Rupturas y continuidad parcial

- Si `next_id` falla `retry_limit`:
  - Marcar `DOWN`.
  - Registrar `break_meta`.
  - Intentar `skip-over` a `next_next_id`.
  - Propagar ruptura por `STATE_SYNC` y/o `CHAIN_REPORT`.

Resultado esperado:

- Visibilidad global de si la ronda cerró completa o con huecos, y en qué segmento.

---

## 9) Loop operativo del agente

1. **Init**: cargar config, abrir transporte, cargar/crear estado, `HELLO` inicial.
2. **Loop Tokio**:
   - Tick gossip.
   - Heartbeats a `next_id` y `prev_id`.
   - Inicio/avance de cadena.
   - Recepción/validación/procesamiento de mensajes.
3. **Persistencia**:
   - Flush atómico tras cambios de estado relevantes.
   - Logs locales para auditoría.

---

## 10) Plan de integración gradual en TAMV

### Fase A — Base común

- Publicar especificación estable (`v1`) de mensajes y estado.
- Generar plantilla universal de `config.toml`.
- Definir contrato de despliegue (Docker/systemd/CI).

### Fase B — Piloto

- Despliegue en subconjunto de repos (anillo reducido).
- Validar convergencia de gossip y detección de rupturas.
- Medir latencia de ronda y tasa de falsos DOWN.

### Fase C — Escalado a 206

- Rollout por lotes con observabilidad local.
- Ajustar `gossip_interval_ms`, `retry_limit`, `chain_timeout_ms` por segmento de red.

### Fase D — Endurecimiento

- Rotación de llaves HMAC por ventana operativa.
- Pruebas de partición y reconvergencia.
- Baselines de antifragilidad (rutas preferidas por fiabilidad histórica).

---

## 11) KPIs operativos sugeridos

- `% rondas completas` por ventana temporal.
- `tiempo medio de cierre de ronda`.
- `MTTR de nodo DOWN` (reintegración).
- `divergencia media de registry` entre pares.
- `ratio de mensajes descartados por seguridad` (firma/nonce/timestamp).

---

## 12) Convivencia con aplicaciones existentes

`tamv-agent` no reemplaza la lógica de negocio del repo; la desacopla:

- App principal: dominio funcional.
- Agente: malla, estado distribuido, cadena auditada y autorreparación.

Interfaz opcional local (socket/archivo) para que la app consulte salud del anillo.

---

## 13) Decisiones abiertas para aprobación humana

1. Tamaño máximo de ventana anti‑replay por nodo.
2. Política exacta de tie‑break en reconciliación (LWW vs vector lógico acotado).
3. Umbrales de skip-over para no degradar consistencia semántica de la cadena.
4. Política de rotación y distribución de `secret_key` por clúster TAMV.

