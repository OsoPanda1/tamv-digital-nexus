# XR Performance Guidelines — TAMV MD-X4

> **Módulo:** M03_XR · **Estado:** `draft` · **Acceso:** INTERNO
> **Dominio:** DM-X4-06 Render XR / 3D / 4D

---

## 1. Objetivos de performance

| Métrica | Target mínimo | Target óptimo |
|---------|--------------|---------------|
| FPS en equipos medios | 45 fps | 60 fps |
| FPS en equipos bajos | 30 fps | 45 fps |
| Tiempo de carga ruta XR | < 2s percibido | < 1s |
| Uso de memoria Three.js | < 200MB | < 100MB |
| Leaks de geometría | 0 | 0 |
| Audio latency | < 50ms | < 20ms |

---

## 2. Code-splitting (obligatorio)

Todas las rutas XR deben usar `React.lazy()` + `Suspense`:

```tsx
// src/App.tsx — implementación requerida
const Metaverse = lazy(() => import('./pages/Metaverse'));
const DreamSpaces = lazy(() => import('./pages/DreamSpaces'));
const ThreeDSpace = lazy(() => import('./pages/ThreeDSpace'));
```

El fallback de Suspense debe ser una pantalla de carga XR ligera (sin Three.js).

**Regla:** `MSR-XR-01` — constitucional (enforced por Constitution Engine).

---

## 3. LOD (Level of Detail)

### 3.1 Configuración automática por FPS

```typescript
// Lógica en useXRStore o en el loop de render
const FPS_THRESHOLDS = {
  HIGH:   { min: 55, quality: 'high',   particles: 2000, shadows: true  },
  MEDIUM: { min: 45, quality: 'medium', particles: 1000, shadows: false },
  LOW:    { min: 30, quality: 'low',    particles: 500,  shadows: false },
  MINIMAL:{ min: 0,  quality: 'low',    particles: 100,  shadows: false },
};
```

### 3.2 Activación de LOD

- Si `fps < 45` durante 3 segundos consecutivos → bajar un nivel de calidad.
- Si `fps > 55` durante 5 segundos consecutivos → subir un nivel.
- Actualizar `xrStore.updateSceneConfig({ quality, lodEnabled: true })`.

---

## 4. Limpieza de recursos Three.js

Cada componente 3D DEBE implementar cleanup en `useEffect`:

```typescript
useEffect(() => {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.MeshStandardMaterial();

  return () => {
    geometry.dispose();
    material.dispose();
    // Para texturas:
    // texture.dispose();
    // Para render targets:
    // renderTarget.dispose();
  };
}, []);
```

**Anti-patrón prohibido:** crear geometrías dentro del loop de render (`useFrame`).

---

## 5. Audio-reactivo — throttle obligatorio

El análisis FFT para audio-reactivo NO debe ejecutarse en cada frame:

```typescript
const AUDIO_SAMPLE_MS = 33; // ~30fps max para análisis FFT
let lastSample = 0;

useFrame(({ clock }) => {
  const now = clock.getElapsedTime() * 1000;
  if (now - lastSample < AUDIO_SAMPLE_MS) return;
  lastSample = now;
  // analizar FFT aquí
});
```

---

## 6. Patrones permitidos en DreamSpaces/HyperReal

✅ **Permitido:**
- `InstancedMesh` para objetos repetitivos (partículas).
- `BufferGeometry` con atributos pre-calculados.
- `LOD` object de Three.js para meshes complejos.
- `RenderTexture` para reflections simples.
- `AudioContext` para binaural.

⛔ **Prohibido:**
- `new THREE.*` dentro de `useFrame`.
- Texturas no comprimidas > 2048px × 2048px en móvil.
- Más de 10 `DirectionalLight` activos simultáneos.
- `postprocessing` habitual sin feature flag de calidad.

---

## 7. Medición de FPS en producción

Implementar FPS counter no-intrusivo:

```typescript
// En store de XR
let frameCount = 0;
let lastFpsTime = performance.now();

function onFrame() {
  frameCount++;
  const now = performance.now();
  if (now - lastFpsTime >= 1000) {
    useXRStore.getState().setFps(frameCount);
    frameCount = 0;
    lastFpsTime = now;
  }
}
```

---

## 8. Governance XR

**DAO-Experiencia** puede decidir:
- Límites de intensidad visual/sonora.
- Tipos de experiencias XR permitidas por defecto.
- Umbrales de accesibilidad (reducir movimiento, sin parallax).

**No puede decidir:**
- Precios de acceso a experiencias premium XR.
- Arquitectura interna del pipeline MD-X4.
