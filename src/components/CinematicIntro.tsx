// =======================================================
// TAMV CINEMATIC INTRO – Product-focused for LATAM Creators
// Clean, direct, no mystical noise. 4 acts in ~15s.
// =======================================================

import React, { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import introAudio from "@/assets/intro.mp3"
import logoImg from "@/assets/LOGOTAMV2.jpg"

interface CinematicIntroProps {
  onComplete: () => void
  skipEnabled?: boolean
  autoStart?: boolean
}

const TOTAL_DURATION = 18 // seconds

// =======================================================
// PERMISSION GATE
// =======================================================
const PermissionGate: React.FC<{ onAccept: () => void }> = ({ onAccept }) => (
  <motion.div
    className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8 }}
  >
    <motion.img
      src={logoImg}
      alt="TAMV"
      className="w-20 h-20 object-contain rounded-xl mb-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    />
    <motion.h1
      className="text-3xl md:text-4xl font-bold tracking-wider text-white mb-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      TAMV
    </motion.h1>
    <motion.p
      className="text-white/50 text-sm tracking-widest uppercase mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      La nueva casa de los creadores
    </motion.p>
    <motion.button
      onClick={onAccept}
      className="px-10 py-3 border border-white/30 text-white text-sm tracking-widest uppercase hover:bg-white/10 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      Iniciar
    </motion.button>
  </motion.div>
)

// =======================================================
// ACT 1: Logo + Tagline (0–3s)
// =======================================================
const ActLogo: React.FC = () => (
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.img
      src={logoImg}
      alt="TAMV"
      className="w-24 h-24 md:w-28 md:h-28 object-contain rounded-xl mb-6"
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ filter: "drop-shadow(0 0 30px rgba(255,255,255,0.15))" }}
    />
    <motion.h1
      className="text-4xl md:text-5xl font-bold text-white tracking-[0.2em] mb-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      TAMV
    </motion.h1>
    <motion.p
      className="text-white/70 text-base md:text-lg tracking-wide text-center max-w-md px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      La nueva casa de los creadores de LATAM.
    </motion.p>
  </motion.div>
)

// =======================================================
// ACT 2: The Problem (3–6s)
// =======================================================
const PROBLEMS = [
  "Demasiados anuncios.",
  "Tus datos no son tuyos.",
  "Tus ingresos no alcanzan.",
]

