# TAMV Singularity v2.1 — Revisión técnica, arquitectura por capas y RFC de ejecución (DOCUMENTAL)

- **Estado:** Propuesta documental (sin ejecución automática en este repo).
- **Modo del workspace:** `MODE=DOCUMENTAL_ONLY`.
- **Locks aplicables:** `CANON_LOCK=TRUE`, `CODE_WRITE=RESTRICTED`.
- **Objetivo:** Evaluar el script compartido para unificar repositorios en monorepo Nx + Vite + React, definiendo una ruta de implementación trazable y compatible con doctrina TAMV.

---

## 1) Lectura ejecutiva

La propuesta `tamv-singularity.py` está alineada con la meta de homogeneizar stack (Nx, Vite, React, Prisma, Sourcegraph, Grafana), pero **no está lista para ejecución directa** por fallos técnicos y por ausencia de una capa explícita de auditoría civilizatoria (MSR/BookPI/EOCT).

**Conclusión documental:**
1. Corregir fallos bloqueantes de generación.
2. Añadir contratos de trazabilidad de integración.
3. Estructurar onboarding de módulos TAMV por capas L0–L7.
4. Ejecutar únicamente en sandbox de integración, no en ramas de producción.

---

## 2) Capas TAMV afectadas (L0–L7)

> Esta sección responde a la guía de trabajo arquitectónica: identificar impacto por capa antes de ejecutar cambios.

1. **L0 — Doctrina & Ética**
   - Impacto: reglas de no-daño, límites de automatización de clonado/mapeo.
   - Requisito: cada paso de unificación debe ser auditable y reversible.

2. **L1 — Memoria & Registro (MSR/BookPI)**
   - Impacto: faltan eventos estructurados del pipeline de unificación.
   - Requisito: emitir eventos y resumen narrativo por corrida.

3. **L2 — Protocolos Controlados**
   - Impacto: no define contratos para `protocol.*` en el scaffold base.
   - Requisito: blueprints opcionales para orquestación controlada.

4. **L3 — Guardianía & Monitoreo**
   - Impacto: integración de Grafana está incompleta (solo carpeta base).
   - Requisito: plantilla mínima de datasource + dashboards versionados.

5. **L4 — XR/VR/3D/4D**
   - Impacto: no existen stubs de `xr.gateway`, `xr.renderer.adapter`, `dreamspaces.service`.
   - Requisito: contratos iniciales y wiring documental para evolución posterior.

6. **L5 — Servicios de Dominio**
   - Impacto: mapping de repos no garantiza scaffold para identidad/social/economía.
   - Requisito: fallback scaffolds y validaciones por dominio.

7. **L6 — Shell UX & Integración**
   - Impacto: genera ejemplo web mínimo, pero sin convenciones completas Nx por proyecto.
   - Requisito: estandarizar target definitions y rutas de desarrollo.

8. **L7 — Quantum‑Inspired (arquitectónico)**
   - Impacto: no hay separación formal entre definición de decisión y resolución.
   - Requisito: interfaces para policy engine pluggable (clásico ahora, híbrido a futuro).

---

## 3) Hallazgos críticos (bloqueantes)

1. **Booleanos inválidos en Python**
   - En `tsconfig_base` se usan `true`; Python requiere `True`.

2. **Escritura de archivos sin crear directorios padre**
   - `.devcontainer/devcontainer.json` sin `os.makedirs('.devcontainer', exist_ok=True)`.
   - `libs/ui/src/lib/utils.ts` sin crear `libs/ui/src/lib`.

3. **String multilínea inválido para `vite.config.ts`**
   - El `f.write("...")` contiene saltos de línea crudos en comillas simples/dobles sin formato seguro (triple comilla), provocando error de parser.

4. **Suposición de layout no garantizado**
   - Se escriben archivos en `apps/web` aunque el contenido real depende de repos clonados.

5. **Inicialización parcial de toolchain**
   - Falta coherencia entre `nx.json`, `workspace.json`, targets y estructura de proyectos si los repos fuente no existen.

