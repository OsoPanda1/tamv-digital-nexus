import Navigation from "@/components/Navigation";
import ParticleField from "@/components/ParticleField";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Video, Heart } from "lucide-react";

const Community = () => {
  const posts = [
    {
      author: "María Rodríguez",
      avatar: "MR",
      time: "Hace 2 horas",
      content: "¡Acabo de crear mi primer Dream Space! La experiencia sensorial es increíble 🎨✨",
      likes: 234,
      comments: 45,
    },
    {
      author: "Carlos Méndez",
      avatar: "CM",
      time: "Hace 5 horas",
      content: "El nuevo update de Isabella AI es impresionante. La capacidad multimodal ha mejorado muchísimo.",
      likes: 189,
      comments: 32,
    },
    {
      author: "Ana Torres",
      avatar: "AT",
      time: "Hace 1 día",
      content: "Organizando evento comunitario en el metaverso este fin de semana. ¿Quién se une? 🚀",
      likes: 456,
      comments: 87,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <ParticleField />
      <Navigation />
      
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 animate-slide-in-up">
            <h1 className="text-5xl font-bold mb-4 glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Comunidad TAMV
            </h1>
            <p className="text-xl text-muted-foreground">
              Conéctate, comparte y co-crea en el ecosistema digital
            </p>
          </div>

          <Card className="glass-panel p-6 mb-8 border-border/50">
            <textarea
              placeholder="¿Qué está pasando en tu metaverso?"
              className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder:text-muted-foreground min-h-[100px]"
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Grupo
                </Button>
              </div>
              <Button className="bg-quantum-gradient shadow-quantum">
                Publicar
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            {posts.map((post, index) => (
              <Card
                key={index}
                className="glass-panel p-6 hover:shadow-quantum transition-all duration-300 border-border/50 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-quantum-gradient flex items-center justify-center text-white font-bold shadow-quantum flex-shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold">{post.author}</h3>
                      <span className="text-sm text-muted-foreground">{post.time}</span>
                    </div>
                    <p className="text-foreground mb-4">{post.content}</p>
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                        <Heart className="w-5 h-5 group-hover:fill-primary group-hover:scale-110 transition-all" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Grupos Activos", count: "156", icon: Users },
              { title: "Canales Live", count: "23", icon: Video },
              { title: "Mensajes Hoy", count: "12.5K", icon: MessageCircle },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="glass-panel p-6 text-center border-border/50">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <p className="text-3xl font-bold mb-1">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;
