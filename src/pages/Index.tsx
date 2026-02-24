// ============================================================================
// TAMV MD-X4™ — NEXT-GEN CIVILIZATORY SOCIAL HUB
// Prioridad: Feed Social, Home, Canales, Grupos, Streamings, Reels, Historias, Muro Global, DreamSpaces
// VISUAL: 85% Visual / 15% Text - Epico, Unico, Revolucionario
// ============================================================================

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Home, Compass, Users, MessageCircle, Video, Radio, Music, Gamepad2,
  ShoppingBag, Globe, Sparkles, Heart, Share2, Send, Play, Pause,
  TrendingUp, Zap, Layers, Search, Bell, Settings, Plus, Camera,
  Mic, Image, Smile, Gift, MapPin, Hash, AtSign, Eye, Flame,
  ChevronRight, ChevronLeft, Wifi, WifiOff, Volume2, VolumeX,
  Maximize2, Minimize2, MoreHorizontal, Bookmark, Flag, UserPlus,
  LogIn, Star, Crown, Diamond, Wallet, Activity, Headphones,
  Wifi as LiveIcon, Ghost, Sparkle, Rocket, Aurora, Waves, Brain,
  ShoppingCart, Store, GraduationCap, PiggyBank, CreditCard, Gem, Palette
} from "lucide-react";
import { CinematicIntro } from "@/components/CinematicIntro";
import { useBackgroundControl } from "@/components/UnifiedBackground";
import { useAuth } from "@/hooks/useAuth";
import { useRealFeed, type FeedPost } from "@/hooks/useRealFeed";
import logoImg from "@/assets/LOGOTAMV2.jpg";

// ============================================================================
// DATOS DE DEMO - CONTENIDO RICO Y VISUAL
// ============================================================================

const DEMO_POSTS: FeedPost[] = [
  {
    id: "demo-1", author_id: "system", 
    content: "Acabo de crear mi primer DreamSpace en TAMV 🚀✨ La nueva era digital está aquí. Únanse a la revolución civilizatoria.",
    media_url: "https://picsum.photos/seed/tamv1/1200/800", media_type: "image",
    likes_count: 1243, comments_count: 89, shares_count: 34, 
    tags: ["#TAMVQuantum", "#NuevaEra"], created_at: new Date(Date.now() - 7200000).toISOString(),
    visibility: "public", author_name: "María R.", author_avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "demo-2", author_id: "system", 
    content: "Sesión binaural KAOS · frecuencias 432Hz 🎵 El audio inmersivo cambia todo. Siente las vibraciones de otra dimensión.",
    media_url: "https://picsum.photos/seed/tamv2/1200/800", media_type: "image",
    likes_count: 2891, comments_count: 156, shares_count: 89, 
    tags: ["#KAOSAudio", "#Frecuencias432Hz"], created_at: new Date(Date.now() - 14400000).toISOString(),
    visibility: "public", author_name: "Carlos M.", author_avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "demo-3", author_id: "system", 
    content: "Isabella AI ahora tiene emociones avanzadas 🔥 La IA más humana que jamás hayas conocido. Habla con ella ahora.",
    media_url: "https://picsum.photos/seed/tamv3/1200/800", media_type: "image",
    likes_count: 5672, comments_count: 423, shares_count: 234, 
    tags: ["#IsabellaAI", "#IAEmocional"], created_at: new Date(Date.now() - 21600000).toISOString(),
    visibility: "public", author_name: "TAMV Official", author_avatar: undefined,
  },
  {
    id: "demo-4", author_id: "system", 
    content: "Mi certificación BookPI verificada en blockchain 🔐 Inmutable, auditable y reconocida globally. El futuro de la educación.",
    media_url: "https://picsum.photos/seed/tamv4/1200/800", media_type: "image",
    likes_count: 1567, comments_count: 145, shares_count: 67, 
    tags: ["#BookPI", "#CertificacionBlockchain"], created_at: new Date(Date.now() - 28800000).toISOString(),
    visibility: "public", author_name: "Ana T.", author_avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "demo-5", author_id: "system", 
    content: "Transmisión en vivo desde el Metaverso TAMV 🎮 Explora mundos infinitos con otros travelers de realidad.",
    media_url: "https://picsum.photos/seed/tamv5/1200/800", media_type: "image",
    likes_count: 4521, comments_count: 312, shares_count: 189, 
    tags: ["#MetaversoTAMV", "#EnVivo"], created_at: new Date(Date.now() - 36000000).toISOString(),
    visibility: "public", author_name: "DJ Quantum", author_avatar: "https://i.pravatar.cc/150?img=8",
  },
];

