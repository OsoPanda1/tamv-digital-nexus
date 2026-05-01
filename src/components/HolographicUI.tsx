import { motion } from "framer-motion";
import type { ReactNode } from "react";

// ======================================================
// HolographicPanel
// ======================================================

interface HolographicPanelProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
}

export const HolographicPanel = ({
  children,
  className = "",
  animated = true,
}: HolographicPanelProps) => {
  return (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.96, y: 8 } : false}
      animate={animated ? { opacity: 1, scale: 1, y: 0 } : {}}
      exit={animated ? { opacity: 0, scale: 0.96, y: 8 } : {}}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        relative overflow-hidden rounded-2xl
        border border-primary/30 bg-black/40
        backdrop-blur-xl
        shadow-quantum
        hover:border-primary/50 hover:shadow-glow transition-all duration-300
        ${className}
      `}
    >
      {/* Glow base */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-br from-primary/10 via-transparent to-secondary/10
        "
      />

      {/* Scanline / reflejo diagonal */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)]
          mix-blend-screen
        "
      />

      {/* Barrido holográfico suave */}
      <div
        className="
          pointer-events-none absolute -inset-32
          bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,247,255,0.14),transparent_45%,rgba(255,107,157,0.14),transparent_90%)]
          animate-[spin_18s_linear_infinite]
          opacity-40 mix-blend-screen
        "
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// ======================================================
// HolographicButton
// ======================================================

interface HolographicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const HolographicButton = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  fullWidth = false,
}: HolographicButtonProps) => {
  const variants: Record<string, string> = {
    primary:
      "bg-quantum-gradient text-white shadow-quantum hover:shadow-glow border border-primary/40",
    secondary:
      "bg-secondary/15 border border-secondary/60 text-secondary hover:bg-secondary/25",
    ghost:
      "bg-transparent border border-primary/30 text-primary hover:bg-primary/10",
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.04, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97, y: 0 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-xl font-semibold
        text-sm md:text-base
        transition-all duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

// ======================================================
// QuantumBadge
// ======================================================

interface QuantumBadgeProps {
  children: ReactNode;
  color?: "primary" | "secondary" | "accent";
  pulsingDot?: boolean;
}

export const QuantumBadge = ({
  children,
  color = "primary",
  pulsingDot = true,
}: QuantumBadgeProps) => {
  const colors: Record<string, string> = {
    primary: "bg-primary/15 text-primary border-primary/60",
    secondary: "bg-secondary/15 text-secondary border-secondary/60",
    accent: "bg-accent/15 text-accent border-accent/60",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full
        border ${colors[color]}
        text-xs md:text-sm font-medium
        shadow-glow/30
        backdrop-blur-md
      `}
    >
      {pulsingDot && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-60 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
};

// ======================================================
// NeuralGrid
// ======================================================

interface NeuralGridProps {
  className?: string;
  intensity?: number; // 0 a 1
}

export const NeuralGrid = ({
  className = "",
  intensity = 0.2,
}: NeuralGridProps) => {
  const clamped = Math.max(0, Math.min(1, intensity));

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{ opacity: clamped }}
      >
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="neural-grid"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              {/* Nodo central */}
              <circle
                cx="30"
                cy="30"
                r="1.4"
                className="text-primary"
                fill="currentColor"
              />
              {/* Conexiones horizontales y verticales */}
              <line
                x1="30"
                y1="30"
                x2="60"
                y2="30"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/30"
              />
              <line
                x1="30"
                y1="30"
                x2="30"
                y2="60"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/30"
              />
              {/* Conexiones diagonales suaves */}
              <line
                x1="30"
                y1="30"
                x2="50"
                y2="10"
                stroke="currentColor"
                strokeWidth="0.4"
                className="text-primary/20"
              />
              <line
                x1="30"
                y1="30"
                x2="10"
                y2="50"
                stroke="currentColor"
                strokeWidth="0.4"
                className="text-primary/20"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      {/* Glow suave sobre el grid para sensación XR */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,247,255,0.18), transparent 60%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};
