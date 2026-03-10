// ============================================================================
// TAMV MD-X4™ — NEXTGEN FEED v10.0 · SOVEREIGN CONSOLE 300x
// Hexagonal stories · Impact + Sovereignty metrics · ADQUIRIR_FLUJO
// ============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, Share2, Bookmark, Play, Music, Verified,
  Send, Image, Sparkles, Loader2, MoreHorizontal, Volume2,
  Activity, TrendingUp, Shield, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useSocialFeed, type SocialPost } from "@/hooks/useSocialFeed";

// ─── Impact Pulse Line ───
const ImpactPulse = ({ value, label }: { value: number; label: string }) => {
  const normalized = Math.min(value / 5000, 1);
  return (
    <div className="flex items-center gap-2">
      <span className="text-[8px] font-mono uppercase text-muted-foreground w-14 flex-shrink-0" style={{ letterSpacing: '0.05em' }}>{label}</span>
      <div className="flex-1 h-[2px] bg-border/20 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--silver)))` }}
          initial={{ width: 0 }}
          animate={{ width: `${normalized * 100}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[9px] font-mono text-primary w-8 text-right">{formatK(value)}</span>
    </div>
  );
};

// ─── Sovereignty Score Badge ───
const SovereigntyBadge = ({ score }: { score: number }) => (
  <div className="flex items-center gap-1">
    <Shield className="w-3 h-3 text-accent" />
    <span className="text-[9px] font-mono text-accent uppercase" style={{ letterSpacing: '0.05em' }}>
      Soberanía {score}%
    </span>
  </div>
);

// ─── Console Card (Sharp, Industrial, 4:5) ───
const ConsoleCard = ({ post, index }: { post: SocialPost; index: number }) => {
  const [saved, setSaved] = useState(false);
  const sovereigntyScore = Math.min(99, 60 + Math.floor((post.likes_count + post.shares_count) / 100));

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
              background: `repeating-linear-gradient(0deg, transparent, transparent 3px, hsl(var(--primary) / 0.03) 3px, hsl(var(--primary) / 0.03) 4px)`,
            }}
          />
          {/* Gradient from bottom */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.5) 35%, transparent 70%)` }} />

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

          {/* Top status badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {post.media_type === 'video' && (
              <Badge className="bg-destructive/80 border-none text-[8px] uppercase tracking-widest rounded-none font-mono">
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
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-foreground font-mono uppercase" style={{ letterSpacing: '0.05em' }}>
                    {post.author_name || 'Ciudadano'}
                  </span>
                  <Verified className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[9px] text-muted-foreground font-mono">{timeAgo(post.created_at)}</span>
              </div>
              <SovereigntyBadge score={sovereigntyScore} />
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

            {/* Metrics bar — Impact + Sovereignty */}
            <div className="space-y-1.5 mb-3">
              <ImpactPulse value={post.likes_count + post.comments_count + post.shares_count} label="Impacto" />
              <ImpactPulse value={post.likes_count * 2} label="Flujo" />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono uppercase">{formatK(post.likes_count)}</span>
                </button>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono">{formatK(post.comments_count)}</span>
                </button>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSaved(!saved)} className="text-muted-foreground hover:text-primary transition-colors">
                  <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-primary text-primary' : ''}`} />
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-3 text-[8px] font-mono uppercase border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-none"
                  style={{ letterSpacing: '0.08em' }}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  VINCULAR
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text-only post */}
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
          <div className="pt-3 border-t border-border/20 space-y-1.5 mb-3">
            <ImpactPulse value={post.likes_count + post.comments_count} label="Impacto" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono uppercase">{formatK(post.likes_count)}</span>
              </button>
              <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono">{formatK(post.comments_count)}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSaved(!saved)} className="text-muted-foreground hover:text-primary transition-colors">
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-primary text-primary' : ''}`} />
              </button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-3 text-[8px] font-mono uppercase border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-none"
                style={{ letterSpacing: '0.08em' }}
              >
                <Zap className="w-3 h-3 mr-1" />
                VINCULAR
              </Button>
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

// ─── Hexagonal Stories Bar ───
const StoriesBar = () => {
  const stories = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    name: ['Edwin', 'Isabella', 'María', 'Carlos', 'Luna', 'UTAMV', 'KAOS', 'DreamS'][i],
    img: `https://api.dicebear.com/9.x/glass/svg?seed=story${i}`,
    live: i < 2,
  }));

  return (
    <div className="flex gap-3 overflow-x-auto pb-3 mb-6 scrollbar-none">
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
        <div className="w-14 h-14 border border-dashed border-border/40 flex items-center justify-center bg-card/30 backdrop-blur cursor-pointer hover:border-primary/50 transition-colors"
          style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
        >
          <span className="text-lg text-muted-foreground">+</span>
        </div>
        <span className="text-[9px] text-muted-foreground font-mono uppercase">NUEVO</span>
      </div>
      {stories.map(s => (
        <div key={s.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group relative">
          <div
            className={`w-14 h-14 p-[1px] overflow-hidden ${s.live ? 'bg-primary/20' : 'bg-border/20'}`}
            style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
          >
            <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
          </div>
          <span className="text-[9px] text-muted-foreground font-mono truncate max-w-[3.5rem] uppercase">{s.name}</span>
          {s.live && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full animate-pulse" />
          )}
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
    id: 'mock-5', author_id: 'utamv', content: 'Nueva certificación BookPI: «Soberanía Digital Nivel 3» — ya disponible en UTAMV.',
    media_url: null, media_type: null,
    likes_count: 1892, comments_count: 567, shares_count: 234, tags: ['UTAMV', 'BookPI', 'Certificación'], created_at: new Date(Date.now() - 14400000).toISOString(), visibility: 'public',
    author_name: 'UTAMV', author_avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=utamv',
  },
];

export default NextGenFeed;
