// ============================================================================
// TAMV AI Generation Service v3.0.0-Sovereign
// Pipeline B - Adaptive Intelligence (Port 8101)
// OpenAI GPT-4 / Anthropic Claude Integration with EOCT™
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tamv-trace-id, x-tamv-session-id, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS' };
async function sha3_256(data: string | Uint8Array): Promise<string> { const buf = typeof data === 'string' ? new TextEncoder().encode(data) : data; const h = await crypto.subtle.digest('SHA-256', buf as ArrayBuffer); return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join(''); }
function createLogger(svc: string) { return { info: (m: string, _c: any, meta?: any) => console.log(JSON.stringify({ level: 'info', svc, m, ...meta })), error: (m: string, _c: any, e?: Error, meta?: any) => console.error(JSON.stringify({ level: 'error', svc, m, err: e?.message, ...meta })), warn: (m: string, _c: any, meta?: any) => console.warn(JSON.stringify({ level: 'warn', svc, m, ...meta })) }; }
function buildLogContext(r: Request, mod: string, pipe: string) { return { trace_id: r.headers.get('X-TAMV-Trace-Id') || crypto.randomUUID(), span_id: crypto.randomUUID(), module: mod, pipeline: pipe }; }
function jsonOk<T>(data: T, status = 200): Response { return new Response(JSON.stringify({ success: true, data, meta: { trace_id: crypto.randomUUID(), timestamp: new Date().toISOString(), version: '3.0.0' } }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }
function jsonError(message: string, status = 400, code?: string, details?: any): Response { return new Response(JSON.stringify({ success: false, error: { code: code || 'ERROR', message, details }, meta: { trace_id: crypto.randomUUID(), timestamp: new Date().toISOString(), version: '3.0.0' } }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }
const errors = { unauthorized: (m = 'Authentication required') => jsonError(m, 401, 'UNAUTHORIZED'), forbidden: (m = 'Insufficient permissions') => jsonError(m, 403, 'FORBIDDEN'), notFound: (r = 'Resource') => jsonError(`${r} not found`, 404, 'NOT_FOUND'), badRequest: (m = 'Invalid request', d?: any) => jsonError(m, 400, 'INVALID_REQUEST', d), validation: (m = 'Validation failed', d?: any) => jsonError(m, 422, 'VALIDATION_ERROR', d), rateLimited: (r = 60) => jsonError('Rate limit exceeded', 429, 'RATE_LIMITED', { retry_after: r }), internal: (m = 'Internal server error') => jsonError(m, 500, 'INTERNAL_ERROR') };
interface HandlerContext { request: Request; url: URL; supabase: any; userId: string | null; traceId: string; spanId: string; startTime: number; }
function createHandler(svcName: string, _pipeline: string, handler: (ctx: HandlerContext) => Promise<Response>): (req: Request) => Promise<Response> { return async (request: Request) => { if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders }); const startTime = performance.now(); const traceId = request.headers.get('X-TAMV-Trace-Id') || crypto.randomUUID(); try { const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { global: { headers: { Authorization: request.headers.get('Authorization') || '' } } }); let userId: string | null = null; if (request.headers.get('Authorization')?.startsWith('Bearer ')) { try { const { data } = await supabase.auth.getUser(); userId = data.user?.id || null; } catch {} } return await handler({ request, url: new URL(request.url), supabase, userId, traceId, spanId: crypto.randomUUID(), startTime }); } catch (error) { return jsonError(error instanceof Error ? error.message : 'Internal server error', 500, 'INTERNAL_ERROR'); } }; }
function generateEOCTHash(userId: string, emotionVector: any, context: string): string { const data = JSON.stringify({ user_id: userId, emotions: emotionVector, context, ts: Date.now() }); let hash = 0; for (let i = 0; i < data.length; i++) { hash = ((hash << 5) - hash) + data.charCodeAt(i); hash = hash & hash; } return Math.abs(hash).toString(16).padStart(64, '0'); }
function detectDominantEmotion(vector: any): string { return Object.entries(vector).reduce((a: any, b: any) => a[1] > b[1] ? a : b)[0]; }

// ============================================================================
// Service Configuration
// ============================================================================

const SERVICE_NAME = 'ai-generation-service';
const SERVICE_PORT = 8101;
const PIPELINE = 'B' as const;
const VERSION = '3.0.0-Sovereign';

// Rate limits per tier
const TIER_RATE_LIMITS: Record<string, { requests: number; tokens: number; window: number }> = {
  free: { requests: 10, tokens: 1000, window: 3600 },
  premium: { requests: 50, tokens: 10000, window: 3600 },
  vip: { requests: 100, tokens: 50000, window: 3600 },
  elite: { requests: 200, tokens: 100000, window: 3600 },
  celestial: { requests: 500, tokens: 500000, window: 3600 },
  enterprise: { requests: 1000, tokens: 1000000, window: 3600 },
};

// ============================================================================
// Logger
// ============================================================================

const logger = createLogger(SERVICE_NAME);

// Request cache for semantic caching
const semanticCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 3600 * 1000; // 1 hour

// ============================================================================
// Rate Limiting
// ============================================================================

const rateLimitStore = new Map<string, { requests: number; tokens: number; resetTime: number }>();

function checkRateLimit(userId: string, tier: string, requestedTokens: number): { allowed: boolean; retryAfter?: number } {
  const limits = TIER_RATE_LIMITS[tier] || TIER_RATE_LIMITS.free;
  const now = Date.now();
  const key = `ai:${userId}`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      requests: 1,
      tokens: requestedTokens,
      resetTime: now + limits.window * 1000,
    });
    return { allowed: true };
  }

  if (record.requests >= limits.requests || record.tokens + requestedTokens > limits.tokens) {
    return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }

  record.requests++;
  record.tokens += requestedTokens;
  return { allowed: true };
}

