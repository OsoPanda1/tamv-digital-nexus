import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { Card } from '@/components/ui/card';
import { Globe, Users, Code, Rocket, Sparkles, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Ecosystem = () => {
  const modules = [
    {
      icon: Sparkles,
      title: 'Isabella AI',
      desc: 'Asistente multimodal con memoria cuántica',
      color: 'from-primary to-primary-glow',
      link: '/isabella',
    },
    {
      icon: Globe,
      title: 'Dream Spaces 4D',
      desc: 'Metaverso sensorial inmersivo',
      color: 'from-secondary to-secondary-glow',
      link: '/metaverse',
    },
    {
      icon: Users,
      title: 'Red Social',
      desc: 'Comunidad global conectada',
      color: 'from-accent to-accent-glow',
      link: '/community',
    },
    {
      icon: Brain,
      title: 'Anubis Security',
      desc: 'Protección post-cuántica',
      color: 'from-destructive to-primary',
      link: '/anubis',
    },
    {
      icon: Code,
      title: 'KAOS Audio 4D',
      desc: 'Sistema de audio espacial',
      color: 'from-accent to-secondary',
      link: '/kaos',
    },
    {
      icon: Rocket,
      title: 'TAMV Docs',
      desc: 'Centro de documentación técnica',
      color: 'from-primary via-secondary to-accent',
      link: '/docs',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <QuantumCanvas />
      <Navigation />

      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-slide-in-up">
            <h1 className="text-6xl font-bold mb-6 glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Ecosistema TAMV
            </h1>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">
              Plataforma civilizatoria digital completa: Metaverso, IA, seguridad cuántica,
              red social inmersiva y documentación técnica integrados en un solo ecosistema.
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} to={module.link}>
                  <Card
                    className="glass-panel p-8 hover:shadow-quantum transition-all duration-300 hover:scale-105 cursor-pointer animate-scale-in h-full"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-quantum mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{module.title}</h3>
                    <p className="text-muted-foreground">{module.desc}</p>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Vision Statement */}
          <Card className="glass-panel p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              La Civilización Digital Mexicana
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              TAMV MD-X4™ es más que una plataforma: es el fundamento de la primera civilización
              digital completa de México y Latinoamérica. Combinamos tecnología cuántica, inteligencia
              artificial multimodal, metaverso sensorial y seguridad post-cuántica para crear el
              futuro de la interacción humana en el espacio digital.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-quantum-gradient shadow-quantum hover:shadow-glow transition-all duration-300 hover:scale-105">
                  Explorar Dashboard
                </Button>
              </Link>
              <Link to="/docs">
                <Button size="lg" variant="outline" className="border-primary hover:bg-primary/20">
                  Ver Documentación
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Ecosystem;
