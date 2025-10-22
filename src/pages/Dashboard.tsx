import Navigation from "@/components/Navigation";
import ParticleField from "@/components/ParticleField";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users, Zap } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "Usuarios Activos", value: "12.5K", icon: Users, color: "from-primary to-primary-glow" },
    { label: "Dream Spaces", value: "234", icon: Sparkles, color: "from-secondary to-secondary-glow" },
    { label: "Engagement", value: "+45%", icon: TrendingUp, color: "from-accent to-accent-glow" },
    { label: "Energy Level", value: "98%", icon: Zap, color: "from-primary via-secondary to-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <ParticleField />
      <Navigation />
      
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-slide-in-up">
            <h1 className="text-5xl font-bold mb-4 glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Centro de Control TAMV
            </h1>
            <p className="text-xl text-muted-foreground">
              Bienvenido al ecosistema digital civilizatorio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="glass-panel p-6 hover:shadow-quantum transition-all duration-300 hover:scale-105 animate-scale-in border-border/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-glow`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-panel p-8 lg:col-span-2 border-border/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Actividad Reciente
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Nuevo Dream Space creado", time: "Hace 5 min", user: "Usuario #1234" },
                  { title: "Evento comunitario iniciado", time: "Hace 15 min", user: "Moderador" },
                  { title: "Isabella AI actualizada", time: "Hace 1 hora", user: "Sistema" },
                  { title: "Nuevo contenido publicado", time: "Hace 2 horas", user: "Creador Pro" },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-colors border border-border/30"
                  >
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.user}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-panel p-8 border-border/50">
              <h2 className="text-2xl font-bold mb-6">Acciones Rápidas</h2>
              <div className="space-y-3">
                <Button className="w-full bg-primary hover:bg-primary/90 shadow-quantum">
                  Crear Dream Space
                </Button>
                <Button variant="outline" className="w-full border-primary/50 hover:bg-primary/20">
                  Ver Comunidad
                </Button>
                <Button variant="outline" className="w-full border-secondary/50 hover:bg-secondary/20">
                  Chat Isabella AI
                </Button>
                <Button variant="outline" className="w-full border-accent/50 hover:bg-accent/20">
                  Documentación Pro
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
