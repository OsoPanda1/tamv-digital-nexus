import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'public' | 'creator' | 'pro' | 'admin';
  idNvida?: {
    digitalFingerprint: string;
    emotionalProfile: string[];
    reputationScore: number;
  };
}

interface QuantumState {
  user: User | null;
  isAuthenticated: boolean;
  sensorPermissions: {
    audio: boolean;
    video: boolean;
    haptic: boolean;
    geolocation: boolean;
  };
  dreamSpaceActive: string | null;
  quantumCoherence: number;
  
  setUser: (user: User | null) => void;
  setSensorPermission: (sensor: keyof QuantumState['sensorPermissions'], granted: boolean) => void;
  activateDreamSpace: (spaceId: string) => void;
  deactivateDreamSpace: () => void;
  updateCoherence: (delta: number) => void;
  logout: () => void;
}

export const useQuantumState = create<QuantumState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      sensorPermissions: {
        audio: false,
        video: false,
        haptic: false,
        geolocation: false
      },
      dreamSpaceActive: null,
      quantumCoherence: 0,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setSensorPermission: (sensor, granted) => 
        set((state) => ({
          sensorPermissions: {
            ...state.sensorPermissions,
            [sensor]: granted
          }
        })),
      
      activateDreamSpace: (spaceId) => set({ dreamSpaceActive: spaceId }),
      deactivateDreamSpace: () => set({ dreamSpaceActive: null }),
      
      updateCoherence: (delta) => 
        set((state) => ({ 
          quantumCoherence: Math.max(0, Math.min(100, state.quantumCoherence + delta))
        })),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        dreamSpaceActive: null 
      })
    }),
    {
      name: 'tamv-quantum-state'
    }
  )
);
