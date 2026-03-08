// ============================================================================
// TAMV MD-X4™ — NEXTGEN FEED v9.0 · INDUSTRIAL CONSOLE
// No likes. Impact Level + Value Flow. Sharp rectangles. Glitch materialization.
// ============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, Share2, Bookmark, Play, Music, Verified,
  Eye, Send, Image, Sparkles, Loader2, MoreHorizontal, Volume2,
  Activity, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useSocialFeed, type SocialPost } from "@/hooks/useSocialFeed";

// ─── Impact Pulse Line ───
const ImpactPulse = ({ value }: { value: number }) => {
  const normalized = Math.min(value / 5000, 1);
  return (
    <div className="flex items-center gap-2">
      <Activity className="w-3.5 h-3.5 text-primary" />
      <div className="flex-1 h-[2px] bg-border/30 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ 
            width: `${normalized * 100}%`,
            background: 'linear-gradient(90deg, hsl(220 100% 50%), hsl(214 32% 91%))'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${normalized * 100}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[10px] font-mono text-primary">{formatK(value)}</span>
    </div>
  );
};

// ─── Console Card (Sharp, Industrial) ───
const ConsoleCard = ({ post, index }: { post: SocialPost; index: number }) => {
  const [saved, setSaved] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative overflow-hidden bg-card/60 backdrop-blur-xl border border-border/30 hover:border-primary/20 transition-all duration-500"
    >
      {/* Media — sharp 4:5 ratio */}
      {post.media_url && (
        <div className="relative" style={{ aspectRatio: '4/5' }}>
          <img
            src={post.media_url}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {/* Scanner overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent 3px, hsla(220, 100%, 50%, 0.03) 3px, hsla(220, 100%, 50%, 0.03) 4px)`,
            }}
          />
          {/* Gradient from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          
          {/* Video play */}
          {post.media_type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div whileHover={{ scale: 1.1 }}
                className="w-14 h-14 bg-card/60 backdrop-blur-lg flex items-center justify-center border border-border/30"
              >
                <Play className="w-5 h-5 text-foreground ml-0.5" />
              </motion.div>
            </div>
          )}

          {/* Top status */}
          <div className="absolute top-3 right-3 flex gap-2">
            {post.media_type === 'video' && (
              <Badge className="bg-destructive/80 border-none text-[9px] uppercase tracking-widest rounded-none font-mono">
                <Volume2 className="w-3 h-3 mr-1" /> LIVE
              </Badge>
            )}
          </div>

          {/* Content overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {/* Author */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-card/80 border border-border/30 p-[1px]">
                <img
                  src={post.author_avatar || `https://api.dicebear.com/9.x/glass/svg?seed=${post.author_id}`}
                  className="w-full h-full object-cover" alt=""
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-foreground font-mono uppercase" style={{ letterSpacing: '0.05em' }}>
                    {post.author_name || 'Ciudadano'}
                  </span>
                  <Verified className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[9px] text-muted-foreground font-mono">{timeAgo(post.created_at)}</span>
              </div>
            </div>

            <p className="text-sm text-foreground/80 line-clamp-2 mb-3">{post.content}</p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[9px] text-primary/70 font-mono uppercase" style={{ letterSpacing: '0.08em' }}>#{tag}</span>
                ))}
              </div>
            )}

            {/* Impact metrics — NOT likes */}
            <div className="space-y-2">
              <ImpactPulse value={post.likes_count + post.comments_count + post.shares_count} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-mono uppercase">Impacto {formatK(post.likes_count)}</span>
                  </div>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-mono">{formatK(post.comments_count)}</span>
                  </button>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button onClick={() => setSaved(!saved)} className="text-muted-foreground hover:text-primary transition-colors">
                  <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-primary text-primary' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text-only */}
      {!post.media_url && (
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-card border border-border/30 p-[1px]">
              <img
                src={post.author_avatar || `https://api.dicebear.com/9.x/glass/svg?seed=${post.author_id}`}
                className="w-full h-full object-cover" alt=""
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold font-mono uppercase" style={{ letterSpacing: '0.05em' }}>
                  {post.author_name || 'Ciudadano'}
                </span>
                <Verified className="w-3 h-3 text-primary" />
              </div>
              <span className="text-[9px] text-muted-foreground font-mono">{timeAgo(post.created_at)}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </div>
          <p className="text-sm leading-relaxed mb-4">{post.content}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1.5 mb-4 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="text-[9px] text-primary/70 font-mono uppercase" style={{ letterSpacing: '0.08em' }}>#{tag}</span>
              ))}
            </div>
          )}
          <div className="pt-3 border-t border-border/20 space-y-2">
            <ImpactPulse value={post.likes_count + post.comments_count} />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono uppercase">Impacto {formatK(post.likes_count)}</span>
                </div>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono">{formatK(post.comments_count)}</span>
                </button>
              </div>
              <button onClick={() => setSaved(!saved)} className="text-muted-foreground hover:text-primary transition-colors">
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-primary text-primary' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.article>
  );
};

