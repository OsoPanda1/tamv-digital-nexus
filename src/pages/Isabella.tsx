import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsabellaChatQuantum } from '@/hooks/useIsabellaChatQuantum';
import { Send, Sparkles, Brain, Heart, Zap } from 'lucide-react';

const Isabella = () => {
  const { messages, isLoading, sendMessage } = useIsabellaChatQuantum();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const quickActions = [
    { icon: Brain, label: 'Explorar Dream Spaces', prompt: '¿Qué son los Dream Spaces y cómo puedo crear uno?' },
    { icon: Zap, label: 'KAOS Audio 4D', prompt: 'Explícame el sistema de audio KAOS 3D/4D' },
    { icon: Heart, label: 'Orientación Emocional', prompt: 'Necesito orientación sobre cómo usar el metaverso' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <QuantumCanvas />
      <Navigation />

      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-in-up">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-quantum-gradient flex items-center justify-center shadow-quantum animate-pulse-glow">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Isabella AI
                </h1>
                <p className="text-muted-foreground text-lg">Asistente Multimodal Cuántica</p>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Inteligencia artificial con memoria cuántica, orientación emocional y co-creación sensorial.
              Tu guía personal en el ecosistema TAMV MD-X4™.
            </p>
          </div>

          {/* Chat Interface */}
          <Card className="glass-panel p-6 mb-6 animate-scale-in">
            <ScrollArea className="h-[500px] pr-4 mb-6">
              {messages.length === 0 ? (
                <div className="text-center py-20">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse-glow" />
                  <h3 className="text-2xl font-bold mb-2">¡Hola! Soy Isabella 👋</h3>
                  <p className="text-muted-foreground mb-6">
                    Estoy aquí para ayudarte a navegar el metaverso TAMV. ¿En qué puedo asistirte hoy?
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className="flex-col h-auto py-6 gap-3 hover:bg-primary/20 hover:border-primary transition-all"
                          onClick={() => sendMessage(action.prompt)}
                        >
                          <Icon className="w-8 h-8 text-primary" />
                          <span className="text-sm">{action.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'glass-panel'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">👤</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4 justify-start">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse-glow" />
                      </div>
                      <div className="glass-panel p-4 rounded-2xl">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Escribe tu mensaje para Isabella..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-quantum-gradient shadow-quantum hover:shadow-glow px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          {/* Capacidades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'Memoria Cuántica',
                desc: 'Recuerda tus interacciones y preferencias',
              },
              {
                icon: Heart,
                title: 'Orientación Emocional',
                desc: 'Apoyo empático y co-creación sensorial',
              },
              {
                icon: Zap,
                title: 'Respuestas Instantáneas',
                desc: 'IA multimodal de alta velocidad',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="glass-panel p-6 text-center hover:shadow-quantum transition-all">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Isabella;
