import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import introAudio from "@/assets/intro.mp3";
import logoImg from "@/assets/LOGOTAMV2.jpg";

interface CinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
  autoStart?: boolean;
}

const TOTAL_DURATION = 40;
const MAX_INTRO_TIME = 58000;
const FRAME_STEP = 1000 / 24;

type SceneId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type VFXMode = "void" | "awaken" | "crisis" | "expand" | "reveal" | "ascend" | "declare";

const TOTAL_DURATION = 34;
const MAX_INTRO_TIME = 45000;

const CHAPTERS: Chapter[] = [
  {
    id: "genesis",
    start: 0,
    end: 6,
    title: "TAMV ONLINE",
    subtitle: "Un nuevo gigante digital acaba de nacer.",
    aura: "from-cyan-400/40 via-blue-500/20 to-transparent",
  },
  {
    id: "pulse",
    start: 6,
    end: 13,
    title: "INTELIGENCIA CIVILIZATORIA",
    subtitle: "Convergencia de comunidad, IA y operaciones en tiempo real.",
    aura: "from-fuchsia-500/45 via-violet-500/20 to-transparent",
  },
  {
    id: "command",
    start: 13,
    end: 21,
    title: "CONTROL · SEGURIDAD · ESCALA",
    subtitle: "Arquitectura soberana diseñada para rendimiento global.",
    aura: "from-emerald-400/40 via-teal-500/20 to-transparent",
  },
  {
    id: "future",
    start: 21,
    end: 29,
    title: "EL FUTURO YA ESTÁ EN LÍNEA",
    subtitle: "Futurismo elegante con experiencia premium AAA.",
    aura: "from-amber-300/35 via-orange-400/25 to-transparent",
  },
  {
    id: "enter",
    start: 29,
    end: 34,
    title: "BIENVENIDO A TAMV",
    subtitle: "Ingresa al nuevo estándar digital.",
    aura: "from-primary/55 via-primary/20 to-transparent",
  },
];

const INTRO_POINTS = [
  "Render optimizado para baja latencia",
  "Narrativa cinematográfica en capítulos",
  "Sistema visual adaptativo para distintos dispositivos",
];

const chapterByTime = (time: number) =>
  CHAPTERS.find((chapter) => time >= chapter.start && time < chapter.end) ?? CHAPTERS[CHAPTERS.length - 1];

