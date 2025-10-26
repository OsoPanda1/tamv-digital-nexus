// src/hooks/useIsabellaEmotionalAnalysis.ts
// Sistema de análisis emocional dimensional basado en Russell's Circumplex Model (1980)

import { useMemo } from "react";

/**
 * Modelo dimensional de emociones
 * Basado en: Russell, J. A. (1980). A circumplex model of affect.
 */
export interface EmotionalDimensions {
  valence: number;      // -1 (negativo) a +1 (positivo)
  arousal: number;      // -1 (calmado) a +1 (activado)
  dominance: number;    // -1 (sumisión) a +1 (control)
  quadrant: EmotionalQuadrant;
  primaryEmotion: string;
  confidence: number;
}

export type EmotionalQuadrant = 
  | "excited_alert"      // Alta valencia, alto arousal
  | "content_relaxed"    // Alta valencia, bajo arousal
  | "stressed_anxious"   // Baja valencia, alto arousal
  | "depressed_lethargic" // Baja valencia, bajo arousal
  | "neutral";

/**
 * Hook para análisis emocional dimensional de texto
 * Implementa detección heurística basada en palabras clave validadas
 */
export function useIsabellaEmotionalAnalysis() {
  
  // Diccionarios de palabras emocionales (basados en investigación de Ekman y Plutchik)
  const emotionalDictionaries = useMemo(() => ({
    // Alta valencia (positivas)
    positiveHighArousal: [
      'emocionado', 'feliz', 'alegre', 'entusiasta', 'eufórico', 'encantado',
      'genial', 'increíble', 'maravilloso', 'fantástico', 'excelente', 'wow'
    ],
    positiveLowArousal: [
      'tranquilo', 'sereno', 'paz', 'contento', 'satisfecho', 'cómodo',
      'relajado', 'bien', 'agradable', 'calma', 'equilibrio'
    ],
    
    // Baja valencia (negativas)
    negativeHighArousal: [
      'ansioso', 'nervioso', 'estresado', 'preocupado', 'angustiado', 'pánico',
      'tenso', 'agitado', 'inquieto', 'alterado', 'agobiado', 'desesperado'
    ],
    negativeLowArousal: [
      'triste', 'deprimido', 'melancólico', 'desmotivado', 'apático', 'vacío',
      'cansado', 'abatido', 'desanimado', 'solo', 'perdido', 'confundido'
    ],
    
    // Dominancia
    dominanceHigh: [
      'puedo', 'controlo', 'decido', 'elijo', 'manejo', 'domino',
      'capaz', 'fuerte', 'poder', 'voluntad', 'confianza'
    ],
    dominanceLow: [
      'no puedo', 'impotente', 'indefenso', 'débil', 'sometido',
      'incapaz', 'sin control', 'atrapado', 'vulnerable'
    ]
  }), []);

  /**
   * Analiza las dimensiones emocionales de un texto
   */
  const analyzeEmotionalDimensions = (text: string): EmotionalDimensions => {
    const lowerText = text.toLowerCase();
    
    // Contadores para cada categoría
    const scores = {
      positiveHigh: countMatches(lowerText, emotionalDictionaries.positiveHighArousal),
      positiveLow: countMatches(lowerText, emotionalDictionaries.positiveLowArousal),
      negativeHigh: countMatches(lowerText, emotionalDictionaries.negativeHighArousal),
      negativeLow: countMatches(lowerText, emotionalDictionaries.negativeLowArousal),
      dominanceHigh: countMatches(lowerText, emotionalDictionaries.dominanceHigh),
      dominanceLow: countMatches(lowerText, emotionalDictionaries.dominanceLow)
    };

    // Calcular dimensiones
    const positiveScore = scores.positiveHigh + scores.positiveLow;
    const negativeScore = scores.negativeHigh + scores.negativeLow;
    const arousalHighScore = scores.positiveHigh + scores.negativeHigh;
    const arousalLowScore = scores.positiveLow + scores.negativeLow;
    
    // Valencia: -1 (negativo) a +1 (positivo)
    const totalValence = positiveScore + negativeScore;
    const valence = totalValence === 0 ? 0 : 
      (positiveScore - negativeScore) / totalValence;
    
    // Arousal: -1 (bajo) a +1 (alto)
    const totalArousal = arousalHighScore + arousalLowScore;
    const arousal = totalArousal === 0 ? 0 :
      (arousalHighScore - arousalLowScore) / totalArousal;
    
    // Dominance: -1 (sumisión) a +1 (control)
    const totalDominance = scores.dominanceHigh + scores.dominanceLow;
    const dominance = totalDominance === 0 ? 0 :
      (scores.dominanceHigh - scores.dominanceLow) / totalDominance;

    // Determinar cuadrante emocional
    const quadrant = mapToQuadrant(valence, arousal);
    
    // Determinar emoción primaria
    const primaryEmotion = determinePrimaryEmotion(quadrant, scores);
    
    // Calcular confianza (basado en número de coincidencias)
    const totalMatches = Object.values(scores).reduce((sum, val) => sum + val, 0);
    const confidence = Math.min(totalMatches / 5, 1); // Normalizado a 0-1

    return {
      valence: Number(valence.toFixed(2)),
      arousal: Number(arousal.toFixed(2)),
      dominance: Number(dominance.toFixed(2)),
      quadrant,
      primaryEmotion,
      confidence: Number(confidence.toFixed(2))
    };
  };

  /**
   * Cuenta coincidencias de palabras en el texto
   */
  const countMatches = (text: string, keywords: string[]): number => {
    return keywords.reduce((count, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
  };

  /**
   * Mapea valencia y arousal a cuadrante emocional
   */
  const mapToQuadrant = (valence: number, arousal: number): EmotionalQuadrant => {
    // Umbrales para clasificación
    const threshold = 0.15;
    
    if (Math.abs(valence) < threshold && Math.abs(arousal) < threshold) {
      return "neutral";
    }
    
    if (valence >= threshold && arousal >= threshold) {
      return "excited_alert";
    } else if (valence >= threshold && arousal < -threshold) {
      return "content_relaxed";
    } else if (valence < -threshold && arousal >= threshold) {
      return "stressed_anxious";
    } else if (valence < -threshold && arousal < -threshold) {
      return "depressed_lethargic";
    }
    
    return "neutral";
  };

  /**
   * Determina la emoción primaria basada en el cuadrante y scores
   */
  const determinePrimaryEmotion = (
    quadrant: EmotionalQuadrant,
    scores: Record<string, number>
  ): string => {
    const emotionMap: Record<EmotionalQuadrant, string> = {
      "excited_alert": "entusiasmo",
      "content_relaxed": "tranquilidad",
      "stressed_anxious": "ansiedad",
      "depressed_lethargic": "tristeza",
      "neutral": "neutral"
    };

    return emotionMap[quadrant];
  };

  /**
   * Genera recomendación de intervención basada en estado emocional
   * Basado en: Beck (1979), Linehan (1993), Kabat-Zinn (1990)
   */
  const recommendIntervention = (dimensions: EmotionalDimensions): string => {
    const { quadrant, primaryEmotion } = dimensions;

    const interventions: Record<EmotionalQuadrant, string> = {
      "excited_alert": "Canaliza esa energía positiva hacia acciones concretas. Explora Dream Spaces para materializar tus ideas.",
      "content_relaxed": "Momento ideal para la creatividad. Considera explorar la Universidad TAMV o crear arte en las Galerías.",
      "stressed_anxious": "Técnica de grounding 5-4-3-2-1: Nombra 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles, 1 que saboreas. También puedes explorar KAOS Audio para relajación.",
      "depressed_lethargic": "La validación de tus emociones es importante. Pequeñas acciones pueden ayudar: explora un Concierto Sensorial o conecta con la Comunidad.",
      "neutral": "Momento de exploración. ¿Qué área de TAMV te gustaría descubrir?"
    };

    return interventions[quadrant];
  };

  return {
    analyzeEmotionalDimensions,
    recommendIntervention
  };
}
