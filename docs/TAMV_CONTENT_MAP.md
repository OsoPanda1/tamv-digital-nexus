# TAMV_CONTENT_MAP

> **Última actualización:** 2026-03-01 · **MD-X4 Wiki Master Update v1**

## Estado
- **Repositorio base analizado:** `tamv-digital-nexus`
- **Clasificación actual:** `TAMV_REPO_CONFIRMED`
- **Objetivo de esta fase:** preparar unificación de 177 repos del owner en un mapa trazable.

## Documentación MD-X4 Wiki — Actualización 2026-03-01

| Documento | Tipo | Cobertura | Estado |
|-----------|------|-----------|--------|
| `docs/04_auth_memberships_access_control.md` | `doc_tech` | Auth, tiers, RLS, roles | `stable` |
| `docs/05_social_core_schema_ui.md` | `doc_tech` | Social schema, hooks, UI | `stable` |
| `docs/06_federated_certification.md` | `doc_tech` | BookPI, certs, federation | `stable` |
| `docs/deployment_templates.md` | `blueprint` | Templates deploy, CI/CD | `stable` |

## Inventario inicial (local)
| Dominio | Evidencia en repo | Estado |
|---|---|---|
| Frontend TAMV ONLINE | `src/pages/*`, `src/components/*` | Activo |
| Integraciones IA | `supabase/functions/isabella-*` | Activo |
| Seguridad | `supabase/functions/dekateotl-security*`, `src/systems/AnubisSecuritySystem.ts` | Activo |
| API unificada | `supabase/functions/tamv-unified-api/index.ts` | Activo |
| Economía y monetización | `src/pages/Economy.tsx`, `src/components/monetization/*`, Stripe functions | Activo |
| Universidad/BookPI | `src/pages/University.tsx`, `src/pages/BookPI.tsx` | Activo |

## Modelo de clasificación para 177 repos
- `TAMV_REPO_CONFIRMED`
- `TAMV_REPO_POSSIBLE`
- `NON_TAMV_REPO`
- `UNCERTAIN_TAMV_REPO`

## Protocolo de unificación (sin romper canon)
1. Inventariar metadata GitHub por repo (nombre, descripción, lenguaje, topics, fecha, default branch).
2. Extraer señales de dominio TAMV por heurísticas semánticas (MSR, SOF, Isabella, UTAMV, etc.).
3. Asignar clasificación con score de confianza.
4. Enlazar repos confirmados al índice canónico en `docs/TAMV_DOCUMENTATION_INDEX.md`.
5. Definir estrategia de convergencia por etapas (docs primero, código después bajo revisión humana).

## Próxima entrega sugerida
- `docs/repo-unification/REPO_REGISTRY_177.csv`
- `docs/repo-unification/REPO_TO_DOMAIN_MATRIX.md`
- `docs/repo-unification/INTEGRATION_WAVES.md`
