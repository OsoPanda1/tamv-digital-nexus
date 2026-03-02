// =======================================================
// TEXT OVERLAY
// 2D Text synchronized with acts
// =======================================================

import { motion, AnimatePresence } from "framer-motion"
import type { ActId } from "./types"

interface TextOverlayProps {
  act: ActId
  time: number
}

// Mensajes finales
const FINAL_MESSAGES = [
  "PROTOCOLO DE INMERSIÓN ACTIVADO...",
  "TAMV ONLINE · ORGULLOSAMENTE LATINOAMERICANOS.",
  "PROYECTO DEDICADO A REINA TREJO SERRANO.",
  "SONRÍE: TU OVEJA NEGRA LO LOGRÓ.",
  "BIENVENIDO AL ECOSISTEMA CIVILIZATORIO.",
]

export function TextOverlay({ act, time }: TextOverlayProps) {
  // Mensajes progresivos en FINAL_DECLARATION
  const messageIndex = Math.max(0, Math.min(4, Math.floor((time - 26) / 1.2)))

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        pointerEvents: "none",
        paddingBottom: "15vh",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        letterSpacing: "0.32em",
        textTransform: "uppercase",
      }}
    >
      <AnimatePresence mode="wait">
        {/* Mensaje de acto actual */}
        {act === "CORE_AWAKENS" && (
          <motion.div
            key="awakens"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              color: "#f3b35b",
              fontSize: "0.9rem",
              textAlign: "center",
              textShadow: "0 0 20px rgba(243, 179, 91, 0.5)",
            }}
          >
            INICIALIZANDO NÚCLEO CIVILIZATORIO
          </motion.div>
        )}

        {act === "SYSTEM_FAILURE" && (
          <motion.div
            key="failure"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            style={{
              color: "#ff4444",
              fontSize: "1.1rem",
              textAlign: "center",
              textShadow: "0 0 30px rgba(255, 68, 68, 0.7)",
              fontWeight: "bold",
            }}
          >
            ANOMALÍA DETECTADA
          </motion.div>
        )}

        {act === "CIVILIZATORY_EXPANSION" && (
          <motion.div
            key="expansion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              color: "#4be2ff",
              fontSize: "0.9rem",
              textAlign: "center",
              textShadow: "0 0 20px rgba(75, 226, 255, 0.5)",
            }}
          >
            EXPANSIÓN ARQUITECTÓNICA
          </motion.div>
        )}

        {act === "REVELATION" && (
          <motion.div
            key="revelation"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            style={{
              color: "#ffd700",
              fontSize: "1.2rem",
              textAlign: "center",
              textShadow: "0 0 40px rgba(255, 215, 0, 0.6)",
              fontWeight: "bold",
            }}
          >
            PROTOCOLO TAMV
          </motion.div>
        )}

        {act === "FINAL_DECLARATION" && (
          <motion.div
            key="final"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <motion.div
              key={`msg-${messageIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.9, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              style={{
                color: "#f5f5f5",
                fontSize: "0.85rem",
                textAlign: "center",
                maxWidth: "80vw",
                textShadow: "0 0 20px rgba(0, 217, 255, 0.5)",
              }}
            >
              {FINAL_MESSAGES[messageIndex]}
            </motion.div>

            {messageIndex >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  fontSize: "0.6rem",
                  color: "#4be2ff",
                  opacity: 0.7,
                  marginTop: "0.5rem",
                }}
              >
                TAMV ONLINE
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
