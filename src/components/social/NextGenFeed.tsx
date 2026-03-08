// ============================================================================
// TAMV MD-X4™ — NEXT-GEN SOCIAL FEED · 300x Superior
// NO ES UN CLON DE FACEBOOK. Es la evolución visual de las redes sociales.
// Ratio: 85% visual/inmersivo · 15% texto
// ============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageCircle, Share2, Bookmark, Play, Music, Verified,
  Flame, Eye, Send, Image, Sparkles, Loader2, MoreHorizontal, Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useSocialFeed, type SocialPost } from "@/hooks/useSocialFeed";

// ─── Hero Content Card (Full-bleed visual) ───
const HeroCard = ({ post, index }: { post: SocialPost; index: number }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative rounded-3xl overflow-hidden bg-card/40 backdrop-blur-xl border border-border/20 hover:border-primary/20 transition-all duration-500"
    >
      {/* Full-bleed media */}
      {post.media_url && (
        <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
          <img
            src={post.media_url}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {/* Gradient overlay from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          
          {/* Play indicator for video */}
          {post.media_type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full bg-background/60 backdrop-blur-lg flex items-center justify-center border border-border/30"
              >
                <Play className="w-6 h-6 text-foreground ml-0.5" />
              </motion.div>
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {post.media_type === 'video' && (
              <Badge className="bg-destructive/80 border-none text-[10px] uppercase tracking-wider">
                <Volume2 className="w-3 h-3 mr-1" /> Live
              </Badge>
            )}
          </div>

          {/* Content overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {/* Author */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(var(--aqua))] to-[hsl(var(--accent))] p-[2px]">
                <img
                  src={post.author_avatar || `https://api.dicebear.com/9.x/glass/svg?seed=${post.author_id}`}
                  className="w-full h-full rounded-full object-cover"
                  alt=""
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground">{post.author_name || 'Ciudadano'}</span>
                  <Verified className="w-3.5 h-3.5 text-primary" />
                </div>
              </div>
            </div>

            {/* Text preview */}
            <p className="text-sm text-foreground/80 line-clamp-2 mb-3">{post.content}</p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] text-primary/80 font-medium">#{tag}</span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLiked(!liked)}
                  className="flex items-center gap-1.5 text-foreground/70 hover:text-destructive transition-colors"
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-destructive text-destructive' : ''}`} />
                  <span className="text-xs font-medium">{formatK(post.likes_count + (liked ? 1 : 0))}</span>
                </button>
                <button className="flex items-center gap-1.5 text-foreground/70 hover:text-primary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-xs font-medium">{formatK(post.comments_count)}</span>
                </button>
                <button className="flex items-center gap-1.5 text-foreground/70 hover:text-primary transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => setSaved(!saved)}
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-primary text-primary' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text-only posts */}
      {!post.media_url && (
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--aqua))] to-[hsl(var(--accent))] p-[2px]">
              <img
                src={post.author_avatar || `https://api.dicebear.com/9.x/glass/svg?seed=${post.author_id}`}
                className="w-full h-full rounded-full object-cover"
                alt=""
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold">{post.author_name || 'Ciudadano'}</span>
                <Verified className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[10px] text-muted-foreground">{timeAgo(post.created_at)}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm leading-relaxed mb-4">{post.content}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1.5 mb-4 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs text-primary/80 font-medium">#{tag}</span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-border/20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-destructive text-destructive' : ''}`} />
                <span className="text-xs">{formatK(post.likes_count + (liked ? 1 : 0))}</span>
              </button>
              <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{formatK(post.comments_count)}</span>
              </button>
              <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setSaved(!saved)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-primary text-primary' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </motion.article>
  );
};

