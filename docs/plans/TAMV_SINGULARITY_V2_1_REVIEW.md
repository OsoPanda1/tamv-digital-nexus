# TAMV Singularity v2.1 — Revisión técnica y plan de integración (DOCUMENTAL)

- **Estado:** Propuesta documental (sin ejecución automática).
- **Modo del workspace:** `MODE=DOCUMENTAL_ONLY`.
- **Objetivo:** Evaluar el script compartido para unificar repositorios en un monorepo Nx + Vite + React, con trazabilidad TAMV.

## 1) Lectura ejecutiva

El script propuesto apunta bien al objetivo de estandarizar el stack (`Nx`, `Vite`, `React`, `Prisma`, `Sourcegraph`, `Grafana`), pero en su estado actual tiene errores de consistencia que impedirían una ejecución limpia y no incorpora trazabilidad civilizatoria (MSR/BookPI) en los pasos automatizados.

## 2) Hallazgos críticos (bloqueantes)

1. **Booleanos inválidos en Python**
   - En `tsconfig_base` aparecen `true` en minúsculas; en Python deben ser `True`.

2. **Escritura de archivos sin crear directorios padre**
   - Se escribe `.devcontainer/devcontainer.json` sin garantizar `os.makedirs(..., exist_ok=True)` para `.devcontainer`.
   - Se escribe `libs/ui/src/lib/utils.ts` sin crear `libs/ui/src/lib`.

3. **String multilínea inválido al generar `vite.config.ts`**
   - El `f.write("import { defineConfig } from 'vite' ...")` usa saltos de línea crudos dentro de comillas dobles, lo que rompe el parser de Python.

4. **Inconsistencia de layout inicial**
   - Se asume existencia de `apps/web` para archivos Vite, pero el mapeo real depende de repos clonados. Debe asegurarse scaffold mínimo cuando no exista el repo fuente.

## 3) Riesgos funcionales no bloqueantes

1. **`workspace.json` en Nx moderno**
   - Funciona, pero conviene migrar hacia `project.json` por proyecto o `nx.json` + autodetección, para mejor mantenibilidad.

2. **Dependencias React 19 RC**
   - Puede generar incompatibilidades en plugins/librerías. Recomendado documentar matriz de compatibilidad.

3. **Clonado con token embebido en URL**
   - Técnica funcional pero sensible para logs y auditoría. Se recomienda token vía `GIT_ASKPASS` o cred helper.

## 4) Plan de integración TAMV (sin romper canon)

1. **Fase A — Harden técnico del generador**
   - Corregir sintaxis Python, creación de carpetas y flujo de scaffold mínimo.
2. **Fase B — Contratos de trazabilidad**
   - Emitir eventos de proceso (`repo_discovered`, `repo_cloned`, `repo_mapped`, `config_generated`) para MSR y resumen narrativo BookPI.
3. **Fase C — Plantillas de dominio**
   - Añadir blueprints opcionales para `protocol.*`, `guardian`, `xr`, `economy`, `memberships`, `identity`.
4. **Fase D — Verificación**
   - Validaciones estáticas (`python -m py_compile`) + smoke checks (`nx graph`, `pnpm -w -r build --if-present`).

## 5) Criterios de aceptación propuestos

- El generador corre sin excepciones en Python 3.11+.
- Crea monorepo reproducible con manifiesto de mapeo.
- Incluye configuración mínima para Sourcegraph/Grafana/devcontainer sin fallos de rutas.
- Publica bitácora de integración apta para MSR/BookPI (aunque sea stub documental en primera iteración).

## 6) Siguiente paso recomendado

Como este repositorio está en modo documental, el siguiente paso seguro es crear una **RFC de implementación** y ejecutar el script únicamente en un sandbox de pruebas fuera de ramas de producción, registrando hallazgos para integración gradual.
