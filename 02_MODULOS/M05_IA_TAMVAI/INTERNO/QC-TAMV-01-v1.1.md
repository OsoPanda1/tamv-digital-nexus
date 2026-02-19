# QC-TAMV-01 v1.1  
Sistema Constitucional de Control de Calidad del Cliente Civilizatorio TAMV

- **Estado**: ACTIVO  
- **Clasificación**: Documento Normativo Técnico‑Legal  
- **Ámbito**: Cliente Civilizatorio (Frontend Web / XR‑ready)  
- **Aplicabilidad**: Humanos, IAs, Agentes Automatizados, CI/CD  
- **Jurisdicción Técnica**: Global  
- **Compatibilidad Legal**: Principios generales de diligencia tecnológica y trazabilidad

***

## I. Objeto y naturaleza

**QC‑TAMV‑01** define el marco constitucional de calidad, coherencia estructural, integridad visual y gobernanza técnica del **Cliente Civilizatorio** del TAMV.

Su función:

- Establecer **invariantes técnicas no negociables**.  
- Traducir principios arquitectónicos en **mecanismos ejecutables** (lint, tests, análisis estático).  
- Vincular el **cumplimiento técnico** con la validez operativa del sistema.  
- Ser aplicable tanto a **humanos** como a **IAs operativas**.  
- Operar como **contrato técnico vinculante** dentro del ecosistema TAMV.

El incumplimiento de este documento **invalida el estado técnico** del cliente, aunque el software compile o aparente funcionar.

***

## II. Definiciones operativas

A efectos de QC‑TAMV‑01:

- **Cliente Civilizatorio**: interfaz principal de interacción del TAMV en Web/XR.  
- **Root**: punto único de inicialización React (`createRoot`).  
- **Router**: mecanismo único de control de navegación (React Router).  
- **Layout**: shell persistente de interfaz (sidebar, header, marco).  
- **Page**: componente 1:1 con una ruta.  
- **Module**: feature encapsulado, agnóstico de navegación.  
- **Domain**: abstracción de negocio transversal (auth, social, economy, ai, xr).  
- **IA Operativa**: sistema autónomo que genera o modifica código en el cliente.  
- **Validez Técnica**: estado en que el cliente cumple todas las invariantes de QC‑TAMV‑01.

***

## III. Principios constitucionales

- **P1 – Determinismo estructural**  
  El cliente debe comportarse de manera predecible, medible y reproducible.

- **P2 – Unicidad crítica**  
  Cada componente estructural crítico (root, router, layout) existe una sola vez.

- **P3 – Separación de responsabilidades**  
  Ninguna capa asume responsabilidades de otra (pages vs modules vs domains).

- **P4 – Gobernanza automática**  
  La arquitectura se impone mediante lint/tests/CI, no por disciplina humana.

- **P5 – Neutralidad de actor**  
  Las reglas aplican por igual a humanos e inteligencias artificiales.

***

## IV. Leyes invariantes (L1–L9)

Estas leyes son **axiomas verificables**. Si se incumplen, el cliente se considera **técnicamente inválido**.

- **L1 – Root único**  
  `ReactDOM.createRoot` solo puede existir en `src/main.tsx`. Cualquier aparición adicional invalida el build.

- **L2 – Router único**  
  `BrowserRouter` solo puede existir en `src/App.tsx`.

- **L3 – Layout único**  
  `Layout.tsx` se monta exactamente una vez, exclusivamente en `App.tsx`.

- **L4 – Correspondencia ruta–page**  
  Cada archivo en `src/pages/*` corresponde a una sola ruta.  
  Una page nunca importa otra page.

- **L5 – Pages sin lógica de dominio**  
  Las pages no contienen:
  - lógica de negocio,  
  - side‑effects persistentes,  
  - estado global,  
  - inicializaciones de servicios (Supabase, IA, logging).

- **L6 – Modules agnósticos de navegación**  
  Ningún archivo en `src/modules/*` puede importar:
  - `react-router-dom`,  
  - `core/Layout`,  
  - pages.