const ActProblem: React.FC<{ t: number }> = ({ t }) => {
  const idx = Math.min(Math.floor(t * PROBLEMS.length), PROBLEMS.length - 1)
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Split screen hint - 3 grey columns */}
      <div className="flex gap-3 mb-10 opacity-30">
        {[
          "Creadora editando de madrugada",
          "Feed lleno de anuncios",
          "Gráfica: tú creces, la plataforma gana",
        ].map((alt, i) => (
          <div
            key={i}
            className="w-24 h-16 md:w-32 md:h-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <span className="text-[9px] text-white/20 text-center px-1 leading-tight">{alt}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          className="text-red-400/90 text-xl md:text-2xl font-semibold tracking-wide text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {PROBLEMS[idx]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}

// =======================================================
// ACT 3: The TAMV Solution (6–12s)
// =======================================================
const FEATURES = ["Comunidad", "Membresías", "Cursos", "Propinas", "IA para Creadores"]

const ActSolution: React.FC<{ t: number }> = ({ t }) => {
  const showCards = t > 0.5
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Creator panel mockup */}
      {!showCards && (
        <motion.div
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-black">
              CR
            </div>
            <div>
              <p className="text-white text-sm font-medium">Tu Panel de Creador</p>
              <p className="text-white/40 text-xs">TAMV Dashboard</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Miembros", value: "+327" },
              { label: "ARPU", value: "$35 USD" },
              { label: "En línea", value: "89" },
            ].map((m) => (
              <div key={m.label} className="text-center p-3 rounded-xl bg-white/[0.04]">
                <p className="text-lg font-bold text-white">{m.value}</p>
                <p className="text-[10px] text-white/40 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main message */}
      <motion.p
        className="text-white text-lg md:text-xl font-medium text-center max-w-md mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {showCards
          ? "Un solo ecosistema para crear, cobrar y crecer."
          : "Menos explotación. Más control sobre tu comunidad."}
      </motion.p>

      {/* Feature cards */}
      {showCards && (
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f}
              className="px-4 py-2 rounded-full border border-white/15 bg-white/[0.04] text-white/80 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              {f}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

// =======================================================
// ACT 4: CTA + Dedication (12–18s)
// =======================================================
const ActCTA: React.FC<{ t: number; onAction: () => void }> = ({ t, onAction }) => {
  const showDedication = t > 0.6
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.img
        src={logoImg}
        alt="TAMV"
        className="w-16 h-16 object-contain rounded-xl mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <motion.button
          onClick={onAction}
          className="px-8 py-3 bg-white text-black font-semibold text-sm tracking-wide rounded-lg hover:bg-white/90 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Soy creador inconforme
        </motion.button>
        <motion.button
          onClick={onAction}
          className="px-8 py-3 border border-white/30 text-white font-medium text-sm tracking-wide rounded-lg hover:bg-white/10 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Quiero construir mi comunidad aquí
        </motion.button>
      </div>

      <motion.p
        className="text-white/25 text-[10px] text-center max-w-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        TAMV no promete ingresos garantizados. Es una plataforma para que tú tengas más herramientas y control.
      </motion.p>

      {/* Dedication to mother */}
      {showDedication && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-white/40 text-xs tracking-wider uppercase mb-1">
            Proyecto dedicado a
          </p>
          <p className="text-white/70 text-sm font-medium tracking-wide">
            Reina Trejo Serrano
          </p>
          <p className="text-white/30 text-[10px] mt-1 italic">
            Sonríe: tu oveja negra lo logró.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

// =======================================================
// MAIN COMPONENT
// =======================================================
export default function CinematicIntro({
  onComplete,
  skipEnabled = true,
  autoStart = false,
}: CinematicIntroProps) {
  const [accepted, setAccepted] = useState(autoStart)
  const [time, setTime] = useState(0)
  const [completed, setCompleted] = useState(false)
  const lastRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Determine current act
  const getAct = (t: number): { act: number; localT: number } => {
    if (t < 3) return { act: 1, localT: t / 3 }
    if (t < 6) return { act: 2, localT: (t - 3) / 3 }
    if (t < 12) return { act: 3, localT: (t - 6) / 6 }
    return { act: 4, localT: Math.min((t - 12) / 6, 1) }
  }

  const { act, localT } = getAct(time)

  // RAF loop
  useEffect(() => {
    if (!accepted || completed) return
    let raf: number
    const loop = (now: number) => {
      if (lastRef.current == null) lastRef.current = now
      const delta = (now - lastRef.current) / 1000
      lastRef.current = now
      setTime((prev) => {
        const next = prev + delta
        if (next >= TOTAL_DURATION) {
          setCompleted(true)
          return TOTAL_DURATION
        }
        return next
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [accepted, completed])

  // Audio
  const initAudio = useCallback(async () => {
    try {
      const audio = new Audio(introAudio)
      audio.volume = 1.0
      audio.loop = false
      audioRef.current = audio

      // Simple reverb via Web Audio
      const Ctx = window.AudioContext || (window as any).webkitAudioContext
      if (Ctx) {
        const ctx = new Ctx()
        const src = ctx.createMediaElementSource(audio)
        const convolver = ctx.createConvolver()
        const sr = ctx.sampleRate
        const len = sr * 2.5
        const impulse = ctx.createBuffer(2, len, sr)
        for (let ch = 0; ch < 2; ch++) {
          const d = impulse.getChannelData(ch)
          for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5)
        }
        convolver.buffer = impulse
        const dry = ctx.createGain()
        dry.gain.value = 0.85
        const wet = ctx.createGain()
        wet.gain.value = 0.35
        src.connect(dry).connect(ctx.destination)
        src.connect(convolver).connect(wet).connect(ctx.destination)
      }
      await audio.play()
    } catch {
      console.warn("Autoplay blocked")
    }
  }, [])

  const stopAudio = useCallback(() => {
    audioRef.current?.pause()
    audioRef.current = null
  }, [])

  const handleStart = useCallback(() => {
    setAccepted(true)
    setTime(0)
    lastRef.current = null
    initAudio()
  }, [initAudio])

  const handleSkip = useCallback(() => {
    stopAudio()
    onComplete()
  }, [stopAudio, onComplete])

  // Complete
  useEffect(() => {
    if (completed) {
      stopAudio()
      setTimeout(onComplete, 600)
    }
  }, [completed, onComplete, stopAudio])

  useEffect(() => () => stopAudio(), [stopAudio])

  // Permission gate
  if (!accepted) {
    return (
      <AnimatePresence>
        <PermissionGate onAccept={handleStart} />
      </AnimatePresence>
    )
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[9999]">
      {/* Acts */}
      <AnimatePresence mode="wait">
        {act === 1 && <ActLogo key="act1" />}
        {act === 2 && <ActProblem key="act2" t={localT} />}
        {act === 3 && <ActSolution key="act3" t={localT} />}
        {act === 4 && <ActCTA key="act4" t={localT} onAction={handleSkip} />}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <motion.div
          className="h-full bg-white/40"
          animate={{ width: `${(time / TOTAL_DURATION) * 100}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>

      {/* Skip */}
      {skipEnabled && (
        <button
          onClick={handleSkip}
          className="absolute top-5 right-6 text-[11px] uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors z-50"
        >
          Saltar
        </button>
      )}
    </div>
  )
}

export { CinematicIntro }
