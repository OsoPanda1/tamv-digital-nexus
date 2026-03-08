// ============================================================================
// TAMV MD-X4™ CINEMATIC INTRO — ULTRA EPIC EDITION v10.0
// Autor visionario y propietario: Edwin Oswaldo Castillo Trejo
// Dedicatoria: Para mi madre, Reina Trejo Serrano ✦
// 48 Federaciones · Evolución de las Redes Sociales
// ============================================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import introAudio from "@/assets/intro.mp3";
import logoImg from "@/assets/LOGOTAMV2.jpg";
import { FEDERATION_COUNT, FEDERATIONS, LAYER_META } from "@/lib/federations";
import { EpicVisualEffects } from "@/cinematic/EpicVisualEffects";

interface CinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
  autoStart?: boolean;
}

const TOTAL_DURATION = 48;
const MAX_INTRO_TIME = 52000;

type SceneId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type VFXMode = "void" | "awaken" | "crisis" | "expand" | "reveal" | "ascend" | "declare";

const SCENE_CONFIG: { end: number; mode: VFXMode; label: string }[] = [
  { end: 6, mode: "void", label: "IGNICIÓN" },
  { end: 12, mode: "awaken", label: "DESPERTAR" },
  { end: 18, mode: "crisis", label: "ANOMALÍA" },
  { end: 25, mode: "expand", label: "EXPANSIÓN" },
  { end: 32, mode: "reveal", label: "REVELACIÓN" },
  { end: 38, mode: "ascend", label: "ASCENSIÓN" },
  { end: 43, mode: "declare", label: "DECLARACIÓN" },
  { end: 48, mode: "declare", label: "TAMV" },
];

// ─── Cinematic Transition ───
const epicTransition = {
  initial: { opacity: 0, scale: 1.08, filter: "blur(12px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.95, filter: "blur(8px)" },
  transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

// ═══════════════════════════════════════════════════════════════════════════
// PERMISSION GATE
// ═══════════════════════════════════════════════════════════════════════════

const PermissionGate: React.FC<{ onAccept: () => void }> = ({ onAccept }) => (
  <motion.div
    className="fixed inset-0 z-[9999] bg-[hsl(var(--background))] flex flex-col items-center justify-center"
    exit={{ opacity: 0, filter: "blur(30px)" }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
  >
    <EpicVisualEffects intensity={0.4} mode="void" time={0} />

    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10"
    >
      <div className="absolute -inset-12 rounded-full bg-[hsl(var(--aqua)/0.06)] blur-3xl animate-pulse" />
      <div className="absolute -inset-20 rounded-full bg-[hsl(var(--primary)/0.03)] blur-[80px]" />
      <img
        src={logoImg}
        alt="TAMV"
        className="w-32 h-32 object-contain rounded-3xl relative z-10 ring-1 ring-white/10"
      />
    </motion.div>

    <div className="mt-10 text-center relative z-10">
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-foreground font-black text-6xl md:text-7xl tracking-[0.3em]"
      >
        TAMV
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1, duration: 1.2 }}
        className="h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--aqua))] to-transparent mx-auto mt-4 w-32"
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
      whileHover={{ borderColor: "hsl(220,100%,50%)", scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="relative z-10 text-foreground text-[10px] tracking-[0.4em] uppercase font-semibold group-hover:text-primary-foreground transition-colors duration-500">
        Iniciar Secuencia Cinematográfica
      </span>
      <motion.div className="absolute inset-0 bg-[hsl(var(--primary))] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
    </motion.button>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// SCENES — 8 Acts, Maximum Visual Impact
// ═══════════════════════════════════════════════════════════════════════════

// Scene 0: Black Void → Logo Ignition
const SceneIgnition: React.FC = () => (
  <motion.div {...epicTransition} className="absolute inset-0 flex flex-col items-center justify-center">
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <motion.div
        className="absolute -inset-16 rounded-full"
        animate={{
          boxShadow: [
            "0 0 0px hsl(220,100%,50%)",
            "0 0 80px hsl(220,100%,50%)",
            "0 0 20px hsl(220,100%,50%)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={logoImg} alt="TAMV" className="w-36 h-36 rounded-3xl object-contain relative z-10 ring-1 ring-white/10" />
      </motion.div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 1.5 }}
      className="mt-8 text-center"
    >
      <p className="text-[9px] uppercase tracking-[0.6em] text-[hsl(var(--aqua))]">
        Protocolo de Ignición · MD-X4
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.5 }}
      className="absolute bottom-20 text-[9px] text-muted-foreground/40 uppercase tracking-[0.4em]"
    >
      Creator Economy · LATAM 2026
    </motion.div>
  </motion.div>
);

// Scene 1: Core Awakening — Energy build-up
const SceneAwaken: React.FC = () => (
  <motion.div {...epicTransition} className="absolute inset-0 flex flex-col items-center justify-center">
    <motion.div
      className="relative w-64 h-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Concentric energy rings */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            inset: `${i * 24}px`,
            borderColor: `hsl(var(--aqua) / ${0.4 - i * 0.06})`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{
            scale: { delay: 0.3 + i * 0.2, duration: 1, ease: "backOut" },
            rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
          }}
        />
      ))}

      {/* Central pulse */}
      <motion.div
        className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-[hsl(var(--aqua))]"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.8, 0.3, 0.8],
          boxShadow: [
            "0 0 20px hsl(220,100%,50%)",
            "0 0 80px hsl(220,100%,50%)",
            "0 0 20px hsl(220,100%,50%)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="mt-10 text-[10px] uppercase tracking-[0.5em] text-[hsl(var(--aqua))]"
    >
      Inicializando Núcleo Civilizatorio
    </motion.p>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5 }}
      className="mt-3 text-[9px] text-muted-foreground/50 uppercase tracking-[0.3em]"
    >
      Sistemas de identidad soberana · Activando capas antifrágiles
    </motion.p>
  </motion.div>
);

