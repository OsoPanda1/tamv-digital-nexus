// ============================================================================
// TAMV MD-X4™ CINEMATIC INTRO — ZERO MEDIOCRITY EDITION
// Autor visionario y propietario: Edwin Oswaldo Castillo Trejo
// Dedicatoria: Para mi madre, Reina Trejo Serrano ✦
// 48 Federaciones · Evolución de las Redes Sociales
// ============================================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import introAudio from "@/assets/intro.mp3";
import logoImg from "@/assets/LOGOTAMV2.jpg";
import { FEDERATION_COUNT, FEDERATIONS, LAYER_META } from "@/lib/federations";

interface CinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
  autoStart?: boolean;
}

const TOTAL_DURATION = 28;
const MAX_INTRO_TIME = 32000;

// ─── Particle field for cinematic depth ───
const CinematicParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.15 - 0.1,
      opacity: Math.random() * 0.6 + 0.1,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) p.y = canvas.height + 5;
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 217, 255, ${p.opacity})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />;
};

// ─── Permission Gate ───
const PermissionGate: React.FC<{ onAccept: () => void }> = ({ onAccept }) => (
  <motion.div
    className="fixed inset-0 z-[9999] bg-[hsl(var(--background))] flex flex-col items-center justify-center"
    exit={{ opacity: 0, filter: "blur(30px)" }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
  >
    <CinematicParticles />

    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10"
    >
      <div className="absolute -inset-8 rounded-full bg-[hsl(var(--aqua)/0.08)] blur-3xl" />
      <img
        src={logoImg}
        alt="TAMV"
        className="w-28 h-28 object-contain rounded-3xl relative z-10 ring-1 ring-white/10"
      />
    </motion.div>

    <div className="mt-8 text-center relative z-10">
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-foreground font-black text-5xl tracking-[0.25em]"
      >
        TAMV
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "6rem" }}
        transition={{ delay: 0.8, duration: 1 }}
        className="h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--aqua))] to-transparent mx-auto mt-3"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-muted-foreground text-[10px] uppercase tracking-[0.5em] mt-3"
      >
        {FEDERATION_COUNT} Federaciones · La Evolución de las Redes Sociales
      </motion.p>
    </div>

    <motion.button
      onClick={onAccept}
      className="mt-10 relative z-10 group py-3 px-12 overflow-hidden border border-border rounded-full bg-card/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3 }}
      whileHover={{ borderColor: "hsl(185,100%,60%)", scale: 1.02 }}
    >
      <span className="relative z-10 text-foreground text-[10px] tracking-[0.35em] uppercase group-hover:text-primary-foreground transition-colors duration-500">
        Iniciar Secuencia
      </span>
      <motion.div className="absolute inset-0 bg-[hsl(var(--primary))] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
    </motion.button>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// SCENES — 6 Acts, Zero Mediocrity
// ═══════════════════════════════════════════════════════════════════════════

type SceneId = 0 | 1 | 2 | 3 | 4 | 5;

const sceneTransition = {
  initial: { opacity: 0, scale: 1.02 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

// Scene 0: Logo Reveal
const SceneLogo: React.FC = () => (
  <motion.div {...sceneTransition} className="absolute inset-0 flex flex-col items-center justify-center bg-background">
    <CinematicParticles />
    <motion.div
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10"
    >
      <div className="absolute -inset-6 rounded-3xl bg-[hsl(var(--aqua)/0.06)] blur-2xl" />
      <img src={logoImg} alt="TAMV" className="w-32 h-32 rounded-3xl object-contain relative" />
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="relative z-10 mt-6 text-muted-foreground text-xs uppercase tracking-[0.4em]"
    >
      Creator Economy · LATAM 2026
    </motion.p>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8 }}
      className="relative z-10 mt-3 text-muted-foreground/60 text-[10px] uppercase tracking-[0.3em] max-w-xs text-center"
    >
      No venimos a pedir espacio. Venimos a construirlo.
    </motion.p>
  </motion.div>
);

