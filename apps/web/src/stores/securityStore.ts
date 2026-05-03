// ============================================================================
// TAMV MD-X4™ - DM-X4-03 Security Cell Store
// Zustand slice for Anubis/DEKATEOTL security domain state
// ============================================================================

import { create } from 'zustand';
import type { SecurityEvent, SecurityMetrics, ThreatLevel } from '@/systems/AnubisSecuritySystem';

export interface SecurityStoreState {
  metrics: SecurityMetrics | null;
  events: SecurityEvent[];
  currentThreatLevel: ThreatLevel;
  scanActive: boolean;

  setMetrics: (metrics: SecurityMetrics) => void;
  addEvent: (event: SecurityEvent) => void;
  resolveEvent: (eventId: string) => void;
  setThreatLevel: (level: ThreatLevel) => void;
  setScanActive: (active: boolean) => void;
  clearEvents: () => void;
}

export const useSecurityStore = create<SecurityStoreState>((set) => ({
  metrics: null,
  events: [],
  currentThreatLevel: 'none',
  scanActive: false,

  setMetrics: (metrics) => set({ metrics }),

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 200),
    })),

  resolveEvent: (eventId) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId ? { ...e, resolved: true } : e
      ),
    })),

  setThreatLevel: (currentThreatLevel) => set({ currentThreatLevel }),

  setScanActive: (scanActive) => set({ scanActive }),

  clearEvents: () => set({ events: [] }),
}));
