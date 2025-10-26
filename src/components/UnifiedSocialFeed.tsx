import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Play } from "lucide-react";

interface SocialPost {
  id: string;
  platform: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  mediaUrl?: string;
  mediaType: "image" | "video";
  likes: number;
  comments: number;
  shares: number;
  platformColor: string;
}

const mockPosts: SocialPost[] = [
  {
    id: "1",
    platform: "Instagram",
    author: "Design Studio MX",
    avatar: "DS",
    time: "Hace 15 min",
    content: "Nuevo proyecto de diseño 3D para el metaverso 🎨✨ #TAMV #Design",
    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    mediaType: "image",
    likes: 2340,
    comments: 156,
    shares: 89,
    platformColor: "from-purple-500 to-pink-500",
  },
  {
    id: "2",
    platform: "TikTok",
    author: "Tech Innovators",
    avatar: "TI",
    time: "Hace 1 hora",
    content: "Tutorial de IA para crear espacios virtuales 🚀",
    mediaUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    mediaType: "video",
    likes: 45200,
    comments: 1230,
    shares: 3400,
    platformColor: "from-black to-cyan-400",
  },
  {
    id: "3",
    platform: "Twitter",
    author: "Digital Revolution",
    avatar: "DR",
    time: "Hace 2 horas",
    content: "El futuro de las redes sociales es descentralizado. TAMV lidera el cambio 🌐",
    mediaUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    mediaType: "image",
    likes: 8900,
    comments: 432,
    shares: 1200,
    platformColor: "from-blue-400 to-blue-600",
  },
  {
    id: "4",
    platform: "LinkedIn",
    author: "Professional Network",
    avatar: "PN",
    time: "Hace 3 horas",
    content: "Conferencia sobre metaverso e IA en CDMX. Networking del futuro 💼",
    mediaUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    mediaType: "image",
    likes: 3400,
    comments: 234,
    shares: 567,
    platformColor: "from-blue-600 to-blue-800",
  },
  {
    id: "5",
    platform: "Facebook",
    author: "Community Central",
    avatar: "CC",
    time: "Hace 4 horas",
    content: "Evento comunitario en Dream Space este sábado. ¡Todos invitados! 🎉",
    mediaUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    mediaType: "image",
    likes: 5600,
    comments: 890,
    shares: 234,
    platformColor: "from-blue-500 to-blue-700",
  },
  {
    id: "6",
    platform: "OnlyFans",
    author: "Creative Arts",
    avatar: "CA",
    time: "Hace 5 horas",
    content: "Contenido exclusivo: Arte digital y NFTs en el metaverso 🎭",
    mediaUrl: "https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=800",
    mediaType: "image",
    likes: 12300,
    comments: 456,
    shares: 123,
    platformColor: "from-blue-400 to-cyan-500",
  },
  {
    id: "7",
    platform: "Telegram",
    author: "Tech Community",
    avatar: "TC",
    time: "Hace 6 horas",
    content: "Canal abierto de desarrollo TAMV. Únete a la conversación 💬",
    mediaUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    mediaType: "image",
    likes: 1200,
    comments: 89,
    shares: 45,
    platformColor: "from-blue-400 to-blue-500",
  },
  {
    id: "8",
    platform: "Fansly",
    author: "Digital Creators",
    avatar: "DC",
    time: "Hace 8 horas",
    content: "Behind the scenes: Creación de avatares 3D personalizados ✨",
    mediaUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    mediaType: "video",
    likes: 8900,
    comments: 234,
    shares: 156,
    platformColor: "from-pink-400 to-rose-500",
  },
];

export const UnifiedSocialFeed = () => {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Muro Global Unificado
            </h2>
            <p className="text-xl text-muted-foreground">
              Contenido de Facebook, Instagram, TikTok, Twitter, LinkedIn, Telegram, OnlyFans, Fansly y más en un solo lugar
            </p>
          </div>

          <Card className="glass-panel p-6 mb-8 border-border/50">
            <textarea
              placeholder="¿Qué quieres compartir con el mundo?"
              className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder:text-muted-foreground min-h-[100px]"
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <div className="flex gap-2 flex-wrap">
                {["Instagram", "TikTok", "Twitter", "Facebook", "LinkedIn", "Telegram"].map((platform) => (
                  <Badge key={platform} variant="outline" className="cursor-pointer hover:bg-primary/20 transition-colors">
                    {platform}
                  </Badge>
                ))}
              </div>
              <Button className="bg-quantum-gradient shadow-quantum">
                Publicar en Todo
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPosts.map((post, index) => (
              <Card
                key={post.id}
                className="glass-panel overflow-hidden hover:shadow-quantum transition-all duration-300 hover:scale-[1.02] border-border/50 animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${post.platformColor} flex items-center justify-center text-white font-bold shadow-quantum flex-shrink-0`}>
                      {post.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm truncate">{post.author}</h3>
                        <Badge className={`bg-gradient-to-r ${post.platformColor} border-0 text-white text-xs`}>
                          {post.platform}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{post.content}</p>
                </div>

                <div className="relative group cursor-pointer">
                  <img
                    src={post.mediaUrl}
                    alt={post.content}
                    className="w-full h-64 object-cover"
                  />
                  {post.mediaType === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-quantum">
                        <Play className="w-8 h-8 text-black ml-1" fill="black" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/60 backdrop-blur-sm border-0 text-white">
                      {post.mediaType === "video" ? "Video" : "Imagen"}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                    <Heart className="w-5 h-5 group-hover:fill-primary group-hover:scale-110 transition-all" />
                    <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.shares.toLocaleString()}</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="border-primary hover:bg-primary/20">
              Cargar Más Contenido
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
