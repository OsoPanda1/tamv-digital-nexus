// ============================================================================
// TAMV MD-X4™ — Epic Quantum Cinematic Intro FINAL MONOLITHIC FILE
// Archivo ÚNICO, completo, sin recortes, sin placeholders.
// ============================================================================

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

import introAudio from "@/assets/intro.mp3";
import logoImg from "@/assets/LOGOTAMV2.jpg";

// ============================================================================
// TYPES
// ============================================================================

type Phase = "start" | "particles" | "explosion" | "universe" | "logo" | "message";

interface CinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
}

// ============================================================================
// NARRATIVE BLOCK
// ============================================================================

const ISABELLA_LINES: { text: string; duration: number }[] = [
  { text: "PROTOCOLO DE INMERSIÓN ACTIVADO...", duration: 3000 },
  { text: "TAMV ONLINE · ORGULLOSAMENTE LATINOAMERICANOS.", duration: 5000 },
  { text: "PROYECTO DEDICADO A REINA TREJO SERRANO.", duration: 3500 },
  { text: "SONRÍE: TU OVEJA NEGRA LO LOGRÓ. TE QUIERO, MA´.", duration: 5000 },
];

// ============================================================================
// 3D PARTICLES SYSTEM
// ============================================================================

function QuantumParticlesBurst({ phase }: { phase: Phase }) {
  const ref = useRef<THREE.Points>(null);
  const count = 9000;

  const positions = useRef(new Float32Array(count * 3));
  const velocities = useRef(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.25 + Math.random() * 2.8;

      positions.current[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions.current[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions.current[i3 + 2] = r * Math.cos(phi);

      const baseVel = 0.06 + Math.random() * 0.08;
      velocities.current[i3] = (Math.random() - 0.5) * baseVel;
      velocities.current[i3 + 1] = (Math.random() - 0.5) * baseVel;
      velocities.current[i3 + 2] = (Math.random() - 0.5) * baseVel;
    }
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const geom = ref.current.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const isExploding =
      phase === "explosion" || phase === "universe" || phase === "logo" || phase === "message";

    const speed = isExploding ? 0.27 : 0.018;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const wobble = Math.sin(t * 1.7 + i) * 0.002;
      arr[i3] += velocities.current[i3] * speed + wobble;
      arr[i3 + 1] += velocities.current[i3 + 1] * speed + Math.cos(t + i) * 0.002;
      arr[i3 + 2] += velocities.current[i3 + 2] * speed;
    }

    posAttr.needsUpdate = true;
    ref.current.rotation.y = t * 0.2;
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.25;
  });

  return (
    <Points ref={ref} positions={positions.current} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8CF7FF"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.95}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// ============================================================================
// ENERGY SPHERE
// ============================================================================

function EnergySphere({ phase }: { phase: Phase }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    const targetScale =
      phase === "start"
        ? 0.9
        : phase === "particles"
        ? 1.9
        : phase === "explosion"
        ? 5
        : 0;

    const current = meshRef.current.scale.x || 0.001;
    const newScale = current + (targetScale - current) * 0.055;

    meshRef.current.scale.set(newScale, newScale, newScale);
    meshRef.current.rotation.y = t * 0.75;
    meshRef.current.rotation.x = t * 0.45;
  });

  if (phase === "universe" || phase === "logo" || phase === "message") return null;

  return (
    <Float speed={2.6} rotationIntensity={0.8} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 5]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={2.3}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

// ============================================================================
// SHOCKWAVE
// ============================================================================

