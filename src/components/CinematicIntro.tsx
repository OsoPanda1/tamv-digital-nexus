// ============================================================================
// TAMV MD-X4™ - Epic Cinematic Intro
// Immersive visual experience with synchronized audio and voice
// ============================================================================

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Points,
  PointMaterial,
  Sphere,
  Float,
  Stars,
  MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// Types
// ============================================================================

type Phase =
  | "start"
  | "particles"
  | "explosion"
  | "universe"
  | "logo"
  | "message";

interface CinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
}

// ============================================================================
// Isabella Voice Lines - Epic Civilizatory Message
// ============================================================================

const ISABELLA_LINES: { text: string; duration: number }[] = [
  { text: "PROTOCOLO DE INMERSIÓN ACTIVADO...", duration: 2800 },
  { text: "BIENVENIDO. ESTÁS POR SER PARTE DE UNA NUEVA ERA DIGITAL.", duration: 4500 },
  { text: "DURANTE MUCHO TIEMPO FUIMOS CONSIDERADOS CONSUMIDORES DE TECNOLOGÍA.", duration: 5000 },
  { text: "HOY DESEAMOS ANUNCIAR AL MUNDO QUE SOMOS MÁS QUE ESO:", duration: 4200 },
  { text: "UNA NUEVA ERA DIGITAL HA DADO COMIENZO, Y LATINOAMÉRICA ES QUIEN LA LIDERA.", duration: 5500 },
  {
    text:
      "2025. LATINOAMÉRICA HA DESPERTADO Y HACE UN LLAMADO A TODOS SUS SOÑADORES Y VISIONARIOS " +
      "PARA COMENZAR EL ASCENSO A LA CIMA DEL ÉXITO...",
    duration: 7500,
  },
];

// ============================================================================
// Audio System with Reverb and Echo Effects
// ============================================================================

class EpicAudioSystem {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private delayNode: DelayNode | null = null;
  private bgMusic: HTMLAudioElement | null = null;
  private musicSource: MediaElementAudioSourceNode | null = null;
  private musicGain: GainNode | null = null;

  async initialize() {
    if (this.audioContext) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(this.audioContext.destination);

    // Reverb
    this.reverbNode = this.audioContext.createConvolver();
    const reverbBuffer = this.createReverbImpulse(2.5, 2.0);
    this.reverbNode.buffer = reverbBuffer;
    this.reverbNode.connect(this.masterGain);

    // Delay / echo
    this.delayNode = this.audioContext.createDelay(1.0);
    this.delayNode.delayTime.value = 0.3;
    const feedbackGain = this.audioContext.createGain();
    feedbackGain.gain.value = 0.4;
    this.delayNode.connect(feedbackGain);
    feedbackGain.connect(this.delayNode);
    this.delayNode.connect(this.masterGain);
  }

  private createReverbImpulse(duration: number, decay: number): AudioBuffer {
    if (!this.audioContext) throw new Error("AudioContext not initialized");

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] =
          (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }

    return buffer;
  }

  async playBackgroundMusic(url: string, volume: number = 0.4) {
    if (!this.audioContext) await this.initialize();

    this.bgMusic = new Audio(url);
    this.bgMusic.loop = true;
    this.bgMusic.volume = volume;

    if (this.audioContext && this.masterGain) {
      this.musicSource = this.audioContext.createMediaElementSource(
        this.bgMusic
      );
      this.musicGain = this.audioContext.createGain();
      this.musicGain.gain.value = volume;
      this.musicSource.connect(this.musicGain);
      this.musicGain.connect(this.masterGain);
    }

    try {
      await this.bgMusic.play();
    } catch {
      console.log("Background music autoplay blocked");
    }
  }

  playHumanVoice(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      onEnd?: () => void;
    } = {}
  ) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const spanishVoices = voices.filter(
      (v) =>
        v.lang.startsWith("es") &&
        (v.name.includes("Google") ||
          v.name.includes("Microsoft") ||
          v.localService)
    );

    if (spanishVoices.length > 0) {
      const femaleVoice = spanishVoices.find((v) => {
        const name = v.name.toLowerCase();
        return (
          name.includes("female") ||
          name.includes("mujer") ||
          name.includes("sabina") ||
          name.includes("helena")
        );
      });
      utterance.voice = femaleVoice || spanishVoices[0];
    }

    utterance.lang = "es-MX";
    utterance.rate = options.rate ?? 0.92;
    utterance.pitch = options.pitch ?? 0.95;
    utterance.volume = options.volume ?? 1.0;

    utterance.onend = () => {
      options.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  playExplosionSound() {
    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      30,
      this.audioContext.currentTime + 0.5
    );

    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.8
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.reverbNode || this.masterGain);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.8);
  }

  playWhooshSound() {
    if (!this.audioContext || !this.masterGain) return;

    const bufferSize = this.audioContext.sampleRate * 0.5;
    const buffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate
    );
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.5
    );

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start();
  }

  setMusicVolume(volume: number) {
    if (this.musicGain) {
      this.musicGain.gain.value = volume;
    }
    if (this.bgMusic) {
      this.bgMusic.volume = volume;
    }
  }

  stopAll() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

