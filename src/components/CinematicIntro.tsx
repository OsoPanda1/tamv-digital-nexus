// =======================================================
// TAMV ONLINE – AAA CINEMATIC INTRO CONTROLLER
// Arquitectura optimizada + Timeline centralizada
// =======================================================

import React, { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { X } from "lucide-react"

import introAudio from "@/assets/intro.mp3"
import logoImg from "@/assets/LOGOTAMV2.jpg"

// Import 3D Scene Components (we'll use the existing components)
import { 
  NebulaFog, 
  LightHalo, 
  QuantumField, 
  PowerCore, 
  ShockwaveRings,
  LeadershipCrown,
  MagicRunes,
  GlowingOrbs,
  ParticleTrails,
  Stars
} from "./CinematicSceneComponents"

type Phase =
  | "permission"
  | "awakening"
  | "ignition"
  | "crisis"
  | "expansion"
  | "crown"
  | "logo"
  | "message"
  | "complete"

interface Props {
  onComplete: () => void
  skipEnabled?: boolean
}

// =======================================================
// TIMELINE CONFIGURACIÓN CENTRALIZADA
// =======================================================

const TIMELINE = [
  { phase: "awakening", delay: 300 },
  { phase: "ignition", delay: 2200 },
  { phase: "crisis", delay: 4800 },
  { phase: "expansion", delay: 7200 },
  { phase: "crown", delay: 9500 },
  { phase: "logo", delay: 11800 },
  { phase: "message", delay: 14000 },
]

const MESSAGE_LINES = [
  { text: "PROTOCOLO DE INMERSIÓN ACTIVADO...", duration: 3500 },
  { text: "TAMV ONLINE · ORGULLOSAMENTE LATINOAMERICANOS.", duration: 5000 },
  { text: "PROYECTO DEDICADO A REINA TREJO SERRANO.", duration: 4500 },
  { text: "SONRÍE: TU OVEJA NEGRA LO LOGRÓ.", duration: 4500 },
  { text: "BIENVENIDO AL ECOSISTEMA CIVILIZATORIO.", duration: 4000 },
]

// =======================================================
// PERMISSION GATE COMPONENT
// =======================================================

const PermissionGate: React.FC<{ onAccept: () => void }> = ({ onAccept }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* Glowing background effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: hovered
            ? "radial-gradient(circle at center, rgba(157,78,221,0.15) 0%, rgba(0,0,0,1) 70%)"
            : "radial-gradient(circle at center, rgba(0,217,255,0.08) 0%, rgba(0,0,0,1) 70%)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Logo */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={logoImg}
            alt="TAMV"
            className="w-24 h-24 object-contain rounded-lg"
          />
          <motion.div
            className="absolute -inset-4 rounded-xl"
            animate={{
              boxShadow: hovered
                ? "0 0 40px rgba(157,78,221,0.5), inset 0 0 20px rgba(157,78,221,0.2)"
                : "0 0 20px rgba(0,217,255,0.3), inset 0 0 10px rgba(0,217,255,0.1)",
            }}
          />
        </motion.div>

        {/* Wordmark */}
        <div className="text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold tracking-[0.3em] text-white mb-2"
            style={{
              textShadow: "0 0 30px rgba(0,217,255,0.5)",
            }}
          >
            TAMV
          </motion.h1>
          <motion.p
            className="text-cyan-400/80 text-sm tracking-[0.4em] uppercase"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            DIGITAL NEXUS
          </motion.p>
        </div>

        {/* Enter button */}
        <motion.button
          onClick={onAccept}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative px-12 py-4 bg-transparent border border-cyan-400/50 text-cyan-400 font-medium tracking-[0.2em] uppercase overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-400/20 to-purple-600/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10">Iniciar Experiencia</span>
        </motion.button>

        {/* Subtitle */}
        <motion.p
          className="text-white/40 text-xs tracking-wider max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Sistema Cinematico Genesis v7.0
          <br />
          Powered by Isabella AI
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// =======================================================
// CIVILIZATORY SCENE (3D)
// =======================================================

import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { Points, PointMaterial, Float, Stars as DreiStars } from "@react-three/drei"

const C = {
  gold: "#FFD700",
  cyan: "#00D9FF",
  purple: "#9D4EDD",
  white: "#FFFFFF",
  magenta: "#FF2D78",
}

function useCinematicCamera(phase: Phase) {
  useFrame(({ mouse, camera }) => {
    const targetX = THREE.MathUtils.lerp(-0.3, 0.3, (mouse.x + 1) / 2)
    const targetY = THREE.MathUtils.lerp(-0.2, 0.2, (mouse.y + 1) / 2)

    camera.position.x += (targetX - camera.position.x) * 0.06
    camera.position.y += (targetY - camera.position.y) * 0.06

    if (phase === "crisis") {
      const shake = 0.06
      camera.position.x += (Math.random() - 0.5) * shake
      camera.position.y += (Math.random() - 0.5) * shake
    }

    if (phase === "crown" || phase === "logo" || phase === "message") {
      const targetZ = 10.5
      camera.position.z += (targetZ - camera.position.z) * 0.08
    } else {
      const targetZ = 9
      camera.position.z += (targetZ - camera.position.z) * 0.08
    }

    camera.lookAt(0, 0.5, 0)
  })
}

const CinematicScene: React.FC<{ phase: Phase }> = ({ phase }) => {
  useCinematicCamera(phase)

  return (
    <group>
      <ambientLight intensity={0.25} color="#0b1020" />
      <spotLight
        position={[0, 6, 5]}
        intensity={2.8}
        angle={0.6}
        penumbra={0.6}
        color={C.gold}
      />
      <pointLight position={[6, -4, 4]} intensity={2.3} color={C.cyan} />
      <pointLight position={[-8, 6, -6]} intensity={1.7} color={C.purple} />

      <NebulaFog phase={phase as any} />
      <DreiStars
        radius={200}
        depth={120}
        count={16000}
        factor={4.5}
        saturation={0.4}
        fade
        speed={phase === "expansion" || phase === "crown" ? 3 : 1}
      />
      <LightHalo />
      <QuantumField phase={phase as any} />
      <PowerCore phase={phase as any} />
      <ShockwaveRings phase={phase as any} />
      <MagicRunes phase={phase as any} />
      <LeadershipCrown phase={phase as any} />
      <GlowingOrbs phase={phase as any} />
      <ParticleTrails phase={phase as any} />
    </group>
  )
}

// =======================================================
// CIVILIZATORY EFFECTS
// =======================================================

const CivilizatoryEffects: React.FC = () => {
  return null // Placeholder for additional effects
}

// =======================================================
// COMPONENTE PRINCIPAL
// =======================================================

export default function CinematicIntro({ onComplete, skipEnabled = true }: Props) {

  const [phase, setPhase] = useState<Phase>("permission")
  const [accepted, setAccepted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [lines, setLines] = useState<string[]>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timelineTimeouts = useRef<number[]>([])
  const progressInterval = useRef<number | null>(null)

  // =======================================================
  // AUDIO CONTROL PROFESIONAL
  // =======================================================

  const initAudio = async () => {
    try {
      const audio = new Audio(introAudio)
      audio.volume = 0.85
      audio.loop = false
      audioRef.current = audio
      await audio.play()
    } catch {
      console.warn("Autoplay bloqueado por el navegador.")
    }
  }

  const stopAudio = () => {
    audioRef.current?.pause()
    audioRef.current = null
  }

  // =======================================================
  // CLEANUP GLOBAL
  // =======================================================

  const clearAllTimers = () => {
    timelineTimeouts.current.forEach(clearTimeout)
    timelineTimeouts.current = []
    if (progressInterval.current) clearInterval(progressInterval.current)
  }

  // =======================================================
  // MASTER START SEQUENCE
  // =======================================================

  const startIntro = useCallback(() => {

    initAudio()
    setAccepted(true)

    // Fases automáticas
    TIMELINE.forEach(({ phase, delay }) => {
      const t = window.setTimeout(() => {
        setPhase(phase as Phase)
      }, delay)

      timelineTimeouts.current.push(t)
    })

    // Mensajes
    let delayAccumulator = 14000

    MESSAGE_LINES.forEach(line => {
      const t = window.setTimeout(() => {
        setLines(prev => [...prev, line.text])
      }, delayAccumulator)

      timelineTimeouts.current.push(t)
      delayAccumulator += line.duration
    })

    // Finalización
    const totalDuration = delayAccumulator + 2000

    timelineTimeouts.current.push(
      window.setTimeout(() => {
        stopAudio()
        setPhase("complete")
        setTimeout(onComplete, 1000)
      }, totalDuration)
    )

    // Progress bar
    const startTime = Date.now()
    progressInterval.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime
      setProgress(Math.min((elapsed / totalDuration) * 100, 100))
    }, 50)

  }, [onComplete])

  // =======================================================
  // SKIP CONTROL
  // =======================================================

  const handleSkip = () => {
    if (!skipEnabled) return
    clearAllTimers()
    stopAudio()
    onComplete()
  }

  // =======================================================
  // CLEANUP ON UNMOUNT
  // =======================================================

  useEffect(() => {
    return () => {
      clearAllTimers()
      stopAudio()
    }
  }, [])

  // =======================================================
  // PERMISSION GATE
  // =======================================================

  if (!accepted) {
    return (
      <AnimatePresence>
        <PermissionGate onAccept={startIntro} />
      </AnimatePresence>
    )
  }

  // =======================================================
  // RENDER PRINCIPAL
  // =======================================================

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[9999]">

      {/* 3D SCENE */}
      <Canvas camera={{ position: [0, 0.5, 9.5], fov: 70 }}>
        <CinematicScene phase={phase} />
        <CivilizatoryEffects />
      </Canvas>

      {/* HUD OVERLAY */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Header */}
        <div className="absolute top-6 left-6 text-xs tracking-[0.4em] uppercase text-white/40">
          TAMV ONLINE · SIMULACIÓN CIVILIZATORIA
        </div>

        {/* Phase Messaging */}
        <AnimatePresence>
          {phase === "awakening" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sky-300 tracking-[1em] uppercase text-sm">
                INICIALIZANDO RED...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logo Phase */}
        <AnimatePresence>
          {phase === "logo" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={logoImg}
                  alt="TAMV"
                  className="w-32 h-32 object-contain rounded-xl"
                  style={{
                    boxShadow: "0 0 60px rgba(255,215,0,0.4)",
                  }}
                />
                <motion.div
                  className="absolute -inset-2 rounded-xl border-2 border-cyan-400/50"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(0,217,255,0.3)",
                      "0 0 40px rgba(0,217,255,0.6)",
                      "0 0 20px rgba(0,217,255,0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Lines */}
        {phase === "message" && (
          <div className="absolute bottom-20 w-full text-center px-6">
            {lines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-cyan-400/90 text-lg mb-2 tracking-wide"
                style={{ textShadow: "0 0 20px rgba(0,217,255,0.5)" }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        )}

      </div>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400"
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* SKIP */}
      {skipEnabled && (
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-xs uppercase tracking-widest text-white/40 hover:text-white z-50"
        >
          Saltar Intro
        </button>
      )}

    </div>
  )
}

// Re-export for compatibility
export { CinematicIntro }
