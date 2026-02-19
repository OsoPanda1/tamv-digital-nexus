// ============================================================================
// TAMV MD-X4â"¢ - Landing Page
// Elegant, sophisticated landing with unified design
// ============================================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, Sparkles, Globe, Users, Zap, Brain, Shield, 
  Headphones, BookOpen, Vote, DollarSign, Layers, Star,
  Compass, Tv, GraduationCap, Music, Gamepad2, ShoppingBag,
  Users as UsersIcon, Radio, Play, Flame
} from "lucide-react";
import { CinematicIntro } from "@/components/CinematicIntro";
import { useBackgroundControl } from "@/components/UnifiedBackground";
import { federationManager } from "@/systems/FederationSystem";
import { motion } from "framer-motion";

// ============================================================================
// Quick Navigation Configuration
// ============================================================================

const QUICK_NAV = [
  { icon: Compass, label: "Explorar", path: "/ecosystem", color: "text-cyan-400" },
  { icon: Tv, label: "Videos", path: "/dream-spaces", color: "text-red-400" },
  { icon: Radio, label: "Lives", path: "/kaos", color: "text-green-400" },
  { icon: Music, label: "MÃºsica", path: "/kaos", color: "text-purple-400" },
  { icon: GraduationCap, label: "Cursos", path: "/university", color: "text-amber-400" },
  { icon: UsersIcon, label: "Grupos", path: "/community", color: "text-blue-400" },
  { icon: ShoppingBag, label: "Market", path: "/monetization", color: "text-pink-400" },
  { icon: Gamepad2, label: "Games", path: "/dream-spaces", color: "text-emerald-400" },
];

const FEATURED_REELS = [
  { id: 1, img: "https://picsum.photos/seed/reel1/300/530", user: "MarÃ­a R.", views: "12.4K" },
  { id: 2, img: "https://picsum.photos/seed/reel2/300/530", user: "Carlos M.", views: "8.2K" },
  { id: 3, img: "https://picsum.photos/seed/reel3/300/530", user: "TAMV", views: "45.1K" },
  { id: 4, img: "https://picsum.photos/seed/reel4/300/530", user: "Isabella", views: "23.7K" },
  { id: 5, img: "https://picsum.photos/seed/reel5/300/530", user: "UTAMV", views: "5.6K" },
  { id: 6, img: "https://picsum.photos/seed/reel6/300/530", user: "Ana T.", views: "9.3K" },
];

// ============================================================================
// Feature Cards Configuration
// ============================================================================

const coreFeatures = [
  {
    icon: Sparkles,
    title: "Dream Spaces 4D",
    description: "Espacios inmersivos multisensoriales con audio espacial binaural",
    link: "/dream-spaces",
    federation: "DREAMSPACES",
    gradient: "from-rose-500 to-rose-700",
  },
  {
    icon: Brain,
    title: "Isabella AI",
    description: "Asistente multimodal con memoria cuÃ¡ntica y orientaciÃ³n emocional",
    link: "/isabella",
    federation: "ISABELLA",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Users,
    title: "Comunidad Global",
    description: "Red social inmersiva con grupos, canales y streaming 4D",
    link: "/community",
    federation: "HARMONY",
    gradient: "from-pink-500 to-pink-700",
  },
  {
    icon: Shield,
    title: "Anubis Security",
    description: "Sistema de seguridad post-cuÃ¡ntica DEKATEOTL de 11 capas",
    link: "/anubis",
    federation: "ANUBIS",
    gradient: "from-red-500 to-red-700",
  },
];

const ecosystemFeatures = [
  { icon: Headphones, label: "KAOS Audio", desc: "Audio 4D", link: "/kaos" },
  { icon: BookOpen, label: "Universidad", desc: "Certificaciones", link: "/university" },
  { icon: Vote, label: "Gobernanza", desc: "DAO HÃ­brida", link: "/governance" },
  { icon: DollarSign, label: "EconomÃ­a", desc: "MSR/TCEP", link: "/economy" },
  { icon: Layers, label: "Ecosistema", desc: "21+ Federaciones", link: "/ecosystem" },
  { icon: Star, label: "ID-NVIDA", desc: "Identidad Digital", link: "/profile" },
];

