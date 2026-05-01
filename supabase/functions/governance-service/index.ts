// ============================================================================
// TAMV Governance Service v3.0.0-Sovereign
// CCP - Control & Coordination (Port 8202)
// DAO Voting & Consensus
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

const SERVICE_NAME = 'governance-service';
const SERVICE_PORT = 8202;
const PIPELINE = 'CCP' as const;
const VERSION = '3.0.0-Sovereign';

// Voting power by tier
const VOTING_POWER: Record<string, number> = {
  free: 1,
  premium: 2,
  vip: 5,
  elite: 10,
  celestial: 25,
  enterprise: 50,
  gold: 8,
  gold_plus: 12,
};

// Minimum requirements to create proposal
const PROPOSAL_REQUIREMENTS: Record<string, { min_tier: string; min_reputation: number }> = {
  general: { min_tier: 'premium', min_reputation: 100 },
  economic: { min_tier: 'vip', min_reputation: 500 },
  constitutional: { min_tier: 'elite', min_reputation: 1000 },
};

// ============================================================================
// Logger
// ============================================================================

const logger = createLogger(SERVICE_NAME);

// ============================================================================
// Consensus Algorithm (Raft-like for MVP)
// ============================================================================

interface Vote {
  proposal_id: string;
  voter_id: string;
  vote: 'for' | 'against' | 'abstain';
  voting_power: number;
  timestamp: string;
}

async function calculateConsensus(
  supabase: any,
  proposalId: string
): Promise<{
  total_for: number;
  total_against: number;
  total_abstain: number;
  quorum_reached: boolean;
  result: 'pending' | 'passed' | 'rejected';
}> {
  const { data: votes } = await supabase
    .from('dao_votes')
    .select('vote, voting_power')
    .eq('proposal_id', proposalId);

  const totals = (votes || []).reduce((acc: any, v: Vote) => {
    acc[v.vote] = (acc[v.vote] || 0) + v.voting_power;
    return acc;
  }, { for: 0, against: 0, abstain: 0 });

  const total_votes = totals.for + totals.against + totals.abstain;
  const quorum = 100; // Minimum voting power required

  const quorum_reached = total_votes >= quorum;
  
  let result: 'pending' | 'passed' | 'rejected' = 'pending';
  if (quorum_reached) {
    result = totals.for > totals.against ? 'passed' : 'rejected';
  }

  return {
    total_for: totals.for,
    total_against: totals.against,
    total_abstain: totals.abstain,
    quorum_reached,
    result,
  };
}

// ============================================================================
// Main Handler
// ============================================================================

