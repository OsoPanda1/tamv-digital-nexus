// src/hooks/useIsabellaChatQuantum.ts
// Hardened: retry logic, network error handling, stream cancellation, timeout

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
  emotion?: "neutral" | "alegría" | "tristeza" | "poder" | "duda";
  audioUrl?: string;
  meta?: Record<string, any>;
}

const MAX_RETRIES = 2;
const STREAM_TIMEOUT_MS = 30_000;

export function useIsabellaChatQuantum() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState<Message["emotion"]>("neutral");
  const [ethicsStatus, setEthicsStatus] = useState<string | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const cancelStream = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  const sendMessage = useCallback(
    async (userMessage: string, retryCount = 0) => {
      if (!userMessage.trim()) return;
      
      // Cancel any in-flight request
      cancelStream();

      if (retryCount === 0) {
        setIsLoading(true);
        setEthicsStatus(null);
        const newUserMessage: Message = {
          role: "user",
          content: userMessage,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, newUserMessage]);
      }

      try {
        controllerRef.current = new AbortController();
        
        // Timeout wrapper
        const timeoutId = setTimeout(() => controllerRef.current?.abort(), STREAM_TIMEOUT_MS);

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-chat-enhanced`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              messages: [...messages, { role: "user", content: userMessage }],
              context: { mood: emotion, timestamp: Date.now() }
            }),
            signal: controllerRef.current.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 429) {
            toast.error("Límite alcanzado. Espera un momento.");
            return;
          }
          if (response.status >= 500 && retryCount < MAX_RETRIES) {
            console.warn(`[Isabella] Retry ${retryCount + 1}/${MAX_RETRIES}`);
            await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
            return sendMessage(userMessage, retryCount + 1);
          }
          const errorText = await response.text().catch(() => 'Error desconocido');
          toast.error(`Isabella AI no responde (${response.status})`);
          return;
        }

        // Read ethics status from headers
        const ethicsHeader = response.headers.get("x-isabella-ethics");
        const emotionServer = response.headers.get("x-isabella-emotion") as Message["emotion"];
        if (ethicsHeader) setEthicsStatus(ethicsHeader);
        if (emotionServer) setEmotion(emotionServer);

        const voiceUrl = response.headers.get("x-isabella-voice-url");
        if (voiceUrl && voiceRef.current) {
          voiceRef.current.src = voiceUrl;
          voiceRef.current.play().catch(() => {});
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No se pudo obtener el stream");

        const decoder = new TextDecoder();
        let assistantMessage = "";
        let buffer = "";

        // Create initial assistant message
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "", timestamp: Date.now() }
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith(":")) continue;

            if (trimmedLine.startsWith("data: ")) {
              const data = trimmedLine.slice(6).trim();
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content && typeof content === 'string') {
                  assistantMessage += content;
                  setMessages(prev => {
                    const updated = [...prev];
                    if (updated.length > 0) {
                      updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        content: assistantMessage,
                      };
                    }
                    return updated;
                  });
                }
              } catch {
                // Skip malformed chunks silently
              }
            }
          }
        }

        // Validate response quality
        if (!assistantMessage.trim() || assistantMessage.trim().length < 10) {
          if (retryCount < MAX_RETRIES) {
            // Remove empty assistant message and retry
            setMessages(prev => prev.filter((m, i) => !(i === prev.length - 1 && m.role === 'assistant' && !m.content.trim())));
            console.warn(`[Isabella] Empty response, retrying ${retryCount + 1}/${MAX_RETRIES}`);
            await new Promise(r => setTimeout(r, 1000));
            return sendMessage(userMessage, retryCount + 1);
          }
          throw new Error("Isabella generó una respuesta vacía después de reintentos");
        }

      } catch (error: any) {
        if (error?.name === 'AbortError') {
          // Stream was cancelled by user or timeout
          toast.info("Solicitud cancelada");
        } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
          toast.error("Error de red. Verifica tu conexión.");
        } else {
          toast.error(error?.message || 'Error al comunicarse con Isabella');
        }
        
        // Remove empty assistant message
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?.role === "assistant" && !lastMsg.content.trim()) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [messages, emotion, cancelStream]
  );

  const clearChat = useCallback(() => {
    cancelStream();
    setMessages([]);
    setEmotion("neutral");
    setEthicsStatus(null);
  }, [cancelStream]);

  return {
    messages,
    isLoading,
    emotion,
    ethicsStatus,
    sendMessage,
    clearChat,
    cancelStream,
    voiceRef,
  };
}
