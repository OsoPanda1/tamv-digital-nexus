import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useIsabellaChatQuantum } from '@/hooks/useIsabellaChatQuantum';
import { Send, Sparkles, Brain, Zap, Globe, BookOpen, ShieldCheck, ArrowUp, Square, Trash2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTIONS = [
  { icon: Globe, label: 'Dream Spaces', prompt: '¿Qué son los Dream Spaces y cómo puedo crear uno?' },
  { icon: Zap, label: 'KAOS Audio 4D', prompt: 'Explícame el sistema de audio KAOS 3D/4D' },
  { icon: BookOpen, label: 'UTAMV Cursos', prompt: '¿Qué cursos ofrece la universidad UTAMV?' },
  { icon: Brain, label: 'Arquitectura TAMV', prompt: 'Describe la arquitectura del ecosistema TAMV MD-X4' },
];

const Isabella = () => {
  const { messages, isLoading, ethicsStatus, sendMessage, clearChat, cancelStream } = useIsabellaChatQuantum();
  const [input, setInput] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-none">Isabella AI</h1>
            <p className="text-[11px] text-muted-foreground">Asistente Soberana TAMV · Escudo AVIXA</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ethicsStatus && ethicsStatus !== 'OK' && (
            <span className="flex items-center gap-1 text-[10px] text-destructive bg-destructive/10 px-2 py-1 rounded-md">
              <ShieldCheck className="w-3 h-3" /> Escudo activo
            </span>
          )}
          {hasMessages && !isLoading && (
            <button onClick={clearChat} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors" title="Nuevo chat">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          /* Empty state — centered like ChatGPT */
          <div className="flex flex-col items-center justify-center h-full px-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center mb-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">¿En qué puedo ayudarte?</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Isabella es tu asistente soberana con triple escudo ético. Pregunta sobre el ecosistema TAMV, DreamSpaces, gobernanza, economía y más.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
              {SUGGESTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.3 }}
                    onClick={() => sendMessage(s.prompt)}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card/40 hover:bg-muted/50 hover:border-primary/30 text-left transition-all group"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-0.5 shrink-0 transition-colors" />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{s.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Message thread */
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <AnimatePresence>
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="group"
                  >
                    {isUser ? (
                      /* User message — right-aligned bubble */
                      <div className="flex justify-end">
                        <div className="max-w-[85%] bg-primary/10 border border-primary/20 rounded-2xl rounded-br-md px-4 py-3">
                          <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ) : (
                      /* Assistant message — full-width like Perplexity */
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">Isabella</span>
                        </div>
                        <div className="pl-8 prose prose-sm prose-invert max-w-none
                          prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:my-2
                          prose-headings:text-foreground prose-headings:font-semibold
                          prose-strong:text-foreground prose-strong:font-semibold
                          prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
                          prose-pre:bg-card prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl
                          prose-ul:my-2 prose-ol:my-2 prose-li:text-foreground/90
                          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                          prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground
                        ">
                          <ReactMarkdown>{msg.content || ''}</ReactMarkdown>
                        </div>
                        {/* Actions — visible on hover */}
                        <div className="pl-8 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopy(msg.content, idx)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                          >
                            {copiedIdx === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedIdx === idx ? 'Copiado' : 'Copiar'}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Streaming indicator */}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pl-8">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-muted-foreground">Isabella está pensando...</span>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input area — bottom, like ChatGPT */}
      <div className="border-t border-border/40 bg-background/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-card/60 border border-border/50 rounded-2xl px-4 py-2 focus-within:border-primary/40 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregunta lo que quieras a Isabella..."
              disabled={isLoading}
              rows={1}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none py-1.5 max-h-[200px] scrollbar-none"
            />
            {isLoading ? (
              <button onClick={cancelStream} className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors shrink-0" title="Detener">
                <Square className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  "p-2 rounded-xl transition-all shrink-0",
                  input.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                )}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Isabella puede cometer errores. Triple escudo ético AVIXA activo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Isabella;
