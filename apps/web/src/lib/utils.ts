/**
 * TAMV MD-X4 QuantumClass Utility v2.0
 * Función universal para unir, optimizar y extender clases CSS,
 * compatible con Tailwind, efectos Quantum y modos sensoriales.
 * Permite temas, estados, efectos y visual contexts, todo en 1 solo archivo.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tipos para extensión avanzada
type Theme = "quantum" | "crystal" | "solar" | "dark" | "light";
type State = "default" | "hover" | "active" | "focus" | "disabled";
type Effect = "glow" | "pulse" | "morph" | "parallax" | "warp";

interface QuantumOptions {
  theme?: Theme;
  state?: State;
  effect?: Effect[];
  extra?: ClassValue[];
}

/* Clases base parametrizadas, 100% integradas */
const themeBase: Record<Theme, string> = {
  quantum: "bg-gradient-to-br from-cyan-300 via-purple-700 to-pink-600 shadow-cyan-400/40",
  crystal: "bg-gradient-to-r from-blue-200 via-blue-500 to-purple-300 glass-effect shadow-blue-500/30",
  solar: "bg-gradient-to-br from-yellow-500 via-pink-300 to-pink-600 text-black shadow-yellow-400/40",
  dark: "bg-gradient-to-br from-black via-gray-800 to-slate-900 text-white",
  light: "bg-gradient-to-br from-white via-slate-100 to-blue-50 text-black"
};

const stateBase: Record<State, string> = {
  default: "",
  hover: "hover:bg-cyan-900/70 hover:scale-105 hover:shadow-cyan-300",
  active: "active:outline active:scale-97 active:shadow-pink-500",
  focus: "focus:ring-4 focus:ring-purple-400/60",
  disabled: "opacity-40 cursor-not-allowed"
};

const effectBase: Record<Effect, string> = {
  glow: "shadow-[0_0_32px_#00f7ff90] animate-pulse-glow",
  pulse: "animate-pulse-fast",
  morph: "animate-morph-crystal",
  parallax: "parallax-effect",
  warp: "transition-transform scale-105 rotate-2"
};

/**
 * Extensión avanzada de unión de clases Quantum
 * Compatibilidad total con cmp viejo: cn("a", "b", {c: true}, ...)
 * Si usas objetos QuantumOptions, puedes usar temas, efectos, etc.
 */
export function cn(...inputs: (ClassValue | QuantumOptions)[]): string {
  const classes: ClassValue[] = [];
  for (const input of inputs) {
    if (typeof input === "object" && !Array.isArray(input) && input !== null && "theme" in input) {
      const opts = input as QuantumOptions;
      classes.push(
        opts.theme ? themeBase[opts.theme] : "",
        opts.state ? stateBase[opts.state] : "",
        opts.effect ? opts.effect.map(e => effectBase[e]).join(" ") : "",
        ...(opts.extra || [])
      );
    } else {
      classes.push(input as ClassValue);
    }
  }
  return twMerge(clsx(classes));
}

/**
 * Ejemplo de uso en React/Tailwind:
 *
 * <div className={cn("rounded-2xl px-8 py-6", { "shadow-lg": isActive }, {
 *   theme: "quantum",
 *   effect: ["glow", "warp"],
 *   state: isFocused ? "focus" : "default",
 *   extra: ["transition", "duration-300"]
 * })}>Contenido TAMV Quantum</div>
 *
 * Esto te permite implementar UI Quantum, Crystal, Solar, etc.
 * sin desacoplar ningún módulo y usando UN SOLO ARCHIVO UNIVERSAL.
 */

// Si deseas logs en desarrollo:
// const DEBUG = process.env.NODE_ENV === "development";
// if (DEBUG) console.log("[cn] result: ", result);

// FIN DEL ARCHIVO
