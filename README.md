# TAMV Digital Nexus

Repositorio unificado del ecosistema TAMV para consolidar módulos 3D/XR/AI, economía digital, gobernanza y servicios federados en una sola base operativa.

> Meta estratégica: unificar progresivamente los repositorios del ecosistema en una arquitectura mantenible y desplegable desde este núcleo.

## Estado actual del repositorio

El proyecto ya contiene piezas clave en producción técnica:
- Frontend React + Vite + TypeScript con componentes inmersivos.
- Integración con Supabase (cliente, tipos, funciones edge y migraciones).
- Módulos funcionales de social, economía, universidad, crisis y sistemas de seguridad.
- Base de QA constitucional (lint + scanner semántico + checker de arquitectura).
- Protocolo operativo MD-X5 con auditoría Deca-V ejecutable.

## Comandos principales


Repositorio objetivo para la convergencia funcional y documental del ecosistema TAMV (177 repos federados) en una base unificada, con gobierno por canon, trazabilidad y hardening operativo.

## Estado de unificación
- Se añadió base canónica en `docs/` para iniciar convergencia por olas sin romper módulos críticos.
- Se incorporaron `SOUL.md` y `AGENTS.md` para bloquear desvíos de arquitectura/documentación.

---

# Welcome to your Lovable project

Repositorio unificado del ecosistema TAMV para consolidar módulos 3D/XR/AI, economía digital, gobernanza y servicios federados en una sola base operativa.

> Meta estratégica: unificar progresivamente los repositorios del ecosistema en una arquitectura mantenible y desplegable desde este núcleo.

## Estado actual del repositorio

El proyecto ya contiene piezas clave en producción técnica:
- Frontend React + Vite + TypeScript con componentes inmersivos.
- Integración con Supabase (cliente, tipos, funciones edge y migraciones).
- Módulos funcionales de social, economía, universidad, crisis y sistemas de seguridad.
- Base de QA constitucional (lint + scanner semántico + checker de arquitectura).
- Protocolo operativo MD-X5 con auditoría Deca-V ejecutable.

## Comandos principales

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Escudo de calidad MD-X5 (Deca-V)

Ejecución integral de validación antes de despliegue:

```bash
npm run audit:deca-v
```

Por defecto corre 10 ciclos de:
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

Modo rápido para iteración local:

```bash
DECA_V_CYCLES=2 npm run audit:deca-v
```

Referencia operativa detallada: `MDX5_OPERATIONAL_PROTOCOL.md`.

## Roadmap de unificación (177 repos → 1 núcleo)

Para que la unificación sea real y sostenible, el plan técnico se divide en fases:

1. **Inventario y clasificación**
   - Catalogar los repos por dominio: identidad, economía, social, XR/3D, IA, seguridad, infra.
   - Marcar estado de cada repo: activo, legado, redundante, fusionable.

2. **Normalización de contratos**
   - Definir contratos de API y eventos entre módulos (tipos compartidos).
   - Homologar convenciones de carpetas, naming y versionado.

3. **Migración por federaciones**
   - Integrar primero repos de alto acoplamiento funcional (auth, wallet, social feed).
   - Reemplazar duplicados por módulos únicos mantenidos en este monorepo lógico.

4. **Consolidación CI/CD**
   - Aplicar gates comunes (lint/typecheck/test/build/deca-v) a todo módulo integrado.
   - Bloquear merges con regresiones arquitectónicas o constitucionales.

5. **Cierre y deprecación**
   - Congelar repos externos migrados.
   - Mantener este repositorio como fuente única de verdad operativa.

## Estructura de alto nivel

- `src/` — aplicación web, componentes, hooks, sistemas y páginas.
- `supabase/` — funciones edge, migraciones y configuración backend.
- `scripts/` — automatizaciones de chequeo arquitectónico, semántico y Deca-V.
- `eslint-plugin-tamv/` — plugin constitucional de reglas TAMV.

## Notas de despliegue

- El build de frontend se genera con `npm run build`.
- Las funciones de Supabase deben desplegarse con su pipeline correspondiente.
- Antes de publicar, ejecutar `npm run audit:deca-v` para validar integridad mínima.

## Enlace del proyecto en Lovable

- https://lovable.dev/projects/63163423-071c-45b1-95ff-6bdf8e698e0b?view=codeEditor

Para que la unificación sea real y sostenible, el plan técnico se divide en fases:

1. **Inventario y clasificación**
   - Catalogar los repos por dominio: identidad, economía, social, XR/3D, IA, seguridad, infra.
   - Marcar estado de cada repo: activo, legado, redundante, fusionable.

2. **Normalización de contratos**
   - Definir contratos de API y eventos entre módulos (tipos compartidos).
   - Homologar convenciones de carpetas, naming y versionado.

3. **Migración por federaciones**
   - Integrar primero repos de alto acoplamiento funcional (auth, wallet, social feed).
   - Reemplazar duplicados por módulos únicos mantenidos en este monorepo lógico.

4. **Consolidación CI/CD**
   - Aplicar gates comunes (lint/typecheck/test/build/deca-v) a todo módulo integrado.
   - Bloquear merges con regresiones arquitectónicas o constitucionales.

5. **Cierre y deprecación**
   - Congelar repos externos migrados.
   - Mantener este repositorio como fuente única de verdad operativa.

## Estructura de alto nivel

- `src/` — aplicación web, componentes, hooks, sistemas y páginas.
- `supabase/` — funciones edge, migraciones y configuración backend.
- `scripts/` — automatizaciones de chequeo arquitectónico, semántico y Deca-V.
- `eslint-plugin-tamv/` — plugin constitucional de reglas TAMV.

## Notas de despliegue

- El build de frontend se genera con `npm run build`.
- Las funciones de Supabase deben desplegarse con su pipeline correspondiente.
- Antes de publicar, ejecutar `npm run audit:deca-v` para validar integridad mínima.

## Enlace del proyecto en Lovable

- https://lovable.dev/projects/63163423-071c-45b1-95ff-6bdf8e698e0b?view=codeEditor

## Estado de sincronización de rama

- Rama actual esperada para integración directa: `main`.
- Si trabajas desde otro entorno, confirma con `git branch --show-current`.
- Para reflejar cambios en remoto: configura `origin` y ejecuta `git push origin main`.
