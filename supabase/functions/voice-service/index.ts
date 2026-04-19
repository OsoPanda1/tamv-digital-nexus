// ============================================================================
// TAMV Voice Service v3.0.0-Sovereign
// Pipeline B - Adaptive Intelligence (Port 8105)
// ElevenLabs TTS / STT Integration
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tamv-trace-id, x-tamv-session-id, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS' };
async function sha3_256(data: string | Uint8Array): Promise<string> { const buf = typeof data === 'string' ? new TextEncoder().encode(data) : data; const h = await crypto.subtle.digest('SHA-256', buf.buffer); return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join(''); }
function createLogger(svc: string) { return { info: (m: string, _c: any, meta?: any) => console.log(JSON.stringify({ level: 'info', svc, m, ...meta })), error: (m: string, _c: any, e?: Error, meta?: any) => console.error(JSON.stringify({ level: 'error', svc, m, err: e?.message, ...meta })), warn: (m: string, _c: any, meta?: any) => console.warn(JSON.stringify({ level: 'warn', svc, m, ...meta })) }; }
function buildLogContext(r: Request, mod: string, pipe: string) { return { trace_id: r.headers.get('X-TAMV-Trace-Id') || crypto.randomUUID(), span_id: crypto.randomUUID(), module: mod, pipeline: pipe }; }
function jsonOk<T>(data: T, status = 200): Response { return new Response(JSON.stringify({ success: true, data, meta: { trace_id: crypto.randomUUID(), timestamp: new Date().toISOString(), version: '3.0.0' } }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }
function jsonError(message: string, status = 400, code?: string, details?: any): Response { return new Response(JSON.stringify({ success: false, error: { code: code || 'ERROR', message, details }, meta: { trace_id: crypto.randomUUID(), timestamp: new Date().toISOString(), version: '3.0.0' } }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }
const errors = { unauthorized: (m = 'Authentication required') => jsonError(m, 401, 'UNAUTHORIZED'), forbidden: (m = 'Insufficient permissions') => jsonError(m, 403, 'FORBIDDEN'), notFound: (r = 'Resource') => jsonError(`${r} not found`, 404, 'NOT_FOUND'), badRequest: (m = 'Invalid request', d?: any) => jsonError(m, 400, 'INVALID_REQUEST', d), validation: (m = 'Validation failed', d?: any) => jsonError(m, 422, 'VALIDATION_ERROR', d), rateLimited: (r = 60) => jsonError('Rate limit exceeded', 429, 'RATE_LIMITED', { retry_after: r }), internal: (m = 'Internal server error') => jsonError(m, 500, 'INTERNAL_ERROR') };
interface HandlerContext { request: Request; url: URL; supabase: any; userId: string | null; traceId: string; spanId: string; startTime: number; }
function createHandler(svcName: string, _pipeline: string, handler: (ctx: HandlerContext) => Promise<Response>): (req: Request) => Promise<Response> { return async (request: Request) => { if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders }); const startTime = performance.now(); const traceId = request.headers.get('X-TAMV-Trace-Id') || crypto.randomUUID(); try { const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { global: { headers: { Authorization: request.headers.get('Authorization') || '' } } }); let userId: string | null = null; if (request.headers.get('Authorization')?.startsWith('Bearer ')) { try { const { data } = await supabase.auth.getUser(); userId = data.user?.id || null; } catch {} } return await handler({ request, url: new URL(request.url), supabase, userId, traceId, spanId: crypto.randomUUID(), startTime }); } catch (error) { return jsonError(error instanceof Error ? error.message : 'Internal server error', 500, 'INTERNAL_ERROR'); } }; }

// ============================================================================
// Service Configuration
// ============================================================================

const SERVICE_NAME = 'voice-service';
  const SERVICE_PORT = 8105;
const PIPELINE = 'B' as const;
const VERSION = '3.0.0-Sovereign';

// Available voices
const VOICES = {
  isabella: {
    id: 'XB0fDUnXU5powFXDhCwa',
    name: 'Isabella',
    description: 'Warm, empathetic feminine voice',
    emotions: ['neutral', 'happy', 'sad', 'excited', 'calm'],
  },
  gabriel: {
    id: 'TxGEqnHWrfWFTfGW9XjX',
    name: 'Gabriel',
    description: 'Professional masculine voice',
    emotions: ['neutral', 'professional', 'friendly'],
  },
  sarah: {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah',
    description: 'Young, energetic feminine voice',
    emotions: ['neutral', 'excited', 'cheerful'],
  },
};

// Rate limits by tier
const TIER_LIMITS: Record<string, { characters: number; window: number }> = {
  free: { characters: 10000, window: 86400 }, // 10k chars per day
  premium: { characters: 100000, window: 86400 },
  vip: { characters: 500000, window: 86400 },
  elite: { characters: 1000000, window: 86400 },
  celestial: { characters: 5000000, window: 86400 },
  enterprise: { characters: 10000000, window: 86400 },
};

// ============================================================================
// Logger
// ============================================================================

const logger = createLogger(SERVICE_NAME);

// Audio cache
const audioCache = new Map<string, { audio: string; timestamp: number }>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Rate limit store
const rateLimitStore = new Map<string, { characters: number; resetTime: number }>();

// ============================================================================
// ElevenLabs Integration
// ============================================================================

async function generateTTS(
  text: string,
  voiceId: string,
  emotion: string,
  stability: number = 0.5,
  similarityBoost: number = 0.75
): Promise<{ audio: string; charactersUsed: number }> {
  const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
  if (!apiKey) {
    throw new Error('ElevenLabs not configured');
  }

  // Check cache
  const cacheKey = await sha3_256(`${text}:${voiceId}:${emotion}`);
  const cached = audioCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { audio: cached.audio, charactersUsed: 0 }; // No charge for cached
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style: emotion === 'excited' ? 0.5 : emotion === 'calm' ? -0.5 : 0,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

  // Cache result
  audioCache.set(cacheKey, { audio: audioBase64, timestamp: Date.now() });

  return {
    audio: audioBase64,
    charactersUsed: text.length,
  };
}

async function transcribeAudio(audioBase64: string): Promise<{ text: string; confidence: number }> {
  // In production: Use Whisper API or similar
  // For MVP: Return placeholder
  return {
    text: '[Transcription not implemented in MVP]',
    confidence: 0.0,
  };
}

// ============================================================================
// Main Handler
// ============================================================================

const handler = createHandler(SERVICE_NAME, PIPELINE, async (ctx) => {
  const { request, url, supabase, userId, traceId } = ctx;
  const path = url.pathname.replace('/voice-service', '');

  // GET /health
  if (path === '/health' && request.method === 'GET') {
    return jsonOk({
      service: SERVICE_NAME,
      version: VERSION,
      pipeline: PIPELINE,
      port: SERVICE_PORT,
      status: 'healthy',
      providers: {
        elevenlabs: !!Deno.env.get('ELEVENLABS_API_KEY'),
        azure_tts: !!Deno.env.get('AZURE_TTS_KEY'),
      },
      voices: Object.entries(VOICES).map(([key, v]) => ({
        id: key,
        voice_id: v.id,
        name: v.name,
        description: v.description,
        emotions: v.emotions,
      })),
      timestamp: new Date().toISOString(),
    });
  }

  // GET /voice/voices - List available voices
  if (path === '/voice/voices' && request.method === 'GET') {
    return jsonOk({
      voices: Object.entries(VOICES).map(([key, v]) => ({
        id: key,
        voice_id: v.id,
        name: v.name,
        description: v.description,
        emotions: v.emotions,
        preview_url: `https://api.elevenlabs.io/v1/voices/${v.id}/preview`,
      })),
    });
  }

  // POST /voice/tts - Text to Speech
  if (path === '/voice/tts' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const {
      text,
      voice = 'isabella',
      emotion = 'neutral',
      stability = 0.5,
      similarity_boost = 0.75,
    } = body;

    if (!text) {
      return errors.badRequest('text required');
    }

    if (text.length > 5000) {
      return errors.validation('Text exceeds 5000 characters');
    }

    const voiceConfig = VOICES[voice as keyof typeof VOICES];
    if (!voiceConfig) {
      return errors.validation('Invalid voice');
    }

    if (!voiceConfig.emotions.includes(emotion)) {
      return errors.validation(`Emotion '${emotion}' not available for voice '${voice}'`);
    }

    // Get user tier and check limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    const tier = profile?.tier || 'free';
    const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;

    // Check rate limit
    const now = Date.now();
    const rateKey = `tts:${userId}`;
    const rateRecord = rateLimitStore.get(rateKey);

    if (!rateRecord || now > rateRecord.resetTime) {
      rateLimitStore.set(rateKey, {
        characters: text.length,
        resetTime: now + limits.window * 1000,
      });
    } else if (rateRecord.characters + text.length > limits.characters) {
      return errors.rateLimited(Math.ceil((rateRecord.resetTime - now) / 1000));
    } else {
      rateRecord.characters += text.length;
    }

    try {
      const result = await generateTTS(text, voiceConfig.id, emotion, stability, similarity_boost);

      // Log usage
      await supabase.from('msr_events').insert({
        actor_id: userId,
        action: 'TTS_GENERATION',
        domain: 'AI',
        status: 'success',
        risk_level: 'none',
        metadata: {
          voice,
          emotion,
          characters: text.length,
          cached: result.charactersUsed === 0,
        },
      });

      logger.info('TTS generated', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        user_id: userId,
        voice,
        characters: text.length,
      });

      return jsonOk({
        audio: result.audio,
        format: 'mp3',
        sample_rate: 44100,
        voice: {
          id: voice,
          name: voiceConfig.name,
        },
        emotion,
        characters_used: result.charactersUsed,
        cached: result.charactersUsed === 0,
      });

    } catch (error) {
      logger.error('TTS generation failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('TTS generation failed');
    }
  }

  // POST /voice/stt - Speech to Text
  if (path === '/voice/stt' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { audio, language = 'es' } = body;

    if (!audio) {
      return errors.badRequest('audio required');
    }

    try {
      const result = await transcribeAudio(audio);

      return jsonOk({
        text: result.text,
        confidence: result.confidence,
        language,
      });

    } catch (error) {
      logger.error('STT transcription failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Transcription failed');
    }
  }

  // Route not found
  return errors.notFound('Endpoint');
});

// ============================================================================
// Start Server
// ============================================================================

serve(handler);

console.log(`🎙️ ${SERVICE_NAME} v${VERSION} running on port ${SERVICE_PORT} [Pipeline ${PIPELINE}]`);
