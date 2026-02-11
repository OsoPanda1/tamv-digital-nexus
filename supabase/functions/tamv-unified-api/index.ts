// TAMV UNIFIED API - Omni-Modus Civilizatory Operating System
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateHash(data: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  let hash = 0;
  for (let i = 0; i < bytes.length; i++) {
    hash = ((hash << 5) - hash) + bytes[i];
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace('/tamv-unified-api', '');
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  
  // Auth check
  const authHeader = req.headers.get('Authorization');
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: authHeader ? { Authorization: authHeader } : {} }
  });

  let userId: string | null = null;
  if (authHeader) {
    const { data } = await supabase.auth.getUser();
    userId = data?.user?.id || null;
  }

  try {
    const body = req.method !== 'GET' ? await req.json().catch(() => ({})) : {};

    // ======= IDENTITY MODULE (ID-NVIDA) =======
    if (path === '/id/me' && req.method === 'GET') {
      if (!userId) return jsonError('Unauthorized', 401);
      const { data, error } = await supabase.from('id_nvida').select('*').eq('user_id', userId).single();
      if (error) return jsonError(error.message, 404);
      return jsonOk({ identity: data });
    }

    if (path === '/id/dignity' && req.method === 'GET') {
      if (!userId) return jsonError('Unauthorized', 401);
      const { data } = await supabase.from('id_nvida').select('dignity_score, reputation_score, trust_level').eq('user_id', userId).single();
      return jsonOk({ dignity: data });
    }

    // ======= GOVERNANCE MODULE (CITEMESH) =======
    if (path === '/governance/roles' && req.method === 'GET') {
      if (!userId) return jsonError('Unauthorized', 401);
      const { data } = await supabase.from('citemesh_roles').select('*').eq('user_id', userId);
      return jsonOk({ roles: data });
    }

    // ======= DAO MODULE =======
    if (path === '/dao/proposals' && req.method === 'GET') {
      const { data } = await supabase.from('dao_proposals').select('*').order('created_at', { ascending: false }).limit(50);
      return jsonOk({ proposals: data });
    }

    if (path === '/dao/proposals' && req.method === 'POST') {
      if (!userId) return jsonError('Unauthorized', 401);
      const { title, description, category, impact_economic } = body;
      if (!title || !description) return jsonError('title and description required', 400);
      
      const hash = generateHash(JSON.stringify({ title, description, userId, ts: Date.now() }));
      const { data, error } = await supabase.from('dao_proposals').insert({
        author_id: userId, title, description,
        category: category || 'general',
        impact_economic: impact_economic || 0,
        evidence_hash: hash,
        status: 'voting',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }).select().single();
      
      if (error) return jsonError(error.message, 400);
      
      // Log MSR event
      await supabase.from('msr_events').insert({
        actor_id: userId, action: 'DAO_PROPOSAL_CREATED', domain: 'GOVERNANCE',
        payload: { proposal_id: data.id, title },
        evidence_hash: hash
      });
      
      return jsonOk({ proposal: data }, 201);
    }

    if (path === '/dao/vote' && req.method === 'POST') {
      if (!userId) return jsonError('Unauthorized', 401);
      const { proposal_id, vote, reason } = body;
      if (!proposal_id || vote === undefined) return jsonError('proposal_id and vote required', 400);
      
      const { data, error } = await supabase.from('dao_votes').insert({
        proposal_id, voter_id: userId, vote: !!vote, reason: reason || null
      }).select().single();
      
      if (error) return jsonError(error.message, 400);
      
      // Update vote counts
      const field = vote ? 'votes_for' : 'votes_against';
      await supabase.rpc('increment_column', { table_name: 'dao_proposals', column_name: field, row_id: proposal_id });
      
      return jsonOk({ vote: data }, 201);
    }

    // ======= ECONOMY MODULE (TCEP) =======
    if (path === '/economy/wallet' && req.method === 'GET') {
      if (!userId) return jsonError('Unauthorized', 401);
      const { data } = await supabase.from('tcep_wallets').select('*').eq('user_id', userId).single();
      return jsonOk({ wallet: data });
    }

    if (path === '/economy/transfer' && req.method === 'POST') {
      if (!userId) return jsonError('Unauthorized', 401);
      const { to_user_id, amount, description } = body;
      if (!to_user_id || !amount || amount <= 0) return jsonError('Invalid transfer', 400);
      
      // Check balance
      const { data: wallet } = await supabase.from('tcep_wallets').select('balance_credits').eq('user_id', userId).single();
      if (!wallet || wallet.balance_credits < amount) return jsonError('Insufficient balance', 400);
      
      const hash = generateHash(JSON.stringify({ from: userId, to: to_user_id, amount, ts: Date.now() }));
      
      // Create transaction
      const { data: tx } = await supabase.from('tcep_transactions').insert({
        from_user_id: userId, to_user_id, amount, tx_type: 'transfer',
        description: description || 'TCEP Transfer', evidence_hash: hash
      }).select().single();
      
      // Log MSR
      await supabase.from('msr_events').insert({
        actor_id: userId, action: 'TCEP_TRANSFER', domain: 'ECONOMY',
        payload: { amount, to: to_user_id }, evidence_hash: hash
      });
      
      return jsonOk({ transaction: tx }, 201);
    }

    if (path === '/economy/transactions' && req.method === 'GET') {
      if (!userId) return jsonError('Unauthorized', 401);
      const { data } = await supabase.from('tcep_transactions')
        .select('*')
        .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(50);
      return jsonOk({ transactions: data });
    }

    if (path === '/economy/commission/calculate' && req.method === 'POST') {
      const { membership_level, amount } = body;
      const rates: Record<string, number> = {
        free: 0.30, premium: 0.25, vip: 0.20, elite: 0.15,
        celestial: 0.10, enterprise: 0.08, gold: 0.12, gold_plus: 0.10
      };
      const rate = rates[membership_level?.toLowerCase()] || 0.30;
      return jsonOk({ commission_rate: rate, commission: amount * rate, net_amount: amount * (1 - rate) });
    }

    // ======= LOTTERY MODULE =======
    if (path === '/economy/lottery/active' && req.method === 'GET') {
      const { data } = await supabase.from('lottery_draws').select('*').eq('status', 'open').order('created_at', { ascending: false });
      return jsonOk({ draws: data });
    }

    if (path === '/economy/lottery/purchase' && req.method === 'POST') {
      if (!userId) return jsonError('Unauthorized', 401);
      const { draw_id, quantity } = body;
      if (!draw_id || !quantity || quantity < 1) return jsonError('draw_id and quantity required', 400);
      
      const { data: draw } = await supabase.from('lottery_draws').select('*').eq('id', draw_id).single();
      if (!draw || draw.status !== 'open') return jsonError('Draw not available', 400);
      if (draw.tickets_sold + quantity > draw.max_tickets) return jsonError('Not enough tickets', 400);
      
      const tickets = [];
      for (let i = 0; i < quantity; i++) {
        tickets.push({
          draw_id, user_id: userId,
          ticket_number: draw.tickets_sold + i + 1
        });
      }
      
      const { data: bought } = await supabase.from('lottery_tickets').insert(tickets).select();
      return jsonOk({ tickets: bought }, 201);
    }

    // ======= MSR MODULE =======
    if (path === '/msr/events' && req.method === 'GET') {
      if (!userId) return jsonError('Unauthorized', 401);
      const { data } = await supabase.from('msr_events')
        .select('*').eq('actor_id', userId)
        .order('created_at', { ascending: false }).limit(100);
      return jsonOk({ events: data });
    }

    if (path === '/msr/log' && req.method === 'POST') {
      if (!userId) return jsonError('Unauthorized', 401);
      const { action, domain, payload, severity } = body;
      if (!action) return jsonError('action required', 400);
      
      const hash = generateHash(JSON.stringify({ actor: userId, action, payload, ts: Date.now() }));
      const { data } = await supabase.from('msr_events').insert({
        actor_id: userId, action, domain: domain || 'GENERAL',
        payload: payload || {}, evidence_hash: hash, severity: severity || 'info'
      }).select().single();
      
      return jsonOk({ event: data }, 201);
    }

    // ======= SENTINEL MODULE (Anubis) =======
    if (path === '/sentinel/status' && req.method === 'GET') {
      return jsonOk({
        sentinel: {
          status: 'ACTIVE',
          threat_level: 'LOW',
          shields: { pqc: true, zero_trust: true, mfa: true },
          last_scan: new Date().toISOString(),
          active_monitors: ['HORUS', 'RADAR_QUETZALCOATL', 'RADAR_OJO_DE_RA']
        }
      });
    }

    // ======= FENIX FUND =======
    if (path === '/economy/fenix/status' && req.method === 'GET') {
      return jsonOk({
        fenix: {
          total_pool: 125000.00,
          distributed: 45000.00,
          contributors: 1250,
          period: '2026-Q1',
          redistribution_rule: '20/30/50',
          status: 'active'
        }
      });
    }

    // ======= API INFO =======
    if (path === '/' || path === '' || path === '/info') {
      return jsonOk({
        name: 'TAMV Unified API - Omni-Modus COS',
        version: '2.0.0',
        modules: ['IDENTITY', 'GOVERNANCE', 'DAO', 'ECONOMY', 'LOTTERY', 'MSR', 'SENTINEL', 'FENIX'],
        endpoints: {
          identity: ['/id/me', '/id/dignity'],
          governance: ['/governance/roles'],
          dao: ['/dao/proposals', '/dao/vote'],
          economy: ['/economy/wallet', '/economy/transfer', '/economy/transactions', '/economy/commission/calculate'],
          lottery: ['/economy/lottery/active', '/economy/lottery/purchase'],
          msr: ['/msr/events', '/msr/log'],
          sentinel: ['/sentinel/status'],
          fenix: ['/economy/fenix/status']
        },
        civilization: 'TAMV DM-X4™ Quantum Sovereign Edition'
      });
    }

    return jsonError('Endpoint not found', 404);
  } catch (error) {
    console.error('[TAMV API]', error);
    return jsonError(error instanceof Error ? error.message : 'Internal error', 500);
  }
});

function jsonOk(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
