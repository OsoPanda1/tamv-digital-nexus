// ============================================================================
// TAMV Embedding Service v3.0.0-Sovereign
// Pipeline B - Adaptive Intelligence (Port 8102)
// pgvector RAG Integration
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

// ============================================================================
// Service Configuration
// ============================================================================

const SERVICE_NAME = 'embedding-service';
const SERVICE_PORT = 8102;
const PIPELINE = 'B' as const;
const VERSION = '3.0.0-Sovereign';

// Embedding models
const EMBEDDING_MODELS = {
  'text-embedding-3-small': { dimensions: 1536, maxTokens: 8191 },
  'text-embedding-3-large': { dimensions: 3072, maxTokens: 8191 },
  'text-embedding-ada-002': { dimensions: 1536, maxTokens: 8191 },
};

// Rate limits by tier
const TIER_LIMITS: Record<string, { requests: number; tokens: number; window: number }> = {
  free: { requests: 100, tokens: 100000, window: 3600 },
  premium: { requests: 500, tokens: 500000, window: 3600 },
  vip: { requests: 1000, tokens: 1000000, window: 3600 },
  elite: { requests: 2000, tokens: 2000000, window: 3600 },
  celestial: { requests: 5000, tokens: 5000000, window: 3600 },
  enterprise: { requests: 10000, tokens: 10000000, window: 3600 },
};

// ============================================================================
// Logger
// ============================================================================

const logger = createLogger(SERVICE_NAME);

// Rate limit store
const rateLimitStore = new Map<string, { requests: number; tokens: number; resetTime: number }>();

// ============================================================================
// OpenAI Embedding Generation
// ============================================================================

async function generateEmbedding(
  text: string,
  model: string = 'text-embedding-3-small'
): Promise<{ embedding: number[]; tokensUsed: number }> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OpenAI not configured');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model,
      encoding_format: 'float',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return {
    embedding: data.data[0].embedding,
    tokensUsed: data.usage?.total_tokens || Math.ceil(text.length / 4),
  };
}

// ============================================================================
// Similarity Calculation (Cosine Similarity)
// ============================================================================

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ============================================================================
// Main Handler
// ============================================================================

