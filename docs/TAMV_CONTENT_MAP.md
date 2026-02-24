# TAMV_CONTENT_MAP

## Estado del repositorio pivote
- **Repositorio base analizado:** `tamv-digital-nexus`
- **Clasificación:** `TAMV_REPO_CONFIRMED`
- **Rol en la unificación:** núcleo documental + integración progresiva de repos federados.

## Evidencia técnica local por dominio
| Dominio | Evidencia | Observación |
|---|---|---|
| Core UX / Portal | `src/App.tsx`, `src/pages/Index.tsx`, `src/components/Navigation.tsx` | Punto de entrada de experiencia unificada |
| IA / Isabella | `supabase/functions/isabella-chat*`, `supabase/functions/isabella-tts`, `src/lib/isabella/*` | Base de interacción y guardas constitucionales |
| Seguridad / Guardianías | `supabase/functions/dekateotl-security*`, `src/systems/AnubisSecuritySystem.ts` | Controles y módulos de defensa |
| TAMV API | `supabase/functions/tamv-unified-api/index.ts` | Gateway unificado backend |
| Economía / MSR-adjacent | `src/pages/Economy.tsx`, `src/components/monetization/*`, `supabase/functions/create-checkout` | Flujo económico y pagos |
| Educación / TAMV ONLINE | `src/pages/University.tsx`, `src/pages/BookPI.tsx`, `docs/online/*` | Base UTAMV/BookPI |
| Render XR / 3D | `src/pages/Metaverse.tsx`, `src/systems/ThreeSceneManager.tsx`, `src/components/QuantumCanvas.tsx` | Experiencia inmersiva |

## Artefactos de unificación creados
- `docs/repo-unification/REPO_REGISTRY_177.csv`
- `docs/repo-unification/REPO_TO_DOMAIN_MATRIX.md`
- `docs/repo-unification/INTEGRATION_WAVES.md`
- `docs/repo-unification/LOCAL_FILE_DOMAIN_MATRIX.csv`
- `docs/repo-unification/UNIFICATION_EXEC_SUMMARY.md`

## Modelo de clasificación global (177 repos)
- `TAMV_REPO_CONFIRMED`
- `TAMV_REPO_POSSIBLE`
- `UNCERTAIN_TAMV_REPO`
- `NON_TAMV_REPO`

## Riesgos y controles
- **Riesgo:** falta de discovery remoto completo.
- **Control aplicado:** mantener placeholders explícitos por slot y no inventar metadata.
- **Siguiente gate:** escaneo remoto + cierre de clasificación 177/177.
