import { useState, useCallback } from 'react';

interface EmotionalDimensions {
  valence: number;
  arousal: number;
  dominance: number;
  primaryEmotion: string;
  confidence: number;
}

export const useEmotionalDetection = () => {
  const [isModelLoaded] = useState(false);
  const [tfReady] = useState(false);

  const analyzeTextEmotion = useCallback((text: string): EmotionalDimensions => {
    if (!text || text.trim().length === 0) {
      return { valence: 0, arousal: 0, dominance: 0, primaryEmotion: 'neutral', confidence: 0.5 };
    }

    const textLower = text.toLowerCase();
    const positiveWords = ['feliz', 'alegre', 'genial', 'excelente', 'amor', 'bien', 'bueno', 'increíble', 'maravilloso'];
    const negativeWords = ['triste', 'mal', 'horrible', 'terrible', 'odio', 'peor', 'malo', 'difícil', 'problema'];
    const highArousalWords = ['emocionado', 'ansioso', 'nervioso', 'energía', 'rápido', 'urgente', 'excitado'];
    const lowArousalWords = ['cansado', 'tranquilo', 'paz', 'relajado', 'calma', 'lento', 'dormido'];
    const dominanceWords = ['puedo', 'controlo', 'sé', 'logré', 'gané', 'domino', 'manejo'];
    const submissionWords = ['no puedo', 'ayuda', 'necesito', 'difícil', 'imposible', 'perdido'];

    const positiveScore = positiveWords.filter(w => textLower.includes(w)).length;
    const negativeScore = negativeWords.filter(w => textLower.includes(w)).length;
    const arousalHighScore = highArousalWords.filter(w => textLower.includes(w)).length;
    const arousalLowScore = lowArousalWords.filter(w => textLower.includes(w)).length;
    const dominanceScore = dominanceWords.filter(w => textLower.includes(w)).length;
    const submissionScore = submissionWords.filter(w => textLower.includes(w)).length;

    const valence = Math.max(-1, Math.min(1, (positiveScore - negativeScore) / 5));
    const arousal = Math.max(-1, Math.min(1, (arousalHighScore - arousalLowScore) / 3));
    const dominance = Math.max(-1, Math.min(1, (dominanceScore - submissionScore) / 3));

    let primaryEmotion = 'neutral';
    if (valence > 0.3 && arousal > 0.3) primaryEmotion = 'alegría';
    else if (valence > 0.3 && arousal < -0.3) primaryEmotion = 'contentamiento';
    else if (valence < -0.3 && arousal > 0.3) primaryEmotion = 'ansiedad';
    else if (valence < -0.3 && arousal < -0.3) primaryEmotion = 'tristeza';
    else if (valence > 0.5) primaryEmotion = 'felicidad';
    else if (valence < -0.5) primaryEmotion = 'dolor';

    const confidence = Math.min(0.95, 0.5 + Math.abs(valence) * 0.3 + Math.abs(arousal) * 0.2);

    return { valence, arousal, dominance, primaryEmotion, confidence };
  }, []);

  const analyzeAudioEmotion = useCallback(async (_audioData: Float32Array): Promise<EmotionalDimensions> => {
    return { valence: 0, arousal: 0, dominance: 0, primaryEmotion: 'neutral', confidence: 0.3 };
  }, []);

  const analyzeFacialEmotion = useCallback(async (_imageData: ImageData): Promise<EmotionalDimensions> => {
    return { valence: 0, arousal: 0, dominance: 0, primaryEmotion: 'neutral', confidence: 0.3 };
  }, []);

  const recommendIntervention = useCallback((emotions: EmotionalDimensions): string => {
    const { primaryEmotion, valence, arousal } = emotions;
    if (primaryEmotion === 'ansiedad' && arousal > 0.5) return 'Técnica de Grounding 5-4-3-2-1';
    if (primaryEmotion === 'tristeza' && valence < -0.5) return 'Activación Conductual';
    if (arousal > 0.7) return 'Respiración 4-7-8';
    if (valence > 0.5) return 'Gratitud: Reconoce este momento positivo.';
    return 'Mindfulness: Observa tus pensamientos sin juzgarlos.';
  }, []);

  return { tfReady, isModelLoaded, analyzeTextEmotion, analyzeAudioEmotion, analyzeFacialEmotion, recommendIntervention };
};
