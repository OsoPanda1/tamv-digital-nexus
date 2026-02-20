// ============================================================================
// TAMV MD-X4™ - Epic Cinematic Intro
// Full 3D particles, energy sphere, explosion effects + intro.mp3
// ============================================================================

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import introAudio from "@/assets/intro.mp3";
import logoImg from "@/assets/LOGOTAMV2.jpg";

type Phase = "start" | "particles" | "explosion" | "universe" | "logo" | "message";

interface CinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
}

const ISABELLA_LINES: { text: string; duration: number }[] = [
  { text: "PROTOCOLO DE INMERSIÓN ACTIVADO...", duration: 2800 },
  { text: "BIENVENIDO A UNA NUEVA ERA DIGITAL.", duration: 3500 },
  { text: "LATINOAMÉRICA HA DESPERTADO.", duration: 3000 },
  { text: "TAMV MD-X4™ · ECOSISTEMA CIVILIZATORIO NEXT-GEN", duration: 4000 },
];

// ============================================================================
// 3D Components
// ============================================================================

function QuantumParticlesBurst({ phase }: { phase: Phase }) {
  const ref = useRef<THREE.Points>(null);
  const count = 5000;

  const positions = useRef(new Float32Array(count * 3));
  const velocities = useRef(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.5 + Math.random() * 2;
      positions.current[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions.current[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions.current[i3 + 2] = r * Math.cos(phi);

      velocities.current[i3] = (Math.random() - 0.5) * 0.08;
      velocities.current[i3 + 1] = (Math.random() - 0.5) * 0.08;
      velocities.current[i3 + 2] = (Math.random() - 0.5) * 0.08;
    }
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const geom = ref.current.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const isExploding = phase === "explosion" || phase === "universe" || phase === "logo" || phase === "message";
    const speed = isExploding ? 0.15 : 0.01;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += velocities.current[i3] * speed;
      arr[i3 + 1] += velocities.current[i3 + 1] * speed;
      arr[i3 + 2] += velocities.current[i3 + 2] * speed;
    }
    posAttr.needsUpdate = true;

    ref.current.rotation.y = t * 0.1;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.1;
  });

  return (
    <Points ref={ref} positions={positions.current} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00D9FF"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function EnergySphere({ phase }: { phase: Phase }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scale = phase === "start" ? 0.5 : phase === "particles" ? 1.5 : phase === "explosion" ? 4 : 0;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const targetScale = scale;
    const current = meshRef.current.scale.x;
    const newScale = current + (targetScale - current) * 0.03;
    meshRef.current.scale.set(newScale, newScale, newScale);
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.rotation.x = t * 0.3;
  });

  if (phase === "universe" || phase === "logo" || phase === "message") return null;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 4]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={1.5}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

function CinematicScene({ phase }: { phase: Phase }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#00D9FF" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#3E7EA3" />
      <Stars radius={100} depth={50} count={8000} factor={4} saturation={0} fade speed={1} />
      <QuantumParticlesBurst phase={phase} />
      <EnergySphere phase={phase} />
    </>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function CinematicIntro({ onComplete, skipEnabled = true }: CinematicIntroProps) {
  const [phase, setPhase] = useState<Phase>("start");
  const [progress, setProgress] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalDuration = ISABELLA_LINES.reduce((sum, l) => sum + l.duration, 0) + 5000;

  const initAudio = useCallback(async () => {
    try {
      const audio = new Audio(introAudio);
      audio.volume = 0.5;
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
      { name: "particles", delay: 800 },
      { name: "explosion", delay: 3500 },
      { name: "universe", delay: 5000 },
      { name: "logo", delay: 7000 },
      { name: "message", delay: 8500 },
    ];

    phases.forEach(({ name, delay }) => {
      timeouts.push(window.setTimeout(() => setPhase(name), delay));
    });

    let lineDelay = 9000;
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
      window.setTimeout(onComplete, 600);
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
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }} className="absolute inset-0">
        <CinematicScene phase={phase} />
      </Canvas>

      {/* Radial glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(0,217,255,${
            phase === "explosion" ? 0.15 : 0.05
          }) 0%, transparent 60%)`,
          transition: "background 1s ease",
        }}
      />

      {/* Logo Phase */}
      <AnimatePresence>
        {(phase === "logo" || phase === "message") && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.div
              className="w-28 h-28 rounded-full overflow-hidden mb-6 border-2 shadow-lg"
              style={{
                borderColor: "hsl(var(--primary))",
                boxShadow: "0 0 40px rgba(0,217,255,0.4), 0 0 80px rgba(0,217,255,0.2)",
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <img src={logoImg} alt="TAMV" className="w-full h-full object-cover" />
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-black tracking-wider mb-4"
              style={{
                background: "linear-gradient(135deg, #00D9FF, #3E7EA3, #C1CBD5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 60px rgba(0,217,255,0.3)",
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              TAMV MD-X4™
            </motion.h1>

            <motion.p
              className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Ecosistema Civilizatorio Next-Gen
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Isabella Narrative Lines */}
      <div className="absolute bottom-24 left-0 right-0 z-30 px-8">
        <AnimatePresence>
          {displayedLines.length > 0 && (
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {displayedLines.map((line, i) => (
                <motion.p
                  key={i}
                  className={`text-sm md:text-base font-mono mb-2 ${
                    i === currentLineIndex ? "text-primary" : "text-muted-foreground/50"
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={
                    i === currentLineIndex
                      ? { textShadow: "0 0 20px rgba(0,217,255,0.5)" }
                      : {}
                  }
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-8 left-8 right-8 z-30">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #00D9FF, #3E7EA3)",
              boxShadow: "0 0 10px rgba(0,217,255,0.5)",
            }}
          />
        </div>
      </div>

      {/* Skip Button */}
      {skipEnabled && (
        <motion.button
          className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full text-xs font-medium border transition-all"
          style={{
            borderColor: "rgba(0,217,255,0.3)",
            color: "rgba(0,217,255,0.7)",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
          }}
          onClick={handleSkip}
          whileHover={{ scale: 1.05, borderColor: "rgba(0,217,255,0.6)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          SKIP →
        </motion.button>
      )}
    </div>
  );
}

export default CinematicIntro;
