// =======================================================
// TAMV ONLINE – AAA CINEMATIC INTRO CONTROLLER v2.0
// Evolved Architecture: Act-based Timeline + R3F Modular
// =======================================================

import React, { useEffect, useRef, useState, useCallback, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Environment, Stars as DreiStars } from "@react-three/drei"
import * as THREE from "three"

// Legacy imports (keep for compatibility)
import introAudio from "@/assets/intro.mp3"
import logoImg from "@/assets/LOGOTAMV2.jpg"

// New Cinematic System
import {
  getActAtTime,
  useTrailerClock,
  CinematicCameraRig,
  LightingRig,
  CoreReactor,
  MegaStructure,
  MonumentCrown,
  TextOverlay,
  type ActId,
} from "@/cinematic"

interface CinematicIntroProps {
  onComplete: () => void
  skipEnabled?: boolean
  autoStart?: boolean
}

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
          Sistema Cinematico Genesis v8.0
          <br />
          Powered by Isabella AI · HEXA-EDIMAP Architecture
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// =======================================================
// 3D CINEMATIC SCENE
// =======================================================

interface TrailerSceneProps {
  act: ActId
  t: number
}

function TrailerScene({ act, t }: TrailerSceneProps) {
  return (
    <>
      {/* Background and fog */}
      <color attach="background" args={["#020203"]} />
      <fog attach="fog" args={["#020203", 20, 80]} />

      {/* Lighting */}
      <LightingRig act={act} />

      {/* Stars background */}
      <DreiStars
        radius={200}
        depth={120}
        count={16000}
        factor={4.5}
        saturation={0.4}
        fade
        speed={act === "CIVILIZATORY_EXPANSION" || act === "REVELATION" ? 2 : 0.5}
      />

      {/* Ground plane - visible when there's geometry */}
      {(act === "CORE_AWAKENS" ||
        act === "SYSTEM_FAILURE" ||
        act === "CIVILIZATORY_EXPANSION" ||
        act === "REVELATION") && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial
            color={"#050505"}
            metalness={0.3}
            roughness={0.9}
          />
        </mesh>
      )}

      {/* Core Reactor */}
      <CoreReactor act={act} t={t} />

      {/* Mega Structure */}
      <MegaStructure act={act} t={t} />

      {/* Monument Crown */}
      <MonumentCrown act={act} t={t} />

      {/* Environment for specularity */}
      <Environment preset="night" />
    </>
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
  // Clock always runs in background, but 3D scene only shows when accepted
  const { time, completed, restart } = useTrailerClock(32, true)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Get current act
  const { act, t } = getActAtTime(time)

  // Audio control
  const initAudio = useCallback(async () => {
    try {
      const audio = new Audio(introAudio)
      audio.volume = 0.85
      audio.loop = false
      audioRef.current = audio
      await audio.play()
    } catch {
      console.warn("Autoplay bloqueado por el navegador.")
    }
  }, [])

  const stopAudio = useCallback(() => {
    audioRef.current?.pause()
    audioRef.current = null
  }, [])

  // Handle start
  const handleStart = useCallback(() => {
    setAccepted(true)
    initAudio()
    restart()
  }, [initAudio, restart])

  // Handle skip
  const handleSkip = useCallback(() => {
    if (!skipEnabled) return
    stopAudio()
    onComplete()
  }, [skipEnabled, stopAudio, onComplete])

  // Watch for completion
  useEffect(() => {
    if (completed) {
      stopAudio()
      setTimeout(onComplete, 500)
    }
  }, [completed, onComplete, stopAudio])

  // Cleanup
  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [stopAudio])

  // Show permission gate if not accepted
  if (!accepted) {
    return (
      <AnimatePresence>
        <PermissionGate onAccept={handleStart} />
      </AnimatePresence>
    )
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[9999]">
      {/* 3D SCENE */}
      <Canvas
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        camera={{ position: [0, 1, 24], fov: 40, near: 0.1, far: 200 }}
      >
        <Suspense fallback={null}>
          <CinematicCameraRig act={act} t={t} />
          <TrailerScene act={act} t={t} />
        </Suspense>
      </Canvas>

      {/* TEXT OVERLAY */}
      <TextOverlay act={act} time={time} />

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400"
          animate={{ width: `${(time / 32) * 100}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>

      {/* HEADER INFO */}
      <div className="absolute top-6 left-6 text-xs tracking-[0.4em] uppercase text-white/40">
        TAMV ONLINE · SIMULACIÓN CIVILIZATORIA
      </div>

      {/* ACT INDICATOR */}
      <div className="absolute top-6 right-6 text-xs tracking-[0.3em] uppercase text-white/30">
        {act.replace(/_/g, " ")}
      </div>

      {/* SKIP BUTTON */}
      {skipEnabled && (
        <button
          onClick={handleSkip}
          className="absolute top-4 right-24 text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors z-50"
        >
          Saltar Intro
        </button>
      )}
    </div>
  )
}

// Re-export for compatibility
export { CinematicIntro }
