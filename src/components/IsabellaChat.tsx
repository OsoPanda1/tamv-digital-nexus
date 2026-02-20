import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  Send,
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useIsabellaChatQuantum } from "@/hooks/useIsabellaChatQuantum";
import {
  useIsabellaTTS,
  type EmotionalProfile,
} from "@/integrations/elevenlabs/isabella-tts";
import { cn } from "@/lib/utils";

type EmotionKey = "alegría" | "tristeza" | "poder" | "duda" | "neutral";

export const IsabellaChat = () => {
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastSpokenMessageIdRef = useRef<string | null>(null);

  const {
    messages,
    isLoading,
    emotion,
    sendMessage,
  } = useIsabellaChatQuantum();

  const {
    speak,
    isPlaying,
    progress: audioProgress,
    error: ttsError,
    stop: stopAudio,
  } = useIsabellaTTS();

  // Scroll suave al final cuando cambian mensajes
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Map emociones a perfil TTS
  const emotionToProfile = (emotionValue?: string): EmotionalProfile => {
    const map: Record<EmotionKey, EmotionalProfile> = {
      alegría: "celebration",
      tristeza: "empathy",
      poder: "guidance",
      duda: "calm",
      neutral: "neutral",
    };

    const normalized = (emotionValue || "neutral") as EmotionKey;
    return map[normalized] ?? "empathy";
  };

  // TTS para último mensaje de assistant
  useEffect(() => {
    if (!audioEnabled || isMuted || isLoading || ttsError) return;
    if (!messages.length) return;

    const lastMessage = messages[messages.length - 1];
    const msgKey = `${lastMessage?.content?.slice(0, 50)}-${messages.length}`;
    if (
      lastMessage?.role !== "assistant" ||
      !lastMessage.content ||
      msgKey === lastSpokenMessageIdRef.current
    ) {
      return;
    }

    lastSpokenMessageIdRef.current = msgKey;

    speak({
      text: lastMessage.content,
      emotionalProfile: emotionToProfile(lastMessage.emotion),
      speed: 1.0,
    });
  }, [messages, audioEnabled, isMuted, isLoading, ttsError, speak]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    stopAudio(); // detiene cualquier audio en curso
    await sendMessage(input.trim());
    setInput("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const emotionColors: Record<EmotionKey, string> = {
    alegría: "from-aqua to-aqua-light",
    tristeza: "from-navy to-navy-deep",
    poder: "from-aqua via-navy-metallic to-silver",
    duda: "from-silver to-muted",
    neutral: "from-silver-dark to-muted",
  };

  const currentEmotionKey: EmotionKey =
    (emotion as EmotionKey) || "neutral";

  const renderStatusText = () => {
    if (isPlaying) return `🔊 Hablando... ${audioProgress}%`;
    if (isLoading) return "Pensando...";
    if (ttsError) return "⚠ Error de audio, revisa conexión";
    if (emotion && emotion !== "neutral") return `Emoción: ${emotion}`;
    return "Asistente emocional";
  };

  const handleToggleAudio = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isPlaying) stopAudio();
    const next = !(audioEnabled && !isMuted);
    setIsMuted(!next);
    setAudioEnabled(next);
  };

  return (
    <div
      className={cn(
        "fixed right-6 bottom-6 glass-metallic border border-aqua/30 rounded-2xl shadow-epic z-50 transition-all duration-500",
        isMinimized ? "w-16 h-16" : "w-96 h-[600px]"
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-aqua/20 cursor-pointer"
        onClick={() => setIsMinimized((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full bg-epic-gradient flex items-center justify-center shadow-aqua",
              isPlaying ? "animate-pulse" : "animate-pulse-aqua"
            )}
          >
            {isPlaying ? (
              <Loader2 className="w-5 h-5 text-background animate-spin" />
            ) : (
              <Brain className="w-5 h-5 text-background" />
            )}
          </div>
          {!isMinimized && (
            <div>
              <h3 className="font-bold text-aqua">Isabella AI</h3>
              <p className="text-xs text-silver-dark">{renderStatusText()}</p>
            </div>
          )}
        </div>

        {!isMinimized && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleAudio}
              className="hover:bg-aqua/10"
              aria-label={
                audioEnabled && !isMuted
                  ? "Silenciar voz de Isabella"
                  : "Activar voz de Isabella"
              }
            >
              {isMuted || !audioEnabled ? (
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
          {/* Mensajes */}
          <ScrollArea className="h-[calc(100%-140px)]" ref={scrollContainerRef}>
            <div className="p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 space-y-3">
                  <Sparkles className="w-12 h-12 text-aqua mx-auto animate-pulse-aqua" />
                  <p className="text-silver-dark text-sm">
                    ¡Hola! Soy Isabella, tu asistente emocional AI. ¿Cómo puedo
                    ayudarte hoy?
                  </p>
                </div>
              )}

              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                const emotionKey = (msg.emotion as EmotionKey) || "neutral";
                const bubbleEmotionClass =
                  !isUser && msg.emotion && emotionColors[emotionKey]
                    ? `bg-gradient-to-br ${emotionColors[emotionKey]}/10`
                    : "";

                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex gap-3 animate-fade-in-up",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-epic-gradient flex items-center justify-center shadow-aqua flex-shrink-0">
                        <Brain className="w-4 h-4 text-background" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl p-3 border text-sm whitespace-pre-wrap",
                        isUser
                          ? "bg-aqua/20 border-aqua/30 text-foreground"
                          : cn("glass-panel border-aqua/20", bubbleEmotionClass)
                      )}
                    >
                      <p>{msg.content}</p>
                      {msg.emotion && !isUser && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-aqua">
                          <Sparkles className="w-3 h-3" />
                          <span className="capitalize">{msg.emotion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

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
                type="button"
              >
                <Mic className="w-5 h-5 text-silver" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="
                  bg-background/50 border-aqua/30
                  focus:border-aqua text-foreground
                  placeholder:text-silver-dark
                "
              />
              <Button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="
                  bg-epic-gradient shadow-aqua hover:shadow-epic
                  flex-shrink-0
                "
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
