// ============================================================================
// TAMV MD-X4™ - EPIC HERO COMPONENT v9.0 — Zero Mediocrity
// Autor visionario y propietario: Edwin Oswaldo Castillo Trejo
// 48 Federaciones Civilizatorias · Evolución de las Redes Sociales
// ============================================================================

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Sparkles, Globe, Users, 
  Rocket, Brain, Shield, Crown,
  ChevronRight, Play, Cpu, Layers,
  Zap, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FEDERATION_COUNT } from "@/lib/federations";

interface EpicHeroProps {
  onEnter?: () => void;
}

const EVOLUTION_PILLARS = [
  {
    icon: <Brain className="w-5 h-5" />,
    label: "Isabella AI Prime",
    desc: "Orquestadora Civilizatoria",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    label: "Self-Healing",
    desc: "Autocuración de Código",
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    label: "OMNI-KERNEL",
    desc: "Organismo Digital Vivo",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    label: "Soberanía 100%",
    desc: "Identidad & Datos Tuyos",
  },
];

const STATS = [
  { value: "7", label: "Federaciones Core" },
  { value: "L0–L3", label: "Capas Antifrágiles" },
  { value: "∞", label: "DreamSpaces XR" },
  { value: "100%", label: "Soberanía Digital" },
];

export const EpicHero = ({ onEnter }: EpicHeroProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 300 + i * 100,
              height: 300 + i * 100,
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              background: `radial-gradient(circle, ${
                i % 2 === 0
                  ? "rgba(0, 217, 255, 0.08)"
                  : "rgba(157, 78, 221, 0.08)"
              } 0%, transparent 70%)`,
              filter: "blur(60px)",
            }}
            animate={{
              x: mousePos.x * (0.5 + i * 0.1),
              y: mousePos.y * (0.5 + i * 0.1),
            }}
            transition={{ type: "spring", stiffness: 50, damping: 30 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-crystal mb-8"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-white/80">
            Ecosistema Civilizatorio OMNI-KERNEL
          </span>
          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-xs font-bold text-white">
            MD-X4
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-display mb-6"
        >
          <span className="text-gradient-quantum">TAMV</span>
          <br />
          <span className="text-white text-4xl md:text-5xl lg:text-6xl font-bold">
            La Nueva Casa de los
          </span>
          <br />
          <span className="text-gradient-quantum text-4xl md:text-5xl lg:text-6xl font-bold">
            Creadores de LATAM
          </span>
        </motion.h1>

        {/* Subtitle — product-led, no mysticism */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-body-large text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Un solo ecosistema para <span className="text-cyan-400 font-semibold">crear, cobrar y crecer</span>.
          Menos explotación, más control sobre tu comunidad, tu contenido y tus ingresos.
          <br />
          <span className="text-white/50 text-sm mt-2 inline-block">
            Visión y creación de Edwin Oswaldo Castillo Trejo · Desde Real del Monte, Hidalgo
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            onClick={onEnter}
            className="btn-premium px-8 py-6 text-lg font-semibold rounded-xl group"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Soy Creador Inconforme
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Link to="/evolution">
            <Button
              size="lg"
              variant="outline"
              className="glass-crystal px-8 py-6 text-lg font-semibold rounded-xl border-white/20 hover:border-cyan-400/50 hover:bg-white/5"
            >
              <Cpu className="w-5 h-5 mr-2" />
              Ver Evolución OMNI-KERNEL
            </Button>
          </Link>
        </motion.div>

        {/* Evolution Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {EVOLUTION_PILLARS.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl glass-crystal hover:border-cyan-400/30 transition-colors cursor-default"
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-cyan-400">
                {feature.icon}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{feature.label}</p>
                <p className="text-xs text-white/50">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="text-center p-6 rounded-2xl glass-crystal"
            >
              <p className="text-4xl md:text-5xl font-bold text-gradient-quantum mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-32 h-1 mx-auto mt-16 rounded-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        />
      </div>
    </div>
  );
};

export default EpicHero;
