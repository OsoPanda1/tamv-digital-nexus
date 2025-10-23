// src/hooks/useIsabellaChatQuantum.ts

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

/**
 * Interfaz de mensaje enriquecido
 */
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
  emotion?: "neutral" | "alegría" | "tristeza" | "poder" | "duda";
  audioUrl?: string;
  meta?: Record<string, any>;
}

/**
 * Hook avanzado Isabella AI Quantum
 */
export function useIsabellaChatQuantum() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState<Message["emotion"]>("neutral");
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  // ENVÍA MENSAJE Y RECIBE STREAMING MULTIMODAL
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) return;
      setIsLoading(true);
      controllerRef.current?.abort();

      const newUserMessage: Message = {
        role: "user",
        content: userMessage,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, newUserMessage]);

      try {
        controllerRef.current = new AbortController();
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-chat-enhanced`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              messages: [...messages, newUserMessage],
              context: { mood: emotion, timestamp: Date.now() }
            }),
            signal: controllerRef.current.signal,
          }
        );

        if (!response.ok) {
          if (response.status === 429) 
            return toast.error("Límite alcanzado. Espera un momento.");
          if (response.status === 402) 
            return toast.error("Créditos agotados.");
          const errorText = await response.text();
          toast.error(`Isabella AI no responde: ${errorText}`);
          return;
        }

        const voiceUrl = response.headers.get("x-isabella-voice-url");
        const emotionServer = response.headers.get("x-isabella-emotion") as Message["emotion"];
        if (voiceUrl && voiceRef.current) {
          voiceRef.current.src = voiceUrl;
          voiceRef.current.play().catch(() => {});
        }
        if (emotionServer) setEmotion(emotionServer);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";

        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "", timestamp: Date.now() }
        ]);

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                const detectedEmotion = parsed.emotion as Message["emotion"];
                if (content) {
                  assistantMessage += content;
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = assistantMessage;
                    if (detectedEmotion && updated[updated.length - 1]) {
                      updated[updated.length - 1].emotion = detectedEmotion;
                      setEmotion(detectedEmotion);
                    }
                    return updated;
                  });
                }
              } catch (err) {}
            }
          }
        }
      } catch (error) {
        toast.error(`Error Isabella: ${error?.message || error}`);
        setMessages(prev => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, emotion]
  );

  // LIMPIAR CHAT Y DETENER STREAM
  const clearChat = useCallback(() => {
    setMessages([]);
    setEmotion("neutral");
    controllerRef.current?.abort();
  }, []);

  return {
    messages,
    isLoading,
    emotion,
    sendMessage,
    clearChat,
    voiceRef,
  };
}
