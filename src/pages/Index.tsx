// ============================================================================
// TAMV MD-X4™ — Next-Gen Civilizatory Social Hub
// Auth-connected · Real feed · Immersive · 85% visual / 15% text
// ============================================================================

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Sparkles, Globe, Users, Brain, Shield,
  Play, Music, Gamepad2, ShoppingBag, Radio, GraduationCap,
  Compass, Heart, MessageCircle, Share2, Eye, Flame,
  TrendingUp, Video, Headphones, Star, Zap, Send,
  LogIn, UserPlus, Coins, Vote, BookOpen, Waves,
} from "lucide-react";
import { CinematicIntro } from "@/components/CinematicIntro";
import { useBackgroundControl } from "@/components/UnifiedBackground";
import { motion, AnimatePresence } from "framer-motion";
import { StoriesCarousel } from "@/components/social/StoriesCarousel";
import { useAuth } from "@/hooks/useAuth";
import { useRealFeed, type FeedPost } from "@/hooks/useRealFeed";
import { Textarea } from "@/components/ui/textarea";
import logoImg from "@/assets/LOGOTAMV2.jpg";

// ============================================================================
// Static demo content (shown when DB is empty)
// ============================================================================

const DEMO_POSTS: FeedPost[] = [
  {
    id: "demo-1", author_id: "system", content: "Mi primer DreamSpace en TAMV 🚀✨ La nueva era digital está aquí.",
    media_url: "https://picsum.photos/seed/post1/800/600", media_type: "image",
    likes_count: 1243, comments_count: 89, shares_count: 34, tags: ["#TAMVQuantum"], created_at: new Date(Date.now() - 7200000).toISOString(),
    visibility: "public", author_name: "María R.", author_avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "demo-2", author_id: "system", content: "Sesión binaural KAOS · frecuencias 432Hz 🎵 El audio inmersivo cambia todo.",
    media_url: "https://picsum.photos/seed/post2/800/800", media_type: "image",
    likes_count: 892, comments_count: 56, shares_count: 21, tags: ["#KAOSAudio"], created_at: new Date(Date.now() - 14400000).toISOString(),
    visibility: "public", author_name: "Carlos M.", author_avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: "demo-3", author_id: "system", content: "Nuevo módulo de Universidad TAMV disponible 🎓 Certificación BookPI verificable.",
    media_url: "https://picsum.photos/seed/post3/800/500", media_type: "image",
    likes_count: 3421, comments_count: 234, shares_count: 156, tags: ["#UTAMV"], created_at: new Date(Date.now() - 21600000).toISOString(),
    visibility: "public", author_name: "TAMV Official", author_avatar: undefined,
  },
  {
    id: "demo-4", author_id: "system", content: "Mi certificación BookPI verificada en blockchain 🔐 Inmutable y auditable.",
    media_url: "https://picsum.photos/seed/post4/800/700", media_type: "image",
    likes_count: 567, comments_count: 45, shares_count: 12, tags: ["#BookPI"], created_at: new Date(Date.now() - 28800000).toISOString(),
    visibility: "public", author_name: "Ana T.", author_avatar: "https://i.pravatar.cc/100?img=5",
  },
];

const QUICK_NAV = [
  { icon: Compass, label: "Explorar", path: "/ecosystem", color: "text-primary" },
  { icon: Video, label: "Videos", path: "/dream-spaces", color: "text-red-400" },
  { icon: Radio, label: "Lives", path: "/kaos", color: "text-green-400" },
  { icon: Music, label: "Música", path: "/kaos", color: "text-violet-400" },
  { icon: GraduationCap, label: "Cursos", path: "/university", color: "text-amber-400" },
  { icon: Users, label: "Grupos", path: "/community", color: "text-blue-400" },
  { icon: ShoppingBag, label: "Market", path: "/monetization", color: "text-pink-400" },
  { icon: Gamepad2, label: "Games", path: "/dream-spaces", color: "text-emerald-400" },
];

const FEATURED_VIDEOS = [
  { id: 1, title: "TAMV Quantum Experience", thumb: "https://picsum.photos/seed/tv1/640/360", views: "125K", duration: "4:32", category: "Tech" },
  { id: 2, title: "DreamSpaces XR Tour", thumb: "https://picsum.photos/seed/tv2/640/360", views: "89K", duration: "12:08", category: "XR" },
  { id: 3, title: "Isabella AI Demo", thumb: "https://picsum.photos/seed/tv3/640/360", views: "234K", duration: "8:15", category: "AI" },
  { id: 4, title: "KAOS Audio Binaural", thumb: "https://picsum.photos/seed/tv4/640/360", views: "67K", duration: "45:00", category: "Music" },
];