// ─── Console Composer ───
const ConsoleComposer = ({ onPost }: { onPost: (content: string) => Promise<void> }) => {
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const { user } = useAuth();
  if (!user) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setPosting(true);
    await onPost(content.trim());
    setContent("");
    setPosting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border/30 bg-card/60 backdrop-blur-xl p-4 mb-6"
    >
      <div className="flex gap-3">
        <div className="w-9 h-9 bg-card border border-border/30 flex-shrink-0 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Transmitir al ecosistema..."
            className="w-full bg-transparent border-none outline-none text-foreground text-sm resize-none placeholder:text-muted-foreground/40 font-mono"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/10">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-7 text-muted-foreground hover:text-primary rounded-none">
                <Image className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-muted-foreground hover:text-primary rounded-none">
                <Music className="w-3.5 h-3.5" />
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim() || posting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-7 text-[10px] rounded-none font-mono uppercase"
              style={{ letterSpacing: '0.1em' }}
            >
              {posting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3 mr-1.5" />}
              Transmitir
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Stories Bar (Industrial) ───
const StoriesBar = () => {
  const stories = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    name: ['Edwin', 'Isabella', 'María', 'Carlos', 'Luna', 'UTAMV', 'KAOS', 'DreamS'][i],
    img: `https://api.dicebear.com/9.x/glass/svg?seed=story${i}`,
    live: i < 2,
  }));

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-none">
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
        <div className="w-14 h-14 border border-dashed border-border/40 flex items-center justify-center bg-card/30 backdrop-blur cursor-pointer hover:border-primary/50 transition-colors">
          <span className="text-lg text-muted-foreground">+</span>
        </div>
        <span className="text-[9px] text-muted-foreground font-mono">NUEVO</span>
      </div>
      {stories.map(s => (
        <div key={s.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          <div className={`w-14 h-14 p-[1px] ${s.live ? 'border border-primary' : 'border border-border/30'}`}>
            <img src={s.img} alt={s.name} className="w-full h-full object-cover bg-card group-hover:opacity-80 transition-opacity" />
          </div>
          <span className="text-[9px] text-muted-foreground font-mono truncate max-w-[3.5rem] uppercase">{s.name}</span>
          {s.live && <span className="text-[8px] text-destructive font-bold uppercase font-mono -mt-1">LIVE</span>}
        </div>
      ))}
    </div>
  );
};

// ─── MAIN FEED ───
export const NextGenFeed = () => {
  const { posts, loading, hasMore, loadMore } = useSocialFeed({ pageSize: 20 });
  const { user } = useAuth();

  const handlePost = async (_content: string) => {};
  const displayPosts: SocialPost[] = posts.length > 0 ? posts : MOCK_VISUAL_POSTS;

  return (
    <div className="max-w-lg mx-auto px-3">
      <StoriesBar />
      <ConsoleComposer onPost={handlePost} />

      {loading && posts.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-6 h-6 border border-primary border-t-transparent mx-auto mb-3"
            />
            <p className="text-[9px] text-muted-foreground uppercase font-mono" style={{ letterSpacing: '0.2em' }}>
              Materializando feed
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayPosts.map((post, i) => (
            <ConsoleCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}

      {hasMore && !loading && posts.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center">
          <Button
            variant="ghost"
            onClick={loadMore}
            className="text-[9px] uppercase font-mono text-muted-foreground hover:text-primary rounded-none"
            style={{ letterSpacing: '0.2em' }}
          >
            Materializar más datos
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// ─── Helpers ───
function formatK(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'AHORA';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

// ─── Mock posts ───
const MOCK_VISUAL_POSTS: SocialPost[] = [
  {
    id: 'mock-1', author_id: 'edwin', content: '🚀 TAMV MD-X4™ marca el inicio de una nueva era. 48 federaciones operando en consola soberana.', 
    media_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=800&fit=crop', media_type: 'photo',
    likes_count: 2847, comments_count: 342, shares_count: 891, tags: ['TAMV', 'SovereignTech'], created_at: new Date(Date.now() - 900000).toISOString(), visibility: 'public',
    author_name: 'Edwin O. Castillo', author_avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=edwin',
  },
  {
    id: 'mock-2', author_id: 'isabella', content: 'Análisis de coherencia emocional del ecosistema. Incremento del 340% en bienestar colectivo. 🧠',
    media_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=800&fit=crop', media_type: 'photo',
    likes_count: 5621, comments_count: 1203, shares_count: 2104, tags: ['IsabellaAI', 'Sentinel'], created_at: new Date(Date.now() - 1800000).toISOString(), visibility: 'public',
    author_name: 'Isabella AI', author_avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=isabella',
  },
  {
    id: 'mock-3', author_id: 'maria', content: 'Primer DreamSpace operativo — recorrido con audio binaural 3D sincronizado al kernel.',
    media_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop', media_type: 'photo',
    likes_count: 1456, comments_count: 234, shares_count: 567, tags: ['DreamSpaces', 'XR'], created_at: new Date(Date.now() - 3600000).toISOString(), visibility: 'public',
    author_name: 'María Rdz', author_avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=maria',
  },
  {
    id: 'mock-4', author_id: 'kaos', content: '«Quantum Frequencies Vol. 3» — Audio binaural, frecuencias de concentración, beats industriales.',
    media_url: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=800&fit=crop', media_type: 'audio',
    likes_count: 3201, comments_count: 456, shares_count: 1890, tags: ['KAOSMusic', 'Binaural'], created_at: new Date(Date.now() - 7200000).toISOString(), visibility: 'public',
    author_name: 'KAOS Music', author_avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=kaos',
  },
  {
    id: 'mock-5', author_id: 'utamv', content: 'Certificación: «Arquitectura Quantum Federada». 47 inscritos en 2h. Hash inmutable en BookPI™.',
    media_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=800&fit=crop', media_type: 'photo',
    likes_count: 1678, comments_count: 289, shares_count: 445, tags: ['UTAMV', 'Certificación'], created_at: new Date(Date.now() - 14400000).toISOString(), visibility: 'public',
    author_name: 'UTAMV Academy', author_avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=utamv',
  },
];

export default NextGenFeed;
