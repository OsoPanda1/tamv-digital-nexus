# TAMV — Arquitectura Unificada de Metarrealidad + Roadmap de Ejecución por IA

**ID canónico:** `TAMV_ARCH_UNIFIED_METAREALITY_ROADMAP_AI`  
**Versión:** 2.1.0  
**Estado:** Versión final unificada (documental + operativa)  
**Fecha:** 2026-03-10  
**Trazabilidad por capas:** L0 → L7

---

## 0. Nota de consolidación y compatibilidad

Esta revisión conserva el enfoque de la versión 2.0.0, pero recupera mayor granularidad funcional para facilitar implementación por equipos técnicos y lectura ejecutiva por instituciones.

Se mantienen los mismos artefactos de salida:
- Documento arquitectónico unificado en `docs/**`.
- Módulo Python funcional en `tools/tamv_metareality_viewer.py`.

---

## 1. Visión General del TAMV

El **TAMV (Territorio Autónomo de Metarrealidad Viva)** es una infraestructura digital civilizatoria que integra red social, metaverso operativo, fábrica de IA y capa de gobernanza/servicios para ciudades, universidades, salud y comunidades creativas.

No es una aplicación aislada: funciona como un **sistema nervioso digital** que conecta experiencias XR, datos, telemedicina, educación, economía digital e integración continua de repositorios.

Núcleo operativo:
- **Sistema Nervioso Digital:** eventos, IA, BookPI, Sensory Gate.
- **Metaverso Operativo:** DreamSpaces, CitySpaces, UniversitySpaces, CrisisSpaces.
- **Fábrica de IA:** IsabellaOrchestrator, Repo-Unification, edge functions evolutivas.

---

## 2. Modelo Metarreal del Sistema

### 2.1 WORLD_LAYERS — Mundos y experiencias
- Ciudades XR turísticas/cívicas.
- Hubs sociales y comunitarios.
- DreamSpaces inmersivos.
- Campus y mundos educativos.
- Simulación de crisis, economía y gobernanza.

Características:
- Geometría procedural bajo demanda.
- Usuarios como flujos energéticos (no solo avatares estáticos).
- Actividad que altera entorno en tiempo real (nodos, color, intensidad, efectos).

### 2.2 INFRASTRUCTURE_FIELD — Infraestructura visible
- Nodos de servidores, clústeres, redes federadas, pipelines e integraciones API.
- Visualización por espirales, grafos, líneas de energía y nodos pulsantes.
- Señales mínimas de observabilidad: latencia, carga y estado.

### 2.3 GOVERNANCE_OVERLAYS — Gobernanza
- Votaciones como ondas de expansión.
- Cambios de reglas como reconfiguración topológica.
- Roles/permisos como constelaciones enlazadas.

### 2.4 USER_TRAILS — Trayectorias de usuario
- Navegación social, creación de contenido, recorridos XR, transacciones, salud y voto.
- Representación en líneas de luz y estelas volumétricas para lectura de dinámica colectiva.

---

## 3. Módulo Python de Visualización Metarreal

**Archivo:** `tools/tamv_metareality_viewer.py`

Módulo plug-and-play para visualización base 3D de TAMV, listo para evolucionar a GPU/VisPy y conectarse a datos reales (trazas de usuario, infraestructura y gobernanza).

Capacidades:
- Núcleo espiral `SYSTEM_CORE`.
- Mundos semitransparentes `WORLD_LAYERS`.
- Trazas dinámicas `USER_TRAILS`.
- Eventos críticos `EVENTS/CRISIS/GOVERNANCE_OVERLAYS`.
- Rotación animada, exportación de frame PNG y GIF opcional.
- CLI parametrizable y ejecución no interactiva (`--no-show`).
- Mensajes de error claros cuando faltan dependencias (`matplotlib`, `pillow`).

### 3.1 Uso base

```bash
python tools/tamv_metareality_viewer.py --save-frame tamv_metareality_frame0.png --no-show
```

### 3.2 Uso ampliado

```bash
python tools/tamv_metareality_viewer.py \
  --seed 77 \
  --world-count 12 \
  --trail-count 60 \
  --frames 240 \
  --elevation-deg 22 \
  --azimuth-speed 0.8 \
  --save-frame tamv_metareality_frame0.png \
  --save-gif tamv_metareality.gif \
  --no-show
```

### 3.3 Dependencias recomendadas

```bash
pip install matplotlib pillow
```

---

## 4. Roadmap de Ejecución por IA (versión final)

### 4.1 Horizonte 0 — Consolidación inmediata (0–4 h IA)
Objetivo: base limpia y coherente para evolución continua.

- **Limpieza estructural:** consolidar navegación informativa en Centro de Conocimiento + Centro Legal/Documentación; regenerar índices automáticos MD/MDX.
- **Unificación visual:** fondo único `UnifiedBackground Matrix 3D`; retirar variantes obsoletas (`EpicBackground`, `QuantumCanvas`) mediante migración compatible.
- **Integraciones críticas:** robustecer `github-repo-scanner` (rate limit, timeout, fallback); endurecer TTS de Isabella con estrategias de degradación.

### 4.2 Fase 1 — Producto orientado a usuario final (4–24 h IA)
Objetivo: experiencia social + XR + salud + gifts de extremo a extremo.

- **Onboarding social guiado:** identidad soberana → primer contenido → primer DreamSpace XR.
- **DreamSpaces con tours:** ciudad, universidad y crisis con `DreamSpaceViewer` + `IsabellaXRGuide`.
- **Telemedicina operacional:** agenda → sala de espera → consulta → cierre BookPI Health.

### 4.3 Fase 2 — Bundles institucionales (1–3 días IA)
Objetivo: empaquetar TAMV por dominio.

- **Bundle Ciudad:** turismo XR, nodos comerciales, tablero económico, simulación urbana.
- **Bundle Universidad:** campus XR, identidad académica soberana, certificación federada.
- **Bundle Salud:** red clínica, teleconsulta, consentimiento digital, políticas de acceso.

### 4.4 Fase 3 — Ecosistema auto-evolutivo (3–7 días IA)
Objetivo: absorber repositorios por olas de valor.

- Escaneo/registro continuo (`github-repo-scanner`).
- Olas de integración: (1) IA/XR, (2) Infra/Sec, (3) Economía/Contenido.
- Auditoría arquitectónica automática con reportes de consistencia.

### 4.5 Fase 4 — TAMV auto-operado por IA (7–14 días IA)
Objetivo: mejora continua autónoma supervisada.

- **IsabellaOrchestrator** prioriza mejoras por uso real.
- **Sensory Gate + Crisis** detecta y mitiga fallas de experiencia/seguridad.
- **Loop continuo** con E2E, auditoría, CI/CD y despliegue gradual.

---

## 5. Modo Pitch Automático y Auto-Demo Permanente

- **Pitch automático:** Cinematic Intro → Feed Social → XR DreamSpace → Telemedicina → Repo-Unification.
- **Narrativas por perfil:** alcaldía, rectoría, inversión y comunidad creativa.
- **Auto-demo permanente:** simulación continua de actividad para mantener el ecosistema “vivo” en demos.

---

## 6. Resultado Final

Con esta versión unificada:
- TAMV queda definido como infraestructura civilizatoria de metarrealidad.
- Existe una base ejecutable mínima en Python para visualización metarreal.
- El roadmap IA entrega secuencia de ejecución trazable para crecimiento modular, institucional y auto-evolutivo.

> Próximo paso opcional: convertir este documento a MDX navegable con embeds de código y hook directo al viewer.
