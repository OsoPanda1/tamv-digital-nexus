import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsabellaChatQuantum } from '@/hooks/useIsabellaChatQuantum';
import { Send, Sparkles, Brain, Heart, Zap, ShieldAlert, Trash2, X } from 'lucide-react';

const ETHICS_RULES = [
  { icon: '🛡️', title: 'Escudo Ontológico', desc: 'Protege la dignidad e identidad del usuario' },
  { icon: '🧠', title: 'Filtro Semántico', desc: 'Detecta manipulación, abuso y contenido tóxico' },
  { icon: '⚖️', title: 'Guardia Conductual', desc: 'Escala crisis a líneas de ayuda humanas' },
];

const Isabella = () => {
  const { messages, isLoading, ethicsStatus, sendMessage, clearChat, cancelStream } = useIsabellaChatQuantum();
  const [input, setInput] = useState('');
  const [showRules, setShowRules] = useState(false);

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

  const isEthicsBlocked = ethicsStatus && ethicsStatus !== 'OK';

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-foreground">Isabella AI</h1>
                <p className="text-muted-foreground">Asistente Multimodal Cuántica · Escudo AVIXA</p>
              </div>
            </div>
          </div>

          {/* Ethics Status Banner */}
          {isEthicsBlocked && (
            <Card className="mb-4 p-4 border-destructive/40 bg-destructive/10">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-destructive shrink-0" />
                <div>
                  <p className="font-bold text-sm text-destructive">Escudo ético activado</p>
                  <p className="text-xs text-muted-foreground">
                    {ethicsStatus === 'CRISIS' 
                      ? 'Se detectó una situación de crisis. Se han proporcionado recursos de ayuda.'
                      : 'El contenido fue filtrado por el triple bloqueo AVIXA (ontológico/semántico/conductual).'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Ethics Rules Toggle */}
          <div className="flex justify-end mb-2">
            <Button variant="ghost" size="sm" onClick={() => setShowRules(!showRules)} className="text-xs text-muted-foreground">
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
              {showRules ? 'Ocultar reglas éticas' : 'Ver reglas éticas'}
            </Button>
          </div>

          {showRules && (
            <Card className="mb-4 p-4 border-primary/20 bg-card/60">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" /> Triple Bloqueo Ético AVIXA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ETHICS_RULES.map(rule => (
                  <div key={rule.title} className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <p className="font-bold text-sm">{rule.icon} {rule.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rule.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                Isabella nunca genera contenido dañino, sexual, violento ni manipulador. En crisis emocionales, escala automáticamente a líneas de ayuda humanas.
              </p>
            </Card>
          )}

          {/* Chat Interface */}
          <Card className="p-6 mb-6 border-border/50 bg-card/60 backdrop-blur-sm">
            <ScrollArea className="h-[450px] pr-4 mb-4">
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <Sparkles className="w-14 h-14 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2">¡Hola! Soy Isabella 👋</h3>
                  <p className="text-muted-foreground mb-6">
                    Estoy aquí para ayudarte a navegar el metaverso TAMV. ¿En qué puedo asistirte hoy?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Button key={index} variant="outline" className="flex-col h-auto py-5 gap-2 hover:bg-primary/10 hover:border-primary/40 transition-all"
                          onClick={() => sendMessage(action.prompt)}>
                          <Icon className="w-7 h-7 text-primary" />
                          <span className="text-xs">{action.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm ${
                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 border border-border/30'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      </div>
                      <div className="bg-muted/50 border border-border/30 p-3.5 rounded-2xl flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Escribe tu mensaje para Isabella..."
                disabled={isLoading}
                className="flex-1"
              />
              {isLoading ? (
                <Button onClick={cancelStream} variant="outline" className="px-4"><X className="w-4 h-4" /></Button>
              ) : (
                <Button onClick={handleSend} disabled={!input.trim()} className="bg-gradient-to-r from-primary to-secondary px-5">
                  <Send className="w-4 h-4" />
                </Button>
              )}
              {messages.length > 0 && !isLoading && (
                <Button onClick={clearChat} variant="ghost" size="icon" className="text-muted-foreground"><Trash2 className="w-4 h-4" /></Button>
              )}
            </div>
          </Card>

          {/* Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Brain, title: 'Memoria Cuántica', desc: 'Recuerda contexto e interacciones previas' },
              { icon: Heart, title: 'Orientación Emocional', desc: 'Apoyo empático con escudo ético AVIXA' },
              { icon: Zap, title: 'Respuestas Streaming', desc: 'IA multimodal con reintentos automáticos' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <Card key={i} className="p-5 text-center border-border/50 bg-card/60 hover:border-primary/30 transition-colors">
                  <Icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Isabella;
