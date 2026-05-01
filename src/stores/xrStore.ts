// ============================================================================
// TAMV MD-X4™ - DM-X4-06 Render XR Cell Store
// Zustand slice for Metaverse / DreamSpaces / 3D domain state
// ============================================================================

import { create } from 'zustand';

export type XREnvironment = 'quantum' | 'forest' | 'cosmic' | 'crystal' | 'void';
export type XRRenderQuality = 'low' | 'medium' | 'high' | 'ultra';

export interface XRSceneConfig {
  environment: XREnvironment;
  quality: XRRenderQuality;
  audioReactive: boolean;
  binauralEnabled: boolean;
  particleCount: number;
  lodEnabled: boolean;
}

export interface XRStoreState {
  isXRActive: boolean;
  currentEnvironment: XREnvironment;
  sceneConfig: XRSceneConfig;
  fps: number;
  quantumCoherence: number;

  setXRActive: (active: boolean) => void;
  setEnvironment: (env: XREnvironment) => void;
  updateSceneConfig: (patch: Partial<XRSceneConfig>) => void;
  setFps: (fps: number) => void;
  setQuantumCoherence: (value: number) => void;
}

const DEFAULT_SCENE_CONFIG: XRSceneConfig = {
  environment: 'quantum',
  quality: 'medium',
  audioReactive: true,
  binauralEnabled: false,
  particleCount: 500,
  lodEnabled: true,
};

export const useXRStore = create<XRStoreState>((set) => ({
  isXRActive: false,
  currentEnvironment: 'quantum',
  sceneConfig: DEFAULT_SCENE_CONFIG,
  fps: 60,
  quantumCoherence: 50,

  setXRActive: (isXRActive) => set({ isXRActive }),

  setEnvironment: (currentEnvironment) => set({ currentEnvironment }),

  updateSceneConfig: (patch) =>
    set((state) => ({
      sceneConfig: { ...state.sceneConfig, ...patch },
    })),

  setFps: (fps) => set({ fps }),

  setQuantumCoherence: (value) =>
    set({ quantumCoherence: Math.max(0, Math.min(100, value)) }),
}));
