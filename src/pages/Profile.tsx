import Navigation from "@/components/Navigation";
import ParticleField from "@/components/ParticleField";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Bell, Star } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <ParticleField />
      <Navigation />
      
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-panel p-8 mb-8 border-border/50 animate-slide-in-up">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-quantum-gradient flex items-center justify-center text-white text-3xl font-bold shadow-quantum">
                TC
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">Creador TAMV</h1>
                <p className="text-muted-foreground mb-4">Miembro desde enero 2024</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Notificaciones
                  </Button>
                </div>
              </div>
              <Button className="bg-quantum-gradient shadow-quantum">
                Editar Perfil
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Dream Spaces", value: "12", icon: Star },
              { label: "Publicaciones", value: "45", icon: User },
              { label: "Conexiones", value: "234", icon: User },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="glass-panel p-6 text-center border-border/50 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              );
            })}
          </div>

          <Card className="glass-panel p-8 border-border/50">
            <h2 className="text-2xl font-bold mb-6">Actividad Reciente</h2>
            <div className="space-y-4">
              {[
                "Creaste un nuevo Dream Space: 'Jardín Cuántico'",
                "Publicaste en la comunidad sobre el nuevo update",
                "Te uniste al grupo 'Desarrolladores TAMV'",
                "Completaste el tutorial de Isabella AI",
              ].map((activity, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-card/50 border border-border/30 hover:bg-card/80 transition-colors"
                >
                  <p className="text-foreground">{activity}</p>
                  <p className="text-sm text-muted-foreground mt-1">Hace {index + 1} días</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
