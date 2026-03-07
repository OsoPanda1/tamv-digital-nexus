// ============================================================================
// TAMV MD-X4™ CINEMATIC INTRO – Creator LATAM Edition
// Autor visionario y propietario: Edwin Oswaldo Castillo Trejo
// Dedicatoria: Para mi madre, Reina Trejo Serrano ✦
// ============================================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import introAudio from "@/assets/intro.mp3";
import logoImg from "@/assets/LOGOTAMV2.jpg";

interface CinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
  autoStart?: boolean;
}

const TOTAL_DURATION = 22;
const MAX_INTRO_TIME = 25000;

// Grain overlay
const CinematicOverlay: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden opacity-[0.04] mix-blend-soft-light">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
  </div>
);

// Permission gate
const PermissionGate: React.FC<{ onAccept: () => void }> = ({ onAccept }) => (
  <motion.div
    className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center"
    exit={{ opacity: 0, filter: "blur(20px)" }}
    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute inset-0 blur-2xl bg-white/5 rounded-full" />
      <img
        src={logoImg}
        alt="TAMV"
        className="w-24 h-24 object-contain rounded-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-1000"
      />
    </motion.div>

    <div className="mt-8 text-center">
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-white font-black text-4xl tracking-[0.3em] mb-2 italic"
      >
        TAMV
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-white/30 text-[10px] uppercase tracking-[0.5em] font-light"
      >
        La nueva casa de los creadores inconformes de LATAM
      </motion.p>
    </div>

    <motion.button
      onClick={onAccept}
      className="mt-10 group relative py-3 px-10 overflow-hidden border border-white/20 rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      whileHover={{ borderColor: "rgba(255,255,255,0.6)" }}
    >
      <span className="relative z-10 text-white text-[10px] tracking-[0.35em] uppercase group-hover:text-black transition-colors">
        Iniciar secuencia
      </span>
      <motion.div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
    </motion.button>
  </motion.div>
);

// ============================================================================
// SCENES
// ============================================================================

type SceneId = 0 | 1 | 2 | 3 | 4;

// Scene 0: Logo + tagline
const SceneLogoIntro: React.FC = () => (
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center bg-black"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        filter: [
          "drop-shadow(0 0 0px #fff)",
          "drop-shadow(0 0 20px rgba(255,255,255,0.16))",
          "drop-shadow(0 0 0px #fff)",
        ],
      }}
      transition={{ duration: 6, repeat: Infinity }}
    >
      <img src={logoImg} alt="TAMV" className="w-28 h-28 rounded-3xl object-contain mb-6" />
    </motion.div>
    <h2 className="text-white/80 text-base font-light tracking-[0.4em] uppercase">
      Creator Economy / LATAM 2026
    </h2>
    <p className="mt-4 text-xs text-white/40 max-w-xs text-center tracking-[0.2em] uppercase">
      No venimos a pedir espacio. Venimos a construirlo.
    </p>
  </motion.div>
);

// Scene 1: The problem
const SceneCollapse: React.FC = () => (
  <motion.div
    className="absolute inset-0 flex flex-col md:flex-row bg-black"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex-1 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10 px-6 py-10">
      <div className="max-w-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-3">
          LA REALIDAD HOY
        </p>
        <p className="text-sm text-white/70">
          18.9M creadores en LATAM viviendo bajo algoritmos que priorizan anuncios, no
          comunidades.
        </p>
        <p className="mt-3 text-xs text-red-500/80 uppercase tracking-[0.3em]">
          La mayoría cobra centavos por horas de trabajo creativo.
        </p>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="max-w-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-3">
          EL COSTO OCULTO
        </p>
        <p className="text-sm text-white/70">
          Datos personales extraídos, decisiones tomadas por modelos cerrados y cero control
          sobre el destino de tu comunidad.
        </p>
        <p className="mt-3 text-xs text-white/50">
          El TAMV nace como infraestructura de escape, no como otra timeline infinita.
        </p>
      </div>
    </div>
  </motion.div>
);

// Scene 2: MD-X4 Architecture
const SceneRingLabel: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
  <div className={"absolute text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/60 " + (className ?? "")}>
    {label}
  </div>
);

