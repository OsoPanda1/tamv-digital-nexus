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
        if (!reader) {
          throw new Error("No se pudo obtener el lector del stream");
        }

        const decoder = new TextDecoder();
        let assistantMessage = "";
        let buffer = ""; // Buffer para manejar chunks incompletos

        // Crear mensaje asistente inicial
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "", timestamp: Date.now() }
        ]);

        console.log('[Isabella Frontend] Iniciando lectura de stream...');

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('[Isabella Frontend] Stream completado');
            break;
          }

          // Decodificar chunk y agregarlo al buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Procesar líneas completas del buffer
          const lines = buffer.split("\n");
          
          // Guardar la última línea incompleta en el buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith(":")) {
              // Ignorar líneas vacías o comentarios SSE
              continue;
            }

            if (trimmedLine.startsWith("data: ")) {
              const data = trimmedLine.slice(6).trim();
              
              if (data === "[DONE]") {
                console.log('[Isabella Frontend] Recibido [DONE]');
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                
                if (content && typeof content === 'string') {
                  // Validar que el contenido no esté vacío o sea solo espacios
                  if (content.trim()) {
                    assistantMessage += content;
                    
                    // Actualizar mensaje en tiempo real
                    setMessages(prev => {
                      const updated = [...prev];
                      if (updated.length > 0) {
                        updated[updated.length - 1].content = assistantMessage;
                      }
                      return updated;
                    });
                  }
                } else {
                  console.log('[Isabella Frontend] Chunk sin contenido válido');
                }
              } catch (parseError) {
                console.error('[Isabella Frontend] Error parseando JSON:', {
                  error: parseError,
                  data: data.substring(0, 100) // Primeros 100 chars para debug
                });
                // No hacer nada, continuar con el siguiente chunk
              }
            }
          }
        }

        // Validaciones científicas de calidad de respuesta
        const validations = {
          notEmpty: assistantMessage.trim().length > 0,
          minimumLength: assistantMessage.trim().length >= 20, // Al menos 20 caracteres
          hasVowels: /[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(assistantMessage), // Contiene vocales
          noExcessiveSpaces: !assistantMessage.includes('   '), // No espacios excesivos
          hasProperPunctuation: /[.!?]/.test(assistantMessage), // Tiene puntuación
          notOnlySymbols: /[a-záéíóúñA-ZÁÉÍÓÚÑ]/.test(assistantMessage), // Tiene letras
          coherentWords: assistantMessage.split(' ').filter(w => w.length > 2).length >= 3 // Al menos 3 palabras de más de 2 letras
        };

        // Verificar todas las validaciones
        const failedValidations = Object.entries(validations)
          .filter(([_, passed]) => !passed)
          .map(([name, _]) => name);

        if (failedValidations.length > 0) {
          console.error('[Isabella Frontend] Validaciones fallidas:', failedValidations);
          throw new Error(`Isabella generó una respuesta inválida. Validaciones fallidas: ${failedValidations.join(', ')}`);
        }

        console.log('[Isabella Frontend] ✓ Mensaje validado exitosamente:', {
          length: assistantMessage.length,
          words: assistantMessage.split(' ').length,
          sentences: assistantMessage.split(/[.!?]/).filter(s => s.trim()).length,
          preview: assistantMessage.substring(0, 150) + (assistantMessage.length > 150 ? '...' : '')
        });
      } catch (error: any) {
        console.error('[Isabella Frontend] Error completo:', error);
        
        // Mensaje de error más descriptivo
        const errorMessage = error?.message || 'Error desconocido al comunicarse con Isabella';
        toast.error(`Isabella AI: ${errorMessage}`);
        
        // Remover el mensaje asistente vacío si existe
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
