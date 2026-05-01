// =======================================================
// CINEMATIC TYPES - TAMV ONLINE AAA TRAILER
// Timeline, Acts and State Machine
// =======================================================

export type ActId =
  | "BLACK_VOID"
  | "CORE_AWAKENS"
  | "SYSTEM_FAILURE"
  | "CIVILIZATORY_EXPANSION"
  | "REVELATION"
  | "FINAL_DECLARATION"

export interface ActConfig {
  id: ActId
  startAt: number // segundos
  endAt: number
}

export const ACTS: ActConfig[] = [
  { id: "BLACK_VOID", startAt: 0, endAt: 4 },
  { id: "CORE_AWAKENS", startAt: 4, endAt: 9 },
  { id: "SYSTEM_FAILURE", startAt: 9, endAt: 14 },
  { id: "CIVILIZATORY_EXPANSION", startAt: 14, endAt: 20 },
  { id: "REVELATION", startAt: 20, endAt: 26 },
  { id: "FINAL_DECLARATION", startAt: 26, endAt: 32 },
]

export const TOTAL_DURATION = 32 // segundos totales del trailer

export function getActAtTime(time: number): { act: ActId; t: number } {
  const current =
    ACTS.find((a) => time >= a.startAt && time < a.endAt) ?? ACTS[ACTS.length - 1]
  const span = current.endAt - current.startAt
  const local = Math.min(Math.max(time - current.startAt, 0), span)
  const t = span <= 0 ? 0 : local / span
  return { act: current.id, t }
}

// Mensajes por acto
export const ACT_MESSAGES: Record<ActId, string | null> = {
  BLACK_VOID: null,
  CORE_AWAKENS: "INICIALIZANDO NÚCLEO...",
  SYSTEM_FAILURE: "ANOMALÍA DETECTADA",
  CIVILIZATORY_EXPANSION: "EXPANSIÓN CIVILIZATORIA",
  REVELATION: "PROTOCOLO TAMV",
  FINAL_DECLARATION: null,
}
