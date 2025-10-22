import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Radio, Waves, Zap, Play, Pause } from 'lucide-react';
import { useState } from 'react';

const Kaos = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioFeatures = [
    {
      icon: Volume2,
      title: 'Audio Espacial 360°',
      desc: 'Sonido envolvente tridimensional con posicionamiento preciso',
    },
    {
      icon: Waves,
      title: 'Frecuencias KAOS',
      desc: 'Síntesis de ondas cuánticas para experiencias sensoriales únicas',
    },
    {
      icon: Radio,
      title: 'Ambientación Dinámica',
      desc: 'Paisajes sonoros que reaccionan a tu posición y acciones',
    },
    {
      icon: Zap,
      title: 'Feedback Háptico',
      desc: 'Vibraciones sincronizadas con el audio para inmersión total',
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
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-quantum animate-pulse-glow">
                <Volume2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-bold glow-text bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
                  KAOS Audio 4D
                </h1>
                <p className="text-muted-foreground text-lg">Sistema de Audio Espacial Cuántico</p>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experiencia sonora revolucionaria con audio 360°, síntesis cuántica y feedback háptico.
              Escucha en una dimensión completamente nueva.
            </p>
          </div>

          {/* Audio Player Demo */}
          <Card className="glass-panel p-12 mb-12 text-center animate-scale-in">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-quantum-gradient flex items-center justify-center shadow-quantum mb-6 animate-pulse-glow">
                {isPlaying ? (
                  <Pause className="w-16 h-16 text-white" />
                ) : (
                  <Play className="w-16 h-16 text-white ml-2" />
                )}
              </div>
              <h3 className="text-3xl font-bold mb-2">Demo KAOS Audio</h3>
              <p className="text-muted-foreground">Experimenta el sonido espacial cuántico</p>
            </div>
            
            <Button
              size="lg"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-quantum-gradient shadow-quantum hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg px-12"
            >
              {isPlaying ? 'Pausar' : 'Reproducir'} Demo
            </Button>
            
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="glass-panel p-4 rounded-xl">
                <Waves className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Frecuencia</p>
                <p className="font-bold">432 Hz</p>
              </div>
              <div className="glass-panel p-4 rounded-xl">
                <Volume2 className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <p className="text-sm text-muted-foreground">Canales</p>
                <p className="font-bold">7.1.4</p>
              </div>
              <div className="glass-panel p-4 rounded-xl">
                <Zap className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm text-muted-foreground">Latencia</p>
                <p className="font-bold">&lt;5ms</p>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {audioFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="glass-panel p-8 hover:shadow-quantum transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-quantum flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Kaos;
