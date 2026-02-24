// ============================================================================
// TAMV MD-X4™ - Epic Quantum Cinematic Intro v2
// Full 3D particles, energy sphere, shockwave, HUD overlays + intro.mp3
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
  const count = 7000;

  const positions = useRef(new Float32Array(count * 3));
  const velocities = useRef(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.3 + Math.random() * 2.5;

      positions.current[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions.current[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions.current[i3 + 2] = r * Math.cos(phi);

      const baseVel = 0.06 + Math.random() * 0.06;
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

    const speed = isExploding ? 0.25 : 0.015;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += velocities.current[i3] * speed;
      arr[i3 + 1] += velocities.current[i3 + 1] * speed;
      arr[i3 + 2] += velocities.current[i3 + 2] * speed;
    }

    posAttr.needsUpdate = true;

    ref.current.rotation.y = t * 0.18;
    ref.current.rotation.x = Math.sin(t * 0.45) * 0.22;
  });

  return (
    <Points ref={ref} positions={positions.current} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#7DF3FF"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function EnergySphere({ phase }: { phase: Phase }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    const targetScale =
      phase === "start"
        ? 0.7
        : phase === "particles"
        ? 1.6
        : phase === "explosion"
        ? 4.5
        : 0;

    const current = meshRef.current.scale.x;
    const newScale = current + (targetScale - current) * 0.05;

    meshRef.current.scale.set(newScale, newScale, newScale);
    meshRef.current.rotation.y = t * 0.7;
    meshRef.current.rotation.x = t * 0.4;
  });

  if (phase === "universe" || phase === "logo" || phase === "message") return null;

  return (
    <Float speed={2.4} rotationIntensity={0.7} floatIntensity={0.7}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 5]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={2}
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  );
}

function Shockwave({ phase }: { phase: Phase }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    const base = phase === "explosion" ? 1 : 0;
    const pulse = phase === "explosion" ? 1 + Math.sin(t * 3) * 0.15 : 0;
    const radius = base * 4 * pulse;

    meshRef.current.scale.set(radius, radius, radius);
    meshRef.current.material.opacity = phase === "explosion" ? 0.18 : 0;
  });

  if (phase !== "explosion") return null;

  return (
    <mesh ref={meshRef}>
      <ringGeometry args={[1.2, 1.4, 64]} />
      <meshBasicMaterial
        color="#00D9FF"
        transparent
        opacity={0.18}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CinematicScene({ phase }: { phase: Phase }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} intensity={2.4} color="#00D9FF" />
      <pointLight position={[-10, -10, -10]} intensity={1.2} color="#3E7EA3" />
      <Stars radius={130} depth={70} count={9000} factor={4} saturation={0} fade speed={1.2} />
      <QuantumParticlesBurst phase={phase} />
      <Shockwave phase={phase} />
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
      audio.volume = 0.7;
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
      { name: "particles", delay: 900 },
      { name: "explosion", delay: 3700 },
      { name: "universe", delay: 5500 },
      { name: "logo", delay: 7500 },
      { name: "message", delay: 9500 },
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

      {/* Radial glow + chromatic haze */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(0,217,255,${
            phase === "explosion" ? 0.2 : 0.08
          }) 0%, transparent 60%)`,
          transition: "background 1s ease",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, rgba(0,217,255,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 100%, rgba(62,126,163,0.18) 0%, transparent 45%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Scanlines + grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.22]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.03) 1px, transparent 2px)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
          mixBlendMode: "soft-light",
        }}
      />

      {/* HUD frame */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-[18px] border border-white/5 rounded-[22px] shadow-[0_0_0_1px_rgba(0,217,255,0.12)]" />
        <div className="absolute inset-x-[18px] top-[18px] flex justify-between text-[10px] tracking-[0.25em] uppercase text-white/20 px-4">
          <span>TAMV MD-X4™ · ISABELLA CHANNEL</span>
          <span>PROTOCOL: IMMERSION · STATUS: ONLINE</span>
        </div>
        <div className="absolute inset-x-[18px] bottom-[18px] flex justify-between text-[10px] tracking-[0.25em] uppercase text-white/20 px-4">
          <span>LATAM NODE</span>
          <span>MSR · THE SOF · UTAMV</span>
        </div>
      </div>

      {/* Logo Phase */}
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
              className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-6 border-2 shadow-lg relative"
              style={{
                borderColor: "rgba(0,217,255,0.7)",
                boxShadow:
                  "0 0 40px rgba(0,217,255,0.5), 0 0 80px rgba(0,217,255,0.25), 0 0 140px rgba(0,217,255,0.25)",
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            >
              <img src={logoImg} alt="TAMV" className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.25)_0%,transparent_35%)]" />
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-black tracking-[0.35em] md:tracking-[0.45em] mb-4 text-center"
              style={{
                background:
                  "linear-gradient(135deg, #00D9FF 0%, #3E7EA3 35%, #C1CBD5 70%, #FFFFFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow:
                  "0 0 40px rgba(0,217,255,0.45), 0 0 90px rgba(0,217,255,0.35), 0 0 140px rgba(0,217,255,0.3)",
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.0 }}
            >
              TAMV MD-X4™
            </motion.h1>

            <motion.p
              className="text-[0.75rem] md:text-xs tracking-[0.6em] uppercase text-white/40"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 1.5 }}
            >
              ECOSISTEMA CIVILIZATORIO LATINOAMERICANO NEXT-GEN
            </motion.p>

            <motion.div
              className="mt-4 flex items-center gap-3 text-[0.65rem] md:text-[0.7rem] text-white/30 tracking-[0.25em] uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span>LATAM · MSR · THE SOF · UTAMV</span>
              <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </motion.div>
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
                  className={`text-xs md:text-sm font-mono mb-1.5 md:mb-2 ${
                    i === currentLineIndex ? "text-cyan-300" : "text-white/25"
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  style={
                    i === currentLineIndex
                      ? {
                          textShadow:
                            "0 0 20px rgba(0,217,255,0.65), 0 0 40px rgba(0,217,255,0.4)",
                          letterSpacing: "0.25em",
                        }
                      : { letterSpacing: "0.2em" }
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
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #00D9FF 0%, #3E7EA3 40%, #C1CBD5 80%, #FFFFFF 100%)",
              boxShadow:
                "0 0 12px rgba(0,217,255,0.6), 0 0 24px rgba(0,217,255,0.35), 0 0 40px rgba(0,217,255,0.25)",
            }}
          />
        </div>
      </div>

      {/* Skip Button */}
      {skipEnabled && (
        <motion.button
          className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full text-[0.65rem] font-medium border transition-all"
          style={{
            borderColor: "rgba(0,217,255,0.45)",
            color: "rgba(198,241,255,0.85)",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
          }}
          onClick={handleSkip}
          whileHover={{
            scale: 1.08,
            borderColor: "rgba(0,217,255,0.8)",
            boxShadow: "0 0 24px rgba(0,217,255,0.6)",
          }}
          whileTap={{ scale: 0.94 }}
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
