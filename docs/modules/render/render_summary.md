# Render XR / MD-X4 Pipelines — Resumen

> **Estado:** `beta` · **Dominio:** DM-X4-06 XR · **Canon:** MD-X4 pipeline dual inmutable

## Definición

El dominio Render XR implementa el Motor MD-X4, el pipeline visual dual de TAMV que combina datos semánticos con experiencias sensoriales inmersivas.

## Pipeline Dual MD-X4

```
Pipeline A — Datos
  Input → Procesamiento semántico → State (MSR)
    → Actualización de UI reactiva

Pipeline B — Sensorial
  State → Traducción a parámetros 3D/audio
    → Three.js / React Three Fiber render
      → Audio KAOS 432Hz / binaural
        → Feedback háptico (si disponible)
```

## Cell mapping

| Cell | Artefacto | Estado |
|------|-----------|--------|
| `cell-metaverse` | `src/pages/Metaverse.tsx`, `src/systems/ThreeSceneManager.tsx` | beta |
| `cell-dreamspaces` | `src/pages/DreamSpaces.tsx`, `src/components/dreamspaces/` | beta |
| `cell-3dspace` | `src/pages/ThreeDSpace.tsx` | beta |
| `cell-quantum-canvas` | `src/systems/QuantumObjects.tsx`, `src/components/QuantumCanvas.tsx` | beta |
| `cell-kaos-audio` | `src/systems/KAOSAudioSystem.ts`, `src/systems/AudioSystem.ts` | stable |
| `cell-holographic` | `src/components/HolographicUI.tsx` | stable |
| `cell-particles` | `src/components/ParticleField.tsx`, `src/components/MatrixBackground.tsx` | stable |
| `cell-unified-bg` | `src/components/UnifiedBackground.tsx` | stable |

## MSR State

```typescript
activeDreamSpace: DreamSpace | null
dreamSpaces: DreamSpace[]
quantumCoherence: number  // 0-100
```

XR Store (`src/stores/xrStore.ts`):
```typescript
isXRActive: boolean
currentEnvironment: XREnvironment
sceneConfig: XRSceneConfig
fps: number
```

## MSR Rules

- `MSR-XR-01`: Code-splitting en rutas XR (lazy + Suspense)
- `MSR-XR-02`: FPS objetivo ≥ 45fps; activar LOD si cae
- Throttle de audio-reactivo para evitar CPU spikes

## Tecnologías

| Tech | Versión | Uso |
|------|---------|-----|
| Three.js | `^0.170.0` | Motor 3D base |
| React Three Fiber | `^8.18.0` | React bindings para Three.js |
| `@react-three/drei` | `^9.122.0` | Helpers 3D |
| Framer Motion | `^12.x` | Animaciones 2D/3D |
| GSAP | `^3.13.0` | Animaciones imperativas |
| KAOS Audio (432Hz) | custom | Binaural + ambient |

## Entornos DreamSpaces

| Entorno | Descripción | Audio |
|---------|-------------|-------|
| `quantum` | Campo cuántico de partículas | Binaural theta |
| `forest` | Bosque inmersivo | Ambiente natural |
| `cosmic` | Espacio profundo | Binaural delta |
| `crystal` | Caverna cristalina | Resonancia 432Hz |
| `void` | Vacío meditativo | Silencio estructurado |

## Edge Functions

- `kaos-audio-system`: Orquestación de audio binaural

## Referencias

- `src/systems/KAOSAudioSystem.ts`
- `src/systems/ThreeSceneManager.tsx`
- `src/systems/QuantumObjects.tsx`
- `src/stores/xrStore.ts`
- `docs/09_motor_mdx4_y_pipelines.md`