const FuturisticBackdrop = ({ time }: { time: number }) => {
  const pulse = useMemo(() => 0.45 + Math.sin(time * 0.6) * 0.15, [time]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#030712]" />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 15% 20%, rgba(56,189,248,${pulse}) 0%, transparent 35%),
            radial-gradient(circle at 85% 30%, rgba(168,85,247,${pulse * 0.9}) 0%, transparent 38%),
            radial-gradient(circle at 55% 85%, rgba(16,185,129,${pulse * 0.7}) 0%, transparent 30%)`,
        }}
      />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
      }} />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)",
          transform: "translateX(-20%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
    </div>
  );
};

export default function CinematicIntro({ onComplete, skipEnabled, autoStart }: CinematicIntroProps) {
  const [started, setStarted] = useState(!!autoStart);
  const [time, setTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const progress = useSpring(0, { stiffness: 40, damping: 20 });
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const watchdogRef = useRef<number | null>(null);

  useEffect(() => {
    if (!accepted || completed) return;
    let lastTime = performance.now();
    let accumulator = 0;
    let frameId: number;

    const loop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      accumulator += now - lastTime;
      lastTime = now;
      if (document.visibilityState === "visible" && (accumulator >= FRAME_STEP || delta > 0.2)) {
        accumulator = 0;
        setTime(prev => {
          const next = prev + delta;
          if (next >= TOTAL_DURATION) {
            setCompleted(true);
            return TOTAL_DURATION;
          }
          return next;
        });
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    if (watchdogRef.current) clearTimeout(watchdogRef.current);
    watchdogRef.current = window.setTimeout(() => setCompleted(true), MAX_INTRO_TIME);

    return () => {
      cancelAnimationFrame(frameId);
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
    };
  }, [accepted, completed]);

  const chapter = chapterByTime(time);

  const startAudio = useCallback(async () => {
    try {
      const audio = new Audio(introAudio);
      audio.preload = "auto";
      audio.volume = 0.6;
      audio.preload = "auto";
      audioRef.current = audio;
      await audio.play();
    } catch {
      // silent fallback for autoplay restrictions
    }
  }, []);

  useEffect(() => {
    [heroCity, aiNetwork, securityShield, metaverseSpace, university, walletCrypto, logoImg].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const scene = useMemo<SceneId>(() => {
    for (let i = 0; i < SCENE_CONFIG.length; i++) {
      if (time < SCENE_CONFIG[i].end) return i as SceneId;
    }
    return 7;
  }, [time]);

  const currentMode = SCENE_CONFIG[scene]?.mode ?? "declare";
  const vfxIntensity = useMemo(() => {
    if (reducedMotion) return 0.2;
    if (scene === 0) return Math.min(time / 3, 0.8);
    if (scene === 2) return 1;
    return 0.6 + Math.sin(time * 0.5) * 0.15;
  }, [reducedMotion, scene, time]);

  useEffect(() => {
    progress.set(Math.min(time / TOTAL_DURATION, 1));
  }, [progress, time]);

  useEffect(() => {
    if (!completed) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onComplete();
  }, [completed, onComplete]);

  if (!started) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#02040a] flex items-center justify-center overflow-hidden">
        <FuturisticBackdrop time={0} />
        <div className="relative z-10 text-center px-6">
          <motion.img
            src={logoImg}
            alt="TAMV"
            className="w-24 h-24 mx-auto rounded-2xl ring-1 ring-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          />
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-8 text-4xl md:text-6xl font-black tracking-[0.3em] text-white"
          >
            TAMV
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-4 text-xs uppercase tracking-[0.4em] text-white/60"
          >
            Trailer de bienvenida · Estándar AAA
          </motion.p>
          <motion.button
            onClick={() => {
              setStarted(true);
              void startAudio();
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-10 rounded-full border border-white/25 px-10 py-4 text-xs uppercase tracking-[0.35em] text-white bg-white/5 backdrop-blur hover:bg-white/10 transition"
          >
            Iniciar experiencia
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black text-white select-none">
      <FuturisticBackdrop time={time} />

      <div className={`absolute inset-0 bg-gradient-to-r ${chapter.aura}`} />

      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-20 flex items-center justify-center px-6"
        >
          <div className="max-w-4xl text-center">
            <p className="text-[10px] uppercase tracking-[0.55em] text-white/60">TAMV DIGITAL NEXUS</p>
            <h2 className="mt-4 text-3xl md:text-6xl font-black tracking-[0.08em] leading-tight">{chapter.title}</h2>
            <p className="mt-4 text-sm md:text-xl text-white/75">{chapter.subtitle}</p>

            <div className="mt-10 grid gap-2 md:grid-cols-3">
              {INTRO_POINTS.map((point) => (
                <div key={point} className="rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-xs tracking-wide text-white/80">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-0 left-0 w-full h-[3px] bg-white/10 z-30">
        <motion.div className="h-full bg-gradient-to-r from-cyan-300 via-violet-400 to-emerald-300" style={{ width: progressWidth }} />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {CHAPTERS.map((entry) => {
          const active = entry.id === chapter.id;
          return <div key={entry.id} className={`h-1.5 rounded-full transition-all ${active ? "w-8 bg-white" : "w-2 bg-white/35"}`} />;
        })}
      </div>

      {skipEnabled !== false && (
        <button
          onClick={() => setCompleted(true)}
          className="absolute bottom-8 right-8 z-30 text-[10px] uppercase tracking-[0.4em] text-white/55 hover:text-white"
        >
          Saltar intro
        </button>
      )}
    </div>
  );
}