const handler = createHandler(SERVICE_NAME, PIPELINE, async (ctx) => {
  const { request, url, supabase, userId, traceId } = ctx;
  const path = url.pathname.replace('/embedding-service', '');

  // GET /health
  if (path === '/health' && request.method === 'GET') {
    return jsonOk({
      service: SERVICE_NAME,
      version: VERSION,
      pipeline: PIPELINE,
      port: SERVICE_PORT,
      status: 'healthy',
      vector_db: 'pgvector',
      models: Object.keys(EMBEDDING_MODELS),
      timestamp: new Date().toISOString(),
    });
  }

  // POST /ai/embeddings - Generate embeddings
  if (path === '/ai/embeddings' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { text, model = 'text-embedding-3-small' } = body;

    if (!text) {
      return errors.badRequest('text required');
    }

    if (!EMBEDDING_MODELS[model as keyof typeof EMBEDDING_MODELS]) {
      return errors.validation('Invalid embedding model');
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
    const rateKey = `embedding:${userId}`;
    const rateRecord = rateLimitStore.get(rateKey);
    const estimatedTokens = Math.ceil(text.length / 4);

    if (!rateRecord || now > rateRecord.resetTime) {
      rateLimitStore.set(rateKey, {
        requests: 1,
        tokens: estimatedTokens,
        resetTime: now + limits.window * 1000,
      });
    } else if (rateRecord.requests >= limits.requests || rateRecord.tokens + estimatedTokens > limits.tokens) {
      return errors.rateLimited(Math.ceil((rateRecord.resetTime - now) / 1000));
    } else {
      rateRecord.requests++;
      rateRecord.tokens += estimatedTokens;
    }

    try {
      const result = await generateEmbedding(text, model);

      // Store embedding if requested
      if (body.store) {
        const { data: stored } = await supabase.from('embeddings').insert({
          user_id: userId,
          content: text.slice(0, 1000),
          embedding: result.embedding,
          model,
          metadata: body.metadata || {},
        }).select().single();

        logger.info('Embedding stored', buildLogContext(request, SERVICE_NAME, PIPELINE), {
          user_id: userId,
          embedding_id: stored?.id,
        });
      }

      // Log usage
      await supabase.from('msr_events').insert({
        actor_id: userId,
        action: 'EMBEDDING_GENERATED',
        domain: 'AI',
        status: 'success',
        risk_level: 'none',
        metadata: {
          model,
          tokens_used: result.tokensUsed,
          dimensions: result.embedding.length,
        },
      });

      return jsonOk({
        embedding: result.embedding,
        model,
        dimensions: result.embedding.length,
        tokens_used: result.tokensUsed,
      });

    } catch (error) {
      logger.error('Embedding generation failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Embedding generation failed');
    }
  }

  // POST /ai/rag/query - RAG query with context
  if (path === '/ai/rag/query' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { query, top_k = 5, threshold = 0.7, filter } = body;

    if (!query) {
      return errors.badRequest('query required');
    }

    try {
      // Generate query embedding
      const queryEmbedding = await generateEmbedding(query);

      // Search similar embeddings using pgvector
      let dbQuery = supabase
        .rpc('match_embeddings', {
          query_embedding: queryEmbedding.embedding,
          match_threshold: threshold,
          match_count: top_k,
        });

      if (filter?.user_id) {
        dbQuery = dbQuery.eq('user_id', filter.user_id);
      }

      if (filter?.document_type) {
        dbQuery = dbQuery.eq('metadata->>document_type', filter.document_type);
      }

      const { data: matches, error } = await dbQuery;

      if (error) {
        throw error;
      }

      // Format results
      const results = (matches || []).map((match: any) => ({
        id: match.id,
        content: match.content,
        similarity: match.similarity,
        metadata: match.metadata,
        created_at: match.created_at,
      }));

      logger.info('RAG query completed', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        user_id: userId,
        results_count: results.length,
      });

      return jsonOk({
        query,
        results,
        total_results: results.length,
      });

    } catch (error) {
      logger.error('RAG query failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('RAG query failed');
    }
  }

  // POST /ai/embeddings/similarity - Calculate similarity between texts
  if (path === '/ai/embeddings/similarity' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { text1, text2, model = 'text-embedding-3-small' } = body;

    if (!text1 || !text2) {
      return errors.badRequest('text1 and text2 required');
    }

    try {
      const [embed1, embed2] = await Promise.all([
        generateEmbedding(text1, model),
        generateEmbedding(text2, model),
      ]);

      const similarity = cosineSimilarity(embed1.embedding, embed2.embedding);

      return jsonOk({
        similarity,
        similarity_percentage: Math.round(similarity * 100),
        model,
      });

    } catch (error) {
      logger.error('Similarity calculation failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Similarity calculation failed');
    }
  }

  // DELETE /ai/embeddings/{id} - Delete stored embedding
  if (path.match(/^\/ai\/embeddings\/[^/]+$/) && request.method === 'DELETE') {
    if (!userId) {
      return errors.unauthorized();
    }

    const embeddingId = path.split('/')[3];

    const { data: embedding } = await supabase
      .from('embeddings')
      .select('user_id')
      .eq('id', embeddingId)
      .single();

    if (!embedding) {
      return errors.notFound('Embedding');
    }

    // Only owner or admin can delete
    if (embedding.user_id !== userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profile?.role !== 'admin') {
        return errors.forbidden('Can only delete own embeddings');
      }
    }

    await supabase.from('embeddings').delete().eq('id', embeddingId);

    return jsonOk({ message: 'Embedding deleted' });
  }

  // Route not found
  return errors.notFound('Endpoint');
});

// ============================================================================
// Start Server
// ============================================================================

serve(handler);

console.log(`🔢 ${SERVICE_NAME} v${VERSION} running on port ${SERVICE_PORT} [Pipeline ${PIPELINE}]`);
