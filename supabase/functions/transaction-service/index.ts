// ============================================================================
// TAMV Transaction Service v3.0.0-Sovereign
// Pipeline A - Critical Operations (Port 8004)
// Saga Pattern for Distributed Transactions
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// === TAMV SHARED INLINE ===
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tamv-trace-id, x-tamv-session-id, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS' };
async function sha3_256(data: string | Uint8Array): Promise<string> { const buf = typeof data === 'string' ? new TextEncoder().encode(data) : data; const h = await crypto.subtle.digest('SHA-256', buf as ArrayBuffer); return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join(''); }
function createLogger(svc: string) { return { info: (m: string, _c: any, meta?: any) => console.log(JSON.stringify({ level: 'info', svc, m, ...meta })), error: (m: string, _c: any, e?: Error, meta?: any) => console.error(JSON.stringify({ level: 'error', svc, m, err: e?.message, ...meta })), warn: (m: string, _c: any, meta?: any) => console.warn(JSON.stringify({ level: 'warn', svc, m, ...meta })) }; }
function buildLogContext(r: Request, mod: string, pipe: string) { return { trace_id: r.headers.get('X-TAMV-Trace-Id') || crypto.randomUUID(), span_id: crypto.randomUUID(), module: mod, pipeline: pipe }; }
function jsonOk<T>(data: T, status = 200): Response { return new Response(JSON.stringify({ success: true, data, meta: { trace_id: crypto.randomUUID(), timestamp: new Date().toISOString(), version: '3.0.0' } }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }
function jsonError(message: string, status = 400, code?: string, details?: any): Response { return new Response(JSON.stringify({ success: false, error: { code: code || 'ERROR', message, details }, meta: { trace_id: crypto.randomUUID(), timestamp: new Date().toISOString(), version: '3.0.0' } }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); }
const errors = { unauthorized: (m = 'Authentication required') => jsonError(m, 401, 'UNAUTHORIZED'), forbidden: (m = 'Insufficient permissions') => jsonError(m, 403, 'FORBIDDEN'), notFound: (r = 'Resource') => jsonError(`${r} not found`, 404, 'NOT_FOUND'), badRequest: (m = 'Invalid request', d?: any) => jsonError(m, 400, 'INVALID_REQUEST', d), validation: (m = 'Validation failed', d?: any) => jsonError(m, 422, 'VALIDATION_ERROR', d), rateLimited: (r = 60) => jsonError('Rate limit exceeded', 429, 'RATE_LIMITED', { retry_after: r }), internal: (m = 'Internal server error') => jsonError(m, 500, 'INTERNAL_ERROR') };
interface HandlerContext { request: Request; url: URL; supabase: any; userId: string | null; traceId: string; spanId: string; startTime: number; }
function createHandler(svcName: string, _pipeline: string, handler: (ctx: HandlerContext) => Promise<Response>): (req: Request) => Promise<Response> { return async (request: Request) => { if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders }); const startTime = performance.now(); const traceId = request.headers.get('X-TAMV-Trace-Id') || crypto.randomUUID(); try { const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { global: { headers: { Authorization: request.headers.get('Authorization') || '' } } }); let userId: string | null = null; if (request.headers.get('Authorization')?.startsWith('Bearer ')) { try { const { data } = await supabase.auth.getUser(); userId = data.user?.id || null; } catch {} } return await handler({ request, url: new URL(request.url), supabase, userId, traceId, spanId: crypto.randomUUID(), startTime }); } catch (error) { return jsonError(error instanceof Error ? error.message : 'Internal server error', 500, 'INTERNAL_ERROR'); } }; }
// === END SHARED INLINE ===

// ============================================================================
// Service Configuration
// ============================================================================

const SERVICE_NAME = 'transaction-service';
const SERVICE_PORT = 8004;
const PIPELINE = 'A' as const;
const VERSION = '3.0.0-Sovereign';

// Transaction limits by tier
const TIER_LIMITS: Record<string, { min: number; max: number; daily: number }> = {
  free: { min: 1, max: 100, daily: 500 },
  premium: { min: 1, max: 1000, daily: 5000 },
  vip: { min: 1, max: 5000, daily: 25000 },
  elite: { min: 1, max: 20000, daily: 100000 },
  celestial: { min: 1, max: 100000, daily: 500000 },
  enterprise: { min: 1, max: 1000000, daily: 10000000 },
};

