// ============================================================================
// TAMV MD-X4™ — HOME: Social Feed First (Instagram/TikTok-style)
// Visual-first: 85% media, 15% text
// ============================================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Flame, TrendingUp, Users, Video, Radio, Search,
  Hash, Crown, Zap, Globe, Star, Sparkles,
} from "lucide-react";

// Social components
import { NextGenFeed } from "@/components/social/NextGenFeed";
import { TrendingSidebar } from "@/components/social/TrendingSidebar";
import { StoriesCarousel } from "@/components/social/StoriesCarousel";
import CinematicIntro from "@/components/CinematicIntro";
import { useAuth } from "@/hooks/useAuth";

// ============================================================================
// UNIFIED DATA FROM ALL OSOPANDA1 REPOS
// ============================================================================

const UNIFIED_FEATURES = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Ecosistema Federado",
    description: "7 capas civilizatorias interconectadas. Arquitectura antifrágil con soberanía digital total.",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Isabella AI",
    description: "Inteligencia artificial emocional avanzada. La IA más humana del mundo digital.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "DreamSpaces XR",
    description: "Espacios virtuales infinitos en 3D/4D. Crea mundos imposibles con física cuántica.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Universidad TAMV",
    description: "Educación certificada en blockchain. Certificaciones BookPI reconocidas globalmente.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: <Music className="w-6 h-6" />,
    title: "KAOS Audio",
    description: "Frecuencias binaurales 432Hz. Audio inmersivo que transforma la consciencia.",
    gradient: "from-rose-500/20 to-red-500/20",
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "Marketplace Global",
    description: "30+ formas de monetización ética. Economía federada con distribución justa.",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
];

