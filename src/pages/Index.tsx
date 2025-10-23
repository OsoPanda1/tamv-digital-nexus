import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { QuantumCanvas } from "@/components/QuantumCanvas";
import { CinematicIntro } from "@/components/CinematicIntro";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Globe, Users, Zap, Brain, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroQuantum from "@/assets/hero-quantum.jpg";

const Index = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('tamv_intro_shown');
    if (!hasSeenIntro) {
      setShowIntro(true);
    } else {
      setIntroComplete(true);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('tamv_intro_shown', 'true');
    setShowIntro(false);
    setIntroComplete(true);
  };

  if (showIntro && !introComplete) {
    return <CinematicIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <QuantumCanvas />
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroQuantum} 
            alt="TAMV Quantum Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8 animate-float">
              <span className="px-6 py-2 rounded-full glass-panel text-sm font-medium shadow-quantum inline-block">
                Ecosistema Civilizatorio Digital Mexicano
              </span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-bold mb-6 glow-text animate-slide-in-up">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                TAMV MD-X4™
              </span>
            </h1>
            
            <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              Plataforma completa de metaverso, red social, IA y documentación técnica.
              El futuro de la civilización digital comienza aquí.
            </p>

            <div className="flex gap-4 justify-center mb-16 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/dashboard">
                <Button size="lg" className="bg-quantum-gradient shadow-quantum hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg px-8">
                  Entrar al Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button size="lg" variant="outline" className="border-primary hover:bg-primary/20 text-lg px-8">
                  Ver Documentación
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Sparkles, label: "Dream Spaces 4D", value: "Inmersivos", link: "/metaverse" },
                { icon: Brain, label: "Isabella AI", value: "Multimodal", link: "/isabella" },
                { icon: Users, label: "Comunidad", value: "Global", link: "/community" },
                { icon: Shield, label: "Anubis Security", value: "Cuántica", link: "/anubis" },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link key={index} to={feature.link}>
                    <Card
                      className="glass-panel p-6 hover:shadow-quantum transition-all duration-300 hover:scale-105 border-border/50 animate-scale-in cursor-pointer"
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-3 text-primary animate-pulse-glow" />
                      <p className="text-sm text-muted-foreground mb-1">{feature.label}</p>
                      <p className="font-bold">{feature.value}</p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Capacidades del Ecosistema
              </h2>
              <p className="text-xl text-muted-foreground">
                Tecnología cuántica-cristalina para la civilización digital
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Metaverso Sensorial 4D",
                  description: "Espacios virtuales con ambientación completa: efectos visuales volumétricos, audio KAOS 3D/4D y feedback háptico. Dream Spaces personalizables con IA.",
                  color: "from-primary to-primary-glow",
                },
                {
                  title: "Red Social Inmersiva",
                  description: "Timeline multimedia, grupos temáticos, canales live, streaming 4D. Conecta, comparte y co-crea con la comunidad global TAMV.",
                  color: "from-secondary to-secondary-glow",
                },
                {
                  title: "Isabella AI Multimodal",
                  description: "Asistente de inteligencia artificial con capacidades de texto, voz (ElevenLabs), memoria cuántica y co-creación emocional.",
                  color: "from-accent to-accent-glow",
                },
                {
                  title: "Centro de Documentación",
                  description: "TAMV Docs Center con niveles público y Pro. Blueprints, API, SDK, sandbox y referencias completas para desarrolladores.",
                  color: "from-primary via-secondary to-accent",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="glass-panel p-8 hover:shadow-quantum transition-all duration-300 hover:scale-105 border-border/50"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-quantum mb-6`}>
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <Card className="glass-panel max-w-4xl mx-auto p-12 text-center border-border/50 shadow-quantum">
            <h2 className="text-4xl font-bold mb-6 glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Únete al Futuro Digital
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Forma parte del ecosistema civilizatorio digital más avanzado de México y Latinoamérica
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-quantum-gradient shadow-quantum hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg px-12">
                Comenzar Ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
