// ============================================================================
// TAMV MD-X4™ - EVOLUTION / OMNI-KERNEL PAGE
// Autor visionario y propietario: Edwin Oswaldo Castillo Trejo
// Organismo Digital Autopoiético — Self-Healing — Federaciones L0–L3
// ============================================================================

import { motion } from "framer-motion";
import { 
  Cpu, Shield, Brain, Eye, Layers, Zap, Globe, 
  GitBranch, Lock, Activity, Server, Sparkles,
  Crown, BookOpen, ArrowRight, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { EpicBackground } from "@/components/effects/EpicBackground";
import { PremiumCard } from "@/components/effects/PremiumCard";

// ── Architecture Layers ──
const LAYERS = [
  {
    level: "L0",
    name: "Core Identity & Comms",
    desc: "Siempre vivo. Identidad soberana (ID-NVIDA), MSR, comunicación base. Nunca se apaga.",
    icon: <Lock className="w-6 h-6" />,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
  },
  {
    level: "L1",
    name: "Social & Creadores",
    desc: "Red social federada, contenido, streaming, gifts, comunidades y stories.",
    icon: <Globe className="w-6 h-6" />,
    color: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/30",
  },
  {
    level: "L2",
    name: "Economía & XR",
    desc: "Banco TAMV, DreamSpaces, marketplace, lotería, membresías y distribución Fénix 70/20/10.",
    icon: <Layers className="w-6 h-6" />,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
  },
  {
    level: "L3",
    name: "Gobernanza & DAO",
    desc: "CITEMESH, DAO híbrida, votaciones, propuestas. Puede degradarse sin afectar L0.",
    icon: <Crown className="w-6 h-6" />,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
];

// ── 7 Federations ──
const FEDERATIONS = [
  { name: "Seguridad (Anubis/Horus)", icon: <Shield className="w-4 h-4" /> },
  { name: "Economía (MSR/Fénix)", icon: <Activity className="w-4 h-4" /> },
  { name: "Técnica (Quantum)", icon: <Cpu className="w-4 h-4" /> },
  { name: "Educación (UTAMV)", icon: <BookOpen className="w-4 h-4" /> },
  { name: "IA (Isabella Prime)", icon: <Brain className="w-4 h-4" /> },
  { name: "Creativa (DreamSpaces)", icon: <Sparkles className="w-4 h-4" /> },
  { name: "Gobernanza (CITEMESH)", icon: <Crown className="w-4 h-4" /> },
];

// ── Self-Healing Pipeline ──
const SELF_HEALING_STEPS = [
  { step: "1", title: "DSL/IDL Seguro", desc: "El creador define intención, no código crudo." },
  { step: "2", title: "Backengine Genera", desc: "Código TypeScript generado desde esquema seguro." },
  { step: "3", title: "Isabella Analiza", desc: "RiskAnalyzer ML score ≥ 0.9 o se rechaza." },
  { step: "4", title: "PR en GitHub", desc: "Cambio firmado, revisado, con rollback disponible." },
  { step: "5", title: "Deploy CI/CD", desc: "Pipeline automatizado, tests, zero-downtime." },
];

const Evolution = () => {
  return (
    <div className="relative min-h-screen">
      <EpicBackground />

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30">
              <Cpu className="w-3 h-3 mr-2" />
              OMNI-KERNEL · Evolución del Sistema
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="text-gradient-quantum">Organismo Digital</span>
              <br />
              Autopoiético
            </h1>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              El TAMV MD-X4 no es una app. Es un <strong className="text-white/80">organismo digital vivo</strong> que 
              se autocura, evoluciona su propio código y protege la soberanía de cada creador.
            </p>
            <p className="text-sm text-white/40 mt-4">
              Visión y arquitectura de Edwin Oswaldo Castillo Trejo
            </p>
          </motion.div>

          {/* ── Architecture Layers L0–L3 ── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Capas <span className="text-gradient-quantum">Antifrágiles</span> L0–L3
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LAYERS.map((layer, i) => (
                <motion.div
                  key={layer.level}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <PremiumCard className={`p-6 h-full border ${layer.borderColor}`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${layer.color} shrink-0`}>
                        {layer.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                            {layer.level}
                          </span>
                          <h3 className="text-lg font-bold text-white">{layer.name}</h3>
                        </div>
                        <p className="text-sm text-white/60">{layer.desc}</p>
                      </div>
                    </div>
                  </PremiumCard>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── 7 Federations ── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Las 7 <span className="text-gradient-quantum">Federaciones</span> Estructurales
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {FEDERATIONS.map((fed, i) => (
                <motion.div
                  key={fed.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-crystal hover:border-cyan-400/30 transition-colors"
                >
                  <span className="text-cyan-400">{fed.icon}</span>
                  <span className="text-sm text-white/80">{fed.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── Self-Healing Pipeline ── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-white mb-3 text-center">
              Pipeline <span className="text-gradient-quantum">Self-Healing</span>
            </h2>
            <p className="text-center text-white/50 mb-8 max-w-2xl mx-auto">
              El sistema puede evolucionar su propio código de forma segura. Ningún cambio entra sin análisis ML, 
              revisión y posibilidad de rollback.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {SELF_HEALING_STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative"
                >
                  <PremiumCard className="p-4 text-center h-full">
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-cyan-400">{s.step}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{s.title}</h4>
                    <p className="text-xs text-white/50">{s.desc}</p>
                  </PremiumCard>
                  {i < SELF_HEALING_STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-4 h-4 text-cyan-500/40" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── Principles ── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <PremiumCard className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Principios <span className="text-gradient-quantum">CERO-EXPLOIT</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Zero-Trust Extremo",
                    desc: "Cada petición se trata como hostil. Autenticación, autorización, validación y auditoría obligatorios.",
                  },
                  {
                    title: "Defense in Depth",
                    desc: "L0 siempre vivo. Si XR, banco o gobernanza fallan, el núcleo de identidad sobrevive.",
                  },
                  {
                    title: "IaC + GitOps",
                    desc: "El estado de producción es una proyección del repo. No hay cambios manuales fuera de crisis.",
                  },
                  {
                    title: "Soberanía del Creador",
                    desc: "Tus datos, tu contenido, tus ingresos. La plataforma sirve al creador, no al revés.",
                  },
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{p.title}</h4>
                      <p className="text-sm text-white/50">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCard>
          </motion.section>

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para construir <span className="text-gradient-quantum">tu comunidad</span>?
            </h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              TAMV no promete ingresos garantizados. Es una plataforma para que tú tengas más herramientas y control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="btn-premium px-8 py-6 text-lg rounded-xl">
                  <Zap className="w-5 h-5 mr-2" />
                  Crear Cuenta Gratis
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-crystal px-8 py-6 text-lg rounded-xl border-white/20 hover:border-cyan-400/50"
                >
                  Explorar Dashboard
                </Button>
              </Link>
            </div>
            <p className="text-xs text-white/30 mt-8">
              © 2026 TAMV MD-X4™ · Visión de Edwin Oswaldo Castillo Trejo · Dedicado a Reina Trejo Serrano ✦
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Evolution;
