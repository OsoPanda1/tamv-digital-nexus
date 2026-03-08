// ============================================================================
// TAMV MD-X4™ — XR Performance Monitor + LOD Auto-Adjust
// Measures FPS in real-time and adjusts xrStore quality automatically
// ============================================================================

import { useCallback, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXRStore, type XRRenderQuality } from '@/stores/xrStore';

const LOD_THRESHOLDS: { min: number; quality: XRRenderQuality; particles: number }[] = [
  { min: 55, quality: 'high', particles: 2000 },
  { min: 45, quality: 'medium', particles: 1000 },
  { min: 30, quality: 'low', particles: 500 },
  { min: 0, quality: 'low', particles: 100 },
];

const DOWNGRADE_HOLD_MS = 3000;
const UPGRADE_HOLD_MS = 5000;

/**
 * React Three Fiber component that monitors FPS and auto-adjusts LOD.
 * Must be placed INSIDE a <Canvas>.
 */
export function XRPerformanceMonitor() {
  const frameCount = useRef(0);
  const lastFpsTime = useRef(performance.now());
  const downgradeStart = useRef<number | null>(null);
  const upgradeStart = useRef<number | null>(null);

  const setFps = useXRStore((s) => s.setFps);
  const updateSceneConfig = useXRStore((s) => s.updateSceneConfig);
  const currentQuality = useXRStore((s) => s.sceneConfig.quality);

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    const elapsed = now - lastFpsTime.current;

    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      frameCount.current = 0;
      lastFpsTime.current = now;
      setFps(fps);

      // LOD auto-adjust
      const qualityOrder: XRRenderQuality[] = ['low', 'medium', 'high', 'ultra'];
      const currentIdx = qualityOrder.indexOf(currentQuality);

      if (fps < 45 && currentIdx > 0) {
        if (!downgradeStart.current) downgradeStart.current = now;
        if (now - downgradeStart.current >= DOWNGRADE_HOLD_MS) {
          const target = LOD_THRESHOLDS.find((t) => fps >= t.min) || LOD_THRESHOLDS[3];
          updateSceneConfig({ quality: target.quality, particleCount: target.particles, lodEnabled: true });
          downgradeStart.current = null;
        }
      } else {
        downgradeStart.current = null;
      }

      if (fps > 55 && currentIdx < qualityOrder.length - 1) {
        if (!upgradeStart.current) upgradeStart.current = now;
        if (now - upgradeStart.current >= UPGRADE_HOLD_MS) {
          const nextQ = qualityOrder[currentIdx + 1];
          const target = LOD_THRESHOLDS.find((t) => t.quality === nextQ) || LOD_THRESHOLDS[0];
          updateSceneConfig({ quality: nextQ, particleCount: target.particles });
          upgradeStart.current = null;
        }
      } else {
        upgradeStart.current = null;
      }
    }
  });

  return null;
}
