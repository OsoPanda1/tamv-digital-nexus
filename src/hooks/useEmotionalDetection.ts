import { useState, useCallback, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

interface EmotionalDimensions {
  valence: number; // -1 (negativo) a 1 (positivo)
  arousal: number; // -1 (desactivado) a 1 (activado)
  dominance: number; // -1 (sumiso) a 1 (dominante)
  primaryEmotion: string;
  confidence: number;
}

/**
 * Hook para detección emocional usando TensorFlow.js
 * Análisis multimodal: texto, audio, expresiones faciales
 */
export const useEmotionalDetection = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [tfReady, setTfReady] = useState(false);

  // Inicializar TensorFlow.js
  useEffect(() => {
    const initTF = async () => {
      try {
        await tf.ready();
        setTfReady(true);
        console.log('🧠 TensorFlow.js inicializado');
      } catch (error) {
        console.error('Error inicializando TensorFlow.js:', error);
      }
    };
    initTF();
  }, []);

  /**
   * Análisis emocional de texto usando heurísticas
   * En producción: usar modelo pre-entrenado de sentiment analysis
   */
  const analyzeTextEmotion = useCallback((text: string): EmotionalDimensions => {
    if (!text || text.trim().length === 0) {
      return {
        valence: 0,
        arousal: 0,
        dominance: 0,
        primaryEmotion: 'neutral',
        confidence: 0.5
      };
    }

    const textLower = text.toLowerCase();

    // Diccionarios emocionales simplificados
    const positiveWords = ['feliz', 'alegre', 'genial', 'excelente', 'amor', 'bien', 'bueno', 'increíble', 'maravilloso'];
    const negativeWords = ['triste', 'mal', 'horrible', 'terrible', 'odio', 'peor', 'malo', 'difícil', 'problema'];
    const highArousalWords = ['emocionado', 'ansioso', 'nervioso', 'energía', 'rápido', 'urgente', 'excitado'];
    const lowArousalWords = ['cansado', 'tranquilo', 'paz', 'relajado', 'calma', 'lento', 'dormido'];
    const dominanceWords = ['puedo', 'controlo', 'sé', 'logré', 'gané', 'domino', 'manejo'];
    const submissionWords = ['no puedo', 'ayuda', 'necesito', 'difícil', 'imposible', 'perdido'];

    // Calcular scores
    const positiveScore = positiveWords.filter(w => textLower.includes(w)).length;
    const negativeScore = negativeWords.filter(w => textLower.includes(w)).length;
    const arousalHighScore = highArousalWords.filter(w => textLower.includes(w)).length;
    const arousalLowScore = lowArousalWords.filter(w => textLower.includes(w)).length;
    const dominanceScore = dominanceWords.filter(w => textLower.includes(w)).length;
    const submissionScore = submissionWords.filter(w => textLower.includes(w)).length;

    // Calcular dimensiones
    const valence = Math.max(-1, Math.min(1, (positiveScore - negativeScore) / 5));
    const arousal = Math.max(-1, Math.min(1, (arousalHighScore - arousalLowScore) / 3));
    const dominance = Math.max(-1, Math.min(1, (dominanceScore - submissionScore) / 3));

    // Determinar emoción primaria usando modelo circumplex
    let primaryEmotion = 'neutral';
    if (valence > 0.3 && arousal > 0.3) primaryEmotion = 'alegría';
    else if (valence > 0.3 && arousal < -0.3) primaryEmotion = 'contentamiento';
    else if (valence < -0.3 && arousal > 0.3) primaryEmotion = 'ansiedad';
    else if (valence < -0.3 && arousal < -0.3) primaryEmotion = 'tristeza';
    else if (valence > 0.5) primaryEmotion = 'felicidad';
    else if (valence < -0.5) primaryEmotion = 'dolor';

    const confidence = Math.min(0.95, 0.5 + Math.abs(valence) * 0.3 + Math.abs(arousal) * 0.2);

    return {
      valence,
      arousal,
      dominance,
      primaryEmotion,
      confidence
    };
  }, []);

  /**
   * Análisis de audio emocional (placeholder para integración futura)
   */
  const analyzeAudioEmotion = useCallback(async (audioData: Float32Array): Promise<EmotionalDimensions> => {
    // TODO: Implementar modelo TensorFlow.js para análisis de audio
    // Por ahora retornamos neutral
    return {
      valence: 0,
      arousal: 0,
      dominance: 0,
      primaryEmotion: 'neutral',
      confidence: 0.3
    };
  }, []);

  /**
   * Análisis facial emocional (placeholder para integración futura con MediaPipe)
   */
  const analyzeFacialEmotion = useCallback(async (imageData: ImageData): Promise<EmotionalDimensions> => {
    // TODO: Implementar detección facial con TensorFlow.js FaceAPI o MediaPipe
    return {
      valence: 0,
      arousal: 0,
      dominance: 0,
      primaryEmotion: 'neutral',
      confidence: 0.3
    };
  }, []);

  /**
   * Recomendar intervención basada en estado emocional
   */
  const recommendIntervention = useCallback((emotions: EmotionalDimensions): string => {
    const { primaryEmotion, valence, arousal } = emotions;

    if (primaryEmotion === 'ansiedad' && arousal > 0.5) {
      return 'Técnica de Grounding 5-4-3-2-1: Nombra 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles, 1 que saboreas.';
    } else if (primaryEmotion === 'tristeza' && valence < -0.5) {
      return 'Activación Conductual: Identifica una pequeña actividad placentera que puedas hacer hoy.';
    } else if (arousal > 0.7) {
      return 'Respiración 4-7-8: Inhala 4 segundos, retén 7 segundos, exhala 8 segundos.';
    } else if (valence > 0.5) {
      return 'Gratitud: Reconoce y saborea este momento positivo. ¿Qué lo hace especial?';
    }

    return 'Mindfulness: Toma un momento para observar tus pensamientos y emociones sin juzgarlos.';
  }, []);

  return {
    tfReady,
    isModelLoaded,
    analyzeTextEmotion,
    analyzeAudioEmotion,
    analyzeFacialEmotion,
    recommendIntervention
  };
};