const audioSystem = new EpicAudioSystem();

// ============================================================================
// 3D Scene Components
// ============================================================================

function QuantumParticles({ phase }: { phase: Phase }) {
  const ref = useRef<THREE.Points>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);
  const [colors, setColors] = useState<Float32Array | null>(null);

  useEffect(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 50 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      const t = Math.random();
      col[i3] = t * 0.6; // R
      col[i3 + 1] = 0.85 - t * 0.4; // G
      col[i3 + 2] = 1.0; // B
    }

    setPositions(pos);
    setColors(col);
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.y = t * 0.05;
      ref.current.rotation.x = Math.sin(t * 0.03) * 0.1;
    }
  });

  if (!positions || !colors) return null;

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        vertexColors
        size={0.15}
        sizeAttenuation
        transparent
        opacity={phase === "particles" ? 0.9 : 0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function EnergySphere({ phase, time }: { phase: Phase; time: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.rotation.z = t * 0.1;
    }
  });

  const scale =
    phase === "explosion"
      ? 1 + time * 2
      : phase === "universe"
      ? 3 + time * 0.5
      : 1;
  const opacity = phase === "explosion" ? 0.8 - time * 0.3 : 0.4;

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]} scale={scale}>
      <MeshDistortMaterial
        color="#00F7FF"
        emissive="#00F7FF"
        emissiveIntensity={2}
        transparent
        opacity={opacity}
        distort={0.4}
        speed={2}
        wireframe
      />
    </Sphere>
  );
}

function GoldenCore({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.y = t * 0.3;
      ref.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
  });

  if (!visible) return null;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={ref}>
        <Sphere args={[1.5, 64, 64]}>
          <MeshDistortMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={1.5}
            transparent
            opacity={0.9}
            distort={0.2}
            speed={3}
          />
        </Sphere>
        <mesh>
          <torusKnotGeometry args={[2, 0.3, 128, 16, 2, 3]} />
          <meshPhysicalMaterial
            color="#FFD700"
            emissive="#FFA500"
            emissiveIntensity={2}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}