// ─── Composer ───
const PostComposer = ({ onPost }: { onPost: (content: string) => Promise<void> }) => {
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
      className="rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl p-4 mb-6"
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--aqua))] to-[hsl(var(--accent))] p-[2px] flex-shrink-0">
          <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Comparte con la civilización..."
            className="w-full bg-transparent border-none outline-none text-foreground text-sm resize-none placeholder:text-muted-foreground/50"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/10">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-primary">
                <Image className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-primary">
                <Music className="w-4 h-4" />
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim() || posting}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-8 text-xs"
            >
              {posting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3 mr-1.5" />}
              Publicar
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Stories Bar ───
const StoriesBar = () => {
  const mockStories = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    name: ['Edwin', 'Isabella', 'María', 'Carlos', 'Luna', 'UTAMV', 'KAOS', 'DreamS'][i],
    img: `https://api.dicebear.com/9.x/glass/svg?seed=story${i}`,
    live: i < 2,
  }));

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-none">
      {/* Add story */}
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border/40 flex items-center justify-center bg-card/30 backdrop-blur cursor-pointer hover:border-primary/50 transition-colors">
          <span className="text-xl text-muted-foreground">+</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Tu historia</span>
      </div>
      {mockStories.map(s => (
        <div key={s.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          <div className={`w-16 h-16 rounded-2xl p-[2px] ${s.live ? 'bg-gradient-to-br from-[hsl(var(--aqua))] to-[hsl(var(--accent))]' : 'bg-border/30'}`}>
            <img
              src={s.img}
              alt={s.name}
              className="w-full h-full rounded-[14px] object-cover bg-card group-hover:scale-95 transition-transform"
            />
          </div>
          <span className="text-[10px] text-muted-foreground truncate max-w-[4rem]">{s.name}</span>
          {s.live && (
            <span className="text-[8px] text-destructive font-bold uppercase -mt-1">Live</span>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── MAIN FEED ───
export const NextGenFeed = () => {
  const { posts, loading, hasMore, loadMore, refreshFeed } = useSocialFeed({ pageSize: 20 });
  const { user } = useAuth();

  const handlePost = async (content: string) => {
    // Placeholder — CreatePostComposer already uses useCreatePost
    // This is just for the visual composer
  };

  // If no real posts, show visual mock feed
  const displayPosts: SocialPost[] = posts.length > 0 ? posts : MOCK_VISUAL_POSTS;

  return (
    <div className="max-w-lg mx-auto px-3">
      {/* Stories */}
      <StoriesBar />

      {/* Composer */}
      <PostComposer onPost={handlePost} />

      {/* Feed */}
      {loading && posts.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent mx-auto mb-3"
            />
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Cargando feed</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayPosts.map((post, i) => (
            <HeroCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && !loading && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 text-center"
        >
          <Button
            variant="ghost"
            onClick={loadMore}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
          >
            Cargar más
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
  if (mins < 1) return 'ahora';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

// ─── Visual mock posts (used when DB is empty) ───
const MOCK_VISUAL_POSTS: SocialPost[] = [
  {
    id: 'mock-1', author_id: 'edwin', content: '🚀 TAMV MD-X4™ marca el inicio de una nueva era. 48 federaciones operando. Soberanía total.', 
    media_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=800&fit=crop', media_type: 'photo',
    likes_count: 2847, comments_count: 342, shares_count: 891, tags: ['TAMV', 'QuantumTech'], created_at: new Date(Date.now() - 900000).toISOString(), visibility: 'public',
    author_name: 'Edwin O. Castillo', author_avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=edwin',
  },
  {
    id: 'mock-2', author_id: 'isabella', content: 'Analizando coherencia emocional del ecosistema. Incremento del 340% en bienestar colectivo. 🧠✨',
    media_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=800&fit=crop', media_type: 'photo',
    likes_count: 5621, comments_count: 1203, shares_count: 2104, tags: ['IsabellaAI', 'Sentient'], created_at: new Date(Date.now() - 1800000).toISOString(), visibility: 'public',
    author_name: 'Isabella AI', author_avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=isabella',
  },
  {
    id: 'mock-3', author_id: 'maria', content: 'Mi primer DreamSpace inmersivo está listo! Recorrido virtual con audio binaural 3D 🎨',
    media_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop', media_type: 'photo',
    likes_count: 1456, comments_count: 234, shares_count: 567, tags: ['DreamSpaces', 'XR'], created_at: new Date(Date.now() - 3600000).toISOString(), visibility: 'public',
    author_name: 'María Rdz', author_avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=maria',
  },
  {
    id: 'mock-4', author_id: 'kaos', content: '🎵 «Quantum Frequencies Vol. 3» — Audio binaural, frecuencias de concentración, beats épicos.',
    media_url: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=800&fit=crop', media_type: 'audio',
    likes_count: 3201, comments_count: 456, shares_count: 1890, tags: ['KAOSMusic', 'Binaural'], created_at: new Date(Date.now() - 7200000).toISOString(), visibility: 'public',
    author_name: 'KAOS Music', author_avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=kaos',
  },
  {
    id: 'mock-5', author_id: 'utamv', content: 'Nueva certificación: «Arquitectura Quantum Federada». 47 inscritos en 2h. Certificación inmutable en BookPI™.',
    media_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=800&fit=crop', media_type: 'photo',
    likes_count: 1678, comments_count: 289, shares_count: 445, tags: ['UTAMV', 'Education'], created_at: new Date(Date.now() - 14400000).toISOString(), visibility: 'public',
    author_name: 'UTAMV Academy', author_avatar: 'https://api.dicebear.com/9.x/glass/svg?seed=utamv',
  },
];

export default NextGenFeed;
