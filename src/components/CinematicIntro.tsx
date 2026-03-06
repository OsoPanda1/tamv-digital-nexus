// =======================================================
// TAMV CINEMATIC INTRO – Hyper-Realistic Edition
// "La Oveja Negra lo logró."
// =======================================================

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion"
import introAudio from "@/assets/intro.mp3"
import logoImg from "@/assets/LOGOTAMV2.jpg"

interface CinematicIntroProps {
  onComplete: () => void
  skipEnabled?: boolean
  autoStart?: boolean
}

const TOTAL_DURATION = 40

// --- Sub-componente: Grano de Película & Glitch sutil ---
const CinematicOverlay: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden opacity-[0.03]">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
  </div>
)

// =======================================================
// PERMISSION GATE: The Ritual
// =======================================================
const PermissionGate: React.FC<{ onAccept: () => void }> = ({ onAccept }) => (
  <motion.div
    className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center cursor-none"
    exit={{ opacity: 0, filter: "blur(20px)" }}
    transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
  >
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <div className="absolute inset-0 blur-2xl bg-white/5 rounded-full" />
      <img src={logoImg} alt="TAMV" className="w-24 h-24 object-contain rounded-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-1700" />
    </motion.div>
    
    <div className="mt-12 text-center overflow-hidden">
      <motion.h1 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-white font-black text-5xl tracking-[0.3em] mb-2 italic"
      >
        TAMV
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-white/30 text-[10px] uppercase tracking-[0.5em] font-light"
      >
        Soberanía Digital / LATAM 2026
      </motion.p>
    </div>

    <motion.button
      onClick={onAccept}
      className="mt-16 group relative py-4 px-12 overflow-hidden border border-white/10 rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      whileHover={{ borderColor: "rgba(255,255,255,0.4)" }}
    >
      <span className="relative z-10 text-white text-xs tracking-[0.3em] uppercase group-hover:text-white transition-colors">Iniciar Secuencia</span>
      <motion.div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-1600" />
    </motion.button>
  </motion.div>
)

// =======================================================
// ACTS: Cinematic Delivery
// =======================================================

const ActLogo: React.FC = () => (
  <motion.div 
    className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
  >
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
        filter: ["drop-shadow(0 0 0px #fff)", "drop-shadow(0 0 20px rgba(255,255,255,0.1))", "drop-shadow(0 0 0px #fff)"]
      }}
      transition={{ duration: 6, repeat: Infinity }}
    >
      <img src={logoImg} alt="TAMV" className="w-32 h-32 rounded-3xl object-contain mb-8" />
    </motion.div>
    <h2 className="text-white/80 text-lg font-light tracking-[0.4em] uppercase">La Oveja Negra lo logró</h2>
  </motion.div>
)

const ActProblem: React.FC<{ t: number }> = ({ t }) => {
  const problems = ["ALGORITMOS OPACOS", "EXTRACCIÓN DE DATOS", "MONETIZACIÓN FALLIDA"]
  const idx = Math.min(Math.floor(t * 3), 2)
  
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden px-10">
      <motion.div 
        key={idx}
        initial={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="text-center"
      >
        <h3 className="text-red-600 font-black text-4xl md:text-7xl italic tracking-tighter mb-4 opacity-80 uppercase">
          {problems[idx]}
        </h3>
        <p className="text-white/20 text-xs tracking-[0.8em] uppercase">Basta de ser el producto</p>
      </motion.div>
      <div className="absolute inset-0 bg-red-900/5 mix-blend-overlay" />
    </motion.div>
  )
}

const ActSolution: React.FC<{ t: number }> = ({ t }) => (
  <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808]">
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full max-w-lg p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-2xl shadow-2xl"
    >
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
        <div>
          <h4 className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Métrica Real de Impacto</h4>
          <p className="text-white text-3xl font-mono font-bold tracking-tighter">ARPU: $35.00 <span className="text-emerald-500 text-sm">USD</span></p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Soberanía</p>
          <p className="text-white text-xl font-mono">100% ID-NVIDA</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {["Fénix Split", "DreamSpaces", "MSR Engine", "DAO Hybrid"].map(tag => (
          <div key={tag} className="bg-white/5 p-4 rounded-xl border border-white/5 text-[10px] text-white/60 tracking-widest uppercase text-center">
            {tag}
          </div>
        ))}
      </div>
    </motion.div>
    <p className="mt-12 text-white/40 text-sm tracking-[0.3em] uppercase italic">Arquitectura Hexagonal / Self-Healing</p>
  </motion.div>
)

const ActCTA: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-6">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mb-16">
      <p className="text-white/30 text-xs uppercase tracking-[0.4em] mb-4">Proyecto dedicado a</p>
      <h3 className="text-white text-3xl font-serif italic mb-2">Reina Trejo Serrano</h3>
      <p className="text-white/50 text-sm italic font-light">"Tu oveja negra construyó su propio mundo."</p>
    </motion.div>

    <div className="flex flex-col gap-4 w-full max-w-xs">
      <button onClick={onAction} className="bg-white text-black py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:invert transition-all">Iniciar Despliegue</button>
      <button onClick={onAction} className="border border-white/20 text-white/50 py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white/5 transition-all">Ver Whitepaper</button>
    </div>
  </motion.div>
)

// =======================================================
// MAIN ENGINE
// =======================================================
export default function CinematicIntro({ onComplete, skipEnabled = true, autoStart = false }: CinematicIntroProps) {
  const [accepted, setAccepted] = useState(autoStart)
  const [time, setTime] = useState(0)
  const [completed, setCompleted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const progress = useSpring(0, { stiffness: 40, damping: 20 })

  useEffect(() => {
    if (!accepted || completed) return
    let lastTime = performance.now()
    const loop = (now: number) => {
      const delta = (now - lastTime) / 1000
      lastTime = now
      setTime(prev => {
        const next = prev + delta
        if (next >= TOTAL_DURATION) { setCompleted(true); return TOTAL_DURATION }
        return next
      })
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }, [accepted, completed])

  useEffect(() => {
    progress.set(time / TOTAL_DURATION)
  }, [time, progress])

  const act = useMemo(() => {
    if (time < 4) return { id: 1, t: time / 4 }
    if (time < 8) return { id: 2, t: (time - 4) / 4 }
    if (time < 13) return { id: 3, t: (time - 8) / 5 }
    return { id: 4, t: (time - 13) / 5 }
  }, [time])

  const initAudio = useCallback(async () => {
    const audio = new Audio(introAudio)
    audio.volume = 0.6
    audioRef.current = audio
    try { await audio.play() } catch { console.warn("Blocked") }
  }, [])

  if (!accepted) return <PermissionGate onAccept={() => { setAccepted(true); initAudio() }} />

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[9999] font-sans text-white select-none">
      <CinematicOverlay />
      
      <AnimatePresence mode="wait">
        {act.id === 1 && <ActLogo key="a1" />}
        {act.id === 2 && <ActProblem key="a2" t={act.t} />}
        {act.id === 3 && <ActSolution key="a3" t={act.t} />}
        {act.id === 4 && <ActCTA key="a4" onAction={onComplete} />}
      </AnimatePresence>

      {/* Progress Bar - Industrial Design */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div className="h-full bg-white/40" style={{ width: useTransform(progress, [0, 1], ["0%", "100%"]) }} />
      </div>

      {skipEnabled && (
        <button onClick={onComplete} className="absolute bottom-8 right-8 text-[9px] uppercase tracking-[0.5em] text-white/20 hover:text-white transition-colors">
          SALTAR_SECUENCIA
        </button>
      )}
    </div>
  )
}
