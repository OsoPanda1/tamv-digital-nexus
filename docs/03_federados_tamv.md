# 03_federados_tamv

## Marco
Este documento define la base de federación TAMV para convergencia de repositorios en `tamv-digital-nexus`.

## Tabla de sistemas federados detectados localmente (muestra inicial)
| Sistema | Tipo | Estado | Evidencia |
|---|---|---|---|
| TAMV Portal | Frontend Core | stable | `src/App.tsx`, `src/pages/Index.tsx` |
| Isabella Chat | IA | beta | `supabase/functions/isabella-chat/index.ts` |
| Isabella Chat Enhanced | IA | beta | `supabase/functions/isabella-chat-enhanced/index.ts` |
| Isabella TTS | IA Voz | beta | `supabase/functions/isabella-tts/index.ts` |
| Quantum Analytics | IA/observabilidad | beta | `supabase/functions/quantum-analytics/index.ts` |
| Dekateotl Security | Seguridad | stable | `supabase/functions/dekateotl-security/index.ts` |
| Dekateotl Security Enhanced | Seguridad | beta | `supabase/functions/dekateotl-security-enhanced/index.ts` |
| TAMV Unified API | API Gateway | stable | `supabase/functions/tamv-unified-api/index.ts` |
| TAMV Content Sync | Integración | beta | `supabase/functions/tamv-content-sync/index.ts` |
| TAMV Fusion Core | Núcleo backend | beta | `supabase/functions/tamv-fusion-core/index.ts` |
| BookPI Surface | Educación | beta | `src/pages/BookPI.tsx` |
| University Surface | Educación | beta | `src/pages/University.tsx` |
| Economy Surface | Economía | beta | `src/pages/Economy.tsx` |
| Anubis Security System | Seguridad cliente | beta | `src/systems/AnubisSecuritySystem.ts` |
| Three Scene Manager | Render XR | beta | `src/systems/ThreeSceneManager.tsx` |

## Política de crecimiento a 40–44 federados
- No inventar sistemas sin fuente verificable.
- Cada alta de sistema requiere: owner, repositorio fuente, interfaz y riesgo.
- Los sistemas conceptuales quedan marcados explícitamente como `conceptual`.
Documento en construcción según el Master Canon TAMV.
