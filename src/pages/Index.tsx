// ============================================================================
// TAMV MD-X4™ v7.0 UNIFIED - INDEX PAGE
// Unified from all OsoPanda1 repos with 100x Visual Quality
// Ecosistema Civilizatorio Latinoamericano
// ============================================================================

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Compass, Users, MessageCircle, Video, Radio, Music, Gamepad2,
  ShoppingBag, Globe, Sparkles, Heart, Share2, Send, Play, Pause,
  TrendingUp, Zap, Layers, Search, Bell, Settings, Plus, Camera,
  Mic, Image, Smile, Gift, MapPin, Hash, AtSign, Eye, Flame,
  ChevronRight, ChevronLeft, Wifi, WifiOff, Volume2, VolumeX,
  Maximize2, Minimize2, MoreHorizontal, Bookmark, Flag, UserPlus,
  LogIn, Star, Crown, Diamond, Wallet, Activity, Headphones,
  Wifi as LiveIcon, Ghost, Sparkle, Rocket, Waves, Brain,
  ShoppingCart, Store, GraduationCap, PiggyBank, CreditCard, Gem, Palette,
  Shield, BookOpen
} from "lucide-react";

// Import enhanced components
import CinematicIntro from "@/components/CinematicIntro";
import { EpicHero } from "@/components/effects/EpicHero";
import { PremiumCard, StatCard, FeatureCard } from "@/components/effects/PremiumCard";
import { EpicBackground } from "@/components/effects/EpicBackground";
import { NextGenFeed } from "@/components/social/NextGenFeed";
import { FEDERATION_COUNT } from "@/lib/federations";

// Import hooks
import { useBackgroundControl } from "@/components/UnifiedBackground";
import { useAuth } from "@/hooks/useAuth";

// ============================================================================
// UNIFIED DATA FROM ALL OSOPANDA1 REPOS
// ============================================================================

const UNIFIED_FEATURES = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Ecosistema Federado",
    description: `${FEDERATION_COUNT} federaciones interconectadas. Arquitectura antifrágil con soberanía digital total.`,
    gradient: "from-primary/20 to-secondary/20",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Isabella AI",
    description: "Inteligencia artificial emocional avanzada. La IA más humana del mundo digital.",
    gradient: "from-secondary/20 to-accent {
    icon: <Layers className="w-6 h-6" />,
    title: "DreamSpaces XR",
    description: "Espacios virtuales infinitos en 3D/4D. Crea mundos imposibles con física cuántica.",
    gradient: "from-ambecceccecceccent/20 to-secondary <GraduationCap className="w-6 h-6" />,
    title: "Universidad TAMV",
    description: "Educación certificada en blockchain. Certificaciones BookPI reconocidas globalmente.",
    gradient: "from-emeraldprimaryprimaryprimary/20 to-accentlassName="w-6 h-6" />,
    title: "KAOS Audio",
    description: "Frecuencias binaurales 432Hz. Audio inmersivo que transforma la consciencia.",
    gradient: "from-rose-500/20 tsecondary/20 secondary/20 to-primary<ShoppingBag className="w-6 h-6" />,
    title: "Marketplace Global",
    description: "30+ formas de monetización ética. Economía federada con distribución justa.",
    gradient: "from-green-500/20accent/20 to-primary;

const UNIFIED_STATS = [
  { value: "30+", label: "Formas Monetización", icon: <Wallet />, color: "aqua" as const },
  { value: "48", label: "Federaciones", icon: <Layers />, color: "aqua" as const },
  { value: "∞", label: "DreamSpaces", icon: <Sparkles />, color: "gold" as const },
  { value: "100%", label: "Soberanía Digital", icon: <Shield />, color: "aqua" as const },
];

const REPOS_UNIFIED = [
  { name: "tamv-digital-nexus", category: "Core" },
  { name: "ecosistema-nextgen-tamv", category: "Ecosystem" },
  { name: "TAMV-ONLINE-NEXTGEN-1.0", category: "Platform" },
  { name: "DOCUMENTACION-TAMV-DM-X4", category: "Docs" },
  { name: "tamv-sentient-digital-nexus", category: "AI" },
  { name: "NEWTAMVGENESIS", category: "Genesis" },
  { name: "epic-visual-forge", category: "Visual" },
  { name: "civilizational-core", category: "Core" },
];