const MUSIC_TRACKS = [
  { title: "Quantum Drift", artist: "KAOS Studio", duration: "3:42", plays: "45K" },
  { title: "Neural Waves 432Hz", artist: "Isabella AI", duration: "12:00", plays: "128K" },
  { title: "Civilizatory Anthem", artist: "TAMV Collective", duration: "5:18", plays: "89K" },
  { title: "Deep Space Binaural", artist: "DreamSpaces", duration: "45:00", plays: "234K" },
];

const LIVE_STREAMS = [
  { user: "DJ Quantum", viewers: "2.3K", thumb: "https://picsum.photos/seed/live1/400/225" },
  { user: "UTAMV Class", viewers: "456", thumb: "https://picsum.photos/seed/live2/400/225" },
  { user: "Art XR Studio", viewers: "1.1K", thumb: "https://picsum.photos/seed/live3/400/225" },
];

const PILLARS = [
  { icon: Vote, title: "Gobernanza CITEMESH", desc: "Democracia federada con ID-NVIDA y propuestas DAO", color: "from-cyan-500/20 to-blue-600/20", border: "border-cyan-500/30" },
  { icon: Coins, title: "Economía TCEP", desc: "Flujo Fénix 70/20/10 · Lotería civilizatoria · Fondo de resiliencia", color: "from-amber-500/20 to-orange-600/20", border: "border-amber-500/30" },
  { icon: Brain, title: "Isabella AI Prime", desc: "IA emocional, mentoring cuántico y análisis constitucional", color: "from-violet-500/20 to-purple-600/20", border: "border-violet-500/30" },
  { icon: BookOpen, title: "UTAMV + BookPI", desc: "Certificaciones inmutables, cursos de élite y DOI verificable", color: "from-emerald-500/20 to-teal-600/20", border: "border-emerald-500/30" },
  { icon: Waves, title: "DreamSpaces + KAOS", desc: "Entornos XR inmersivos y audio binaural 3D espacial", color: "from-pink-500/20 to-rose-600/20", border: "border-pink-500/30" },
  { icon: Shield, title: "Anubis Sentinel", desc: "Monitoreo 1Hz, resiliencia absoluta y auto-reparación", color: "from-slate-400/20 to-zinc-600/20", border: "border-slate-400/30" },
];

// ============================================================================
// Post Card Component
// ============================================================================