- **L7 – Inicialización controlada**  
  Servicios globales (Supabase, AI Gateway, logging) se inicializan una sola vez, en capas explícitas (`integrations/*`, `core/*`).

- **L8 – No superposición de vistas**  
  Ninguna ruta puede renderizar simultáneamente fragmentos de otra ruta.  
  Ruta `/` no muestra componentes propios de `/login`, y viceversa.

- **L9 – Excepciones auditadas**  
  Cualquier excepción a estas leyes:
  - se declara explícitamente,  
  - vive fuera de `main`/`App`/`Layout`,  
  - se documenta y rastrea,  
  - no puede llegar a producción.

***

## V. Arquitectura canónica del cliente

### 5.1 Pages (`src/pages`)

- `Index.tsx`, `Documentation.tsx`, `Login.tsx`, `Register.tsx`, `Membership.tsx`, etc.  
- Función: **orquestar módulos/domains** para cada ruta.  
- Prohibido: router, layout, servicios globales, lógica de negocio.

### 5.2 Core (`src/core`)

- `Layout.tsx`: shell persistente.  
- `RouterGuard.tsx`: gating de rutas (auth, membresía).

Reglas:

- `Layout` solo se usa en `App.tsx`.  
- Ningún module/page monta `Layout` directamente.

### 5.3 Modules (`src/modules`)

- `constelacionInteractiva` → dominio social.  
- `nexoEstelar` → social + IA.  
- `oraculoTecnologico` → auth + IA.  
- `interfazSensorial` → XR/UI.

Reglas:

- Pages importan modules.  
- Modules nunca importan pages ni router/layout.

### 5.4 Domains (`src/domains`)

- `auth/`, `social/`, `economy/`, `ai/`, `xr/`.  
- Destino de refactor progresivo desde `modules/*` según mapa acordado.

***

## VI. Blindaje tecnológico (eslint, tests, análisis)

### 6.1 ESLint constitucional (plugin `tamv`)

Reglas obligatorias:

- `tamv/no-reactdom-outside-main`  
  - Bloquea imports de `react-dom/client` fuera de `src/main.tsx`.

- `tamv/no-router-outside-app`  
  - Bloquea `react-router-dom` fuera de `src/App.tsx`.

- `tamv/no-layout-outside-app`  
  - Bloquea imports de `core/Layout` fuera de `src/App.tsx`.

- `tamv/no-router-in-modules`  
  - Bloquea `react-router-dom` en `src/modules/*`.

- `tamv/no-page-to-page-import`  
  - Bloquea imports `/pages/` dentro de `src/pages/*`.

Violación de cualquiera ⇒ estado técnico inválido, CI en rojo.

### 6.2 Tests como sensores de estructura

**E2E (Playwright)**:

- Verifican que una ruta no muestra componentes de otra (`data-testid`).  
- `/` no muestra formularios de login/registro.  
- `/login` no muestra `global-feed`, `nexo-estelar`, etc.

**Unitarios/estáticos (Vitest)**:

- Root único: solo `src/main.tsx` contiene `createRoot`.  
- Opcional: test de grafo de imports para evitar page→page, module→router.

### 6.3 Análisis arquitectónico

Script obligatorio (`scripts/check-architecture.ts`):

- Construye grafo de dependencias (pages, core, modules, domains).  
- Falla si detecta:

  - page → page,  
  - module → router,  
  - module → Layout,  
  - domains importando pages.

Este script se ejecuta como parte de `npm run ci`.

***

## VII. Blindaje jurídico‑técnico

### 7.1 Naturaleza

QC‑TAMV‑01 es:

- Norma técnica interna vinculante.  
- Política de control de calidad del Cliente Civilizatorio.  
- Cláusula operativa de aceptación técnica para despliegues TAMV.

No sustituye normativa legal externa, pero define el estándar mínimo de diligencia técnica y trazabilidad del cliente.

