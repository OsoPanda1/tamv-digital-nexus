import Navigation from "@/components/Navigation";
import ParticleField from "@/components/ParticleField";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Lock, BookOpen, Code } from "lucide-react";

const Docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <ParticleField />
      <Navigation />
      
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 animate-slide-in-up text-center">
            <h1 className="text-5xl font-bold mb-4 glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              TAMV Docs Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Documentación completa del ecosistema civilizatorio digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="glass-panel p-8 hover:shadow-quantum transition-all duration-300 border-border/50 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-quantum">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Documentación Pública</h2>
                  <p className="text-sm text-muted-foreground">Acceso libre</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Historia y Visión del Proyecto
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Roadmap y Módulos
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Whitepapers Técnicos
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Guías de Usuario
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 shadow-quantum">
                Explorar Docs Públicas
              </Button>
            </Card>

            <Card className="glass-panel p-8 hover:shadow-glow transition-all duration-300 border-secondary/50 group relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-quantum-gradient text-xs font-bold text-white shadow-quantum">
                  PRO
                </span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center shadow-glow">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Documentación Pro</h2>
                  <p className="text-sm text-muted-foreground">Acceso Premium</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  Blueprints Completos
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  API Keys y SDK
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  Entorno Sandbox
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  Soporte Priority
                </li>
              </ul>
              <Button className="w-full bg-quantum-gradient shadow-glow hover:scale-105 transition-transform">
                Upgrade a Pro
              </Button>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Referencias API",
                description: "Documentación completa de endpoints y métodos",
                color: "from-primary to-primary-glow",
              },
              {
                icon: Code,
                title: "SDK & Libraries",
                description: "Herramientas de desarrollo y ejemplos de código",
                color: "from-secondary to-secondary-glow",
              },
              {
                icon: BookOpen,
                title: "Tutoriales",
                description: "Guías paso a paso para implementación",
                color: "from-accent to-accent-glow",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={index}
                  className="glass-panel p-6 hover:shadow-quantum transition-all duration-300 border-border/50 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-quantum mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Docs;