function PostCard({ post }: { post: FeedPost }) {
  const timeAgo = (() => {
    const diff = Date.now() - new Date(post.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  })();

  const isOfficial = post.author_name === "TAMV Official";

  return (
    <Card className="overflow-hidden border-border/30 backdrop-blur-sm" style={{ background: "rgba(11,12,17,0.75)" }}>
      <div className="flex items-center gap-3 p-4 pb-2">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
          {post.author_avatar ? (
            <img src={post.author_avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold truncate">{post.author_name}</span>
            {isOfficial && <Zap className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
            {post.tags?.[0] && (
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/30 text-primary/70">{post.tags[0]}</Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
      </div>
      <p className="px-4 pb-3 text-sm leading-relaxed">{post.content}</p>
      {post.media_url && (
        <div className="relative">
          <img src={post.media_url} alt="" className="w-full object-cover max-h-[500px]" loading="lazy" />
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/10">
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-red-400 transition-colors">
            <Heart className="w-4.5 h-4.5" />
            <span className="text-xs">{post.likes_count > 0 ? post.likes_count.toLocaleString() : ""}</span>
          </button>
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="w-4.5 h-4.5" />
            <span className="text-xs">{post.comments_count > 0 ? post.comments_count : ""}</span>
          </button>
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-green-400 transition-colors">
            <Share2 className="w-4.5 h-4.5" />
            <span className="text-xs">{post.shares_count > 0 ? post.shares_count : ""}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// Composer Component
// ============================================================================

function PostComposer({ onPost }: { onPost: (content: string) => void }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setSending(true);
    await onPost(text.trim());
    setText("");
    setSending(false);
  };

  return (
    <Card className="p-4 border-primary/20 backdrop-blur-sm" style={{ background: "rgba(0,217,255,0.03)" }}>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Emitir señal al tejido TAMV..."
        className="bg-transparent border-border/30 resize-none mb-3 min-h-[80px] placeholder:text-muted-foreground/50"
      />
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground text-xs"><Video className="w-4 h-4 mr-1" /> Video</Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground text-xs"><Music className="w-4 h-4 mr-1" /> Audio</Button>
        </div>
        <Button size="sm" disabled={!text.trim() || sending} onClick={submit} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <Send className="w-4 h-4 mr-1" /> Emitir
        </Button>
      </div>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const { setBackground } = useBackgroundControl();
  const { user, isAuthenticated } = useAuth();
  const { posts: realPosts, loading: feedLoading, createPost } = useRealFeed();
  const navigate = useNavigate();

  useEffect(() => {
    setBackground("matrix", 0.4);
  }, [setBackground]);

  const feedPosts = realPosts.length > 0 ? realPosts : DEMO_POSTS;

  if (showIntro) {
    return <CinematicIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO — Full width, cinematic */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-6 border border-primary/30 shadow-lg shadow-primary/20">
            <img src={logoImg} alt="TAMV" className="w-full h-full object-cover" />
          </div>
          <h1
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
            style={{
              background: "linear-gradient(135deg, #00D9FF 0%, #C1CBD5 50%, #3E7EA3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            TAMV MD-X4™
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-2 tracking-wide">
            Ecosistema Civilizatorio Next-Gen
          </p>
          <p className="text-sm text-muted-foreground/60 max-w-xl mx-auto mb-8">
            Más allá de las redes sociales. Gobernanza federada, economía circular, IA emocional, 
            entornos XR y certificaciones inmutables — todo desde Latinoamérica para el mundo.
          </p>
          <div className="flex items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8">
                  <Globe className="w-5 h-5 mr-2" /> Entrar al Ecosistema
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6">
                    <UserPlus className="w-5 h-5 mr-2" /> Unirse a la Civilización
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 px-6" onClick={() => {
                  document.getElementById("feed-section")?.scrollIntoView({ behavior: "smooth" });
                }}>
                  <Eye className="w-5 h-5 mr-2" /> Explorar como Viajero
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PILLARS — "TAMV no es una red social, es..." */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Infraestructura Civilizatoria · 7+ Federaciones Activas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`p-4 rounded-xl border ${p.border} bg-gradient-to-br ${p.color} backdrop-blur-sm text-center cursor-default`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-foreground/80" />
                  <h3 className="text-xs font-bold mb-1">{p.title}</h3>
                  <p className="text-[10px] text-muted-foreground leading-tight">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Quick Nav Bar */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="sticky top-0 z-30 py-3 px-4 border-y border-border/20" style={{ background: "rgba(11,12,17,0.9)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-6xl mx-auto flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <Link to="/">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-primary/30">
              <img src={logoImg} alt="TAMV" className="w-full h-full object-cover" />
            </div>
          </Link>
          {QUICK_NAV.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link key={i} to={item.path}>
                <motion.div
                  className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
          {!isAuthenticated && (
            <Link to="/auth" className="ml-auto flex-shrink-0">
              <Button size="sm" variant="outline" className="border-primary/30 text-primary text-xs">
                <LogIn className="w-3.5 h-3.5 mr-1" /> Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Stories */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <StoriesCarousel />
        </div>
      </section>

      {/* LIVE Streams */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-sm font-bold">EN VIVO</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {LIVE_STREAMS.map((stream, i) => (
              <motion.div key={i} className="relative flex-shrink-0 w-52 h-28 rounded-xl overflow-hidden cursor-pointer group" whileHover={{ scale: 1.03 }}>
                <img src={stream.thumb} alt={stream.user} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <Badge className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5">LIVE</Badge>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-bold truncate">{stream.user}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" /> {stream.viewers}</p>
                </div>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MAIN FEED + SIDEBAR */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div id="feed-section" className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold tracking-wide uppercase">Flujo Civilizatorio en Vivo</h2>
            {realPosts.length === 0 && (
              <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-400">Demo</Badge>
            )}
          </div>

          {/* Composer (auth only) */}
          {isAuthenticated && (
            <PostComposer onPost={async (content) => { await createPost(content); }} />
          )}

          {/* Featured Video */}
          <Card className="overflow-hidden border-border/30 backdrop-blur-sm" style={{ background: "rgba(11,12,17,0.7)" }}>
            <div className="relative aspect-video cursor-pointer group">
              <img src={FEATURED_VIDEOS[0].thumb} alt={FEATURED_VIDEOS[0].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <motion.div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center" whileHover={{ scale: 1.1 }}>
                  <Play className="w-7 h-7 text-primary-foreground ml-1" />
                </motion.div>
              </div>
              <Badge className="absolute top-3 left-3 bg-primary/80 text-primary-foreground">{FEATURED_VIDEOS[0].category}</Badge>
              <span className="absolute bottom-3 right-3 text-xs bg-black/70 px-2 py-1 rounded">{FEATURED_VIDEOS[0].duration}</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{FEATURED_VIDEOS[0].title}</h3>
              <p className="text-sm text-muted-foreground">{FEATURED_VIDEOS[0].views} vistas</p>
            </div>
          </Card>

          {/* Feed Posts */}
          {feedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {!isAuthenticated && (
            <Card className="p-6 text-center border-primary/20" style={{ background: "rgba(0,217,255,0.04)" }}>
              <p className="text-sm text-muted-foreground mb-3">Inicia sesión para emitir señales, interactuar y acceder a todo el ecosistema.</p>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  <UserPlus className="w-4 h-4 mr-2" /> Crear Cuenta TAMV
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Civilizatory Pulse */}
          <Card className="p-4 border-primary/20 backdrop-blur-sm" style={{ background: "linear-gradient(135deg, rgba(0,217,255,0.05), rgba(62,126,163,0.05))" }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary animate-pulse" /> Pulso Civilizatorio
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Federaciones Activas</span><span className="text-primary font-bold">7</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Nodos Conectados</span><span className="text-emerald-400 font-bold">43</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Flujo TCEP 24h</span><span className="text-amber-400 font-bold">$12,450</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Señales Emitidas</span><span className="text-foreground font-bold">{feedPosts.length.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Coherencia Quantum</span><span className="text-primary font-bold">97.3%</span></div>
            </div>
          </Card>

          {/* Video Grid */}
          <Card className="p-4 border-border/30 backdrop-blur-sm" style={{ background: "rgba(11,12,17,0.7)" }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" /> Videos Trending
            </h3>
            <div className="space-y-3">
              {FEATURED_VIDEOS.slice(1).map((vid) => (
                <div key={vid.id} className="flex gap-3 cursor-pointer group">
                  <div className="relative w-28 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Play className="w-5 h-5 text-white opacity-80" />
                    </div>
                    <span className="absolute bottom-1 right-1 text-[10px] bg-black/70 px-1 rounded">{vid.duration}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{vid.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{vid.views} vistas</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Music Player */}
          <Card className="p-4 border-border/30 backdrop-blur-sm" style={{ background: "rgba(11,12,17,0.7)" }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-primary" /> KAOS Music
            </h3>
            <div className="space-y-2">
              {MUSIC_TRACKS.map((track, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center flex-shrink-0">
                    <Music className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{track.title}</p>
                    <p className="text-[10px] text-muted-foreground">{track.artist}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-muted-foreground">{track.duration}</p>
                    <p className="text-[10px] text-primary">{track.plays}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Trending */}
          <Card className="p-4 border-border/30 backdrop-blur-sm" style={{ background: "rgba(11,12,17,0.7)" }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Trending
            </h3>
            <div className="space-y-2">
              {["#TAMVQuantum", "#DreamSpacesXR", "#IsabellaAI", "#NuevaEraDigital", "#UTAMV", "#KAOSAudio"].map((tag, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-xs font-medium">{tag}</span>
                  <span className="text-[10px] text-muted-foreground">{Math.floor(Math.random() * 50 + 10)}K</span>
                </div>
              ))}
            </div>
          </Card>

          {/* CTA */}
          {!isAuthenticated && (
            <Card className="p-5 border-primary/20 text-center" style={{ background: "linear-gradient(135deg, rgba(0,217,255,0.08), rgba(62,126,163,0.08))" }}>
              <Flame className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="text-sm font-bold mb-1">Únete a TAMV</h3>
              <p className="text-[10px] text-muted-foreground mb-3">La primera civilización digital next-gen</p>
              <Link to="/auth">
                <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  Crear Cuenta <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-6 px-4 border-t border-border/20 text-center">
        <p className="text-xs text-muted-foreground">© 2025 TAMV MD-X4™ — Ecosistema Civilizatorio Next-Gen · 7+ Federaciones · Hecho con ❤️ en Latinoamérica</p>
      </footer>
    </div>
  );
};

export default Index;
