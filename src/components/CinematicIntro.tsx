// ============================================================================
// TAMV MD-X4™ CINEMATIC INTRO — ULTRA EPIC EDITION v12.0
// Autor visionario y propietario: Edwin Oswaldo Castillo Trejo
// Dedicatoria: Para mi madre, Reina Trejo Serrano ✦
// 48 Federaciones · La Evolución de las Redes Sociales
// ============================================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import introAudio from "@/assets/intro.mp3";
import logoImg from "@/assets/LOGOTAMV2.jpg";
import heroCity from "@/assets/gallery/hero-city.jpg";
import aiNetwork from "@/assets/gallery/ai-network.jpg";
import securityShield from "@/assets/gallery/security-shield.jpg";
import metaverseSpace from "@/assets/gallery/metaverse-space.jpg";
import university from "@/assets/gallery/university.jpg";
import walletCrypto from "@/assets/gallery/wallet-crypto.jpg";
import { FEDERATION_COUNT, FEDERATIONS, LAYER_META } from "@/lib/federations";
import { EpicVisualEffects } from "@/cinematic/EpicVisualEffects";

interface CinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
  autoStart?: boolean;
}

const TOTAL_DURATION = 52;
const MAX_INTRO_TIME = 58000;

type SceneId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type VFXMode = "void" | "awaken" | "crisis" | "expand" | "reveal" | "ascend" | "declare";

const SCENE_CONFIG: { end: number; mode: VFXMode; label: string }[] = [
  { end: 7, mode: "void", label: "IGNICIÓN" },
  { end: 14, mode: "awaken", label: "DESPERTAR" },
  { end: 21, mode: "crisis", label: "ANOMALÍA" },
  { end: 28, mode: "expand", label: "EXPANSIÓN" },
  { end: 35, mode: "reveal", label: "REVELACIÓN" },
  { end: 42, mode: "ascend", label: "ASCENSIÓN" },
  { end: 47, mode: "declare", label: "DECLARACIÓN" },
  { end: 52, mode: "declare", label: "TAMV" },
];

// ─── Cinematic Transition ───
const epicT = {
  initial: { opacity: 0, scale: 1.06, filter: "blur(10px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.96, filter: "blur(6px)" },
  transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

// ─── Cinematic Background Image ───
const CineBG: React.FC<{ src: string; zoom?: boolean; overlay?: string }> = ({
  src, zoom = true, overlay = "rgba(0,0,0,0.7)"
}) => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.img
      src={src}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      initial={{ scale: zoom ? 1.15 : 1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 7, ease: "easeOut" }}
    />
    <div className="absolute inset-0" style={{ background: overlay }} />
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))]/80 via-transparent to-[hsl(var(--background))]/90" />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// PERMISSION GATE
// ═══════════════════════════════════════════════════════════════════════════
const PermissionGate: React.FC<{ onAccept: () => void }> = ({ onAccept }) => (
  <motion.div
    className="fixed inset-0 z-[9999] bg-[hsl(var(--background))] flex flex-col items-center justify-center"
    exit={{ opacity: 0, filter: "blur(30px)" }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
  >
    <EpicVisualEffects intensity={0.3} mode="void" time={0} />

    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10"
    >
      <div className="absolute -inset-16 rounded-full bg-[hsl(var(--primary)/0.08)] blur-[60px] animate-pulse" />
      <img src={logoImg} alt="TAMV" className="w-28 h-28 object-contain rounded-2xl relative z-10 ring-1 ring-white/10" />
    </motion.div>

    <div className="mt-10 text-center relative z-10">
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-foreground font-black text-5xl md:text-7xl tracking-[0.3em]"
      >
        TAMV
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1, duration: 1.2 }}
        className="h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--primary))] to-transparent mx-auto mt-4 w-32"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-muted-foreground text-[10px] uppercase tracking-[0.6em] mt-4"
      >
        {FEDERATION_COUNT} Federaciones · La Evolución de las Redes Sociales
      </motion.p>
    </div>

    <motion.button
      onClick={onAccept}
      className="mt-12 relative z-10 group py-4 px-14 overflow-hidden border border-border rounded-full bg-card/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8 }}
      whileHover={{ borderColor: "hsl(var(--primary))", scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="relative z-10 text-foreground text-[10px] tracking-[0.4em] uppercase font-semibold group-hover:text-primary-foreground transition-colors duration-500">
        Iniciar Experiencia Cinematográfica
      </span>
      <motion.div className="absolute inset-0 bg-[hsl(var(--primary))] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
    </motion.button>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// SCENES — 8 Acts with real imagery + cinematic composition
// ═══════════════════════════════════════════════════════════════════════════

// Scene 0: IGNITION — Logo reveals over dark cityscape
const SceneIgnition: React.FC = () => (
  <motion.div {...epicT} className="absolute inset-0">
    <CineBG src={heroCity} overlay="rgba(0,0,0,0.82)" />
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <motion.div
          className="absolute -inset-20 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0px hsl(var(--primary))",
              "0 0 120px hsl(var(--primary))",
              "0 0 30px hsl(var(--primary))",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={logoImg}
          alt="TAMV"
          className="w-40 h-40 rounded-3xl object-contain relative z-10 ring-1 ring-white/10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="mt-10 text-center"
      >
        <p className="text-[10px] uppercase tracking-[0.6em] text-primary/80 font-medium">
          Protocolo de Ignición · MD-X4 Quantum
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
        className="absolute bottom-[15%] text-center"
      >
        <p className="text-[9px] text-muted-foreground/30 uppercase tracking-[0.4em]">
          Una civilización digital desde LATAM · 2026
        </p>
      </motion.div>
    </div>
  </motion.div>
);

// Scene 1: AWAKEN — AI neural network awakens
const SceneAwaken: React.FC = () => (
  <motion.div {...epicT} className="absolute inset-0">
    <CineBG src={aiNetwork} overlay="rgba(0,0,0,0.75)" />
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
      <motion.div className="relative w-72 h-72 sm:w-80 sm:h-80">
        {/* Hexagonal rings */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              inset: `${i * 28}px`,
              border: `1px solid hsl(var(--primary) / ${0.5 - i * 0.1})`,
              boxShadow: `0 0 ${20 - i * 4}px hsl(var(--primary) / ${0.15 - i * 0.03})`,
            }}
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{
              scale: { delay: 0.3 + i * 0.3, duration: 1.2, ease: "backOut" },
              rotate: { duration: 25 + i * 8, repeat: Infinity, ease: "linear" },
            }}
          />
        ))}
        <motion.div
          className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-primary"
          animate={{
            scale: [1, 2.5, 1],
            opacity: [0.9, 0.2, 0.9],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ boxShadow: "0 0 60px hsl(var(--primary))" }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-8 text-[11px] uppercase tracking-[0.5em] text-primary/90 font-medium"
      >
        Inicializando Núcleo Civilizatorio
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="mt-3 text-[9px] text-muted-foreground/50 uppercase tracking-[0.3em] text-center max-w-md"
      >
        Identidad soberana · Isabella AI · {FEDERATION_COUNT} federaciones antifrágiles
      </motion.p>
    </div>
  </motion.div>
);