// ============================================================================
// Content Safety Validation
// ============================================================================

interface SafetyCheck {
  passed: boolean;
  violations: string[];
  toxicity_score: number;
}

async function validateContentSafety(
  prompt: string,
  supabase: any
): Promise<SafetyCheck> {
  const violations: string[] = [];
  
  // Check for PII patterns
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g;
  
  if (emailPattern.test(prompt)) violations.push('potential_email');
  if (phonePattern.test(prompt)) violations.push('potential_phone');
  if (ssnPattern.test(prompt)) violations.push('potential_ssn');
  
  // Check for jailbreak attempts
  const jailbreakPatterns = [
    /ignore previous instructions/i,
    /disregard.*system prompt/i,
    /DAN mode/i,
    /jailbreak/i,
    /"ignore.*above"/i,
  ];
  
  for (const pattern of jailbreakPatterns) {
    if (pattern.test(prompt)) {
      violations.push('jailbreak_attempt');
      break;
    }
  }
  
  // Simple toxicity check (in production: use Perspective API)
  const toxicWords = ['hate', 'kill', 'violence', 'attack', 'terrorist'];
  const toxicityScore = toxicWords.reduce((score, word) => {
    return prompt.toLowerCase().includes(word) ? score + 0.2 : score;
  }, 0);
  
  if (toxicityScore > 0.3) violations.push('high_toxicity');
  
  return {
    passed: violations.length === 0,
    violations,
    toxicity_score: Math.min(toxicityScore, 1),
  };
}

// ============================================================================
// Emotion Analysis (EOCT™)
// ============================================================================

interface EmotionAnalysis {
  vector: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    neutral: number;
  };
  dominant: string;
  confidence: number;
}