// ============================================================================
// Main Landing Page Component
// ============================================================================

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const { setBackground } = useBackgroundControl();
  const fedStats = federationManager.getStatistics();

  useEffect(() => {
    // Set quantum background for landing page
    setBackground('quantum', 0.3);
  }, [setBackground]);

  if (showIntro) {
    return <CinematicIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge 
              className="mb-6 px-4 py-2 text-sm border-aqua/30 text-aqua"
              variant="outline"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ecosistema Digital Civilizatorio
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span 
                style={{
                  background: 'linear-gradient(135deg, #00D9FF, #3E7EA3, #C1CBD5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                TAMV MD-X4â"¢
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              La primera plataforma digital civilizatoria de LatinoamÃ©rica. 
              Un ecosistema completo de IA, economÃ­a, educaciÃ³n y metaverso.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8"
                >
                  Comenzar Ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-aqua/30 text-aqua hover:bg-aqua/10 px-8"
                >
                  DocumentaciÃ³n
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {QUICK_NAV.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={index} to={item.path}>
                  <motion.div
                    className="flex flex-col items-center p-3 rounded-xl border border-aqua/10 hover:border-aqua/30 transition-all duration-300 cursor-pointer"
                    style={{ background: 'rgba(11, 12, 17, 0.6)' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className={`w-5 h-5 ${item.color} mb-1`} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Reels */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Play className="w-5 h-5 text-aqua" />
              Reels Destacados
            </h2>
            <Link to="/community" className="text-sm text-aqua hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {FEATURED_REELS.map((reel) => (
              <motion.div
                key={reel.id}
                className="relative flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={reel.img} 
                  alt={`Reel by ${reel.user}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-medium truncate">{reel.user}</p>
                  <p className="text-xs text-muted-foreground">{reel.views} vistas</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pilares del Ecosistema
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cuatro sistemas integrados que forman la base de la civilizaciÃ³n digital TAMV
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className="p-6 border-aqua/20 hover:border-aqua/40 transition-all duration-300 group cursor-pointer"
                      style={{
                        background: 'rgba(11, 12, 17, 0.6)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-aqua transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                          <Badge variant="outline" className="mt-3 text-xs border-aqua/20 text-aqua">
                            {feature.federation}
                          </Badge>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-aqua group-hover:translate-x-1 transition-all" />
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ecosystem Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Card 
            className="p-8 border-aqua/20"
            style={{
              background: 'rgba(11, 12, 17, 0.6)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h3 className="text-xl font-bold mb-6 text-center">Explora el Ecosistema</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {ecosystemFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link key={index} to={feature.link}>
                    <motion.div
                      className="flex flex-col items-center p-4 rounded-lg border border-aqua/10 hover:border-aqua/30 transition-all cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Icon className="w-6 h-6 text-aqua mb-2" />
                      <span className="text-sm font-medium">{feature.label}</span>
                      <span className="text-xs text-muted-foreground">{feature.desc}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      {/* Federation Stats */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">Estado de las Federaciones</h2>
            <p className="text-muted-foreground">21+ sistemas integrados operando en sincronÃ­a</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card 
              className="p-6 text-center border-aqua/20"
              style={{ background: 'rgba(11, 12, 17, 0.6)' }}
            >
              <p className="text-4xl font-bold text-aqua mb-1">{fedStats.total}</p>
              <p className="text-sm text-muted-foreground">Federaciones</p>
            </Card>
            <Card 
              className="p-6 text-center border-emerald-500/20"
              style={{ background: 'rgba(11, 12, 17, 0.6)' }}
            >
              <p className="text-4xl font-bold text-emerald-400 mb-1">{fedStats.active}</p>
              <p className="text-sm text-muted-foreground">Activas</p>
            </Card>
            <Card 
              className="p-6 text-center border-amber-500/20"
              style={{ background: 'rgba(11, 12, 17, 0.6)' }}
            >
              <p className="text-4xl font-bold text-amber-400 mb-1">{fedStats.development}</p>
              <p className="text-sm text-muted-foreground">En Desarrollo</p>
            </Card>
            <Card 
              className="p-6 text-center border-violet-500/20"
              style={{ background: 'rgba(11, 12, 17, 0.6)' }}
            >
              <p className="text-4xl font-bold text-violet-400 mb-1">{fedStats.quantumEnabled}</p>
              <p className="text-sm text-muted-foreground">Quantum Ready</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ãšnete a la CivilizaciÃ³n Digital
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              LatinoamÃ©rica estÃ¡ despertando. SÃ© parte de la revoluciÃ³n digital 
              que estÃ¡ transformando nuestra regiÃ³n.
            </p>
            <Link to="/auth">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-6 text-lg"
              >
                Crear Cuenta Gratuita
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-aqua/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Â© 2025 TAMV MD-X4â"¢ â€" Ecosistema Digital Civilizatorio
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Hecho con â¤ï¸ en LatinoamÃ©rica
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
