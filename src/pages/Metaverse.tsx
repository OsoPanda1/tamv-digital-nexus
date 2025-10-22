import Navigation from "@/components/Navigation";
import ParticleField from "@/components/ParticleField";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles } from "lucide-react";
import metaverseSpace from "@/assets/metaverse-space.jpg";

const Metaverse = () => {
  return (
    <div className="min-h-screen bg-background">
      <ParticleField />
      <Navigation />
      
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-slide-in-up text-center">
            <h1 className="text-6xl font-bold mb-4 glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Metaverso TAMV
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explora espacios 4D inmersivos y experiencias sensoriales en el ecosistema digital
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass-panel p-8 hover:shadow-quantum transition-all duration-300 border-border/50 group">
              <div className="relative overflow-hidden rounded-lg mb-6 h-64">
                <img 
                  src={metaverseSpace} 
                  alt="Dream Spaces" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-quantum">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Dream Spaces</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Crea y personaliza tus espacios virtuales con ambientación sensorial, audio KAOS 3D/4D y efectos visuales cuánticos.
              </p>
              <Button className="w-full bg-quantum-gradient shadow-quantum hover:shadow-glow transition-all">
                Explorar Dream Spaces
              </Button>
            </Card>

            <Card className="glass-panel p-8 hover:shadow-quantum transition-all duration-300 border-border/50 group">
              <div className="relative overflow-hidden rounded-lg mb-6 h-64 bg-gradient-to-br from-secondary/20 to-accent/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Compass className="w-32 h-32 text-secondary animate-pulse-glow" />
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center shadow-glow">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Cattleya Content</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Plataforma de contenido inmersivo con experiencias multimedia 4D, streaming sensorial y co-creación comunitaria.
              </p>
              <Button variant="outline" className="w-full border-secondary hover:bg-secondary/20">
                Acceder a Cattleya
              </Button>
            </Card>
          </div>

          <Card className="glass-panel p-8 mt-8 border-border/50">
            <h2 className="text-2xl font-bold mb-6">Características del Metaverso</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Experiencias 4D",
                  description: "Ambientes sensoriales completos con efectos visuales, audio espacial y feedback háptico"
                },
                {
                  title: "Interacción Social",
                  description: "Conecta con usuarios en tiempo real en espacios compartidos inmersivos"
                },
                {
                  title: "Personalización Total",
                  description: "Diseña tu identidad digital y personaliza cada aspecto de tu experiencia"
                },
              ].map((feature, index) => (
                <div key={index} className="p-6 rounded-lg bg-card/50 border border-border/30">
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Metaverse;