const TRENDING_HASHTAGS = [
  { tag: "#TAMVQuantum", posts: "2.4M" },
  { tag: "#DreamSpacesXR", posts: "1.8M" },
  { tag: "#IsabellaAI", posts: "956K" },
  { tag: "#NuevaEraDigital", posts: "743K" },
  { tag: "#UTAMV2026", posts: "621K" },
  { tag: "#KAOSAudio", posts: "489K" },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const { setBackground } = useBackgroundControl();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setBackground("particles", 0.5);
  }, [setBackground]);

  if (showIntro) {
    return <CinematicIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Epic Background */}
      <EpicBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* ═══════════════════════════════════════════════════════════════════
           HERO SECTION - Epic Entrance
           ═══════════════════════════════════════════════════════════════════ */}
        <EpicHero onEnter={() => navigate("/dashboard")} />

        {/* ═══════════════════════════════════════════════════════════════════
           UNIFIED REPOS SECTION
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 px-4 py-1.5 text-sm bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
                <Layers className="w-3 h-3 mr-2" />
                Unificación Completa
              </Badge>
              <h2 className="text-headline text-foreground mb-4">
                Repositorios <span className="text-gradient-quantum">Unificados</span>
              </h2>
              <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
                Todo el conocimiento y código del ecosistema TAMV ahora en una 
                sola plataforma civilizatoria unificada.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {REPOS_UNIFIED.map((repo, index) => (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-crystal p-4 rounded-xl text-center hover:border-primary/30 transition-all group cursor-default"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5 text-[hsl(var(--silver-metallic))]" />
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{repo.name}</p>
                  <p className="text-xs text-white/40 mt-1">{repo.category}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
           FEATURES SECTION
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 px-4 py-1.5 text-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
                <Sparkles className="w-3 h-3 mr-2" />
                Ecosistema Completo
              </Badge>
              <h2 className="text-headline text-white mb-4">
                Todo en una sola <span className="text-gradient-quantum">Plataforma</span>
              </h2>
              <p className="text-body-large text-white/60 max-w-2xl mx-auto">
                Red social, metaverso, universidad, marketplace, IA y más. 
                Un solo ecosistema para crear, cobrar y crecer.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {UNIFIED_FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    gradient={feature.gradient}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
           STATS SECTION
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-crystal rounded-3xl p-8 md:p-12"
            >
              <div className="text-center mb-12">
                <h2 className="text-headline text-white mb-4">
                  Métricas <span className="text-gradient-quantum">Civilizatorias</span>
                </h2>
                <p className="text-body-large text-white/60">
                  El poder de la unificación en números
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {UNIFIED_STATS.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <StatCard
                      label={stat.label}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
           NEXT-GEN SOCIAL FEED — 300x Superior
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <Badge className="mb-4 px-4 py-1.5 text-sm bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30">
                <Flame className="w-3 h-3 mr-2" />
                Civilizatory Flow
              </Badge>
              <h2 className="text-headline text-white mb-2">
                Feed <span className="text-gradient-quantum">Social Quantum</span>
              </h2>
              <p className="text-sm text-white/40">{FEDERATION_COUNT} federaciones · Tiempo real · Soberanía 100%</p>
            </motion.div>
            <NextGenFeed />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
           CTA SECTION
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-crystal rounded-3xl p-12 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 p-[2px]"
                >
                  <div className="w-full h-full rounded-full bg-[#050508] flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-cyan-400" />
                  </div>
                </motion.div>

                <h2 className="text-display text-white mb-6">
                  Únete a la <span className="text-gradient-quantum">Revolución</span>
                </h2>
                <p className="text-body-large text-white/60 max-w-2xl mx-auto mb-8">
                  Visión y creación de <span className="text-cyan-400 font-semibold">Edwin Oswaldo Castillo Trejo</span>. 
                  Desde Real del Monte, Hidalgo — un ecosistema civilizatorio para que los creadores 
                  de LATAM tengan más herramientas, más control y más soberanía digital.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isAuthenticated ? (
                    <Link to="/dashboard">
                      <Button
                        size="lg"
                        className="btn-premium px-8 py-6 text-lg rounded-xl"
                      >
                        <Rocket className="w-5 h-5 mr-2" />
                        Entrar al Ecosistema
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/auth">
                        <Button
                          size="lg"
                          className="btn-premium px-8 py-6 text-lg rounded-xl"
                        >
                          <Star className="w-5 h-5 mr-2" />
                          Crear Cuenta Gratis
                        </Button>
                      </Link>
                      <Link to="/docs">
                        <Button
                          size="lg"
                          variant="outline"
                          className="glass-crystal px-8 py-6 text-lg rounded-xl border-white/20 hover:border-cyan-400/50"
                        >
                          <BookOpen className="w-5 h-5 mr-2" />
                          Explorar Documentación
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                <p className="text-sm text-white/40 mt-6">
                  Orgullosamente Latinoamericano · Dedicado a Reina Trejo Serrano ✦
                  <br />
                  <span className="text-white/30">Visión de Edwin Oswaldo Castillo Trejo</span>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
           FOOTER
           ═══════════════════════════════════════════════════════════════════ */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/30">
                  <img src="/src/assets/LOGOTAMV2.jpg" alt="TAMV" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-white">TAMV MD-X4™</p>
                  <p className="text-xs text-white/40">v7.0 Unified</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-white/60">
                <Link to="/docs" className="hover:text-cyan-400 transition-colors">Documentación</Link>
                <Link to="/governance" className="hover:text-cyan-400 transition-colors">Gobernanza</Link>
                <Link to="/economy" className="hover:text-cyan-400 transition-colors">Economía</Link>
                <Link to="/profile" className="hover:text-cyan-400 transition-colors">Perfil</Link>
              </div>

              <p className="text-sm text-white/40">
                © 2026 TAMV MD-X4™ · Edwin Oswaldo Castillo Trejo · Todos los derechos reservados
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