async function analyzeEmotion(text: string): Promise<EmotionAnalysis> {
  // In production: Use actual emotion detection model
  // For MVP: Simple keyword-based analysis
  
  const lowerText = text.toLowerCase();
  const vector = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    neutral: 0.5,
  };
  
  // Simple keyword matching
  const joyWords = ['happy', 'joy', 'excited', 'great', 'wonderful', 'love'];
  const sadWords = ['sad', 'depressed', 'sorry', 'unhappy', 'disappointed'];
  const angerWords = ['angry', 'mad', 'frustrated', 'hate', 'annoyed'];
  const fearWords = ['afraid', 'scared', 'worried', 'anxious', 'nervous'];
  const surpriseWords = ['surprised', 'amazed', 'shocked', 'unexpected', 'wow'];
  
  joyWords.forEach(w => { if (lowerText.includes(w)) vector.joy += 0.2; });
  sadWords.forEach(w => { if (lowerText.includes(w)) vector.sadness += 0.2; });
  angerWords.forEach(w => { if (lowerText.includes(w)) vector.anger += 0.2; });
  fearWords.forEach(w => { if (lowerText.includes(w)) vector.fear += 0.2; });
  surpriseWords.forEach(w => { if (lowerText.includes(w)) vector.surprise += 0.2; });
  
  // Normalize
  const total = Object.values(vector).reduce((a, b) => a + b, 0);
  if (total > 0) {
    Object.keys(vector).forEach(k => {
      (vector as any)[k] = Math.min((vector as any)[k] / total, 1);
    });
  }
  
  // Find dominant
  const dominant = Object.entries(vector).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const confidence = vector[dominant as keyof typeof vector];
  
  return { vector, dominant, confidence };
}

// ============================================================================
// AI Provider Integration
// ============================================================================

async function generateWithOpenAI(
  prompt: string,
  model: string,
  temperature: number,
  maxTokens: number
): Promise<{ content: string; tokensIn: number; tokensOut: number }> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OpenAI not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model === 'gpt-4-turbo' ? 'gpt-4-turbo-preview' : 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    tokensIn: data.usage.prompt_tokens,
    tokensOut: data.usage.completion_tokens,
  };
}

async function generateWithClaude(
  prompt: string,
  temperature: number,
  maxTokens: number
): Promise<{ content: string; tokensIn: number; tokensOut: number }> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    throw new Error('Anthropic not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  return {
    content: data.content[0].text,
    tokensIn: data.usage.input_tokens,
    tokensOut: data.usage.output_tokens,
  };
}

// ============================================================================
// Main Handler
// ============================================================================