const SceneCoreMDX4: React.FC = () => (
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center bg-radial from-[#0b0219] via-black to-black"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="relative h-64 w-64 sm:h-80 sm:w-80">
      <div className="absolute inset-10 rounded-full border border-white/10" />
      <div className="absolute inset-16 rounded-full border border-[#ff4f9a]/35" />
      <div className="absolute inset-[5.5rem] rounded-full border border-[#4ff6ff]/35" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-3xl sm:text-4xl font-semibold tracking-[0.25em]">TAMV</div>
      </div>
      <SceneRingLabel label="Identidad" className="top-2 left-1/2 -translate-x-1/2" />
      <SceneRingLabel label="Membresías" className="right-2 top-1/2 -translate-y-1/2" />
      <SceneRingLabel label="Economía" className="bottom-2 left-1/2 -translate-x-1/2" />
      <SceneRingLabel label="IA" className="left-2 top-1/2 -translate-y-1/2" />
    </div>
    <p className="mt-6 max-w-xl text-center text-sm sm:text-base text-white/70">
      Arquitectura MD‑X4: identidad, comunidad, monetización e IA alineados para servir al creador.
    </p>
  </motion.div>
);

// Scene 3: Creator impact dashboard
const SceneCreatorImpact: React.FC = () => (
  <motion.div
    className="absolute inset-0 flex flex-col md:flex-row bg-black"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex-1 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
      <div className="max-w-sm p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">
          CREATOR HUD · EJEMPLO
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
          <div className="flex justify-between text-xs text-white/70">
            <span>Creador LATAM · Nivel 3</span>
            <span className="text-white/50">TAMV MD‑X4</span>
          </div>
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-[11px] text-white/50 uppercase tracking-[0.2em]">Miembros activos</div>
              <div className="text-2xl font-semibold">1,245</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-white/50 uppercase tracking-[0.2em]">ARPU ilustrativo</div>
              <div className="text-xl font-semibold">$35 USD</div>
            </div>
          </div>
          <p className="text-[10px] text-white/40 mt-1">
            Valores de ejemplo. No representan promesas de rendimiento.
          </p>
        </div>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-xs p-6 text-center space-y-3">
        <p className="text-sm sm:text-base text-white/80">
          Cada creador que migra arrastra comunidad, atención y flujo económico. El TAMV es la
          infraestructura que los recibe y coordina.
        </p>
        <p className="text-xs text-white/50">
          Tu historia deja de ser un hilo perdido en un feed infinito.
        </p>
      </div>
    </div>
  </motion.div>
);

// Scene 4: CTA + Dedication
const SceneIgnitionCall: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black via-[#05020b] to-black px-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="text-xs uppercase tracking-[0.35em] text-white/40 mb-4">
      SECUENCIA DE IGNICIÓN
    </div>
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center max-w-xl">
      Esto no es otra red social.
      <br />
      Es el ecosistema soberano para{" "}
      <span className="text-[#ff4f9a]">creadores inconformes de LATAM</span>.
    </h2>
    <p className="mt-4 max-w-md text-center text-sm sm:text-base text-white/70">
      Si estás aquí, no vienes a ver qué pasa. Vienes a decidir cómo se enciende.
    </p>
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <button
        onClick={onAction}
        className="rounded-full border border-white/40 bg-white text-black px-6 py-2 text-xs sm:text-sm uppercase tracking-[0.25em] hover:bg-[#ff4f9a] hover:border-[#ff4f9a] hover:text-white transition"
      >
        Soy creador inconforme
      </button>
      <button
        onClick={onAction}
        className="rounded-full border border-white/30 bg-white/5 px-6 py-2 text-xs sm:text-sm uppercase tracking-[0.25em] text-white hover:bg-white hover:text-black transition"
      >
        Quiero construir mi comunidad aquí
      </button>
    </div>

    {/* Dedication */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 2 }}
      className="mt-8 text-center"
    >
      <p className="text-[10px] text-white/30 uppercase tracking-[0.4em]">
        Dedicado a mi madre, Reina Trejo Serrano ✦
      </p>
      <p className="text-[9px] text-white/20 mt-1 tracking-[0.3em]">
        Visión y creación: Edwin Oswaldo Castillo Trejo
      </p>
    </motion.div>

    <p className="mt-4 text-[10px] text-white/40 max-w-md text-center">
      TAMV ofrece infraestructura y herramientas. No garantiza resultados económicos
      específicos; cada creador construye su propia trayectoria.
    </p>
  </motion.div>
);

// ============================================================================
// MAIN ENGINE
// ============================================================================

function CinematicIntroEngine({ onComplete, skipEnabled, autoStart }: CinematicIntroProps) {
  const [accepted, setAccepted] = useState(!!autoStart);
  const [time, setTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progress = useSpring(0, { stiffness: 40, damping: 20 });
  const watchdogRef = useRef<number | null>(null);

  useEffect(() => {
    if (!accepted || completed) return;

    let lastTime = performance.now();
    let frameId: number;

    const loop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setTime((prev) => {
        const next = prev + delta;
        if (next >= TOTAL_DURATION) {
          setCompleted(true);
          return TOTAL_DURATION;
        }
        return next;
      });
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

  useEffect(() => {
    progress.set(time / TOTAL_DURATION);
  }, [time, progress]);

  const initAudio = useCallback(async () => {
    try {
      const audio = new Audio(introAudio);
      audio.volume = 0.7;
      audioRef.current = audio;
      await audio.play();
    } catch {
      // Silent fallback
    }
  }, []);

  const scene = useMemo<SceneId>(() => {
    if (time < 4) return 0;
    if (time < 9) return 1;
    if (time < 14) return 2;
    if (time < 18) return 3;
    return 4;
  }, [time]);

  useEffect(() => {
    if (completed) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      onComplete();
    }
  }, [completed, onComplete]);

  if (!accepted) {
    return (
      <PermissionGate
        onAccept={() => {
          setAccepted(true);
          void initAudio();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[9999] font-sans text-white select-none">
      <CinematicOverlay />

      <AnimatePresence mode="wait">
        {scene === 0 && <SceneLogoIntro key="s0" />}
        {scene === 1 && <SceneCollapse key="s1" />}
        {scene === 2 && <SceneCoreMDX4 key="s2" />}
        {scene === 3 && <SceneCreatorImpact key="s3" />}
        {scene === 4 && <SceneIgnitionCall key="s4" onAction={() => setCompleted(true)} />}
      </AnimatePresence>

      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div
          className="h-full bg-white/40"
          style={{ width: useTransform(progress, [0, 1], ["0%", "100%"]) }}
        />
      </div>

      {skipEnabled && (
        <button
          onClick={() => setCompleted(true)}
          className="absolute bottom-8 right-8 text-[9px] uppercase tracking-[0.5em] text-white/25 hover:text-white transition-colors"
        >
          SALTAR_SECUENCIA
        </button>
      )}
    </div>
  );
}

export default CinematicIntroEngine;