// Scene 2: System Failure — Glitch crisis
const SceneCrisis: React.FC = () => (
  <motion.div {...epicTransition} className="absolute inset-0 flex flex-col items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Shattered grid */}
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded border border-destructive/30 bg-destructive/5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.3, 1],
              scale: 1,
              x: Math.sin(i * 0.8) * (i % 3 === 0 ? 8 : 0),
            }}
            transition={{
              delay: i * 0.05,
              duration: 0.4,
              x: { duration: 0.3, repeat: Infinity, repeatType: "mirror", delay: i * 0.1 },
            }}
          />
        ))}
      </div>

      {/* Warning overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <span className="text-destructive text-xl sm:text-2xl font-black tracking-[0.3em] uppercase"
          style={{ textShadow: "0 0 30px hsl(0,70%,50%)" }}
        >
          ANOMALÍA
        </span>
      </motion.div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      className="mt-10 space-y-2 text-center"
    >
      <p className="text-[10px] uppercase tracking-[0.35em] text-destructive/80">
        Falla sistémica detectada en las redes tradicionales
      </p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="text-[10px] text-muted-foreground/60 tracking-[0.3em]"
      >
        18.9M creadores de LATAM en explotación algorítmica
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="text-[10px] text-destructive/60 tracking-[0.2em]"
      >
        Centavos por horas de trabajo creativo · Datos extraídos · Cero control
      </motion.p>
    </motion.div>
  </motion.div>
);

// Scene 3: Civilizatory Expansion — Federations bloom
const SceneExpansion: React.FC = () => (
  <motion.div {...epicTransition} className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
    <div className="relative z-10 text-center mb-8">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[9px] uppercase tracking-[0.5em] text-[hsl(var(--aqua)/0.7)] mb-3"
      >
        Expansión Civilizatoria
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-4xl sm:text-5xl font-bold text-foreground"
      >
        <span className="text-[hsl(var(--aqua))]">{FEDERATION_COUNT}</span>{" "}
        <span className="text-foreground/80">Federaciones</span>
      </motion.h2>
    </div>

    {/* Federation grid with staggered reveal */}
    <div className="relative z-10 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5 max-w-4xl px-4">
      {FEDERATIONS.map((fed, i) => (
        <motion.div
          key={fed.id}
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.5 + i * 0.04, duration: 0.5, ease: "backOut" }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-sm cursor-default"
          style={{
            background: `hsl(${fed.color} / 0.15)`,
            border: `1px solid hsl(${fed.color} / 0.3)`,
            boxShadow: `0 0 12px hsl(${fed.color} / 0.1)`,
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
      className="relative z-10 flex gap-4 mt-6 flex-wrap justify-center px-4"
    >
      {Object.entries(LAYER_META).map(([key, meta]) => (
        <div key={key} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${meta.color})` }} />
          <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
            {key}: {meta.name}
          </span>
        </div>
      ))}
    </motion.div>
  </motion.div>
);

// Scene 4: Revelation — Architecture concentric rings
const SceneRevelation: React.FC = () => (
  <motion.div {...epicTransition} className="absolute inset-0 flex flex-col items-center justify-center">
    <div className="relative h-72 w-72 sm:h-80 sm:w-80">
      {['L3', 'L2', 'L1', 'L0'].map((layer, i) => {
        const inset = 4 + i * 18;
        const meta = LAYER_META[layer as keyof typeof LAYER_META];
        return (
          <motion.div
            key={layer}
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + i * 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute rounded-full"
            style={{
              inset: `${inset}px`,
              border: `1px solid hsl(${meta.color} / 0.4)`,
              boxShadow: `0 0 30px hsl(${meta.color} / 0.15), inset 0 0 20px hsl(${meta.color} / 0.05)`,
            }}
          />
        );
      })}

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-3xl font-black tracking-[0.3em] text-foreground"
          style={{ textShadow: "0 0 40px hsl(51,100%,50%,0.3)" }}
        >
          TAMV
        </span>
      </motion.div>

      {/* Orbit labels */}
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-[8px] uppercase tracking-[0.3em] text-muted-foreground"
      >Gobernanza</motion.span>
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2.2 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 text-[8px] uppercase tracking-[0.3em] text-muted-foreground"
      >Economía</motion.span>
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2.4 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3 text-[8px] uppercase tracking-[0.3em] text-muted-foreground"
      >Social</motion.span>
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2.6 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 text-[8px] uppercase tracking-[0.3em] text-muted-foreground"
      >IA</motion.span>
    </div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
      className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--gold))]"
    >
      4 capas antifrágiles · {FEDERATION_COUNT} federaciones · Soberanía 100%
    </motion.p>
  </motion.div>
);

// Scene 5: Ascension — Creator Impact HUD
const SceneAscension: React.FC = () => (
  <motion.div {...epicTransition} className="absolute inset-0 flex items-center justify-center px-4">
    <div className="max-w-2xl w-full">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground mb-6 text-center"
      >
        Tablero de Creador · Proyección Soberana
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-8 space-y-6"
      >
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Comunidad", value: "1,245", sub: "miembros activos", color: "var(--aqua)" },
            { label: "Revenue", value: "$35", sub: "ARPU mensual", color: "var(--gold)" },
            { label: "Federaciones", value: String(FEDERATION_COUNT), sub: "conectadas", color: "var(--quantum-purple)" },
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
                className="text-3xl font-black"
                style={{ color: `hsl(${stat.color})`, textShadow: `0 0 20px hsl(${stat.color} / 0.3)` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.2, type: "spring", stiffness: 200 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-[8px] text-muted-foreground/60">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Revenue bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>Tu porcentaje</span>
            <span className="text-[hsl(var(--gold))]">75%</span>
          </div>
          <div className="h-1.5 bg-border/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--gold))]"
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ delay: 1.5, duration: 2, ease: "easeOut" }}
            />
          </div>
          <p className="text-[7px] text-muted-foreground/40 text-center">
            TAMV: 25% · Tú: 75% — Valores ilustrativos
          </p>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

// Scene 6: Final Declaration
const SceneDeclaration: React.FC = () => (
  <motion.div {...epicTransition} className="absolute inset-0 flex flex-col items-center justify-center px-6">
    <div className="relative z-10 text-center max-w-xl">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/60 mb-8"
      >
        Declaración Final
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 1.2 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight"
      >
        Esto no es otra red social.
        <br />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-[hsl(var(--aqua))]"
        >
          Es la infraestructura soberana
        </motion.span>
        <br />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-foreground/80"
        >
          para creadores inconformes de LATAM.
        </motion.span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="mt-6 text-[9px] text-muted-foreground/40 uppercase tracking-[0.3em]"
      >
        No venimos a pedir espacio. Venimos a construirlo.
      </motion.div>
    </div>
  </motion.div>
);

// Scene 7: CTA + Dedication
const SceneCTA: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <motion.div {...epicTransition} className="absolute inset-0 flex flex-col items-center justify-center px-6">
    <div className="relative z-10 text-center max-w-xl">
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
          className="rounded-full bg-[hsl(var(--primary))] text-primary-foreground px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-semibold hover:shadow-[0_0_40px_hsl(var(--aqua)/0.5)] transition-all duration-500"
        >
          Soy creador inconforme
        </button>
        <button
          onClick={onAction}
          className="rounded-full border border-border bg-card/50 px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-foreground hover:bg-card hover:border-[hsl(var(--aqua)/0.3)] transition-all duration-500"
        >
          Explorar el ecosistema
        </button>
      </motion.div>

      {/* Dedication */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 3 }}
        className="mt-12"
      >
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--aqua)/0.3)] to-transparent mx-auto mb-4" />
        <p className="text-[8px] text-muted-foreground/30 uppercase tracking-[0.5em]">
          Dedicado a mi madre, Reina Trejo Serrano ✦
        </p>
        <p className="text-[7px] text-muted-foreground/20 mt-1 tracking-[0.3em]">
          Visión y creación: Edwin Oswaldo Castillo Trejo · Real del Monte, Hidalgo
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
    if (scene === 0) return Math.min(time / 3, 1);
    if (scene === 2) return 1; // crisis max
    return 0.7 + Math.sin(time * 0.5) * 0.15;
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
      {/* Epic visual effects layer */}
      <EpicVisualEffects intensity={vfxIntensity} mode={currentMode} time={time} />

      {/* Scene content */}
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

      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-border/20 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--primary))]"
          style={{ width: progressWidth }}
        />
      </div>

      {/* Scene indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {SCENE_CONFIG.map((cfg, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full transition-all duration-700"
              style={{
                background: i === scene ? 'hsl(var(--aqua))' : 'hsl(var(--muted-foreground) / 0.2)',
                transform: i === scene ? 'scale(1.8)' : 'scale(1)',
                boxShadow: i === scene ? '0 0 8px hsl(var(--aqua))' : 'none',
              }}
            />
          </div>
        ))}
      </div>

      {/* Scene label */}
      <motion.div
        key={scene}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.3, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="absolute top-6 left-6 text-[8px] uppercase tracking-[0.5em] text-muted-foreground/40 z-50"
      >
        {SCENE_CONFIG[scene]?.label}
      </motion.div>

      {/* Timer */}
      <div className="absolute top-6 right-6 text-[8px] font-mono text-muted-foreground/20 z-50 tabular-nums">
        {String(Math.floor(time / 60)).padStart(2, "0")}:{String(Math.floor(time % 60)).padStart(2, "0")}
      </div>

      {skipEnabled !== false && (
        <button
          onClick={() => setCompleted(true)}
          className="absolute bottom-6 right-6 text-[8px] uppercase tracking-[0.4em] text-muted-foreground/20 hover:text-foreground/60 transition-colors z-50"
        >
          Saltar ›
        </button>
      )}
    </div>
  );
}

export default CinematicIntroEngine;
