# Render XR / MD-X4 — Documento Interno

> **Estado:** `draft` · **Acceso:** INTERNO · **Revisión:** DAO-Experiencia

## Patrón de code-splitting para rutas XR

Las rutas XR son costosas en bundle. Implementar lazy loading:

```tsx
// En App.tsx
const Metaverse = lazy(() => import('./pages/Metaverse'));
const DreamSpaces = lazy(() => import('./pages/DreamSpaces'));
const ThreeDSpace = lazy(() => import('./pages/ThreeDSpace'));

// Wrapper con Suspense
<Suspense fallback={<XRLoadingScreen />}>
  <Route path="/metaverse" element={<Metaverse />} />
</Suspense>
```

**Estado actual:** pendiente de implementar (TASKS-TAMV-MODULAR.md ítem 5).

## Guía LOD (Level of Detail)

Implementar LOD progresivo basado en FPS medido:

```typescript
const LOD_THRESHOLDS = {
  ultra:   { fps: 60, particles: 2000, shadowQuality: 'high' },
  high:    { fps: 45, particles: 1000, shadowQuality: 'medium' },
  medium:  { fps: 30, particles: 500,  shadowQuality: 'low' },
  low:     { fps: 0,  particles: 100,  shadowQuality: 'none' },
};
```

El `xrStore.fps` se actualiza cada segundo desde el loop de render.
Si `fps < 45`, llamar a `xrStore.updateSceneConfig({ quality: 'medium', lodEnabled: true })`.

## Throttle de audio-reactivo

El audio-reactivo debe muestrear FFT máximo a 30fps, no en cada frame de render:

```typescript
const AUDIO_SAMPLE_INTERVAL_MS = 33; // ~30fps
```

## Performance benchmarks objetivo

| Métrica | Target | Medición |
|---------|--------|----------|
| FPS mínimo (equipos medios) | ≥ 45 | `xrStore.fps` |
| Tiempo de carga ruta XR | < 2s percibido | LCP Lighthouse |
| Uso memoria Three.js | < 200MB | Chrome DevTools |
| Leaks de geometría | 0 | Dispose en cleanup |

## Limpieza de recursos Three.js

Todo componente 3D debe hacer dispose en unmount:

```typescript
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
    texture.dispose();
  };
}, []);
```

## KAOS Audio — frecuencias binaural

| Preset | Freq L | Freq R | Estado objetivo |
|--------|--------|--------|-----------------|
| `focus` | 200Hz | 210Hz | Concentración (alpha 10Hz) |
| `relax` | 150Hz | 154Hz | Relajación (theta 4Hz) |
| `meditate` | 100Hz | 104Hz | Meditación profunda (theta 4Hz) |
| `energize` | 300Hz | 314Hz | Energía (beta 14Hz) |
| `sleep` | 80Hz | 84Hz | Sueño (delta 4Hz) |

Frecuencia base del sistema: 432Hz (en lugar del estándar 440Hz).