// Scene 1: The Problem
const SceneProblem: React.FC = () => (
  <motion.div {...sceneTransition} className="absolute inset-0 flex flex-col md:flex-row bg-background">
    <div className="flex-1 flex items-center justify-center border-b md:border-b-0 md:border-r border-border px-8 py-10">
      <div className="max-w-sm">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-4">El Status Quo</p>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-foreground/80 text-sm leading-relaxed"
        >
          18.9M creadores en LATAM viviendo bajo algoritmos que priorizan anuncios, no comunidades.
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="h-[1px] bg-destructive/40 mt-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-3 text-[10px] text-destructive/70 uppercase tracking-[0.3em]"
        >
          Centavos por horas de trabajo creativo.
        </motion.p>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center px-8 py-10">
      <div className="max-w-sm">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-4">El Costo Oculto</p>
        <motion.p
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="text-foreground/80 text-sm leading-relaxed"
        >
          Datos extraídos, modelos cerrados, cero control sobre tu comunidad.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-muted-foreground/60 text-xs"
        >
          TAMV nace como infraestructura de escape, no como otra timeline infinita.
        </motion.p>
      </div>
    </div>
  </motion.div>
);

// Scene 2: 48 Federations Visualization
const SceneFederations: React.FC = () => (
  <motion.div {...sceneTransition} className="absolute inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
    <CinematicParticles />
    <div className="relative z-10 text-center mb-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-2"
      >
        Arquitectura Civilizatoria
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl sm:text-4xl font-bold text-foreground"
      >
        <span className="text-[hsl(var(--aqua))]">{FEDERATION_COUNT}</span> Federaciones
      </motion.h2>
    </div>

    {/* Federation Grid */}
    <div className="relative z-10 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5 max-w-4xl px-4">
      {FEDERATIONS.map((fed, i) => (
        <motion.div
          key={fed.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.03, duration: 0.3, ease: "backOut" }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-sm cursor-default"
          style={{
            background: `hsl(${fed.color} / 0.15)`,
            border: `1px solid hsl(${fed.color} / 0.25)`,
          }}
          title={fed.name}
        >
          {fed.icon}
        </motion.div>
      ))}
    </div>

    {/* Layer Labels */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="relative z-10 flex gap-4 mt-6 flex-wrap justify-center px-4"
    >
      {Object.entries(LAYER_META).map(([key, meta]) => (
        <div key={key} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${meta.color})` }} />
          <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            {key}: {meta.name}
          </span>
        </div>
      ))}
    </motion.div>
  </motion.div>
);

// Scene 3: Architecture Rings
const SceneArchitecture: React.FC = () => (
  <motion.div {...sceneTransition} className="absolute inset-0 flex flex-col items-center justify-center bg-background">
    <div className="relative h-64 w-64 sm:h-72 sm:w-72">
      {['L3', 'L2', 'L1', 'L0'].map((layer, i) => {
        const inset = 4 + i * 16;
        const meta = LAYER_META[layer as keyof typeof LAYER_META];
        return (
          <motion.div
            key={layer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.6 }}
            className="absolute rounded-full"
            style={{
              inset: `${inset}px`,
              border: `1px solid hsl(${meta.color} / 0.35)`,
              boxShadow: `0 0 20px hsl(${meta.color} / 0.1)`,
            }}
          />
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold tracking-[0.2em] text-foreground">TAMV</span>
      </div>
      {/* Labels */}
      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Gobernanza</span>
      <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Economía</span>
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Social</span>
      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">IA</span>
    </div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="mt-8 text-center text-sm text-muted-foreground max-w-md"
    >
      4 capas antifrágiles · {FEDERATION_COUNT} federaciones · Soberanía 100%
    </motion.p>
  </motion.div>
);

// Scene 4: Creator Impact
const SceneImpact: React.FC = () => (
  <motion.div {...sceneTransition} className="absolute inset-0 flex items-center justify-center bg-background px-4">
    <div className="max-w-2xl w-full">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 text-center">Creator HUD</p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 space-y-4"
      >
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Miembros", value: "1,245", sub: "activos" },
            { label: "Revenue", value: "$35", sub: "ARPU mensual" },
            { label: "Federaciones", value: String(FEDERATION_COUNT), sub: "conectadas" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="text-center"
            >
              <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-[9px] text-muted-foreground">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
        <div className="h-[1px] bg-border" />
        <p className="text-[10px] text-muted-foreground/60 text-center">
          Valores ilustrativos. Cada creador construye su propia trayectoria.
        </p>
      </motion.div>
    </div>
  </motion.div>
);

// Scene 5: CTA + Dedication
const SceneCTA: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <motion.div {...sceneTransition} className="absolute inset-0 flex flex-col items-center justify-center bg-background px-6">
    <CinematicParticles />
    <div className="relative z-10 text-center max-w-xl">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-6"
      >
        Secuencia de Ignición
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight"
      >
        Esto no es otra red social.
        <br />
        Es el ecosistema soberano para{" "}
        <span className="text-[hsl(var(--aqua))]">creadores inconformes de LATAM</span>.
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
      >
        <button
          onClick={onAction}
          className="rounded-full bg-[hsl(var(--primary))] text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.25em] font-semibold hover:shadow-[0_0_30px_hsl(var(--aqua)/0.4)] transition-all"
        >
          Soy creador inconforme
        </button>
        <button
          onClick={onAction}
          className="rounded-full border border-border bg-card/50 px-8 py-3 text-xs uppercase tracking-[0.25em] text-foreground hover:bg-card transition-all"
        >
          Explorar el ecosistema
        </button>
      </motion.div>

      {/* Dedication */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 2 }}
        className="mt-10"
      >
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--aqua)/0.3)] to-transparent mx-auto mb-4" />
        <p className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.4em]">
          Dedicado a mi madre, Reina Trejo Serrano ✦
        </p>
        <p className="text-[8px] text-muted-foreground/25 mt-1 tracking-[0.3em]">
          Visión y creación: Edwin Oswaldo Castillo Trejo
        </p>
      </motion.div>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE
// ═══════════════════════════════════════════════════════════════════════════

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
      setTime(prev => {
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

  useEffect(() => { progress.set(time / TOTAL_DURATION); }, [time, progress]);

  const initAudio = useCallback(async () => {
    try {
      const audio = new Audio(introAudio);
      audio.volume = 0.6;
      audioRef.current = audio;
      await audio.play();
    } catch { /* silent fallback */ }
  }, []);

  const scene = useMemo<SceneId>(() => {
    if (time < 4) return 0;
    if (time < 8.5) return 1;
    if (time < 14) return 2;
    if (time < 18) return 3;
    if (time < 22) return 4;
    return 5;
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
      <PermissionGate onAccept={() => { setAccepted(true); void initAudio(); }} />
    );
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden z-[9999] font-sans text-foreground select-none">
      <AnimatePresence mode="wait">
        {scene === 0 && <SceneLogo key="s0" />}
        {scene === 1 && <SceneProblem key="s1" />}
        {scene === 2 && <SceneFederations key="s2" />}
        {scene === 3 && <SceneArchitecture key="s3" />}
        {scene === 4 && <SceneImpact key="s4" />}
        {scene === 5 && <SceneCTA key="s5" onAction={() => setCompleted(true)} />}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-border/30 z-50">
        <motion.div
          className="h-full bg-[hsl(var(--aqua))]"
          style={{ width: useTransform(progress, [0, 1], ["0%", "100%"]) }}
        />
      </div>

      {/* Scene indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: i === scene ? 'hsl(var(--aqua))' : 'hsl(var(--muted-foreground) / 0.3)',
              transform: i === scene ? 'scale(1.5)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {skipEnabled !== false && (
        <button
          onClick={() => setCompleted(true)}
          className="absolute bottom-6 right-6 text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30 hover:text-foreground transition-colors z-50"
        >
          Saltar
        </button>
      )}
    </div>
  );
}

export default CinematicIntroEngine;