const handler = createHandler(SERVICE_NAME, PIPELINE, async (ctx) => {
  const { request, url, supabase, userId, traceId } = ctx;
  const path = url.pathname.replace('/governance-service', '');

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

  // GET /governance/proposals - List proposals
  if (path === '/governance/proposals' && request.method === 'GET') {
    const page = ctx.url.searchParams.get('page') || '1';
    const limit = ctx.url.searchParams.get('limit') || '20';
    const status = ctx.url.searchParams.get('status');
    const category = ctx.url.searchParams.get('category');
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('dao_proposals')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      return errors.internal('Failed to fetch proposals');
    }

    return jsonOk({
      proposals: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
      },
    });
  }

  // POST /governance/proposals - Create proposal
  if (path === '/governance/proposals' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { title, description, category = 'general', impact_economic = 0 } = body;

    if (!title || !description) {
      return errors.badRequest('title and description required');
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, reputation_score')
      .eq('id', userId)
      .single();

    if (!profile) {
      return errors.notFound('User profile');
    }

    // Check requirements
    const requirements = PROPOSAL_REQUIREMENTS[category] || PROPOSAL_REQUIREMENTS.general;
    const tierLevels = Object.keys(VOTING_POWER);
    const userTierLevel = tierLevels.indexOf(profile.tier);
    const requiredTierLevel = tierLevels.indexOf(requirements.min_tier);

    if (userTierLevel < requiredTierLevel) {
      return errors.forbidden(`Minimum tier '${requirements.min_tier}' required for ${category} proposals`);
    }

    if ((profile.reputation_score || 0) < requirements.min_reputation) {
      return errors.forbidden(`Minimum reputation ${requirements.min_reputation} required`);
    }

    try {
      const hash = await sha3_256(JSON.stringify({
        title,
        description,
        author: userId,
        ts: Date.now(),
      }));

      const { data: proposal, error } = await supabase.from('dao_proposals').insert({
        author_id: userId,
        title,
        description,
        category,
        impact_economic,
        evidence_hash: hash,
        status: 'voting',
        votes_for: 0,
        votes_against: 0,
        votes_abstain: 0,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }).select().single();

      if (error) throw error;

      // Log MSR event
      await supabase.from('msr_events').insert({
        actor_id: userId,
        action: 'DAO_PROPOSAL_CREATED',
        domain: 'GOVERNANCE',
        resource: proposal.id,
        status: 'success',
        risk_level: category === 'constitutional' ? 'high' : 'medium',
        evidence_hash: hash,
        metadata: {
          title,
          category,
          impact_economic,
        },
      });

      logger.info('Proposal created', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        proposal_id: proposal.id,
        author_id: userId,
        category,
      });

      return jsonOk({ proposal }, 201);

    } catch (error) {
      logger.error('Proposal creation failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Failed to create proposal');
    }
  }

  // GET /governance/proposals/{id} - Get proposal details
  if (path.match(/^\/governance\/proposals\/[^/]+$/) && request.method === 'GET') {
    const proposalId = path.split('/')[3];

    const { data: proposal, error } = await supabase
      .from('dao_proposals')
      .select('*, author:profiles!dao_proposals_author_id_fkey(display_name)')
      .eq('id', proposalId)
      .single();

    if (error || !proposal) {
      return errors.notFound('Proposal');
    }

    // Calculate current consensus
    const consensus = await calculateConsensus(supabase, proposalId);

    return jsonOk({
      proposal,
      consensus,
    });
  }

  // POST /governance/vote - Cast vote
  if (path === '/governance/vote' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { proposal_id, vote, reason } = body;

    if (!proposal_id || !vote) {
      return errors.badRequest('proposal_id and vote required');
    }

    if (!['for', 'against', 'abstain'].includes(vote)) {
      return errors.validation('vote must be for, against, or abstain');
    }

    // Get proposal
    const { data: proposal } = await supabase
      .from('dao_proposals')
      .select('status, expires_at')
      .eq('id', proposal_id)
      .single();

    if (!proposal) {
      return errors.notFound('Proposal');
    }

    if (proposal.status !== 'voting') {
      return errors.badRequest('Proposal is not open for voting');
    }

    if (new Date(proposal.expires_at) < new Date()) {
      return errors.badRequest('Voting period has ended');
    }

    // Get user's voting power
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    const votingPower = VOTING_POWER[profile?.tier || 'free'];

    // Check if already voted
    const { data: existingVote } = await supabase
      .from('dao_votes')
      .select('id')
      .eq('proposal_id', proposal_id)
      .eq('voter_id', userId)
      .single();

    try {
      if (existingVote) {
        // Update vote
        await supabase.from('dao_votes').update({
          vote,
          reason: reason || null,
          voting_power: votingPower,
          updated_at: new Date().toISOString(),
        }).eq('id', existingVote.id);
      } else {
        // Create vote
        await supabase.from('dao_votes').insert({
          proposal_id,
          voter_id: userId,
          vote,
          reason: reason || null,
          voting_power: votingPower,
        });
      }

      // Recalculate consensus
      const consensus = await calculateConsensus(supabase, proposal_id);

      // Update proposal vote counts
      await supabase.from('dao_proposals').update({
        votes_for: consensus.total_for,
        votes_against: consensus.total_against,
        votes_abstain: consensus.total_abstain,
        status: consensus.result === 'passed' ? 'passed' : 
                consensus.result === 'rejected' ? 'rejected' : 'voting',
      }).eq('id', proposal_id);

      logger.info('Vote cast', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        proposal_id,
        voter_id: userId,
        vote,
        voting_power: votingPower,
      });

      return jsonOk({
        vote: {
          proposal_id,
          vote,
          voting_power: votingPower,
        },
        consensus,
      });

    } catch (error) {
      logger.error('Voting failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Failed to cast vote');
    }
  }

  // GET /governance/results/{id} - Get voting results
  if (path.match(/^\/governance\/results\/[^/]+$/) && request.method === 'GET') {
    const proposalId = path.split('/')[3];

    const { data: proposal } = await supabase
      .from('dao_proposals')
      .select('*')
      .eq('id', proposalId)
      .single();

    if (!proposal) {
      return errors.notFound('Proposal');
    }

    const consensus = await calculateConsensus(supabase, proposalId);

    // Get vote breakdown
    const { data: votes } = await supabase
      .from('dao_votes')
      .select('vote, voting_power, voter:profiles!dao_votes_voter_id_fkey(display_name, tier)')
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: false });

    return jsonOk({
      proposal: {
        id: proposal.id,
        title: proposal.title,
        status: proposal.status,
        expires_at: proposal.expires_at,
      },
      results: {
        ...consensus,
        total_voting_power: consensus.total_for + consensus.total_against + consensus.total_abstain,
        participation_rate: 0, // Calculate based on total eligible voters
      },
      votes: votes || [],
    });
  }

  // Route not found
  return errors.notFound('Endpoint');
});

// ============================================================================
// Start Server
// ============================================================================

serve(handler);

console.log(`🏛️ ${SERVICE_NAME} v${VERSION} running on port ${SERVICE_PORT} [Pipeline ${PIPELINE}]`);