// ============================================================================
// Logger
// ============================================================================

const logger = createLogger(SERVICE_NAME);

// ============================================================================
// Saga Pattern Implementation
// ============================================================================

interface SagaStep {
  name: string;
  execute: () => Promise<any>;
  compensate: () => Promise<void>;
}

class Saga {
  private steps: SagaStep[] = [];
  private executed: string[] = [];
  private results: any[] = [];

  addStep(step: SagaStep) {
    this.steps.push(step);
  }

  async execute(): Promise<{ success: boolean; results: any[]; error?: string }> {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      try {
        const result = await step.execute();
        this.executed.push(step.name);
        this.results.push(result);
      } catch (error) {
        // Compensate all executed steps in reverse order
        await this.compensate();
        return {
          success: false,
          results: this.results,
          error: `Step ${step.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
      }
    }
    return { success: true, results: this.results };
  }

  private async compensate(): Promise<void> {
    for (let i = this.executed.length - 1; i >= 0; i--) {
      const stepName = this.executed[i];
      const step = this.steps.find(s => s.name === stepName);
      if (step) {
        try {
          await step.compensate();
        } catch (error) {
          console.error(`Compensation failed for ${stepName}:`, error);
        }
      }
    }
  }
}

// ============================================================================
// Transaction Functions
// ============================================================================

async function createTransaction(
  supabase: any,
  fromUserId: string,
  toUserId: string,
  amount: number,
  currency: string,
  description: string,
  hash: string
): Promise<any> {
  const { data, error } = await supabase.from('tcep_transactions').insert({
    from_user_id: fromUserId,
    to_user_id: toUserId,
    amount,
    currency,
    tx_type: 'transfer',
    description,
    evidence_hash: hash,
    status: 'pending',
  }).select().single();

  if (error) throw error;
  return data;
}

async function updateBalance(
  supabase: any,
  userId: string,
  delta: number
): Promise<void> {
  const { error } = await supabase.rpc('update_wallet_balance', {
    p_user_id: userId,
    p_delta: delta,
  });

  if (error) throw error;
}

async function confirmTransaction(
  supabase: any,
  txId: string
): Promise<void> {
  const { error } = await supabase.from('tcep_transactions').update({
    status: 'confirmed',
    confirmed_at: new Date().toISOString(),
  }).eq('id', txId);

  if (error) throw error;
}

async function rollbackTransaction(
  supabase: any,
  txId: string
): Promise<void> {
  await supabase.from('tcep_transactions').update({
    status: 'failed',
  }).eq('id', txId);
}

// ============================================================================
// Main Handler
// ============================================================================

const handler = createHandler(SERVICE_NAME, PIPELINE, async (ctx) => {
  const { request, url, supabase, userId, traceId } = ctx;
  const path = url.pathname.replace('/transaction-service', '');

  // GET /health
  if (path === '/health' && request.method === 'GET') {
    return jsonOk({
      service: SERVICE_NAME,
      version: VERSION,
      pipeline: PIPELINE,
      port: SERVICE_PORT,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  }

  // POST /tx/create - Create transaction (Saga pattern)
  if (path === '/tx/create' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { to_user_id, amount, currency = 'TAU', description = '' } = body;

    // Validation
    if (!to_user_id || !amount) {
      return errors.badRequest('to_user_id and amount required');
    }

    if (to_user_id === userId) {
      return errors.badRequest('Cannot transfer to yourself');
    }

    if (amount <= 0) {
      return errors.badRequest('Amount must be positive');
    }

    // Get user tier and limits
    const { data: fromProfile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    const tier = fromProfile?.tier || 'free';
    const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;

    if (amount < limits.min || amount > limits.max) {
      return errors.validation(`Amount must be between ${limits.min} and ${limits.max}`);
    }

    // Check daily limit
    const { data: dailyTx } = await supabase
      .from('tcep_transactions')
      .select('amount', { count: 'exact' })
      .eq('from_user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const dailyTotal = dailyTx?.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0) || 0;
    if (dailyTotal + amount > limits.daily) {
      return errors.validation(`Daily limit of ${limits.daily} exceeded`);
    }

    // Check sender balance
    const { data: fromWallet } = await supabase
      .from('tcep_wallets')
      .select('balance_credits')
      .eq('user_id', userId)
      .single();

    if (!fromWallet || fromWallet.balance_credits < amount) {
      return errors.validation('Insufficient balance', {
        required: amount,
        available: fromWallet?.balance_credits || 0,
        currency,
      });
    }

    // Verify recipient exists
    const { data: toProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', to_user_id)
      .single();

    if (!toProfile) {
      return errors.notFound('Recipient user');
    }

    // Generate evidence hash
    const hash = await sha3_256(JSON.stringify({
      from: userId,
      to: to_user_id,
      amount,
      currency,
      ts: Date.now(),
    }));

    // Execute Saga
    const saga = new Saga();
    let txId: string = '';

    saga.addStep({
      name: 'create_transaction',
      execute: async () => {
        const tx = await createTransaction(supabase, userId, to_user_id, amount, currency, description, hash);
        txId = tx.id;
        return tx;
      },
      compensate: async () => {
        if (txId) {
          await rollbackTransaction(supabase, txId);
        }
      },
    });

    saga.addStep({
      name: 'debit_sender',
      execute: async () => {
        await updateBalance(supabase, userId, -amount);
      },
      compensate: async () => {
        await updateBalance(supabase, userId, amount);
      },
    });

    saga.addStep({
      name: 'credit_recipient',
      execute: async () => {
        await updateBalance(supabase, to_user_id, amount);
      },
      compensate: async () => {
        await updateBalance(supabase, to_user_id, -amount);
      },
    });

    saga.addStep({
      name: 'confirm_transaction',
      execute: async () => {
        await confirmTransaction(supabase, txId);
      },
      compensate: async () => {
        await rollbackTransaction(supabase, txId);
      },
    });

    const result = await saga.execute();

    if (!result.success) {
      logger.error('Transaction failed', buildLogContext(request, SERVICE_NAME, PIPELINE), undefined, {
        error: result.error,
        from_user: userId,
        to_user: to_user_id,
        amount,
      });
      return errors.internal(result.error || 'Transaction failed');
    }

    // Log MSR event
    await supabase.from('msr_events').insert({
      actor_id: userId,
      action: 'TCEP_TRANSFER',
      domain: 'ECONOMY',
      resource: txId!,
      status: 'success',
      risk_level: amount > 1000 ? 'medium' : 'low',
      evidence_hash: hash,
      metadata: {
        to_user_id,
        amount,
        currency,
      },
    });

    logger.info('Transaction completed', buildLogContext(request, SERVICE_NAME, PIPELINE), {
      tx_id: txId,
      from_user: userId,
      to_user: to_user_id,
      amount,
    });

    return jsonOk({
      transaction: {
        id: txId,
        from_user_id: userId,
        to_user_id,
        amount,
        currency,
        status: 'confirmed',
        evidence_hash: hash,
        confirmed_at: new Date().toISOString(),
      },
    }, 201);
  }

  // GET /tx/{id} - Get transaction
  if (path.startsWith('/tx/') && request.method === 'GET') {
    if (!userId) {
      return errors.unauthorized();
    }

    const txId = path.split('/')[2];
    if (!txId) {
      return errors.badRequest('Transaction ID required');
    }

    const { data: tx, error } = await supabase
      .from('tcep_transactions')
      .select('*')
      .eq('id', txId)
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .single();

    if (error || !tx) {
      return errors.notFound('Transaction');
    }

    return jsonOk({ transaction: tx });
  }

  // GET /tx/history - Get transaction history
  if (path === '/tx/history' && request.method === 'GET') {
    if (!userId) {
      return errors.unauthorized();
    }

    const page = ctx.url.searchParams.get('page') || '1';
    const limit = ctx.url.searchParams.get('limit') || '20';
    const status = ctx.url.searchParams.get('status');
    const currency = ctx.url.searchParams.get('currency');
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('tcep_transactions')
      .select('*', { count: 'exact' })
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (currency) {
      query = query.eq('currency', currency);
    }

    const { data, error, count } = await query;

    if (error) {
      return errors.internal('Failed to fetch transactions');
    }

    return jsonOk({
      transactions: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
      },
    });
  }

  // Route not found
  return errors.notFound('Endpoint');
});

// ============================================================================
// Start Server
// ============================================================================

serve(handler);

console.log(`💰 ${SERVICE_NAME} v${VERSION} running on port ${SERVICE_PORT} [Pipeline ${PIPELINE}]`);
