// ============================================================================
// TAMV MD-X4™ - Immersive Social Landing
// 85% visual / 15% text · Next-Gen Social Interaction Ecosystem
// ============================================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Sparkles, Globe, Users, Brain, Shield,
  Play, Music, Gamepad2, ShoppingBag, Radio, GraduationCap,
  Compass, Heart, MessageCircle, Share2, Eye, Flame,
  TrendingUp, Video, Headphones, Star, Zap,
} from "lucide-react";
import { CinematicIntro } from "@/components/CinematicIntro";
import { useBackgroundControl } from "@/components/UnifiedBackground";
import { motion } from "framer-motion";
import { StoriesCarousel } from "@/components/social/StoriesCarousel";
import logoImg from "@/assets/LOGOTAMV2.jpg";

// ============================================================================
// Media Content Configuration (massive multimedia)
// ============================================================================

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

const TRENDING_POSTS = [
  {
    id: 1, user: "María R.", avatar: "https://i.pravatar.cc/100?img=1",
    img: "https://picsum.photos/seed/post1/800/600",
    text: "Mi primer DreamSpace en TAMV 🚀✨",
    likes: 1243, comments: 89, shares: 34, time: "2h",
  },
  {
    id: 2, user: "Carlos M.", avatar: "https://i.pravatar.cc/100?img=3",
    img: "https://picsum.photos/seed/post2/800/800",
    text: "Sesión binaural KAOS · frecuencias 432Hz 🎵",
    likes: 892, comments: 56, shares: 21, time: "4h",
  },
  {
    id: 3, user: "TAMV Official", avatar: "",
    img: "https://picsum.photos/seed/post3/800/500",
    text: "Nuevo módulo de Universidad TAMV disponible 🎓",
    likes: 3421, comments: 234, shares: 156, time: "6h",
    verified: true,
  },
  {
    id: 4, user: "Ana T.", avatar: "https://i.pravatar.cc/100?img=5",
    img: "https://picsum.photos/seed/post4/800/700",
    text: "Mi certificación BookPI verificada en blockchain 🔐",
    likes: 567, comments: 45, shares: 12, time: "8h",
  },
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

// ============================================================================
// Main Component
// ============================================================================

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const { setBackground } = useBackgroundControl();

  useEffect(() => {
    setBackground("matrix", 0.4);
  }, [setBackground]);

  if (showIntro) {
    return <CinematicIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Quick Nav Bar */}
      <section className="sticky top-0 z-30 py-3 px-4 border-b border-border/30" style={{ background: "rgba(11,12,17,0.85)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <Link to="/">
            <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 border border-primary/30">
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
              <motion.div
                key={i}
                className="relative flex-shrink-0 w-52 h-28 rounded-xl overflow-hidden cursor-pointer group"
                whileHover={{ scale: 1.03 }}
              >
                <img src={stream.thumb} alt={stream.user} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <Badge className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5">LIVE</Badge>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-bold truncate">{stream.user}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {stream.viewers}
                  </p>
                </div>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Featured Video */}
          <Card className="overflow-hidden border-border/30" style={{ background: "rgba(11,12,17,0.7)" }}>
            <div className="relative aspect-video cursor-pointer group">
              <img src={FEATURED_VIDEOS[0].thumb} alt={FEATURED_VIDEOS[0].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
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

          {/* Social Posts Feed */}
          {TRENDING_POSTS.map((post) => (
            <Card key={post.id} className="overflow-hidden border-border/30" style={{ background: "rgba(11,12,17,0.7)" }}>
              {/* Post Header */}
              <div className="flex items-center gap-3 p-4 pb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                  {post.avatar ? (
                    <img src={post.avatar} alt={post.user} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold truncate">{post.user}</span>
                    {post.verified && <Zap className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
              </div>

              {/* Post Text */}
              <p className="px-4 pb-3 text-sm">{post.text}</p>

              {/* Post Image */}
              <div className="relative">
                <img src={post.img} alt="" className="w-full object-cover max-h-[500px]" loading="lazy" />
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-5">
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-xs">{post.likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-green-400 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-xs">{post.shares}</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Video Grid */}
          <Card className="p-4 border-border/30" style={{ background: "rgba(11,12,17,0.7)" }}>
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
          <Card className="p-4 border-border/30" style={{ background: "rgba(11,12,17,0.7)" }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-primary" /> KAOS Music
            </h3>
            <div className="space-y-2">
              {MUSIC_TRACKS.map((track, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer group">
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

          {/* Trending Topics */}
          <Card className="p-4 border-border/30" style={{ background: "rgba(11,12,17,0.7)" }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Trending
            </h3>
            <div className="space-y-2">
              {["#TAMVQuantum", "#DreamSpacesXR", "#IsabellaAI", "#NuevaEraDigital", "#UTAMV", "#KAOSAudio"].map((tag, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-xs font-medium">{tag}</span>
                  <span className="text-[10px] text-muted-foreground">{Math.floor(Math.random() * 50 + 10)}K posts</span>
                </div>
              ))}
            </div>
          </Card>

          {/* CTA */}
          <Card className="p-5 border-primary/20 text-center" style={{ background: "linear-gradient(135deg, rgba(0,217,255,0.08), rgba(62,126,163,0.08))" }}>
            <Flame className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="text-sm font-bold mb-1">Únete a TAMV</h3>
            <p className="text-[10px] text-muted-foreground mb-3">Ecosistema Civilizatorio Next-Gen</p>
            <Link to="/auth">
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                Crear Cuenta <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-6 px-4 border-t border-border/20 text-center">
        <p className="text-xs text-muted-foreground">© 2025 TAMV MD-X4™ — Ecosistema Digital Civilizatorio · Hecho con ❤️ en Latinoamérica</p>
      </footer>
    </div>
  );
};

export default Index;