function Shockwave({ phase }: { phase: Phase }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    const base = phase === "explosion" ? 1 : 0;
    const pulse = phase === "explosion" ? 1 + Math.sin(t * 3.2) * 0.18 : 0;
    const radius = base * 4.3 * pulse;

    meshRef.current.scale.set(radius, radius, radius);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = phase === "explosion" ? 0.2 : 0;
  });

  if (phase !== "explosion") return null;

  return (
    <mesh ref={meshRef}>
      <ringGeometry args={[1.3, 1.5, 72]} />
      <meshBasicMaterial
        color="#00D9FF"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ============================================================================
// SCENE
// ============================================================================

function CinematicScene({ phase }: { phase: Phase }) {
  return (
    <>
      <ambientLight intensity={0.28} />
      <pointLight position={[10, 10, 10]} intensity={2.6} color="#00D9FF" />
      <pointLight position={[-10, -10, -10]} intensity={1.3} color="#3E7EA3" />

      <Stars radius={140} depth={80} count={10000} factor={4.2} saturation={0} fade speed={1.25} />

      <QuantumParticlesBurst phase={phase} />
      <Shockwave phase={phase} />
      <EnergySphere phase={phase} />

      <EffectComposer multisampling={4}>
        <Bloom
          intensity={phase === "explosion" ? 2.6 : 1.2}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[phase === "explosion" ? 0.002 : 0.0006, 0.0004]}
        />
        <Noise opacity={0.06} />
      </EffectComposer>
    </>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CinematicIntro({ onComplete, skipEnabled = true }: CinematicIntroProps) {
  const [phase, setPhase] = useState<Phase>("start");
  const [progress, setProgress] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalDuration = ISABELLA_LINES.reduce((s, l) => s + l.duration, 0) + 8000;

  const initAudio = useCallback(async () => {
    try {
      const audio = new Audio(introAudio);
      audio.volume = 1.0;
      audio.loop = false;
      audioRef.current = audio;
      await audio.play();
    } catch {
      console.log("Audio autoplay blocked");
    }
  }, []);

  useEffect(() => {
    initAudio();
    const timeouts: number[] = [];

    const phases: { name: Phase; delay: number }[] = [
      { name: "start", delay: 0 },
      { name: "particles", delay: 1200 },
      { name: "explosion", delay: 4200 },
      { name: "universe", delay: 7200 },
      { name: "logo", delay: 9000 },
      { name: "message", delay: 11500 },
    ];

    phases.forEach(({ name, delay }) => {
      timeouts.push(window.setTimeout(() => setPhase(name), delay));
    });

    let lineDelay = 11500;
    ISABELLA_LINES.forEach((line, index) => {
      timeouts.push(
        window.setTimeout(() => {
          setCurrentLineIndex(index);
          setDisplayedLines((prev) => [...prev, line.text]);
        }, lineDelay)
      );
      lineDelay += line.duration;
    });

    const progressInterval = window.setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (totalDuration / 50), 100));
    }, 50);

    const completeTimeout = window.setTimeout(() => {
      window.clearInterval(progressInterval);
      setProgress(100);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      window.setTimeout(onComplete, 1000);
    }, totalDuration);

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      window.clearInterval(progressInterval);
      window.clearTimeout(completeTimeout);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [initAudio, onComplete, totalDuration]);

  const handleSkip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: false }}
        camera={{ position: [0, 0, 8], fov: 75 }}
      >
        <CinematicScene phase={phase} />
      </Canvas>

      {/* HUD FRAME */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-[18px] border border-white/6 rounded-[22px] shadow-[0_0_0_1px_rgba(0,217,255,0.15)]" />
      </div>

      {/* LOGO PHASE */}
      <AnimatePresence>
        {(phase === "logo" || phase === "message") && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            <motion.div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-8 border-2 shadow-lg"
              animate={{ rotate: [0, 360], scale: [1, 1.03, 1] }}
              transition={{
                rotate: { duration: 26, repeat: Infinity, ease: "linear" },
                scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                borderColor: "rgba(0,217,255,0.8)",
                boxShadow:
                  "0 0 40px rgba(0,217,255,0.6), 0 0 90px rgba(0,217,255,0.35)",
              }}
            >
              <img src={logoImg} alt="TAMV" className="w-full h-full object-cover" />
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-black tracking-[0.4em] md:tracking-[0.5em] text-center"
              style={{
                background:
                  "linear-gradient(135deg, #00D9FF 0%, #3E7EA3 35%, #C1CBD5 70%, #FFFFFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow:
                  "0 0 50px rgba(0,217,255,0.6), 0 0 120px rgba(0,217,255,0.45)",
              }}
            >
              TAMV MD-X4™
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NARRATIVE LINES */}
      <div className="absolute bottom-24 left-0 right-0 z-30 px-8">
        <AnimatePresence>
          {displayedLines.length > 0 && (
            <motion.div className="max-w-4xl mx-auto text-center">
              {displayedLines.map((line, i) => (
                <motion.p
                  key={i}
                  className={`text-sm md:text-lg font-mono mb-2 ${
                    i === currentLineIndex ? "text-cyan-300" : "text-white/30"
                  }`}
                  style={{
                    letterSpacing: i === currentLineIndex ? "0.3em" : "0.22em",
                    textShadow:
                      i === currentLineIndex
                        ? "0 0 26px rgba(0,217,255,0.75)"
                        : "none",
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-8 left-8 right-8 z-30">
        <div className="h-2 rounded-full overflow-hidden bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #00D9FF 0%, #3E7EA3 40%, #C1CBD5 80%, #FFFFFF 100%)",
              boxShadow: "0 0 20px rgba(0,217,255,0.7)",
            }}
          />
        </div>
      </div>

      {/* SKIP */}
      {skipEnabled && (
        <motion.button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-50 px-5 py-2.5 rounded-full text-xs font-semibold border"
          style={{
            borderColor: "rgba(0,217,255,0.5)",
            color: "rgba(198,241,255,0.9)",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(14px)",
          }}
        >
          SKIP →
        </motion.button>
      )}
    </div>
  );
}
