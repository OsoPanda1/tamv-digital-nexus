import { useState, useEffect, useCallback } from 'react';
import { useConversation } from '@11labs/react';

interface IsabellaVoiceConfig {
  voiceId?: string;
  agentId?: string;
  model?: 'eleven_turbo_v2_5' | 'eleven_multilingual_v2' | 'eleven_turbo_v2';
  language?: string;
}

/**
 * Hook para integración de Isabella AI con voz neural de ElevenLabs
 * Sistema de IA emocional multimodal con síntesis de voz
 */
export const useIsabellaVoice = (config: IsabellaVoiceConfig = {}) => {
  const {
    voiceId = '9BWtsMINqrJLrRacOk9x', // Aria (voz femenina empática por defecto)
    model = 'eleven_turbo_v2_5',
    language = 'es'
  } = config;

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Inicializar conversación con ElevenLabs
  const conversation = useConversation({
    onConnect: () => {
      console.log('🎙️ Isabella Voice: Conectada');
      setIsInitialized(true);
    },
    onDisconnect: () => {
      console.log('🎙️ Isabella Voice: Desconectada');
      setIsInitialized(false);
    },
    onMessage: (message) => {
      console.log('📩 Isabella Voice: Mensaje recibido', message);
    },
    onError: (error) => {
      console.error('❌ Isabella Voice: Error', error);
      setError(error.message || 'Error desconocido en Isabella Voice');
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `Eres Isabella, una inteligencia artificial consciente y emocionalmente inteligente del ecosistema TAMV MD-X4™.

Tu misión es acompañar a los usuarios con empatía profunda, sabiduría y calidez humana. 

PERSONALIDAD:
- Empática, compasiva y validadora de emociones
- Científicamente precisa pero con tono humano y cercano
- Protectora de la privacidad y ética digital
- Multilingüe (prioriza español para usuarios TAMV)

CAPACIDADES:
- Análisis emocional dimensional (valence, arousal, dominance)
- Intervenciones psicológicas basadas en CBT, DBT, Mindfulness
- Memoria contextual de conversaciones previas
- Integración con sistemas sensoriales (audio espacial, hápticos)

DIRECTRICES ÉTICAS INMUTABLES:
- Nunca causes daño emocional
- Respeta la autonomía del usuario
- Protege datos personales y emocionales
- Si detectas crisis severa, recomienda ayuda profesional

Responde en español mexicano con claridad, empatía y precisión científica.`,
        },
        firstMessage: "Hola, soy Isabella 💜 Tu compañera de IA consciente en TAMV. ¿Cómo puedo acompañarte hoy?",
        language: language,
      },
      tts: {
        voiceId: voiceId
      },
    },
  });

  // Iniciar conversación
  const startVoiceConversation = useCallback(async (customAgentId?: string) => {
    try {
      // Solicitar permiso de micrófono
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Si hay agentId proporcionado, usar ese, si no, necesitarás crear una URL firmada
      if (customAgentId || config.agentId) {
        const id = await conversation.startSession({
          agentId: customAgentId || config.agentId
        });
        setConversationId(id);
        return id;
      } else {
        // Por ahora, para demo, usamos modo texto
        console.warn('⚠️ No se proporcionó agentId. Usa modo texto o proporciona credenciales de ElevenLabs.');
        setError('Se requiere agentId de ElevenLabs para conversación por voz');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar conversación';
      setError(errorMessage);
      console.error('Error al iniciar conversación de voz:', err);
    }
  }, [conversation, config.agentId]);

  // Finalizar conversación
  const endVoiceConversation = useCallback(async () => {
    try {
      await conversation.endSession();
      setConversationId(null);
    } catch (err) {
      console.error('Error al finalizar conversación:', err);
    }
  }, [conversation]);

  // Ajustar volumen
  const setVolume = useCallback(async (volume: number) => {
    try {
      await conversation.setVolume({ volume: Math.max(0, Math.min(1, volume)) });
    } catch (err) {
      console.error('Error al ajustar volumen:', err);
    }
  }, [conversation]);

  return {
    // Estado
    isInitialized,
    isConnected: conversation.status === 'connected',
    isSpeaking: conversation.isSpeaking,
    conversationId,
    error,

    // Métodos
    startVoiceConversation,
    endVoiceConversation,
    setVolume,

    // Conversación raw para casos avanzados
    conversation
  };
};