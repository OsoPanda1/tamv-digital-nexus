import { initialRdmState, RdmDigitalEngine } from "./engine";
import type { RdmState } from "./types";

const STORAGE_KEY = "tamv.rdmDigital.state.v1";

export function loadRdmState(): RdmState {
  if (typeof window === "undefined") {
    return initialRdmState;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return initialRdmState;
  }
  try {
    return JSON.parse(raw) as RdmState;
  } catch {
    return initialRdmState;
  }
}

export function saveRdmState(state: RdmState): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createPersistedRdmEngine(): RdmDigitalEngine {
  return new RdmDigitalEngine(loadRdmState());
}
