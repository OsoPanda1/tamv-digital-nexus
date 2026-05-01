# REPO_TO_DOMAIN_MATRIX

## Propósito
Matriz de convergencia para unificar 177 repositorios del owner `OsoPanda1` dentro de `tamv-digital-nexus` bajo control canónico.

## Estado actual de descubrimiento
- Repositorio confirmado local: `tamv-digital-nexus`.
- Registro total objetivo: **177 slots** en `REPO_REGISTRY_177.csv`.
- Slots pendientes de descubrimiento remoto: **176** (bloqueados por restricción de red/proxy en este entorno).

## Dominios de convergencia
1. **CORE/PLATAFORMA**: shell app, navegación, estado global.
2. **IA/ISABELLA/THE SOF**: chat, TTS, analytics, orquestación multiagente.
3. **SEGURIDAD/GUARDIANÍAS**: Sentinel, Dekateotl, Anubis y radares.
4. **UTAMV/BOOKPI/TAMV ONLINE**: campus, journeys, aprendizaje.
5. **MSR/ECONOMÍA**: monetización, checkout, ledger y estados económicos.
6. **RENDER XR/3D/4D (MD-X4)**: metaverse, canvas, experiencias inmersivas.
7. **INFRA/APIs**: edge functions, webhooks, integraciones.

## Evidencia local (archivo a dominio)
Fuente: `LOCAL_FILE_DOMAIN_MATRIX.csv`

| Dominio | Archivos detectados |
|---|---:|
| IA | 16 |
| Seguridad | 6 |
| ONLINE_EDU | 7 |
| Economía | 9 |
| Render/XR | 10 |
| API/Infra | 7 |
| Sin clasificar | 137 |

## Criterio de clasificación de repos (global)
- `TAMV_REPO_CONFIRMED`: nombre/README/topics con señales canon inequívocas.
- `TAMV_REPO_POSSIBLE`: contiene señales parciales TAMV o dependencia funcional.
- `UNCERTAIN_TAMV_REPO`: información incompleta o ambigua.
- `NON_TAMV_REPO`: no aporta al stack TAMV.

## Regla de integración
Primero unificar documentación, contratos y ownership; después mover/absorber código por olas con pruebas y rollback.
