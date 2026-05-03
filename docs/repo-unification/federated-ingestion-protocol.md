# Federated Ingestion Protocol (TAMV)

**Version:** 1.0.0  
**Mode:** DOCUMENTAL_ONLY  
**Scope:** Absorción federada de repositorios hacia dominios TAMV

## Flujo obligatorio (secuencial y bloqueante)

Toda absorción **DEBE** ejecutar el siguiente flujo, sin omitir etapas:

1. **Discovery**
2. **Scoring**
3. **Sandbox Import**
4. **Contract Fit**
5. **Security/License Gate**
6. **Merge**

Si una etapa falla, el proceso cambia a estado `rejected` o vuelve a `draft` con acciones correctivas.

---

## 1) Discovery

Objetivo: identificar origen, alcance y artefactos del repositorio candidato.

Entradas mínimas:
- URL del repo y commit/tag de referencia.
- Metadatos de licencia declarada.
- Inventario base (lenguajes, módulos, dependencias, CI).

Salidas mínimas:
- Registro en `federated_sources.json`.
- Ficha de Absorción inicial (`status: draft`).

## 2) Scoring

Objetivo: priorizar absorciones con una métrica trazable.

Dimensiones sugeridas (0–5):
- Relevancia TAMV por dominio destino.
- Calidad técnica/mantenibilidad.
- Cobertura documental.
- Riesgo operativo.
- Riesgo legal/licencia.

Regla:
- `score_total` normalizado 0–100.
- Candidatos con score bajo umbral pasan a `rejected` o backlog.

## 3) Sandbox Import

Objetivo: aislar la ingesta y validar reproducibilidad sin afectar módulos críticos.

Controles:
- Import en entorno sandbox/documental.
- Congelado de dependencias y snapshot de artefactos.
- Generación de evidencia (logs, hashes, manifiestos).

Resultado:
- `AuditBundle` preliminar BookPI-ready.

## 4) Contract Fit

Objetivo: validar encaje con contratos canónicos TAMV.

Verificaciones:
- Compatibilidad con dominios y taxonomía TAMV.
- Mapeo de interfaces/contratos esperados.
- No colisión con módulos canónicos.

Resultado:
- Dictamen: `fit`, `fit-with-gaps`, o `no-fit`.

## 5) Security/License Gate

Objetivo: bloquear absorciones inseguras o legalmente incompatibles.

Validaciones obligatorias:
- Licencia compatible con política TAMV.
- Dependencias críticas con mantenimiento activo.
- Ausencia de incidentes de seguridad críticos sin parche.
- No evidencia de breach comprometido sin remediación verificable.

Resultado:
- Gate `pass` o `fail`.
- `fail` implica estado `rejected` automático.

## 6) Merge

Objetivo: integración documental y trazabilidad final.

Precondiciones:
- Contract Fit != `no-fit`.
- Security/License Gate = `pass`.
- AuditBundle completo y referenciado.

Salida:
- Estado actualizado (`validated` o `integrated`).
- Evidencia enlazada en Ficha y en índice federado.

---

## Estados de absorción

- `draft`: descubierto o en evaluación inicial.
- `validated`: superó controles clave, pendiente de integración plena.
- `integrated`: absorbido y trazado en canon operativo.
- `rejected`: descartado por reglas automáticas o no-fit estructural.

## Criterios de rechazo automáticos

Una absorción pasa a `rejected` sin excepción cuando ocurra cualquiera:

1. **Licencia incompatible** con política TAMV o sin licencia verificable.
2. **Dependencias críticas sin mantenimiento** (abandono confirmado, sin reemplazo viable).
3. **Breach o vulnerabilidad crítica activa** sin parche/remediación verificable.

## AuditBundle documental (BookPI-ready)

Cada absorción DEBE enlazar un `AuditBundle` con:
- `manifest.json` (metadatos, hash, versión, timestamps).
- `evidence/` (capturas de análisis, reportes, logs, SBOM si aplica).
- `decision.md` (dictamen, riesgos, justificación y estado).

Convención de referencia en ficha:
- `audit_bundle_ref`: ruta o URI estable del paquete.
- `bookpi_ready`: `true|false`.

## Trazabilidad mínima requerida

- Source ID único por repositorio.
- Fecha/hora UTC por transición de estado.
- Responsable documental y versión de protocolo aplicada.
