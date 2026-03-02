// ============================================================================
// TAMV MD-X4™ - PREMIUM CARD COMPONENT v7.0
// Ultra-Premium Visual Card with 100x Quality
// ============================================================================

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export const PremiumCard = ({
  children,
  className = "",
  hover = true,
  glow = false,
  gradient = false,
  onClick,
}: PremiumCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        hover
          ? {
              y: -8,
              transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
            }
          : undefined
      }
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/[0.08] to-white/[0.02]
        backdrop-blur-xl
        border border-white/[0.1]
        ${hover ? "cursor-pointer" : ""}
        ${className}
      `}
      style={{
        boxShadow: glow
          ? "0 0 40px rgba(0, 217, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4)"
          : "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Gradient overlay */}
      {gradient && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(0, 217, 255, 0.3) 0%, rgba(157, 78, 221, 0.3) 100%)",
          }}
        />
      )}
      
      {/* Shimmer effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />
      
      {/* Border glow */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(0, 217, 255, 0.3), rgba(157, 78, 221, 0.3))",
          padding: "1px",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          opacity: 0.5,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// Compact stat card variant
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "aqua" | "purple" | "gold" | "pink";
}

export const StatCard = ({
  label,
  value,
  icon,
  trend,
  trendValue,
  color = "aqua",
}: StatCardProps) => {
  const colorMap = {
    aqua: "from-cyan-400 to-blue-500",
    purple: "from-purple-400 to-pink-500",
    gold: "from-amber-400 to-orange-500",
    pink: "from-pink-400 to-rose-500",
  };

  return (
    <PremiumCard className="p-6" glow>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/60 font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend && trendValue && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${
              trend === "up" ? "text-green-400" : 
              trend === "down" ? "text-red-400" : "text-white/60"
            }`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg`}>
            <div className="text-white">{icon}</div>
          </div>
        )}
      </div>
    </PremiumCard>
  );
};

// Feature card variant
interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  gradient?: string;
}

export const FeatureCard = ({
  title,
  description,
  icon,
  gradient = "from-cyan-500/20 to-purple-500/20",
}: FeatureCardProps) => {
  return (
    <PremiumCard className="p-8 h-full" hover gradient>
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6`}>
        <div className="text-2xl text-white">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </PremiumCard>
  );
};

export default PremiumCard;