function UniverseExpansion({ phase }: { phase: Phase }) {
  const [stars, setStars] = useState<Float32Array | null>(null);

  useEffect(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 200 + 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }

    setStars(positions);
  }, []);

  if (!stars || !["explosion", "universe", "logo", "message"].includes(phase))
    return null;

  return (
    <Points positions={stars} stride={3}>
      <PointMaterial
        color="#ffffff"
        size={0.5}
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function CameraController({ phase }: { phase: Phase }) {
  const { camera } = useThree();

  useEffect(() => {
    if (phase === "start") {
      camera.position.set(0, 0, 50);
    } else if (phase === "explosion") {
      let frame: number;
      const animate = () => {
        camera.position.z = Math.min(camera.position.z + 0.5, 80);
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    } else if (phase === "logo" || phase === "message") {
      camera.position.z = 30;
    }
  }, [phase, camera]);

  return null;
}

// ============================================================================
// Main Cinematic Intro Component
// ============================================================================

export function CinematicIntro({
  onComplete,
  skipEnabled = true,
}: CinematicIntroProps) {
  const [phase, setPhase] = useState<Phase>("start");
  const [progress, setProgress] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [time, setTime] = useState(0);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const totalDuration =
    ISABELLA_LINES.reduce((sum, line) => sum + line.duration, 0) + 3000;

  // Initialize audio on mount (usuario debe haber interactuado antes para evitar bloqueo)
  const initializeAudio = useCallback(async () => {
    if (audioInitialized) return;
    try {
      await audioSystem.initialize();
      setAudioInitialized(true);
      // Ejemplo: activa música si tienes el archivo listo
      // await audioSystem.playBackgroundMusic("/audio/techno-house-intro.mp3", 0.35);
    } catch (e) {
      console.log("Audio initialization failed:", e);
    }
  }, [audioInitialized]);

  // Main sequence
  useEffect(() => {
    initializeAudio();

    const timeouts: number[] = [];

    const phases: { name: Phase; delay: number }[] = [
      { name: "start", delay: 0 },
      { name: "particles", delay: 500 },
      { name: "explosion", delay: 3000 },
      { name: "universe", delay: 4500 },
      { name: "logo", delay: 7000 },
      { name: "message", delay: 8000 },
    ];

    phases.forEach(({ name, delay }) => {
      const id = window.setTimeout(() => {
        setPhase(name);
        if (name === "explosion") {
          audioSystem.playExplosionSound();
        }
        if (name === "logo") {
          audioSystem.playWhooshSound();
        }
      }, delay);
      timeouts.push(id);
    });

    let currentDelay = 1000;
    ISABELLA_LINES.forEach((line, index) => {
      const id = window.setTimeout(() => {
        setCurrentLineIndex(index);
        setDisplayedLines((prev) => [...prev, line.text]);
        audioSystem.playHumanVoice(line.text, {
          rate: 0.9,
          pitch: 0.92,
          volume: 1.0,
        });
      }, currentDelay);
      timeouts.push(id);
      currentDelay += line.duration;
    });

    const progressInterval = window.setInterval(() => {
      setProgress((prev) =>
        Math.min(prev + 100 / (totalDuration / 50), 100)
      );
    }, 50);

    const completeTimeout = window.setTimeout(() => {
      window.clearInterval(progressInterval);
      setProgress(100);
      audioSystem.stopAll();
      window.setTimeout(onComplete, 500);
    }, totalDuration);

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      window.clearInterval(progressInterval);
      window.clearTimeout(completeTimeout);
      audioSystem.stopAll();
    };
  }, [initializeAudio, onComplete, totalDuration]);

  // Time tracker for animations
  useEffect(() => {
    let mounted = true;
    let last = performance.now();

    const loop = (now: number) => {
      if (!mounted) return;
      const delta = (now - last) / 1000;
      last = now;
      setTime((t) => t + delta);
      requestAnimationFrame(loop);
    };

    const frame = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  const handleSkip = () => {
    audioSystem.stopAll();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 50], fov: 60 }}
        style={{ width: "100vw", height: "100vh" }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 50, 200]} />

        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00F7FF" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FFD700" />

        <CameraController phase={phase} />

        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {phase !== "start" && <QuantumParticles phase={phase} />}

        {(phase === "explosion" || phase === "universe") && (
          <EnergySphere phase={phase} time={time} />
        )}

        <UniverseExpansion phase={phase} />

        {(phase === "logo" || phase === "message") && <GoldenCore visible />}
      </Canvas>

      {/* Text Overlay */}
      <AnimatePresence>
        {phase === "message" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
          >
            <div className="text-center px-6 max-w-4xl space-y-4">
              {displayedLines.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className={`font-medium tracking-wide ${
                    index === currentLineIndex
                      ? "text-2xl md:text-4xl"
                      : "text-lg md:text-2xl opacity-70"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, #00F7FF 0%, #FFD700 50%, #FF6B9D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 40px rgba(0, 247, 255, 0.5)",
                    filter:
                      index === currentLineIndex
                        ? "drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))"
                        : "none",
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar + Logo */}
      <motion.div
        className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-full max-w-md px-8">
          <div
            className="relative h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255, 255, 255, 0.1)" }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #00F7FF, #FFD700, #FF6B9D)",
                boxShadow: "0 0 20px rgba(0, 247, 255, 0.5)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === "logo" || phase === "message" ? 1 : 0,
            }}
          >
            <span
              className="text-2xl md:text-3xl font-bold tracking-widest"
              style={{
                background: "linear-gradient(90deg, #FFD700, #FFA500)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              TAMV MD-X4™
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Skip Button */}
      {skipEnabled && (
        <motion.button
          className="fixed top-6 right-6 z-50 px-4 py-2 rounded-lg border border-white/20 bg-black/50 text-white/70 text-sm hover:bg-white/10 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={handleSkip}
        >
          Saltar →
        </motion.button>
      )}

      {/* Vignette Effect */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  );
}

export default CinematicIntro;