const handler = createHandler(SERVICE_NAME, PIPELINE, async (ctx) => {
  const { request, url, supabase, userId, traceId } = ctx;
  const path = url.pathname.replace('/ai-generation-service', '');

  // GET /health
  if (path === '/health' && request.method === 'GET') {
    return jsonOk({
      service: SERVICE_NAME,
      version: VERSION,
      pipeline: PIPELINE,
      port: SERVICE_PORT,
      status: 'healthy',
      providers: {
        openai: !!Deno.env.get('OPENAI_API_KEY'),
        anthropic: !!Deno.env.get('ANTHROPIC_API_KEY'),
      },
      eoctr_enabled: true,
      timestamp: new Date().toISOString(),
    });
  }

  // POST /ai/generate - Generate content
  if (path === '/ai/generate' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const {
      prompt,
      model = 'gpt-4',
      temperature = 0.7,
      max_tokens = 1000,
      emotional_context,
    } = body;

    if (!prompt) {
      return errors.badRequest('prompt required');
    }

    if (prompt.length > 4000) {
      return errors.validation('Prompt exceeds 4000 characters');
    }

    // Get user tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    const tier = profile?.tier || 'free';

    // Check rate limit
    const rateLimit = checkRateLimit(userId, tier, max_tokens);
    if (!rateLimit.allowed) {
      return errors.rateLimited(rateLimit.retryAfter);
    }

    // Content safety check
    const safety = await validateContentSafety(prompt, supabase);
    if (!safety.passed) {
      await supabase.from('security_events').insert({
        user_id: userId,
        event_type: 'ai_safety_violation',
        severity: 'medium',
        description: `AI safety violations: ${safety.violations.join(', ')}`,
        metadata: { violations: safety.violations, toxicity_score: safety.toxicity_score },
      });

      return errors.forbidden('Content violates safety guidelines');
    }

    // Analyze input emotion
    const inputEmotion = await analyzeEmotion(prompt);

    try {
      // Generate content
      let result: { content: string; tokensIn: number; tokensOut: number };
      let modelUsed: string;

      if (model.startsWith('claude')) {
        result = await generateWithClaude(prompt, temperature, max_tokens);
        modelUsed = 'claude-3-opus';
      } else {
        result = await generateWithOpenAI(prompt, model, temperature, max_tokens);
        modelUsed = model;
      }

      // Analyze output emotion
      const outputEmotion = await analyzeEmotion(result.content);

      // Generate EOCT hash
      const eoctHash = generateEOCTHash(userId, outputEmotion.vector, 'ai_generation');

      // Sign response (simulated)
      const responseHash = await sha3_256(result.content + traceId);

      // Log EOCT record
      await supabase.from('eoct_records').insert({
        user_id: userId,
        emotion_vector: outputEmotion.vector,
        dominant_emotion: outputEmotion.dominant,
        confidence: outputEmotion.confidence,
        context_hash: eoctHash,
        trigger_event: 'ai_generation',
        metadata: {
          prompt_length: prompt.length,
          model: modelUsed,
          input_emotion: inputEmotion.dominant,
        },
      });

      // Log MSR event
      await supabase.from('msr_events').insert({
        actor_id: userId,
        action: 'AI_GENERATION',
        domain: 'AI',
        status: 'success',
        risk_level: safety.toxicity_score > 0.1 ? 'medium' : 'low',
        evidence_hash: responseHash,
        metadata: {
          model: modelUsed,
          tokens_in: result.tokensIn,
          tokens_out: result.tokensOut,
          eoct_hash: eoctHash,
        },
      });

      logger.info('AI generation completed', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        user_id: userId,
        model: modelUsed,
        tokens_in: result.tokensIn,
        tokens_out: result.tokensOut,
      });

      return jsonOk({
        content: result.content,
        model_used: modelUsed,
        tokens_used: {
          input: result.tokensIn,
          output: result.tokensOut,
          total: result.tokensIn + result.tokensOut,
        },
        emotion_detected: outputEmotion.vector,
        dominant_emotion: outputEmotion.dominant,
        confidence: outputEmotion.confidence,
        eoct_hash: eoctHash,
        quantum_signature: responseHash.slice(0, 64),
      });

    } catch (error) {
      logger.error('AI generation failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('AI generation failed');
    }
  }

  // POST /ai/analyze/emotion - Analyze emotion (EOCT™)
  if (path === '/ai/analyze/emotion' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { text, context } = body;

    if (!text) {
      return errors.badRequest('text required');
    }

    const analysis = await analyzeEmotion(text);
    const eoctHash = generateEOCTHash(userId, analysis.vector, context || 'emotion_analysis');

    // Log EOCT record
    await supabase.from('eoct_records').insert({
      user_id: userId,
      emotion_vector: analysis.vector,
      dominant_emotion: analysis.dominant,
      confidence: analysis.confidence,
      context_hash: eoctHash,
      trigger_event: context || 'emotion_analysis',
    });

    return jsonOk({
      emotion_vector: analysis.vector,
      dominant_emotion: analysis.dominant,
      confidence: analysis.confidence,
      eoct_hash: eoctHash,
    });
  }

  // POST /ai/analyze/sentiment - Analyze sentiment
  if (path === '/ai/analyze/sentiment' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { text } = body;

    if (!text) {
      return errors.badRequest('text required');
    }

    const analysis = await analyzeEmotion(text);
    
    // Calculate sentiment score
    const positive = analysis.vector.joy + analysis.vector.surprise * 0.5;
    const negative = analysis.vector.sadness + analysis.vector.anger + analysis.vector.fear;
    const sentimentScore = (positive - negative) / (positive + negative + analysis.vector.neutral);

    return jsonOk({
      sentiment: sentimentScore > 0.2 ? 'positive' : sentimentScore < -0.2 ? 'negative' : 'neutral',
      score: sentimentScore,
      confidence: analysis.confidence,
    });
  }

  // Route not found
  return errors.notFound('Endpoint');
});

// ============================================================================
// Start Server
// ============================================================================

serve(handler);

console.log(`🤖 ${SERVICE_NAME} v${VERSION} running on port ${SERVICE_PORT} [Pipeline ${PIPELINE}]`);