### 7.2 Principios aplicables

- **Responsabilidad objetiva técnica**: el sistema responde por violaciones, independientemente de intención.  
- **Debida diligencia tecnológica**: el uso de lint/tests/análisis estructural demuestra diligencia razonable.  
- **Trazabilidad verificable**: decisiones técnicas clave quedan registradas en CI/logs.  
- **Neutralidad algorítmica**: las reglas no distinguen entre humano o IA; sólo importan los artefactos.

### 7.3 IAs operativas

Cualquier IA que opere sobre el código:

- Es considerada **agente técnico subordinado**.  
- Debe seguir QC‑TAMV‑01.  
- Sus outputs se validan automáticamente vía lint/tests/CI.  
- No genera derechos ni autoría independiente sobre el marco normativo.

### 7.4 Incumplimiento

Incumplir QC‑TAMV‑01 implica:

- Invalidez del estado técnico del cliente.  
- Bloqueo de despliegue, integración o dependencia.  
- Activación de revisión técnica obligatoria (por guardianías técnicas / SRE / comité).

***

## VIII. Procedimiento operativo (CI/CD)

Pipeline obligatorio para cualquier PR hacia ramas protegidas (`main`, `release/*`):

1. `npm run lint`  
2. `npm run check` (TypeScript sin emit)  
3. `npm run test` (Vitest)  
4. `npm run test:e2e` (Playwright)  
5. `npm run check:architecture` (script de grafo)

Cualquier fallo ⇒

- Merge bloqueado.  
- Despliegue bloqueado.  
- La IA o humano responsable debe corregir antes de continuar.

***

## IX. Artefacto canónico vinculante

**`src/pages/Index.tsx`** se declara *Page TAMV de referencia*:

- No importa router ni layout.  
- No maneja estado global.  
- No inicializa servicios.  
- Sólo compone módulos/domains.

Se registra en DigyTAMV como:  
`Arquitectura/QC/QC-TAMV-P01-IndexPage.md` (ejemplo normativo para contributors y agentes IA).

***

## X. Versionado y evolución

- QC‑TAMV‑01 v1.1 sólo puede modificarse mediante:  
  - revisión técnica formal,  
  - análisis de impacto,  
  - aprobación por el órgano de gobernanza técnica pertinente (p.ej. Consejo de Arquitectura TAMV).

- Toda nueva versión debe:  
  - conservar compatibilidad con los principios P1–P5,  
  - documentar cambios en DigyTAMV,  
  - actualizar pipelines de CI/CD.

***

## XI. Sello oficial

Con esta versión:

- **QC‑TAMV‑01 v1.1** queda:

  - Aprobado técnicamente.  
  - Ejecutable automáticamente (lint, tests, análisis).  
  - Vinculante dentro del ecosistema TAMV.  
  - Preparado para auditoría externa técnica/ética.  
  - Compatible con operación humana e IA.

- **Fecha de entrada en vigor**: inmediata.  
- **Ámbito**: global.  
- **Estado**: definitivo hasta la publicación de QC‑TAMV‑01 v1.2 o superior.

***

## XII. Referencias técnicas

- [React createRoot API](https://react.dev/reference/react-dom/client/createRoot)
- [ESLint Custom Rules](https://eslint.org/docs/latest/extend/custom-rules)
- [Vitest Testing Framework](https://vitest.dev/)
- [Playwright E2E Testing](https://playwright.dev/)
- [API Audit Checklist](https://appsentinels.ai/blog/blog-api-audit-checklist-a-comprehensive-guide-for-security-leaders/)
- [React Monorepo Best Practices](https://www.dhiwise.com/post/best-practices-for-structuring-your-react-monorepo)
- [App Development Checklist](https://www.create.xyz/blog/app-development-checklist)
- [MVP Checklist](https://americanchase.com/mvp-checklist/)

***

**Documento generado como parte del ecosistema TAMV MD-X4â"¢**  
**Sistema Constitucional de Control de Calidad v1.1**
