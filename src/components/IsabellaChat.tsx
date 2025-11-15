import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Mic, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useIsabellaChatQuantum } from '@/hooks/useIsabellaChatQuantum';
import { cn } from '@/lib/utils';

export const IsabellaChat = () => {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, emotion, sendMessage } = useIsabellaChatQuantum();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const emotionColors = {
    alegría: 'from-aqua to-aqua-light',
    tristeza: 'from-navy to-navy-deep',
    poder: 'from-aqua via-navy-metallic to-silver',
    duda: 'from-silver to-muted',
    neutral: 'from-silver-dark to-muted',
  };

  return (
    <div
      className={cn(
        'fixed right-6 bottom-6 glass-metallic border border-aqua/30 rounded-2xl shadow-epic z-50 transition-all duration-500',
        isMinimized ? 'w-16 h-16' : 'w-96 h-[600px]'
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-aqua/20 cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-epic-gradient flex items-center justify-center shadow-aqua animate-pulse-aqua">
            <Brain className="w-5 h-5 text-background" />
          </div>
          {!isMinimized && (
            <div>
              <h3 className="font-bold text-aqua">Isabella AI</h3>
              <p className="text-xs text-silver-dark">
                {emotion && emotion !== 'neutral' ? `Emoción: ${emotion}` : 'Asistente Emocional'}
              </p>
            </div>
          )}
        </div>
        {!isMinimized && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="hover:bg-aqua/10"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-silver" />
              ) : (
                <Volume2 className="w-4 h-4 text-aqua" />
              )}
            </Button>
          </div>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="h-[calc(100%-140px)] p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 space-y-3">
                  <Sparkles className="w-12 h-12 text-aqua mx-auto animate-pulse-aqua" />
                  <p className="text-silver-dark">
                    ¡Hola! Soy Isabella, tu asistente emocional AI. ¿Cómo puedo ayudarte hoy?
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex gap-3 animate-fade-in-up',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-epic-gradient flex items-center justify-center shadow-aqua flex-shrink-0">
                      <Brain className="w-4 h-4 text-background" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl p-3 border',
                      msg.role === 'user'
                        ? 'bg-aqua/20 border-aqua/30 text-foreground'
                        : cn(
                            'glass-panel border-aqua/20',
                            msg.emotion && emotionColors[msg.emotion]
                              ? `bg-gradient-to-br ${emotionColors[msg.emotion as keyof typeof emotionColors]}/10`
                              : ''
                          )
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.emotion && msg.role === 'assistant' && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-aqua">
                        <Sparkles className="w-3 h-3" />
                        <span className="capitalize">{msg.emotion}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-full bg-epic-gradient flex items-center justify-center shadow-aqua animate-pulse-aqua">
                    <Brain className="w-4 h-4 text-background" />
                  </div>
                  <div className="glass-panel border-aqua/20 rounded-2xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-aqua animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-aqua animate-pulse delay-100" />
                      <div className="w-2 h-2 rounded-full bg-aqua animate-pulse delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-aqua/20">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-aqua/10 flex-shrink-0"
              >
                <Mic className="w-5 h-5 text-silver" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="bg-background/50 border-aqua/30 focus:border-aqua text-foreground placeholder:text-silver-dark"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-epic-gradient shadow-aqua hover:shadow-epic flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