---

## 4) Riesgos no bloqueantes y mitigación

1. **`workspace.json` en Nx moderno**
   - Riesgo: deuda técnica gradual.
   - Mitigación: migración por oleadas a `project.json` por proyecto.

2. **React 19 RC en toolchain mixto**
   - Riesgo: incompatibilidades de ecosistema.
   - Mitigación: matriz de compatibilidad + perfil estable opcional (`React 18 LTS`) para entornos críticos.

3. **Token en URL de clonado**
   - Riesgo: exposición accidental en logs/historial.
   - Mitigación: `GIT_ASKPASS` / cred helper / token efímero CI.

4. **Observabilidad mínima insuficiente**
   - Riesgo: integración opaca sin trazabilidad por fase.
   - Mitigación: eventos de pipeline + manifiesto firmado de ejecución.

---

## 5) Plan de implementación propuesto (RFC, sin ejecución en este repo)

### Fase A — Hardening del generador
1. Corregir sintaxis Python y path creation.
2. Añadir función utilitaria `safe_write(path, content)` que cree padres automáticamente.
3. Garantizar scaffold base cuando falte repo origen (web/admin/api/ui/db).

### Fase B — Trazabilidad civilizatoria (L1)
1. Definir `integration.events.jsonl` por corrida.
2. Emitir eventos mínimos:
   - `repo_discovered`
   - `repo_clone_started`
   - `repo_cloned`
   - `repo_mapped`
   - `config_generated`
   - `run_completed`
3. Generar `bookpi.integration.summary.md` (narrativa legible para humanos).

### Fase C — Blueprints TAMV (L2–L5)
1. Plantillas opcionales para:
   - `protocol.orchestrator.ts`
   - `protocol.msr.adapter.ts`
   - `protocol.bookpi.adapter.ts`
   - `protocol.monitoring.guardian.ts`
   - `protocol.visual.xr.ts`
   - `xr.gateway.ts`, `xr.renderer.adapter.ts`, `dreamspaces.service.ts`
   - `economy.service.ts`, `ledger.internal.ts`, `memberships.service.ts`, `tokens.service.ts`
2. Contratos con `types` explícitos desde el scaffold inicial.

### Fase D — Verificación técnica
1. `python -m py_compile tamv-singularity.py`
2. `python3 tamv-singularity.py --dry-run` (si se agrega modo dry-run)
3. `pnpm -w -r build --if-present`
4. `pnpm nx graph` y snapshot del grafo para auditoría

### Fase E — Gobernanza de despliegue
1. Ejecutar en sandbox de integración.
2. Publicar informe de delta entre corrida y estado esperado.
3. Abrir PR por ola temática (infra, dominio, XR, economía), evitando cambios masivos.

---

## 6) Criterios de aceptación

- El generador compila y ejecuta sin excepciones en Python 3.11+.
- Toda escritura de archivo es segura y crea sus padres.
- Monorepo resultante es reproducible e incluye manifiesto de mapeo.
- Pipeline produce bitácora auditable para MSR/BookPI (aunque sea stub inicial).
- Existe ruta de evolución explícita para módulos TAMV de protocolos, guardianía, XR y economía.

---

## 7) Checklist de revisión humana previa a ejecución real

- [ ] Validar canon contra `SOUL.md` y `docs/MASTER_CANON_OPENCLAW_TAMV.md`.
- [ ] Confirmar política de credenciales para clonado.
- [ ] Aprobar lista de repos y mapa destino.
- [ ] Aprobar plantillas L2–L5 y contratos de eventos.
- [ ] Autorizar corrida en sandbox con retención de artefactos.

---

## 8) Recomendación final

Dado el modo documental del repositorio, la acción correcta es mantener esta propuesta como **RFC de implementación**, y ejecutar el generador únicamente en un entorno de pruebas aislado con trazabilidad completa antes de cualquier adopción productiva.