// Scene 2: CRISIS — system failure, the problem
const SceneCrisis: React.FC = () => (
  <motion.div {...epicT} className="absolute inset-0">
    <CineBG src={securityShield} overlay="rgba(10,0,0,0.8)" />
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
      {/* Shattered data grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-sm border border-destructive/20"
              style={{
                background: `linear-gradient(135deg, hsl(0 70% 15% / ${0.3 + Math.random() * 0.3}), transparent)`,
              }}
              initial={{ opacity: 0, scale: 0, rotate: Math.random() * 20 - 10 }}
              animate={{
                opacity: [0, 1, 0.4, 1],
                scale: 1,
                rotate: 0,
                x: Math.random() > 0.7 ? [0, (Math.random() - 0.5) * 10, 0] : 0,
              }}
              transition={{
                delay: i * 0.03,
                duration: 0.3,
                x: { duration: 0.2, repeat: Infinity, repeatType: "mirror", delay: i * 0.08 + 1 },
              }}
            />
          ))}
        </div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        >
          <span
            className="text-destructive text-2xl sm:text-3xl font-black tracking-[0.4em] uppercase"
            style={{ textShadow: "0 0 40px hsl(0 70% 50% / 0.6)" }}
          >
            ANOMALÍA
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-12 space-y-3 text-center max-w-lg"
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-destructive/80 font-medium">
          Las redes tradicionales explotan al creador
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="text-[10px] text-muted-foreground/60 tracking-[0.2em]"
        >
          18.9M creadores LATAM · Centavos por horas de trabajo · Datos extraídos
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="text-[10px] text-destructive/50 tracking-[0.2em]"
        >
          Cero propiedad · Cero soberanía · Cero dignidad algorítmica
        </motion.p>
      </motion.div>
    </div>
  </motion.div>
);

// Scene 3: EXPANSION — Federation bloom over metaverse
const SceneExpansion: React.FC = () => (
  <motion.div {...epicT} className="absolute inset-0">
    <CineBG src={metaverseSpace} overlay="rgba(0,0,0,0.72)" />
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[9px] uppercase tracking-[0.5em] text-primary/60 mb-3"
        >
          Expansión Civilizatoria
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-4xl sm:text-6xl font-black text-foreground"
        >
          <span className="text-primary">{FEDERATION_COUNT}</span>{" "}
          <span className="text-foreground/80">Federaciones</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5 max-w-4xl px-4">
        {FEDERATIONS.map((fed, i) => (
          <motion.div
            key={fed.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.035, duration: 0.4, ease: "backOut" }}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm cursor-default backdrop-blur-sm"
            style={{
              background: `hsl(${fed.color} / 0.2)`,
              border: `1px solid hsl(${fed.color} / 0.35)`,
              boxShadow: `0 0 15px hsl(${fed.color} / 0.12)`,
            }}
            title={fed.name}
          >
            {fed.icon}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="flex gap-4 mt-8 flex-wrap justify-center px-4"
      >
        {Object.entries(LAYER_META).map(([key, meta]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${meta.color})` }} />
            <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground/60">
              {key}: {meta.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  </motion.div>
);

// Scene 4: REVELATION — Architecture layers
const SceneRevelation: React.FC = () => (
  <motion.div {...epicT} className="absolute inset-0">
    <CineBG src={walletCrypto} overlay="rgba(0,0,0,0.78)" />
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72 sm:h-80 sm:w-80">
        {(['L3', 'L2', 'L1', 'L0'] as const).map((layer, i) => {
          const inset = 4 + i * 20;
          const meta = LAYER_META[layer as keyof typeof LAYER_META];
          return (
            <motion.div
              key={layer}
              initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.4, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute rounded-full"
              style={{
                inset: `${inset}px`,
                border: `1.5px solid hsl(${meta.color} / 0.5)`,
                boxShadow: `0 0 40px hsl(${meta.color} / 0.15), inset 0 0 30px hsl(${meta.color} / 0.05)`,
              }}
            />
          );
        })}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 1.2 }}
        >
          <span
            className="text-3xl font-black tracking-[0.3em] text-foreground"
            style={{ textShadow: "0 0 50px hsl(var(--primary) / 0.4)" }}
          >
            TAMV
          </span>
        </motion.div>

        {/* Orbit labels */}
        {[
          { text: "Gobernanza", pos: "top-0 left-1/2 -translate-x-1/2 -translate-y-4", delay: 2.5 },
          { text: "Economía", pos: "right-0 top-1/2 -translate-y-1/2 translate-x-4", delay: 2.7 },
          { text: "Social · XR", pos: "bottom-0 left-1/2 -translate-x-1/2 translate-y-4", delay: 2.9 },
          { text: "Isabella AI", pos: "left-0 top-1/2 -translate-y-1/2 -translate-x-4", delay: 3.1 },
        ].map(({ text, pos, delay }) => (
          <motion.span
            key={text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay }}
            className={`absolute ${pos} text-[8px] uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap`}
          >
            {text}
          </motion.span>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-primary/70"
      >
        4 capas antifrágiles · Soberanía total · BookPI inmutable
      </motion.p>
    </div>
  </motion.div>
);

// Scene 5: ASCENSION — Creator Impact dashboard
const SceneAscension: React.FC = () => (
  <motion.div {...epicT} className="absolute inset-0">
    <CineBG src={university} overlay="rgba(0,0,0,0.8)" />
    <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/60 mb-6 text-center"
        >
          Tablero de Creador · Proyección Soberana
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-8 space-y-6"
        >
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Comunidad", value: "1,245", sub: "miembros activos", cssVar: "--primary" },
              { label: "Revenue", value: "$35", sub: "ARPU mensual", cssVar: "--primary" },
              { label: "Federaciones", value: String(FEDERATION_COUNT), sub: "conectadas", cssVar: "--primary" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.2 }}
                className="text-center"
              >
                <div className="text-[9px] text-muted-foreground uppercase tracking-[0.3em]">{stat.label}</div>
                <motion.div
                  className="text-3xl font-black text-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.2, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-[8px] text-muted-foreground/50">{stat.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>Tu porcentaje</span>
              <span className="text-primary">75%</span>
            </div>
            <div className="h-2 bg-border/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ delay: 1.5, duration: 2, ease: "easeOut" }}
              />
            </div>
            <p className="text-[7px] text-muted-foreground/30 text-center">
              TAMV: 25% · Tú: 75% — Valores ilustrativos del split soberano
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

// Scene 6: DECLARATION — Final statement
const SceneDeclaration: React.FC = () => (
  <motion.div {...epicT} className="absolute inset-0">
    <CineBG src={heroCity} overlay="rgba(0,0,0,0.85)" zoom={false} />
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/40 mb-8"
        >
          Declaración Final
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight"
        >
          Esto no es otra red social.
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-primary"
          >
            Es la infraestructura soberana
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="text-foreground/70"
          >
            para creadores inconformes de LATAM.
          </motion.span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="mt-8 text-[10px] text-muted-foreground/30 uppercase tracking-[0.3em]"
        >
          No venimos a pedir espacio. Venimos a construirlo.
        </motion.div>
      </div>
    </div>
  </motion.div>
);

// Scene 7: CTA + Dedication
const SceneCTA: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <motion.div {...epicT} className="absolute inset-0">
    <CineBG src={metaverseSpace} overlay="rgba(0,0,0,0.82)" zoom={false} />
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="mb-8"
        >
          <img src={logoImg} alt="TAMV" className="w-20 h-20 rounded-2xl object-contain mx-auto ring-1 ring-white/10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={onAction}
            className="rounded-full bg-primary text-primary-foreground px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-semibold hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all duration-500"
          >
            Soy creador inconforme
          </button>
          <button
            onClick={onAction}
            className="rounded-full border border-border bg-card/50 backdrop-blur px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-foreground hover:bg-card hover:border-primary/30 transition-all duration-500"
          >
            Explorar el ecosistema
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 3 }}
          className="mt-14"
        >
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mb-4" />
          <p className="text-[8px] text-muted-foreground/25 uppercase tracking-[0.5em]">
            Dedicado a mi madre, Reina Trejo Serrano ✦
          </p>
          <p className="text-[7px] text-muted-foreground/15 mt-1 tracking-[0.3em]">
            Visión y creación: Edwin Oswaldo Castillo Trejo · Real del Monte, Hidalgo
          </p>
        </motion.div>
      </div>
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
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
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
    for (let i = 0; i < SCENE_CONFIG.length; i++) {
      if (time < SCENE_CONFIG[i].end) return i as SceneId;
    }
    return 7;
  }, [time]);

  const currentMode = SCENE_CONFIG[scene]?.mode ?? "declare";
  const vfxIntensity = useMemo(() => {
    if (scene === 0) return Math.min(time / 3, 0.8);
    if (scene === 2) return 1;
    return 0.6 + Math.sin(time * 0.5) * 0.15;
  }, [scene, time]);

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
    return <PermissionGate onAccept={() => { setAccepted(true); void initAudio(); }} />;
  }

  return (
    <div className="fixed inset-0 bg-[hsl(var(--background))] overflow-hidden z-[9999] font-sans text-foreground select-none">
      <EpicVisualEffects intensity={vfxIntensity} mode={currentMode} time={time} />

      <AnimatePresence mode="wait">
        {scene === 0 && <SceneIgnition key="s0" />}
        {scene === 1 && <SceneAwaken key="s1" />}
        {scene === 2 && <SceneCrisis key="s2" />}
        {scene === 3 && <SceneExpansion key="s3" />}
        {scene === 4 && <SceneRevelation key="s4" />}
        {scene === 5 && <SceneAscension key="s5" />}
        {scene === 6 && <SceneDeclaration key="s6" />}
        {scene === 7 && <SceneCTA key="s7" onAction={() => setCompleted(true)} />}
      </AnimatePresence>

      <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
        <motion.div
          className="h-full bg-white/40 origin-left"
          style={{ scaleX: progress }}
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-border/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-primary/80 to-primary"
          style={{ width: progressWidth }}
        />
      </div>

      {/* Scene dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-50">
        {SCENE_CONFIG.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-700"
            style={{
              background: i === scene ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.15)',
              transform: i === scene ? 'scale(2)' : 'scale(1)',
              boxShadow: i === scene ? '0 0 10px hsl(var(--primary))' : 'none',
            }}
          />
        ))}
      </div>

      {/* Scene label */}
      <motion.div
        key={scene}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.25, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="absolute top-8 left-8 text-[8px] uppercase tracking-[0.5em] text-muted-foreground/30 z-50"
      >
        {SCENE_CONFIG[scene]?.label}
      </motion.div>

      {/* Timer */}
      <div className="absolute top-8 right-8 text-[8px] font-mono text-muted-foreground/15 z-50 tabular-nums">
        {String(Math.floor(time / 60)).padStart(2, "0")}:{String(Math.floor(time % 60)).padStart(2, "0")}
      </div>

      {skipEnabled !== false && (
        <button
          onClick={() => setCompleted(true)}
          className="absolute bottom-8 right-8 text-[8px] uppercase tracking-[0.4em] text-muted-foreground/15 hover:text-foreground/50 transition-colors z-50"
        >
          Saltar ›
        </button>
      )}
    </div>
  );
}

export default CinematicIntroEngine;