// ============================================================================
// HISTORIAS - STORIES EPICOS
// ============================================================================

interface Story {
  id: string;
  user: string;
  avatar: string;
  image: string;
  viewed?: boolean;
}

const STORIES: Story[] = [
  { id: "1", user: "María R.", avatar: "https://i.pravatar.cc/150?img=1", image: "https://picsum.photos/seed/story1/600/1000" },
  { id: "2", user: "Carlos M.", avatar: "https://i.pravatar.cc/150?img=3", image: "https://picsum.photos/seed/story2/600/1000" },
  { id: "3", user: "TAMV Official", avatar: "", image: "https://picsum.photos/seed/story3/600/1000" },
  { id: "4", user: "Ana T.", avatar: "https://i.pravatar.cc/150?img=5", image: "https://picsum.photos/seed/story4/600/1000" },
  { id: "5", user: "DJ Quantum", avatar: "https://i.pravatar.cc/150?img=8", image: "https://picsum.photos/seed/story5/600/1000" },
  { id: "6", user: "Isabella AI", avatar: "", image: "https://picsum.photos/seed/story6/600/1000" },
  { id: "7", user: "Elena Dream", avatar: "https://i.pravatar.cc/150?img=9", image: "https://picsum.photos/seed/story7/600/1000" },
  { id: "8", user: "Marco XR", avatar: "https://i.pravatar.cc/150?img=10", image: "https://picsum.photos/seed/story8/600/1000" },
];

// ============================================================================
// VIDEOS REELS - CONTENIDO VERTICAL
// ============================================================================

interface Reel {
  id: string;
  user: string;
  avatar: string;
  video: string;
  caption: string;
  likes: number;
}