const UNIFIED_STATS = [
  { value: "30+", label: "Formas Monetización", icon: <Wallet />, color: "aqua" as const },
  { value: "7", label: "Capas Federadas", icon: <Layers />, color: "purple" as const },
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


const QUICK_ACCESS_LINKS = [
  { label: "Metaverso", icon: <Globe />, path: "/metaverse", iconClass: "bg-cyan-500/20 text-cyan-300" },
  { label: "Isabella AI", icon: <Brain />, path: "/isabella", iconClass: "bg-purple-500/20 text-purple-300" },
  { label: "Universidad", icon: <GraduationCap />, path: "/university", iconClass: "bg-amber-500/20 text-amber-300" },
  { label: "DreamSpaces", icon: <Sparkles />, path: "/dream-spaces", iconClass: "bg-pink-500/20 text-pink-300" },
  { label: "Marketplace", icon: <ShoppingBag />, path: "/monetization", iconClass: "bg-emerald-500/20 text-emerald-300" },
  { label: "Gobernanza", icon: <Crown />, path: "/governance", iconClass: "bg-yellow-500/20 text-yellow-300" },
];

const NEXUS_COMMAND_DECK = [
  { title: "Estado Federado", metric: "177 repos sincronizados", status: "Operativo" },
  { title: "Resiliencia IA", metric: "99.93% continuidad", status: "Estable" },
  { title: "XR Rendering", metric: "Latencia < 24ms", status: "Optimizado" },
];

// ============================================================================
// MAIN COMPONENT
// MAIN
// ============================================================================

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const { isAuthenticated } = useAuth();

  if (showIntro) {
    return <CinematicIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen py-4">
      {/* Top bar: Search + Quick actions */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Buscar en TAMV..."
              className="w-full bg-card/40 border border-border/20 rounded-xl pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 backdrop-blur-sm"
            />
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
           TRENDING SECTION
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Trending Hashtags */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <PremiumCard className="p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
                      <TrendingUp className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Tendencias Globales</h3>
                      <p className="text-sm text-white/50">Lo más viral en TAMV</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {TRENDING_HASHTAGS.map((item, index) => (
                      <motion.div
                        key={item.tag}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-white/30">0{index + 1}</span>
                          <span className="text-white group-hover:text-cyan-400 transition-colors">
                            {item.tag}
                          </span>
                        </div>
                        <span className="text-sm text-white/40">{item.posts} posts</span>
                      </motion.div>
                    ))}
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Quick Access */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <PremiumCard className="p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                      <Zap className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Acceso Rápido</h3>
                      <p className="text-sm text-white/50">Navega el ecosistema</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {QUICK_ACCESS_LINKS.map((link) => (
                      <Link key={link.path} to={link.path}>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group"
                        >
                          <div className={`p-2 rounded-lg ${link.iconClass}`}>
                            {link.icon}
                          </div>
                          <span className="text-white group-hover:text-cyan-400 transition-colors flex-1">
                            {link.label}
                          </span>
                          <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-cyan-400 transition-colors" />
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </PremiumCard>
              </motion.div>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════════════════════════════
           NEXUS COMMAND DECK
           ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {NEXUS_COMMAND_DECK.map((item) => (
                <div
                  key={item.title}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1020]/80 via-[#101728]/70 to-[#071018]/90 p-6"
                >
                  <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-cyan-500/20 blur-2xl" />
                  <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-3">{item.status}</p>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-cyan-300 font-medium">{item.metric}</p>
                </div>
              ))}
            </motion.div>
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
          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <Link to="/auth">
                <Button size="sm" className="rounded-xl bg-primary text-primary-foreground text-xs gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Unirse
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main layout: Feed + Trending Sidebar */}
      <div className="max-w-7xl mx-auto px-4 flex gap-6">
        {/* Feed Column */}
        <div className="flex-1 max-w-2xl mx-auto xl:mx-0">
          {/* Stories */}
          <StoriesCarousel />

          {/* Feed tabs */}
          <Tabs defaultValue="foryou" className="w-full mb-4">
            <TabsList className="bg-card/30 border border-border/20 rounded-xl p-1 h-auto flex w-full">
              <TabsTrigger value="foryou" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Flame className="w-3.5 h-3.5" /> Para ti
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Users className="w-3.5 h-3.5" /> Siguiendo
              </TabsTrigger>
              <TabsTrigger value="live" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Radio className="w-3.5 h-3.5" /> En Vivo
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <TrendingUp className="w-3.5 h-3.5" /> Tendencia
              </TabsTrigger>
            </TabsList>

            <TabsContent value="foryou" className="mt-4">
              <NextGenFeed />
            </TabsContent>

            <TabsContent value="following" className="mt-4">
              <NextGenFeed />
            </TabsContent>

            <TabsContent value="live" className="mt-4">
              <LiveGrid />
            </TabsContent>

            <TabsContent value="trending" className="mt-4">
              <NextGenFeed />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar — Trending (desktop only) */}
        <TrendingSidebar />
      </div>
    </div>
  );
};

// ─── Live Grid ───
const LIVE_CHANNELS = [
  { name: "Quantum Night Live", viewers: "2.3K", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=225&fit=crop", host: "TAMV Official" },
  { name: "Coding Session", viewers: "891", img: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&h=225&fit=crop", host: "Carlos M." },
  { name: "Art Workshop XR", viewers: "456", img: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=225&fit=crop", host: "María R." },
  { name: "Music Jam Binaural", viewers: "1.2K", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=225&fit=crop", host: "KAOS Audio" },
  { name: "DreamSpace Build", viewers: "678", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=225&fit=crop", host: "Luna S." },
  { name: "UTAMV Clase Abierta", viewers: "1.5K", img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=225&fit=crop", host: "UTAMV" },
];

const LiveGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {LIVE_CHANNELS.map((ch) => (
      <motion.div
        key={ch.name}
        whileHover={{ scale: 1.02 }}
        className="relative rounded-xl overflow-hidden cursor-pointer group"
      >
        <img src={ch.img} alt="" className="w-full aspect-video object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        <Badge className="absolute top-2.5 left-2.5 bg-destructive/90 text-destructive-foreground gap-1 text-[9px] animate-pulse rounded-sm">
          <Radio className="w-3 h-3" /> LIVE
        </Badge>
        <div className="absolute top-2.5 right-2.5 text-[10px] bg-background/60 backdrop-blur px-2 py-0.5 rounded-sm flex items-center gap-1 font-mono">
          <Users className="w-3 h-3" />{ch.viewers}
        </div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <p className="font-bold text-sm">{ch.name}</p>
          <p className="text-[10px] text-muted-foreground">{ch.host}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

export default Index;
