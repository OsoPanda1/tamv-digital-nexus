/**
 * ISABELLA TTS Service - ElevenLabs Integration
 * TAMV MD-X4™ Quantum Edition
 * 
 * Servicio completo de síntesis de voz para Isabella AI
 * con cache, rate limiting, validación de seguridad y streaming
 */

import { supabase } from '@/integrations/supabase/client';

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS E INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type EmotionalProfile = 'empathy' | 'guidance' | 'celebration' | 'calm' | 'urgency' | 'neutral';

export interface TTSOptions {
  text: string;
  emotionalProfile?: EmotionalProfile;
  speed?: number;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  timeout?: number;
  language?: string;
}

export interface TTSResult {
  audioBuffer: ArrayBuffer;
  mimeType: string;
  duration?: number;
  generatedAt: Date;
  cacheKey?: string;
}

interface CacheEntry {
  data: ArrayBuffer;
  timestamp: number;
  ttl: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE VOZ POR PERFIL EMOCIONAL
// ═══════════════════════════════════════════════════════════════════════════

const VOICE_SETTINGS: Record<EmotionalProfile, {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}> = {
  empathy: {
    stability: 0.6,
    similarity_boost: 0.8,
    style: 0.7,
    use_speaker_boost: true,
  },
  guidance: {
    stability: 0.75,
    similarity_boost: 0.85,
    style: 0.4,
    use_speaker_boost: false,
  },
  celebration: {
    stability: 0.5,
    similarity_boost: 0.9,
    style: 0.9,
    use_speaker_boost: true,
  },
  calm: {
    stability: 0.85,
    similarity_boost: 0.7,
    style: 0.2,
    use_speaker_boost: false,
  },
  urgency: {
    stability: 0.7,
    similarity_boost: 0.9,
    style: 0.8,
    use_speaker_boost: true,
  },
  neutral: {
    stability: 0.7,
    similarity_boost: 0.75,
    style: 0.5,
    use_speaker_boost: false,
  },
};

// Voces disponibles de ElevenLabs
export const AVAILABLE_VOICES = {
  aria: '9BWtsMINqrJLrRacOk9x',
  sarah: 'EXAVITQu4vr4xnSDxMaL',
  charlotte: 'XB0fDUnXU5powFXDhCwa',
  alice: 'Xb7hH8MSUJpSbSDYk0k2',
  matilda: 'XrExE9yKIg1WjnnlVkGX',
  lily: 'pFZP5JQG7iQjIQuC4Bku',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CLASE PRINCIPAL: ISABELLA TTS SERVICE
// ═══════════════════════════════════════════════════════════════════════════

class IsabellaTTSService {
  private cache: Map<string, CacheEntry> = new Map();
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private minRequestInterval = 200; // ms entre requests

  // Default voice (Aria - empática y femenina)
  private voiceId: string = AVAILABLE_VOICES.aria;
  private modelId: string = 'eleven_turbo_v2_5';

  constructor() {
    // Limpiar cache cada 5 minutos
    setInterval(() => this.cleanCache(), 5 * 60 * 1000);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MÉTODO PRINCIPAL: GENERAR VOZ
  // ─────────────────────────────────────────────────────────────────────────

  async speak(options: TTSOptions): Promise<TTSResult> {
    const {
      text,
      emotionalProfile = 'empathy',
      speed = 1.0,
      onProgress,
      onError,
      timeout = 30000,
      language = 'es',
    } = options;

    try {
      // 1. Validar input
      this.validateInput(text, emotionalProfile, speed);

      // 2. Generar cache key
      const cacheKey = this.generateCacheKey(text, emotionalProfile, language);

      // 3. Verificar cache
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log('[ISABELLA-TTS] Cache hit:', cacheKey.substring(0, 8));
        onProgress?.(100);
        return {
          audioBuffer: cached,
          mimeType: 'audio/mpeg',
          cacheKey,
          generatedAt: new Date(),
        };
      }

      // 4. Generar audio (con rate limiting)
      onProgress?.(10);
      const result = await this.generateAudioWithRateLimit(
        text,
        emotionalProfile,
        speed,
        language,
        timeout,
        onProgress
      );

      // 5. Guardar en cache (TTL: 1 hora)
      this.setCache(cacheKey, result.audioBuffer, 60 * 60 * 1000);

      onProgress?.(100);
      return { ...result, cacheKey };

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown TTS error');
      console.error('[ISABELLA-TTS] Error:', err.message);
      onError?.(err);
      throw err;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VALIDACIÓN DE INPUT (SEGURIDAD)
  // ─────────────────────────────────────────────────────────────────────────

  private validateInput(text: string, profile: string, speed: number): void {
    if (!text || typeof text !== 'string') {
      throw new Error('El texto debe ser una cadena no vacía');
    }

    if (text.length > 5000) {
      throw new Error('El texto excede el máximo permitido (5000 caracteres)');
    }

    if (text.length < 1) {
      throw new Error('El texto no puede estar vacío');
    }

    const validProfiles: EmotionalProfile[] = ['empathy', 'guidance', 'celebration', 'calm', 'urgency', 'neutral'];
    if (!validProfiles.includes(profile as EmotionalProfile)) {
      throw new Error(`Perfil emocional inválido: ${profile}`);
    }

    if (speed < 0.5 || speed > 2.0) {
      throw new Error('La velocidad debe estar entre 0.5 y 2.0');
    }

    // Prevención de XSS/Injection
    if (this.containsMaliciousContent(text)) {
      throw new Error('El texto contiene contenido potencialmente malicioso');
    }
  }

  private containsMaliciousContent(text: string): boolean {
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /eval\(/i,
      /document\./i,
      /window\./i,
    ];
    return dangerousPatterns.some(pattern => pattern.test(text));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GENERACIÓN DE AUDIO CON RATE LIMITING
  // ─────────────────────────────────────────────────────────────────────────

  private async generateAudioWithRateLimit(
    text: string,
    emotionalProfile: EmotionalProfile,
    speed: number,
    language: string,
    timeout: number,
    onProgress?: (progress: number) => void
  ): Promise<Omit<TTSResult, 'cacheKey'>> {
    // Enforce rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();

    onProgress?.(30);

    // Llamar al edge function que maneja ElevenLabs
    const { data, error } = await supabase.functions.invoke('isabella-tts', {
      body: {
        text,
        emotionalProfile,
        voiceId: this.voiceId,
        modelId: this.modelId,
        voiceSettings: VOICE_SETTINGS[emotionalProfile],
        language,
      },
    });

    if (error) {
      throw new Error(`Error en TTS: ${error.message}`);
    }

    onProgress?.(80);

    // Fallback graceful: si no hay audio (API key issue, rate limit, etc.)
    if (data?.fallback || !data?.audio) {
      console.warn('[ISABELLA-TTS] Text-only mode:', data?.message || 'no audio');
      // Return empty buffer to signal no audio available
      return {
        audioBuffer: new ArrayBuffer(0),
        mimeType: 'audio/mpeg',
        generatedAt: new Date(),
      };
    }

    // Si el edge function devuelve audio base64
    const binaryString = atob(data.audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return {
      audioBuffer: bytes.buffer,
      mimeType: 'audio/mpeg',
      generatedAt: new Date(),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GESTIÓN DE CACHE
  // ─────────────────────────────────────────────────────────────────────────

  private generateCacheKey(text: string, profile: string, language: string): string {
    // Simple hash function
    const data = `${text}|${profile}|${language}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `tts_${Math.abs(hash).toString(36)}`;
  }

  private getFromCache(key: string): ArrayBuffer | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache(key: string, data: ArrayBuffer, ttl: number): void {
    // Limitar cache a 50MB
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.data.byteLength;
    }

    if (totalSize + data.byteLength > 50 * 1024 * 1024) {
      // Eliminar entrada más antigua
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  private cleanCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REPRODUCCIÓN DE AUDIO
  // ─────────────────────────────────────────────────────────────────────────

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio();

        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Error al reproducir audio'));
        };

        audio.src = url;
        audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CONFIGURACIÓN
  // ─────────────────────────────────────────────────────────────────────────

  setVoice(voiceId: string): void {
    this.voiceId = voiceId;
  }

  setModel(modelId: string): void {
    this.modelId = modelId;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════

let instance: IsabellaTTSService | null = null;

export function getIsabellaTTSService(): IsabellaTTSService {
  if (!instance) {
    instance = new IsabellaTTSService();
  }
  return instance;
}

// ═══════════════════════════════════════════════════════════════════════════
// REACT HOOK
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef } from 'react';

export function useIsabellaTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef(false);

  const speak = useCallback(async (options: TTSOptions) => {
    setIsPlaying(true);
    setError(null);
    setProgress(0);
    abortRef.current = false;

    try {
      const service = getIsabellaTTSService();

      const result = await service.speak({
        ...options,
        onProgress: (p) => {
          if (!abortRef.current) setProgress(p);
        },
        onError: (err) => setError(err.message),
      });

      if (abortRef.current) return;

      await service.playAudio(result.audioBuffer);
    } catch (err) {
      if (!abortRef.current) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        console.error('[ISABELLA-TTS] Error:', message);
      }
    } finally {
      if (!abortRef.current) {
        setIsPlaying(false);
        setProgress(0);
      }
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { 
    speak, 
    stop, 
    isPlaying, 
    error, 
    progress,
    clearError,
  };
}

export default IsabellaTTSService;