const REELS: Reel[] = [
  { id: "1", user: "María R.", avatar: "https://i.pravatar.cc/150?img=1", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", caption: "Mi experiencia en DreamSpaces 🥽✨", likes: 1234 },
  { id: "2", user: "Carlos M.", avatar: "https://i.pravatar.cc/150?img=3", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", caption: "Audio binaural 432Hz 🎵", likes: 892 },
  { id: "3", user: "DJ Quantum", avatar: "https://i.pravatar.cc/150?img=8", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", caption: "Live set desde el metaverso 🎧", likes: 2341 },
];

// ============================================================================
// STREAMINGS EN VIVO
// ============================================================================

interface LiveStream {
  id: string;
  user: string;
  avatar: string;
  thumbnail: string;
  viewers: number;
  title: string;
  category: string;
}

const LIVE_STREAMS: LiveStream[] = [
  { id: "1", user: "DJ Quantum", avatar: "https://i.pravatar.cc/150?img=8", thumbnail: "https://picsum.photos/seed/live1/640/360", viewers: 2340, title: "Sesión Quantum Beats 🎵", category: "Música" },
  { id: "2", user: "UTAMV Live", avatar: "", thumbnail: "https://picsum.photos/seed/live2/640/360", viewers: 456, title: "Clase: Introducción al Metaverso", category: "Educación" },
  { id: "3", user: "Art XR Studio", avatar: "https://i.pravatar.cc/150?img=12", thumbnail: "https://picsum.photos/seed/live3/640/360", viewers: 1123, title: "Pintura Digital en Realidad Extendida", category: "Arte" },
  { id: "4", user: "Isabella AI", avatar: "", thumbnail: "https://picsum.photos/seed/live4/640/360", viewers: 5678, title: "Chat en Vivo con Isabella", category: "IA" },
  { id: "5", user: "Gaming TAMV", avatar: "https://i.pravatar.cc/150?img=15", thumbnail: "https://picsum.photos/seed/live5/640/360", viewers: 892, title: "Torneo de Juegos Blockchain", category: "Gaming" },
];

// ============================================================================
// CANALES DESTACADOS
// ============================================================================

interface Channel {
  id: string;
  name: string;
  image: string;
  members: number;
  category: string;
  isLive?: boolean;
}

const CHANNELS: Channel[] = [
  { id: "1", name: "TAMV Official", image: "https://picsum.photos/seed/ch1/200/200", members: 125000, category: "Official", isLive: true },
  { id: "2", name: "DreamSpaces", image: "https://picsum.photos/seed/ch2/200/200", members: 45000, category: "Metaverso" },
  { id: "3", name: "Música KAOS", image: "https://picsum.photos/seed/ch3/200/200", members: 67000, category: "Audio" },
  { id: "4", name: "Universidad TAMV", image: "https://picsum.photos/seed/ch4/200/200", members: 23000, category: "Educación" },
  { id: "5", name: "Gaming Hub", image: "https://picsum.photos/seed/ch5/200/200", members: 89000, category: "Gaming" },
  { id: "6", name: "Arte Digital", image: "https://picsum.photos/seed/ch6/200/200", members: 34000, category: "Arte" },
  { id: "7", name: "Tech Innovators", image: "https://picsum.photos/seed/ch7/200/200", members: 56000, category: "Tecnología" },
  { id: "8", name: "Comunidad Latina", image: "https://picsum.photos/seed/ch8/200/200", members: 78000, category: "Comunidad" },
];

// ============================================================================
// GRUPOS POPULARES
// ============================================================================

interface Group {
  id: string;
  name: string;
  image: string;
  members: number;
  description: string;
}

const GROUPS: Group[] = [
  { id: "1", name: "Pioneros del Metaverso", image: "https://picsum.photos/seed/g1/200/200", members: 12500, description: "Exploradores de realidades alternativas" },
  { id: "2", name: "Amantes del Audio Binaural", image: "https://picsum.photos/seed/g2/200/200", members: 8900, description: "Frecuencias para la evolución consciousness" },
  { id: "3", name: "Creadores Digitales TAMV", image: "https://picsum.photos/seed/g3/200/200", members: 15600, description: "Artistas y creadores del nuevo mundo" },
  { id: "4", name: "Estudiantes UTAMV", image: "https://picsum.photos/seed/g4/200/200", members: 6700, description: "Futuros certificados blockchain" },
  { id: "5", name: "Gamers Quantum", image: "https://picsum.photos/seed/g5/200/200", members: 23400, description: "Juegos con tecnología cuántica" },
  { id: "6", name: "Comunidad Zen", image: "https://picsum.photos/seed/g6/200/200", members: 4500, description: "Meditación y bienestar digital" },
];

// ============================================================================
// BARRA DE NAVEGACIÓN SOCIAL PRINCIPAL
// ============================================================================

const SOCIAL_TABS = [
  { id: "home", label: "Inicio", icon: Home, active: true },
  { id: "channels", label: "Canales", icon: Compass, active: false },
  { id: "groups", label: "Grupos", icon: Users, active: false },
  { id: "reels", label: "Reels", icon: Play, active: false },
  { id: "live", label: "En Vivo", icon: Radio, active: false },
  { id: "dreamspaces", label: "DreamSpaces", icon: Sparkles, active: false },
];

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

function StoryRing({ story, index }: { story: Story; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex flex-col items-center gap-2 cursor-pointer group"
    >
      <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full p-[3px] ${story.viewed ? 'bg-gray-600' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-cyan-400'}`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-cyan-400 animate-spin-slow opacity-50" />
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-background">
          <img src={story.avatar || "https://i.pravatar.cc/150?img=0"} alt={story.user} className="w-full h-full object-cover" />
        </div>
        {index === 0 && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
            <Plus className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>
      <span className="text-xs text-muted-foreground truncate max-w-[70px] group-hover:text-primary transition-colors">{story.user.split(' ')[0]}</span>
    </motion.div>
  );
}

function LiveBadge({ viewers }: { viewers: number }) {
  return (
    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
      <div className="w-2 h-2 bg-white rounded-full" />
      EN VIVO · {viewers.toLocaleString()}
    </div>
  );
}

function LikeButton({ count }: { count: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(count);
  
  return (
    <button 
      onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
      className={`flex items-center gap-1.5 transition-all ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'}`}
    >
      <Heart className={`w-5 h-5 ${liked ? 'fill-current animate-bounce' : ''}`} />
      <span className="text-sm">{likes > 0 ? likes.toLocaleString() : ''}</span>
    </button>
  );
}

function PostCard({ post, index }: { post: FeedPost; index: number }) {
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
    >
      <Card className="overflow-hidden border-border/30 backdrop-blur-md bg-black/40 shadow-xl hover:shadow-2xl transition-all duration-500 group">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 pb-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/40 flex-shrink-0 shadow-lg">
            {post.author_avatar ? (
              <img src={post.author_avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold truncate">{post.author_name}</span>
              {isOfficial && (
                <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-[10px] px-2 py-0">
                  <Zap className="w-3 h-3 mr-1" />Official
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">· {timeAgo}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {post.tags.map((tag, i) => (
                  <span key={i} className="text-xs text-primary/80 hover:underline cursor-pointer">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <p className="px-4 pb-3 text-base leading-relaxed">{post.content}</p>
        
        {/* Media */}
        {post.media_url && (
          <div className="relative overflow-hidden group/media">
            <img src={post.media_url} alt="" className="w-full object-cover max-h-[600px] transition-transform duration-700 group-hover/media:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity" />
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/10">
          <div className="flex items-center gap-4">
            <LikeButton count={post.likes_count} />
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.comments_count > 0 ? post.comments_count : ''}</span>
            </button>
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-green-400 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm">{post.shares_count > 0 ? post.shares_count : ''}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function PostComposer({ onPost }: { onPost: (content: string) => void }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  const submit = async () => {
    if (!text.trim()) return;
    setSending(true);
    await onPost(text.trim());
    setText("");
    setSending(false);
  };

  return (
    <Card className="p-4 border-primary/20 backdrop-blur-md bg-black/40 shadow-xl">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="¿Qué estás pensando, pionero de la civilización?"
            className="bg-transparent border-border/30 resize-none min-h-[80px] text-base placeholder:text-muted-foreground/50 focus:border-primary/50"
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><Image className="w-5 h-5" /></Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><Video className="w-5 h-5" /></Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><Camera className="w-5 h-5" /></Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><MapPin className="w-5 h-5" /></Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><Gift className="w-5 h-5" /></Button>
            </div>
            <Button 
              size="sm" 
              disabled={!text.trim() || sending} 
              onClick={submit} 
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              <Send className="w-4 h-4 mr-2" /> Publicar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// REEL CARD - VIDEO VERTICAL
// ============================================================================

function ReelCard({ reel, index }: { reel: Reel; index: number }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => { setPlaying(!playing); videoRef.current?.play(); }}
    >
      <video ref={videoRef} src={reel.video} loop muted className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      
      {/* User info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-3 mb-3">
          <img src={reel.avatar || "https://i.pravatar.cc/150?img=0"} alt={reel.user} className="w-10 h-10 rounded-full border-2 border-white/30" />
          <span className="font-bold text-white">{reel.user}</span>
          <Button size="sm" variant="outline" className="ml-auto border-white/30 text-white hover:bg-white/20 text-xs">Seguir</Button>
        </div>
        <p className="text-sm text-white/90 mb-2">{reel.caption}</p>
        <div className="flex items-center gap-4 text-white/70 text-sm">
          <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {reel.likes.toLocaleString()}</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> Comentarios</span>
          <span className="flex items-center gap-1"><Share2 className="w-4 h-4" /> Compartir</span>
        </div>
      </div>
      
      {/* Side actions */}
      <div className="absolute right-3 bottom-20 flex flex-col gap-4">
        <button className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors">
          <Heart className="w-6 h-6 text-white" />
        </button>
        <button className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors">
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
        <button className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors">
          <Share2 className="w-6 h-6 text-white" />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// LIVE STREAM CARD
// ============================================================================

function LiveStreamCard({ stream, index }: { stream: LiveStream; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-xl overflow-hidden cursor-pointer group"
    >
      <div className="aspect-video">
        <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <LiveBadge viewers={stream.viewers} />
      <div className="absolute bottom-2 left-2 right-2">
        <div className="flex items-center gap-2 mb-1">
          <img src={stream.avatar || "https://i.pravatar.cc/150?img=0"} alt={stream.user} className="w-6 h-6 rounded-full" />
          <span className="text-sm font-medium text-white truncate">{stream.user}</span>
        </div>
        <p className="text-xs text-white/70 truncate">{stream.title}</p>
        <Badge variant="outline" className="mt-1 text-[10px] border-white/30 text-white bg-black/30">{stream.category}</Badge>
      </div>
      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Play className="w-12 h-12 text-white" />
      </div>
    </motion.div>
  );
}

// ============================================================================
// CHANNEL CARD
// ============================================================================

function ChannelCard({ channel, index }: { channel: Channel; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      className="flex flex-col items-center gap-2 cursor-pointer group p-3 rounded-xl hover:bg-primary/10 transition-all"
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary group-hover:scale-110 transition-all shadow-lg">
        <img src={channel.image} alt={channel.name} className="w-full h-full object-cover" />
        {channel.isLive && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center border-2 border-background">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="font-medium text-sm truncate max-w-[80px] group-hover:text-primary transition-colors">{channel.name}</p>
        <p className="text-xs text-muted-foreground">{channel.members.toLocaleString()} miembros</p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// GROUP CARD
// ============================================================================

function GroupCard({ group, index }: { group: Group; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 cursor-pointer transition-all group"
    >
      <img src={group.image} alt={group.name} className="w-14 h-14 rounded-xl object-cover group-hover:scale-105 transition-transform" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{group.name}</p>
        <p className="text-xs text-muted-foreground truncate">{group.description}</p>
        <p className="text-xs text-primary mt-0.5">{group.members.toLocaleString()} miembros</p>
      </div>
      <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/20 text-xs">
        Unirse
      </Button>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT - INDEX PAGE
// ============================================================================

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { setBackground } = useBackgroundControl();
  const { user, isAuthenticated } = useAuth();
  const { posts: realPosts, loading: feedLoading, createPost } = useRealFeed();
  const navigate = useNavigate();
  
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  useEffect(() => {
    setBackground("quantum", 0.5);
  }, [setBackground]);

  const feedPosts = realPosts.length > 0 ? realPosts : DEMO_POSTS;

  if (showIntro) {
    return <CinematicIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen pb-24">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO EPICO - FULL VISUAL IMMERSION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.div 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[50vh] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Animated Background Layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/50 rounded-full"
                initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
                animate={{ 
                  y: [null, '-100%'],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: Math.random() * 10 + 10, 
                  repeat: Infinity,
                  delay: Math.random() * 5 
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative z-10 mb-6"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/20 group hover:scale-110 transition-transform duration-500">
            <img src={logoImg} alt="TAMV" className="w-full h-full object-cover" />
          </div>
          <motion.div 
            className="absolute -inset-2 rounded-3xl border-2 border-primary/50"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-2 text-center"
        >
          <span className="bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            TAMV
          </span>
          <span className="block text-2xl md:text-4xl font-light text-muted-foreground mt-2">
            MD-X4™
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto px-4 mb-8"
        >
          La evolución federada de las redes sociales. 
          <span className="text-primary"> Civilización digital </span>
          desde Latinoamérica para el mundo.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 flex flex-wrap gap-4 justify-center px-4"
        >
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-6 text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all">
                <Globe className="w-5 h-5 mr-2" /> Entrar al Ecosistema
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-6 text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all">
                  <UserPlus className="w-5 h-5 mr-2" /> Únete a la Civilización
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 text-lg backdrop-blur-sm" onClick={() => {
                document.getElementById("feed-section")?.scrollIntoView({ behavior: "smooth" });
              }}>
                <Eye className="w-5 h-5 mr-2" /> Explorar como Viajero
              </Button>
            </>
          )}
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 flex gap-8 md:gap-16 mt-12 text-center"
        >
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">2.5M+</p>
            <p className="text-sm text-muted-foreground">Pioneros</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-secondary">150K+</p>
            <p className="text-sm text-muted-foreground">DreamSpaces</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-accent">50K+</p>
            <p className="text-sm text-muted-foreground">En Vivo</p>
          </div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        >
          <ChevronRight className="w-6 h-6 rotate-90" />
        </motion.div>

      </motion.div>
      {/* NAVEGACIÓN SOCIAL PRINCIPAL - TABS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4 py-3 overflow-x-auto">
            {/* Logo mini */}
            <Link to="/" className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-primary/30">
                <img src={logoImg} alt="TAMV" className="w-full h-full object-cover" />
              </div>
            </Link>
            
            {/* Tabs */}
            <div className="flex gap-1 flex-1 justify-center">
              {SOCIAL_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                        : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              {!isAuthenticated && (
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                    <LogIn className="w-4 h-4 mr-1" /> Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTENIDO PRINCIPAL */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div id="feed-section" className="max-w-7xl mx-auto px-4 py-6">
        
        {/* STORIES - CARRUSEL HORIZONTAL */}
        <section className="mb-8">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2 -mx-2">
            {STORIES.map((story, i) => (
              <StoryRing key={story.id} story={story} index={i} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* EN VIVO - LIVE STREAMS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500" /> 
              En Vivo Ahora
            </h2>
            <Badge variant="destructive" className="ml-2 animate-pulse">{LIVE_STREAMS.reduce((a, s) => a + s.viewers, 0).toLocaleString()} espectadores</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {LIVE_STREAMS.map((stream, i) => (
              <LiveStreamCard key={stream.id} stream={stream} index={i} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CANALES DESTACADOS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" /> 
              Canales Destacados
            </h2>
            <Button variant="ghost" size="sm" className="text-primary">Ver todos <ChevronRight className="w-4 h-4" /></Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {CHANNELS.map((channel, i) => (
              <ChannelCard key={channel.id} channel={channel} index={i} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* REELS - VIDEOS VERTICALES */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Play className="w-5 h-5 text-pink-500" /> 
              Reels Trending
            </h2>
            <Badge variant="outline" className="border-pink-500/30 text-pink-400">🔥 Hot</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {REELS.map((reel, i) => (
              <ReelCard key={reel.id} reel={reel} index={i} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* FEED PRINCIPAL - PUBLICACIONES */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-primary animate-pulse" />
              <h2 className="text-lg font-bold">Feed Principal</h2>
              <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">EN VIVO</Badge>
            </div>

            {/* Composer */}
            {isAuthenticated && (
              <PostComposer onPost={async (content) => { await createPost(content); }} />
            )}

            {/* Posts */}
            {feedPosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}

            {!isAuthenticated && (
              <Card className="p-8 text-center border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                <p className="text-lg mb-4">Únete a la civilización digital más avanzada</p>
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                    <UserPlus className="w-5 h-5 mr-2" /> Crear Cuenta Gratis
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pulso Civilizatorio */}
            <Card className="p-5 border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-md">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary animate-pulse" /> 
                Pulso Civilizatorio
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Usuarios Activos</span>
                  <span className="text-primary font-bold">2.5M+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Publicaciones Hoy</span>
                  <span className="text-green-400 font-bold">156K+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">En Vivo Ahora</span>
                  <span className="text-red-400 font-bold animate-pulse">{LIVE_STREAMS.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Coherencia Quantum</span>
                  <span className="text-primary font-bold">98.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Nodos Federados</span>
                  <span className="text-secondary font-bold">127</span>
                </div>
              </div>
            </Card>

            {/* Grupos Populares */}
            <Card className="p-5 border-border/30 bg-black/20 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> 
                  Grupos Populares
                </h3>
                <Button variant="ghost" size="sm" className="text-xs text-primary">Ver más</Button>
              </div>
              <div className="space-y-2">
                {GROUPS.slice(0, 4).map((group, i) => (
                  <GroupCard key={group.id} group={group} index={i} />
                ))}
              </div>
            </Card>

            {/* Trending */}
            <Card className="p-5 border-border/30 bg-black/20 backdrop-blur-md">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> 
                Tendencias
              </h3>
              <div className="space-y-2">
                {["#TAMVQuantum", "#DreamSpacesXR", "#IsabellaAI", "#NuevaEraDigital", "#UTAMV2024", "#KAOSAudio"].map((tag, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors">
                    <span className="text-sm text-primary/80 hover:text-primary">{tag}</span>
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="p-5 border-border/30 bg-black/20 backdrop-blur-md">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" /> 
                Acceso Rápido
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/dream-spaces">
                  <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/20 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" /> DreamSpaces
                  </Button>
                </Link>
                <Link to="/kaos">
                  <Button variant="outline" size="sm" className="w-full border-pink-500/30 text-pink-400 hover:bg-pink-500/20 text-xs">
                    <Headphones className="w-3 h-3 mr-1" /> KAOS Audio
                  </Button>
                </Link>
                <Link to="/university">
                  <Button variant="outline" size="sm" className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs">
                    <Sparkle className="w-3 h-3 mr-1" /> Universidad
                  </Button>
                </Link>
                <Link to="/isabella">
                  <Button variant="outline" size="sm" className="w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/20 text-xs">
                    <Brain className="w-3 h-3 mr-1" /> Isabella AI
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Galerías de Arte */}
            <Card className="p-5 border-border/30 bg-black/20 backdrop-blur-md">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-400 animate-pulse" /> 
                Galerías de Arte
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/gifts">
                  <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                    <img src="https://picsum.photos/seed/gallery1/200/150" alt="Arte Digital" className="w-full h-20 object-cover group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-1 left-2 text-xs font-bold text-white">Arte Digital</span>
                  </div>
                </Link>
                <Link to="/gifts">
                  <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                    <img src="https://picsum.photos/seed/gallery2/200/150" alt="NFTs" className="w-full h-20 object-cover group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-1 left-2 text-xs font-bold text-white">NFTs</span>
                  </div>
                </Link>
                <Link to="/gifts">
                  <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                    <img src="https://picsum.photos/seed/gallery3/200/150" alt="3D Art" className="w-full h-20 object-cover group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-1 left-2 text-xs font-bold text-white">3D Art</span>
                  </div>
                </Link>
                <Link to="/gifts">
                  <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                    <img src="https://picsum.photos/seed/gallery4/200/150" alt="Música" className="w-full h-20 object-cover group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-1 left-2 text-xs font-bold text-white">Música</span>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Tienda Virtual / Marketplace */}
            <Card className="p-5 border-border/30 bg-black/20 backdrop-blur-md">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-400" /> 
                Marketplace
              </h3>
              <div className="space-y-3">
                <Link to="/monetization">
                  <Button variant="outline" size="sm" className="w-full border-green-500/30 text-green-400 hover:bg-green-500/20">
                    <BuildingStore className="w-4 h-4 mr-2" /> Tienda Virtual
                  </Button>
                </Link>
                <Link to="/gifts">
                  <Button variant="outline" size="sm" className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/20">
                    <Gift className="w-4 h-4 mr-2" /> Regalos Virtuales
                  </Button>
                </Link>
                <Link to="/economy">
                  <Button variant="outline" size="sm" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/20">
                    <PiggyBank className="w-4 h-4 mr-2" /> Economía TCEP
                  </Button>
                </Link>
              </div>
            </Card>

            {/* UTAMV - Universidad */}
            <Card className="p-5 border-border/30 bg-black/20 backdrop-blur-md">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" /> 
                UTAMV Universidad
              </h3>
              <div className="space-y-3">
                <Link to="/university">
                  <Button variant="outline" size="sm" className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/20">
                    <GraduationCap className="w-4 h-4 mr-2" /> Cursos Online
                  </Button>
                </Link>
                <Link to="/bookpi">
                  <Button variant="outline" size="sm" className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20">
                    <Diamond className="w-4 h-4 mr-2" /> Certificaciones BookPI
                  </Button>
                </Link>
                <Link to="/docs">
                  <Button variant="outline" size="sm" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20">
                    <Sparkle className="w-4 h-4 mr-2" /> Biblioteca Digital
                  </Button>
                </Link>
              </div>
            </Card>

            {/* NubiWallet - Billetera Digital */}
            <Card className="p-5 border-border/30 bg-black/20 backdrop-blur-md">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-cyan-400 animate-pulse" /> 
                NubiWallet
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                  <p className="text-xs text-muted-foreground">Balance Total</p>
                  <p className="text-xl font-bold text-cyan-400">$12,450.00 TCEP</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/monetization">
                    <Button variant="outline" size="sm" className="w-full border-green-500/30 text-green-400 hover:bg-green-500/20 text-xs">
                      <CreditCard className="w-3 h-3 mr-1" /> Depositar
                    </Button>
                  </Link>
                  <Link to="/monetization">
                    <Button variant="outline" size="sm" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs">
                      <CreditCard className="w-3 h-3 mr-1" /> Retirar
                    </Button>
                  </Link>
                  <Link to="/economy">
                    <Button variant="outline" size="sm" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs">
                      <Activity className="w-3 h-3 mr-1" /> Historial
                    </Button>
                  </Link>
                  <Link to="/monetization">
                    <Button variant="outline" size="sm" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/20 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" /> Inversiones
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Membresías de Pago */}
            <Card className="p-5 border-border/30 bg-black/20 backdrop-blur-md">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400 animate-pulse" /> 
                Membresías Premium
              </h3>
              <div className="space-y-3">
                <Link to="/monetization">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 cursor-pointer hover:border-yellow-500/50 transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="font-bold text-sm text-yellow-400 group-hover:text-yellow-300">TAMV Basic</span>
                    </div>
                    <p className="text-xs text-muted-foreground">$9.99/mes</p>
                  </div>
                </Link>
                <Link to="/monetization">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 cursor-pointer hover:border-purple-500/50 transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                      <Diamond className="w-4 h-4 text-purple-400" />
                      <span className="font-bold text-sm text-purple-400 group-hover:text-purple-300">TAMV Pro</span>
                    </div>
                    <p className="text-xs text-muted-foreground">$19.99/mes</p>
                  </div>
                </Link>
                <Link to="/monetization">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 cursor-pointer hover:border-cyan-500/50 transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-sm text-cyan-400 group-hover:text-cyan-300">TAMV Enterprise</span>
                    </div>
                    <p className="text-xs text-muted-foreground">$49.99/mes</p>
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
