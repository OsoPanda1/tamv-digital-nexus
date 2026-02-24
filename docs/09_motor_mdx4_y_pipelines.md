# 09 — Motor MD-X4 y Pipelines Visuales

> **Estado:** `draft` · **Versión:** 1.0 · **Origen:** Master Canon TAMV

---

## Definición

MD-X4™ (Motor Digital, generación 4) es el pipeline de renderizado y experiencia inmersiva propietario de TAMV. Opera en modo **dual-pipeline**:

- **Pipeline A (Datos):** Procesamiento semántico, estado, lógica de dominio.
- **Pipeline B (Sensorial):** Traducción a experiencia visual, auditiva y háptica.

---

## Pipeline A — Datos

```
Evento de usuario / Sistema
  → Validación (Zod / MSR Rules)
    → Procesamiento de dominio (Systems / Edge Functions)
      → Actualización de estado (Zustand stores)
        → Re-render reactivo (React / TanStack Query)
```

Tecnologías: TypeScript, Zustand, TanStack Query, Supabase Realtime.

---

## Pipeline B — Sensorial

```
Estado actualizado (Zustand)
  → Traducción a parámetros 3D (ThreeSceneManager)
    → Render loop (React Three Fiber / Three.js)
      → Post-processing (shaders, partículas, efectos)
        → Audio KAOS 432Hz (KAOSAudioSystem)
          → Feedback háptico (Navigator.vibrate — si disponible)
```

Tecnologías: Three.js `^0.170.0`, React Three Fiber `^8.18.0`, Web Audio API, GSAP `^3.13.0`, Framer Motion `^12.x`.

---

## Entornos visuales

| Entorno | Descripción | Shaders | Audio |
|---------|-------------|---------|-------|
| `quantum` | Campo cuántico de partículas | ParticleShader + QuantumDistortion | Binaural theta |
| `forest` | Bosque inmersivo procedural | FoliageShader + AmbientOcclusion | Ambiente natural |
| `cosmic` | Espacio profundo | NebulaShader + StarField | Binaural delta |
| `crystal` | Caverna cristalina | CrystalRefraction + CausticsShader | Resonancia 432Hz |
| `matrix` | Rain de caracteres | MatrixShader | Digital ambient |
| `void` | Vacío meditativo | MinimalParticle | Silencio estructurado |

---

## Componentes MD-X4 en repo

| Componente | Ruta | Función |
|-----------|------|---------|
| `ThreeSceneManager` | `src/systems/ThreeSceneManager.tsx` | Gestión del ciclo de vida de la escena Three.js |
| `QuantumObjects` | `src/systems/QuantumObjects.tsx` | Objetos 3D cuánticos procedurales |
| `QuantumCanvas` | `src/components/QuantumCanvas.tsx` | Canvas cuántico 2D/3D |
| `UnifiedBackground` | `src/components/UnifiedBackground.tsx` | Background unificado (matrix + partículas) |
| `ParticleField` | `src/components/ParticleField.tsx` | Campo de partículas inmersivo |
| `MatrixBackground` | `src/components/MatrixBackground.tsx` | Efecto de lluvia de caracteres |
| `HolographicUI` | `src/components/HolographicUI.tsx` | UI holográfica sobre escena 3D |
| `DreamSpaceViewer` | `src/components/dreamspaces/` | Viewer de DreamSpaces |
| `KAOSAudioSystem` | `src/systems/KAOSAudioSystem.ts` | Sistema de audio binaural 432Hz |
| `AudioSystem` | `src/systems/AudioSystem.ts` | Audio base del ecosistema |

---

## XR Store — Estado del pipeline

```typescript
// src/stores/xrStore.ts
{
  isXRActive: boolean,
  currentEnvironment: 'quantum' | 'forest' | 'cosmic' | 'crystal' | 'void',
  sceneConfig: {
    quality: 'low' | 'medium' | 'high' | 'ultra',
    audioReactive: boolean,
    binauralEnabled: boolean,
    particleCount: number,
    lodEnabled: boolean,
  },
  fps: number,
  quantumCoherence: number  // 0-100
}
```

---

## Performance targets

Ver `02_MODULOS/M03_XR/INTERNO/XR-PERFORMANCE-GUIDELINES.md` para guía completa.

| Métrica | Target |
|---------|--------|
| FPS mínimo | 45 fps |
| Carga ruta XR | < 2s |
| Memoria Three.js | < 200MB |

---

## Pendiente de implementar

- [ ] Code-splitting en rutas XR (`lazy()` + `Suspense`)
- [ ] LOD automático basado en FPS medido
- [ ] Throttle de audio-reactivo a 30fps
- [ ] Integración `xrStore.fps` con loop de render
