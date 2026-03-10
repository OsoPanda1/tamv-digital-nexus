# TAMV — Arquitectura Unificada de Metarrealidad + Roadmap de Ejecución por IA

**Versión:** 1.0.0  
**Estado:** Lista para integración operativa  
**Trazabilidad TAMV:** L0 (Doctrina) → L7 (Quant-Inspired)

---

## 1. Visión General del TAMV

El **TAMV** (Territorio Autónomo de Metarrealidad Viva) es una infraestructura digital civilizatoria que combina red social, metaverso operativo, fábrica de IA y capa de gobernanza/servicios para ciudades, universidades, redes de salud y comunidades creativas.

No se comporta como una aplicación aislada, sino como un **sistema nervioso digital** que integra mundos XR, datos, telemedicina, educación, economía digital e integración continua de repositorios de software.

Su núcleo opera como:

- **Sistema Nervioso Digital:** eventos, IA, BookPI, Sensory Gate.
- **Metaverso Operativo:** DreamSpaces, CitySpaces, UniversitySpaces, CrisisSpaces.
- **Fábrica de IA:** IsabellaOrchestrator, Repo‑Unification, funciones de evolución continua.

---

## 2. Modelo Metarreal del Sistema

### 2.1 WORLD_LAYERS — Mundos y experiencias

Los `WORLD_LAYERS` representan los espacios donde viven las experiencias de usuario:

- Ciudades XR turísticas y cívicas.
- Espacios sociales y hubs de comunidad.
- DreamSpaces inmersivos.
- Mundos educativos y campus.
- Escenarios de simulación de crisis, economía y gobernanza.

Características clave:

- Geometría procedural para generar ciudades y escenas bajo demanda.
- Usuarios representados como flujos energéticos, no solo avatares estáticos.
- Actividad que modifica el entorno en tiempo real (densidad de nodos, intensidad de color, efectos).

### 2.2 INFRASTRUCTURE_FIELD — Infraestructura del sistema

La `INFRASTRUCTURE_FIELD` hace visible la topología real del ecosistema:

- Nodos de servidores, clusters, redes federadas, pipelines de datos e integraciones de APIs.
- Visualización como espirales, grafos, líneas de energía y nodos pulsantes con latencia, carga y estado de servicios.

### 2.3 GOVERNANCE_OVERLAYS — Gobernanza

La gobernanza se representa como patrones dinámicos:

- Votaciones como ondas de expansión sobre el grafo.
- Cambios de reglas como reconfiguraciones topológicas visibles.
- Permisos y roles como constelaciones de nodos conectados.

### 2.4 USER_TRAILS — Trayectorias de usuario

Cada usuario genera trayectorias que cruzan capas:

- Navegación social, creación de contenido, visitas XR, transacciones, votaciones y consultas de salud.
- Visualización como líneas de luz, estelas volumétricas y bifurcaciones para lectura de comportamiento colectivo.

---

## 3. Visualizador Metarreal en Python (módulo funcional)

Archivo: `tools/tamv_metareality_viewer.py`

El módulo implementa una visualización 3D base de la metarrealidad TAMV, diseñada para evolucionar a pipeline GPU/VisPy y conectarse a datos reales del sistema.

### Capacidades incluidas

- Núcleo espiral del sistema (`SYSTEM_CORE`).
- Mundos flotantes (`WORLD_LAYERS`) con superficies semitransparentes.
- Trayectorias de usuario (`USER_TRAILS`).
- Eventos críticos (`EVENTS`, `CRISIS`, `GOVERNANCE_OVERLAYS`).
- Exportación de frame inicial en PNG.
- Exportación opcional de animación GIF.
- CLI con parámetros para semilla, cantidad de elementos, rutas de salida y modo sin interfaz.

### Uso rápido

```bash
python tools/tamv_metareality_viewer.py --save-frame tamv_metareality_frame0.png --no-show
```

### Uso con animación GIF

```bash
python tools/tamv_metareality_viewer.py \
  --frames 240 \
  --save-frame tamv_metareality_frame0.png \
  --save-gif tamv_metareality.gif \
  --no-show
```

---

## 4. Roadmap de Ejecución por IA (versión final)

### 4.1 Horizonte 0 — Consolidación inmediata (0–4 horas IA)

Objetivo: dejar la base del TAMV limpia y coherente para evolución continua.

Acciones por agentes:

- **Limpieza estructural**
  - Reorganizar rutas y consolidar páginas informativas en dos centros: `Centro de Conocimiento` y `Centro Legal / Documentación`.
  - Generar índices automáticos desde MD existentes (`01_filosofia_tamv.md`, `MDX4_FUNCTIONAL_ARCHITECTURE_MAP.md`, etc.).
- **Unificación visual**
  - Forzar sistema único de fondo: `UnifiedBackground Matrix 3D`.
  - Eliminar variantes obsoletas (`EpicBackground`, `QuantumCanvas`).
  - Ajustar `CinematicIntro v12.0` con escenas ancladas a módulos reales.
- **Corrección de integraciones**
  - Endurecer `github-repo-scanner` (rate limit, errores, timeouts).
  - Revisar TTS de Isabella con fallback y manejo de errores.

### 4.2 Fase 1 — Producto centrado en usuario final (4–24 horas IA)

Objetivo: convertir el núcleo en experiencia completa (social + XR + salud + gifts).

- **Social Feed + Onboarding Isabella**
  - Flujo de 3 pasos: identidad soberana → primer contenido → primer DreamSpace XR.
  - Progress bar, badges y Gifts (Light/Epic).
- **DreamSpaces XR y tours**
  - Recorridos guiados (ciudad, educativo, crisis) con `DreamSpaceViewer v3.0` + `IsabellaXRGuide`.
  - Escenas demo estables (FPS, HUD, audio KAOS, permisos XR).
- **Telemedicina y Gifts**
  - Extender `/health`: agenda, espera, consulta, cierre con BookPI Health.
  - Integración de gifts en feed social, XR y salud.

### 4.3 Fase 2 — Bundles institucionales (1–3 días IA)

Objetivo: empaquetar TAMV para clientes concretos.

- **Bundle Ciudad**
  - Rutas XR turísticas, nodos comerciales, dashboards económicos y simulaciones urbanas.
  - Escenas y textos autogenerados desde documentos técnico-financieros.
- **Bundle Universidad**
  - Campus XR, certificación federada, identidad académica soberana y tutoría IA.
  - Integración BookPI + XR para logros y aulas inmersivas.
- **Bundle Salud**
  - Red de clínicas, teleconsulta, ledger médico, consentimiento digital.
  - Uso intensivo de BookPI Health, MSR ledger y `GOVERNANCE_OVERLAYS`.

### 4.4 Fase 3 — Ecosistema auto-evolutivo (3–7 días IA)

Objetivo: absorber código desde universo de repos por olas.

- **Escaneo y clasificación continua**
  - `github-repo-scanner` + scripts de análisis mantienen un registro vivo de repos y potencial de integración.
- **Olas de integración**
  - Ola 1: IA y XR.
  - Ola 2: Infraestructura y seguridad.
  - Ola 3: Economía y contenido.
- **Auditoría automática**
  - Scripts verifican consistencia arquitectónica y generan reportes/sugerencias.

### 4.5 Fase 4 — TAMV auto-operado por IA (7–14 días IA, iterativo)

Objetivo: que el propio sistema decida qué mejorar, lanzar y absorber.

- **IsabellaOrchestrator como director de producto**
  - Analiza uso de feed, XR, salud, gifts y repos integrados.
  - Genera tareas, escenas y ajustes por objetivos institucionales.
- **Sensory Gate + Crisis**
  - Monitorea picos de uso, fallos XR y riesgos de seguridad.
  - Activa respuestas automáticas: cerrar escenas inestables, reconfigurar rutas, escalar servicios.
- **Loop de despliegue continuo**
  - Agentes ejecutan E2E, auditorías y despliegues sobre CI/CD, K8s y Docker.

---

## 5. Modo Pitch Automático y Auto-Demo Permanente

- **Modo Pitch Automático**
  - Secuencia: Cinematic Intro → Feed Social → XR DreamSpace → Telemedicina → Repo‑Unification.
  - Narrativas por público objetivo: alcalde, rector, inversor y comunidad creativa.
- **Auto-Demo Permanente**
  - Agentes simulan usuarios, sesiones XR, comercio digital y consultas médicas para mantener el ecosistema vivo.

---

## 6. Resultado Final

Con esta arquitectura unificada, el visualizador metarreal funcional en Python y el roadmap de ejecución por IA, TAMV queda definido como una infraestructura civilizatoria de metarrealidad capaz de:

- Desarrollarse de forma continua.
- Auto‑expandirse por integración de repos y servicios.
- Auto‑optimizarse con trazabilidad y auditoría.

Esto deja la base lista para posterior conversión a MDX navegable con hooks de código y embebido del viewer dentro del propio ecosistema TAMV.
