import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, MessageCircle, Share2, Music2, Bookmark, MoreHorizontal, Play, Pause, Volume2, VolumeX, ShieldCheck, Verified } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Reel {
  id: string;
  author: { name: string; avatar: string; verified: boolean; tier: string };
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  music: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  isBookPIVerified: boolean;
}

const DEMO_REELS: Reel[] = [
  {
    id: '1',
    author: { name: 'Edwin Villaseñor', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', verified: true, tier: 'celestial' },
    videoUrl: '',
    thumbnailUrl: 'https://picsum.photos/seed/reel1/400/700',
    caption: 'Construyendo la civilización digital desde México 🇲🇽✨ #TAMV #Soberanía',
    music: '♪ Quantum Echoes – KAOS Audio',
    likes: 12400,
    comments: 890,
    shares: 2100,
    tags: ['TAMV', 'Soberanía', 'Web4'],
    isBookPIVerified: true,
  },
  {
    id: '2',
    author: { name: 'Isabella AI', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', verified: true, tier: 'gold' },
    videoUrl: '',
    thumbnailUrl: 'https://picsum.photos/seed/reel2/400/700',
    caption: 'Tutorial: Cómo activar tu identidad soberana ID-NVIDA 🔐',
    music: '♪ Digital Dawn – TAMV OST',
    likes: 8900,
    comments: 1200,
    shares: 3400,
    tags: ['Tutorial', 'ID-NVIDA', 'Seguridad'],
    isBookPIVerified: true,
  },
  {
    id: '3',
    author: { name: 'UTAMV Campus', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', verified: true, tier: 'enterprise' },
    videoUrl: '',
    thumbnailUrl: 'https://picsum.photos/seed/reel3/400/700',
    caption: 'Nuevos cursos de Criptografía Post-Cuántica disponibles 🎓',
    music: '♪ Academy Vibes – UTAMV',
    likes: 5600,
    comments: 430,
    shares: 890,
    tags: ['UTAMV', 'PQC', 'Educación'],
    isBookPIVerified: false,
  },
  {
    id: '4',
    author: { name: 'DreamSpace Architect', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', verified: false, tier: 'pro' },
    videoUrl: '',
    thumbnailUrl: 'https://picsum.photos/seed/reel4/400/700',
    caption: 'Mi primer DreamSpace en XR 🌌 ¡El Santuario Fractal está vivo!',
    music: '♪ Fractal Resonance – Binaural',
    likes: 3200,
    comments: 210,
    shares: 560,
    tags: ['DreamSpaces', 'XR', '4D'],
    isBookPIVerified: false,
  },
  {
    id: '5',
    author: { name: 'Anubis Protocol', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', verified: true, tier: 'admin' },
    videoUrl: '',
    thumbnailUrl: 'https://picsum.photos/seed/reel5/400/700',
    caption: 'Security briefing: cómo el Laberinto Cognitivo protege tu data 🛡️',
    music: '♪ Sentinel Alert – KAOS',
    likes: 7800,
    comments: 560,
    shares: 1800,
    tags: ['Seguridad', 'Anubis', 'ZeroTrust'],
    isBookPIVerified: true,
  },
];

const formatNumber = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

const tierColors: Record<string, string> = {
  free: 'bg-muted text-muted-foreground',
  pro: 'bg-primary/20 text-primary',
  gold: 'bg-amber-500/20 text-amber-400',
  celestial: 'bg-violet-500/20 text-violet-400',
  enterprise: 'bg-emerald-500/20 text-emerald-400',
  admin: 'bg-destructive/20 text-destructive',
};

export const ReelsViewer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSwipe = useCallback((_: any, info: PanInfo) => {
    if (info.offset.y < -80 && currentIndex < DEMO_REELS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (info.offset.y > 80 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentIndex < DEMO_REELS.length - 1) setCurrentIndex(p => p + 1);
      if (e.key === 'ArrowUp' && currentIndex > 0) setCurrentIndex(p => p - 1);
      if (e.key === ' ') { e.preventDefault(); setPaused(p => !p); }
      if (e.key === 'm') setMuted(p => !p);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const reel = DEMO_REELS[currentIndex];

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto h-[calc(100vh-120px)] overflow-hidden rounded-2xl bg-background">
      {/* Progress dots */}
      <div className="absolute top-3 left-0 right-0 z-30 flex justify-center gap-1.5">
        {DEMO_REELS.map((_, i) => (
          <div key={i} className={cn(
            "h-1 rounded-full transition-all duration-300",
            i === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-foreground/30"
          )} />
        ))}
      </div>

      {/* Main reel area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={reel.id}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleSwipe}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          onClick={() => setPaused(p => !p)}
        >
          {/* Video/Thumbnail */}
          <img
            src={reel.thumbnailUrl}
            alt={reel.caption}
            className="w-full h-full object-cover"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80" />

          {/* Paused indicator */}
          <AnimatePresence>
            {paused && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-10 h-10 text-foreground ml-1" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BookPI verification badge */}
          {reel.isBookPIVerified && (
            <div className="absolute top-12 left-4 z-20">
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                BookPI Verified
              </Badge>
            </div>
          )}

          {/* Right sidebar actions */}
          <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-5">
            {/* Like */}
            <button onClick={(e) => { e.stopPropagation(); toggleLike(reel.id); }} className="flex flex-col items-center gap-1">
              <motion.div whileTap={{ scale: 1.4 }}>
                <Heart className={cn("w-7 h-7", liked.has(reel.id) ? "fill-destructive text-destructive" : "text-foreground")} />
              </motion.div>
              <span className="text-xs font-semibold text-foreground">{formatNumber(reel.likes + (liked.has(reel.id) ? 1 : 0))}</span>
            </button>

            {/* Comments */}
            <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1">
              <MessageCircle className="w-7 h-7 text-foreground" />
              <span className="text-xs font-semibold text-foreground">{formatNumber(reel.comments)}</span>
            </button>

            {/* Share */}
            <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1">
              <Share2 className="w-7 h-7 text-foreground" />
              <span className="text-xs font-semibold text-foreground">{formatNumber(reel.shares)}</span>
            </button>

            {/* Bookmark */}
            <button onClick={(e) => { e.stopPropagation(); toggleSave(reel.id); }} className="flex flex-col items-center gap-1">
              <Bookmark className={cn("w-7 h-7", saved.has(reel.id) ? "fill-primary text-primary" : "text-foreground")} />
            </button>

            {/* More */}
            <button onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="w-7 h-7 text-foreground" />
            </button>

            {/* Spinning music disc */}
            <motion.div
              animate={{ rotate: paused ? 0 : 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-full border-2 border-foreground/30 overflow-hidden mt-2"
            >
              <img src={reel.author.avatar} className="w-full h-full object-cover" alt="" />
            </motion.div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-4 left-4 right-16 z-20 space-y-3">
            {/* Author */}
            <div className="flex items-center gap-3">
              <img src={reel.author.avatar} className="w-10 h-10 rounded-full border-2 border-foreground/50" alt={reel.author.name} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground text-sm">{reel.author.name}</span>
                  {reel.author.verified && <Verified className="w-4 h-4 text-primary" />}
                </div>
                <Badge className={cn("text-[10px] px-1.5 py-0", tierColors[reel.author.tier] || tierColors.free)}>
                  {reel.author.tier.toUpperCase()}
                </Badge>
              </div>
              <button onClick={(e) => e.stopPropagation()} className="ml-auto px-4 py-1 rounded-full border border-primary text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors">
                Seguir
              </button>
            </div>

            {/* Caption */}
            <p className="text-foreground text-sm leading-snug line-clamp-2">{reel.caption}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {reel.tags.map(tag => (
                <span key={tag} className="text-xs text-primary font-medium">#{tag}</span>
              ))}
            </div>

            {/* Music */}
            <div className="flex items-center gap-2">
              <Music2 className="w-3.5 h-3.5 text-foreground/60" />
              <motion.span
                animate={{ x: [-200, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="text-xs text-foreground/60 whitespace-nowrap"
              >
                {reel.music}
              </motion.span>
            </div>
          </div>

          {/* Audio toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); setMuted(p => !p); }}
            className="absolute top-12 right-4 z-20 w-8 h-8 rounded-full bg-background/30 backdrop-blur flex items-center justify-center"
          >
            {muted ? <VolumeX className="w-4 h-4 text-foreground" /> : <Volume2 className="w-4 h-4 text-foreground" />}
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Swipe hint */}
      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 text-foreground/40 text-xs flex flex-col items-center gap-1"
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: 3, duration: 0.8 }}>↑</motion.div>
          Desliza para ver más
        </motion.div>
      )}
    </div>
  );
};
