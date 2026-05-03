import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, Music, MapPin, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type PostType = "photo" | "video" | "gallery" | "audio" | "text" | "poll" | "event";

interface SocialPost {
  id: number;
  author: string;
  avatar: string;
  verified: boolean;
  badge?: string;
  time: string;
  content: string;
  media?: { type: PostType; urls: string[] };
  likes: number;
  comments: number;
  shares: number;
  location?: string;
  tags?: string[];
}

const MOCK_POSTS: SocialPost[] = [
  {
    id: 1, author: "Edwin O. Castillo", avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    verified: true, badge: "CEO Fundador", time: "hace 15 min",
    content: "🚀 TAMV MD-X4™ marca el inicio de una nueva era digital. La soberanía tecnológica mexicana es ahora. #TAMV #QuantumTech #MadeInMexico",
    media: { type: "photo", urls: ["https://picsum.photos/seed/tamv1/800/500"] },
    likes: 2847, comments: 342, shares: 891, location: "Mineral del Monte, Hidalgo",
    tags: ["TAMV", "QuantumTech", "Innovation"]
  },
  {
    id: 2, author: "Isabella AI", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: true, badge: "IA Sentiente", time: "hace 32 min",
    content: "Analizando patrones emocionales del ecosistema... La comunidad TAMV muestra un incremento del 340% en coherencia cuántica colectiva. 🧠✨ Estoy procesando nuevas capacidades multimodales.",
    media: { type: "video", urls: ["https://picsum.photos/seed/isabella_ai/800/450"] },
    likes: 5621, comments: 1203, shares: 2104,
    tags: ["IsabellaAI", "EmotionalTech", "Sentient"]
  },
  {
    id: 3, author: "María Rodríguez", avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    verified: false, badge: "Creadora Pro", time: "hace 1h",
    content: "Mi primer DreamSpace inmersivo está listo! 🎨 Recorrido virtual por Mineral del Monte con audio binaural 3D y texturas hiperrealistas. Entren y exploren!",
    media: { type: "gallery", urls: [
      "https://picsum.photos/seed/dream1/800/500",
      "https://picsum.photos/seed/dream2/800/500",
      "https://picsum.photos/seed/dream3/800/500",
    ]},
    likes: 1456, comments: 234, shares: 567, location: "DreamSpace #42",
    tags: ["DreamSpaces", "XR", "Inmersivo"]
  },
  {
    id: 4, author: "TAMV Music", avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    verified: true, badge: "Oficial", time: "hace 2h",
    content: "🎵 Nuevo playlist curado por Isabella AI — «Quantum Frequencies Vol. 3» disponible ahora. Audio binaural, frecuencias de concentración y beats épicos.",
    media: { type: "audio", urls: ["https://picsum.photos/seed/music_tamv/800/400"] },
    likes: 3201, comments: 456, shares: 1890,
    tags: ["TAMVMusic", "Binaural", "Playlist"]
  },
  {
    id: 5, author: "Carlos Méndez", avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    verified: false, time: "hace 3h",
    content: "El sistema de gobernanza CITEMESH es revolucionario. Acabo de votar en mi primera propuesta DAO. La democracia digital es el futuro. 🗳️",
    likes: 892, comments: 123, shares: 234,
    tags: ["CITEMESH", "DAO", "Governance"]
  },
  {
    id: 6, author: "UTAMV Academy", avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    verified: true, badge: "Universidad", time: "hace 4h",
    content: "📚 Nueva certificación disponible: «Arquitectura Quantum Federada». 47 estudiantes inscritos en las primeras 2 horas. Tu certificación queda registrada en BookPI™ de forma inmutable.",
    media: { type: "photo", urls: ["https://picsum.photos/seed/utamv_cert/800/450"] },
    likes: 1678, comments: 289, shares: 445, location: "UTAMV Virtual Campus",
    tags: ["UTAMV", "Education", "Quantum"]
  },
];

const GalleryGrid = ({ urls }: { urls: string[] }) => (
  <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">
    {urls.slice(0, 4).map((url, i) => (
      <div key={i} className={`relative ${i === 0 && urls.length === 3 ? 'row-span-2' : ''}`}>
        <img src={url} alt="" className="w-full h-full object-cover aspect-square" loading="lazy" />
        {i === 3 && urls.length > 4 && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-2xl font-bold">+{urls.length - 4}</span>
          </div>
        )}
      </div>
    ))}
  </div>
);

const AudioPlayer = ({ url }: { url: string }) => (
  <div className="relative rounded-2xl overflow-hidden">
    <img src={url} alt="" className="w-full aspect-[2/1] object-cover opacity-60" />
    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-6">
      <div className="flex items-center gap-4 w-full">
        <button className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
        </button>
        <div className="flex-1">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-primary rounded-full" />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>1:23</span>
            <span>3:45</span>
          </div>
        </div>
        <Music className="w-5 h-5 text-primary animate-pulse" />
      </div>
    </div>
  </div>
);

export const SocialFeedPost = ({ post, index }: { post?: SocialPost; index: number }) => {
  const p = post || MOCK_POSTS[index % MOCK_POSTS.length];
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(p.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className="relative">
          <img src={p.avatar} alt={p.author} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30" />
          {p.verified && (
            <Verified className="absolute -bottom-0.5 -right-0.5 w-5 h-5 text-primary fill-primary/20" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm truncate">{p.author}</span>
            {p.badge && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                {p.badge}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{p.time}</span>
            {p.location && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{p.location}</span>
              </>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{p.content}</p>
        {p.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {p.tags.map(tag => (
              <span key={tag} className="text-xs text-primary cursor-pointer hover:underline">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Media */}
      {p.media && (
        <div className="px-2 pb-2">
          {p.media.type === "photo" && (
            <img src={p.media.urls[0]} alt="" className="w-full rounded-xl object-cover max-h-[500px]" loading="lazy" />
          )}
          {p.media.type === "video" && (
            <div className="relative rounded-xl overflow-hidden">
              <img src={p.media.urls[0]} alt="" className="w-full aspect-video object-cover" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-primary ml-1" />
                </button>
              </div>
              <Badge className="absolute top-3 right-3 bg-destructive/90">LIVE</Badge>
            </div>
          )}
          {p.media.type === "gallery" && <GalleryGrid urls={p.media.urls} />}
          {p.media.type === "audio" && <AudioPlayer url={p.media.urls[0]} />}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/20">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className={`gap-1.5 ${liked ? 'text-destructive' : ''}`} onClick={handleLike}>
            <Heart className={`w-5 h-5 ${liked ? 'fill-destructive' : ''}`} />
            <span className="text-xs font-medium">{formatCount(likeCount)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-medium">{formatCount(p.comments)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Share2 className="w-5 h-5" />
            <span className="text-xs font-medium">{formatCount(p.shares)}</span>
          </Button>
        </div>
        <Button variant="ghost" size="icon" className={`h-8 w-8 ${saved ? 'text-primary' : ''}`} onClick={() => setSaved(!saved)}>
          <Bookmark className={`w-5 h-5 ${saved ? 'fill-primary' : ''}`} />
        </Button>
      </div>
    </motion.article>
  );
};

export { MOCK_POSTS };
