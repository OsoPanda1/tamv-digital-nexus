// ============================================================================
// TAMV Wallet Service v2.1 — HARDENED with validation, rate limiting, audit
// Uses real database tables, MSR audit trail, proper auth
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ── Rate Limiting (in-memory, per-user) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30; // requests per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ── Validation helpers ──
function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function isValidAmount(val: unknown): val is number {
  return typeof val === 'number' && Number.isFinite(val) && val > 0 && val <= 1_000_000;
}

function sanitizeString(str: unknown, maxLen = 500): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/[<>]/g, '');
}

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

  // Only POST allowed
  if (req.method !== 'POST') {
    return jsonError('Method not allowed', 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Auth — extract user from JWT
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonError('No authorization header', 401);
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const token = authHeader.replace('Bearer ', '');
  
  let user: any;
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return jsonError('Invalid authentication', 401);
    user = data.user;
  } catch {
    return jsonError('Authentication failed', 401);
  }

  // Rate limit check
  if (!checkRateLimit(user.id)) {
    return jsonError('Rate limit exceeded. Try again in 60 seconds.', 429);
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return jsonError('Invalid JSON body', 400);
    }

    const { action, intent, payload } = body;
    const resolvedIntent = typeof intent === 'string' ? intent : '';
    const resolvedAction = typeof action === 'string' ? action : '';
    const operation = resolvedIntent || resolvedAction;
    if (!operation || operation.length > 80) {
      return jsonError('Invalid action/intent', 400);
    }

    switch (operation) {
      // ── GET BALANCE ──
      case 'get_balance':
      case 'wallet.balance.get': {
        const { data: wallet, error } = await supabase
          .from('tcep_wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // No wallet yet — create one
          const { data: newWallet, error: createErr } = await supabase
            .from('tcep_wallets')
            .insert({ user_id: user.id })
            .select()
            .single();
          if (createErr) return jsonError(createErr.message, 500);
          return jsonOk({
            balance_tcep: Number(newWallet.balance_credits),
            balance_locked: Number(newWallet.balance_locked),
            lifetime_earned: Number(newWallet.lifetime_earned),
            lifetime_spent: Number(newWallet.lifetime_spent),
            membership_tier: newWallet.membership_tier,
            commission_rate: Number(newWallet.commission_rate),
          });
        }
        if (error) return jsonError(error.message, 500);

        return jsonOk({
          balance_tcep: Number(wallet.balance_credits),
          balance_locked: Number(wallet.balance_locked),
          lifetime_earned: Number(wallet.lifetime_earned),
          lifetime_spent: Number(wallet.lifetime_spent),
          membership_tier: wallet.membership_tier,
          commission_rate: Number(wallet.commission_rate),
        });
      }

      // ── TRANSFER ──
      case 'transfer':
      case 'wallet.transfer':
      case 'economy.transfer': {
        const transferPayload = payload && typeof payload === 'object' ? payload : body;
        const { toUserId, amount, description } = transferPayload as Record<string, unknown>;

        // Strict validation
        if (!toUserId || !isValidUUID(toUserId)) {
          return jsonError('Invalid recipient ID', 400);
        }
        if (!isValidAmount(amount)) {
          return jsonError('Invalid amount: must be a positive number up to 1,000,000', 400);
        }
        if (toUserId === user.id) {
          return jsonError('Cannot transfer to yourself', 400);
        }

        const safeDesc = sanitizeString(description, 200);

        // Get sender wallet
        const { data: fromWallet } = await supabase
          .from('tcep_wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!fromWallet || Number(fromWallet.balance_credits) < amount) {
          return jsonError('Saldo insuficiente', 400);
        }

        // Get or create receiver wallet
        let { data: toWallet } = await supabase
          .from('tcep_wallets')
          .select('*')
          .eq('user_id', toUserId)
          .single();

        if (!toWallet) {
          const { data: newW } = await supabase
            .from('tcep_wallets')
            .insert({ user_id: toUserId })
            .select()
            .single();
          toWallet = newW;
        }
        if (!toWallet) return jsonError('Receptor no encontrado', 404);

        const hash = generateHash(JSON.stringify({ from: user.id, to: toUserId, amount, ts: Date.now() }));

        // Debit sender
        const { error: debitErr } = await supabase.from('tcep_wallets').update({
          balance_credits: Number(fromWallet.balance_credits) - amount,
          lifetime_spent: Number(fromWallet.lifetime_spent) + amount,
        }).eq('user_id', user.id);

        if (debitErr) return jsonError('Transfer failed: debit error', 500);

        // Credit receiver
        const { error: creditErr } = await supabase.from('tcep_wallets').update({
          balance_credits: Number(toWallet.balance_credits) + amount,
          lifetime_earned: Number(toWallet.lifetime_earned) + amount,
        }).eq('user_id', toUserId);

        if (creditErr) {
          // Rollback debit
          await supabase.from('tcep_wallets').update({
            balance_credits: Number(fromWallet.balance_credits),
            lifetime_spent: Number(fromWallet.lifetime_spent),
          }).eq('user_id', user.id);
          return jsonError('Transfer failed: credit error, rollback applied', 500);
        }

        // Record transaction
        await supabase.from('tcep_transactions').insert({
          from_user_id: user.id,
          to_user_id: toUserId,
          amount,
          tx_type: 'transfer',
          description: safeDesc || 'Transferencia TCEP',
          evidence_hash: hash,
        });

        // MSR audit
        await supabase.from('msr_events').insert({
          actor_id: user.id,
          action: 'TCEP_TRANSFER',
          domain: 'ECONOMY',
          payload: { amount, to: toUserId },
          evidence_hash: hash,
        });

        return jsonOk({ message: 'Transferencia exitosa', amount, to: toUserId, evidence_hash: hash });
      }

      // ── DAILY LOGIN REWARD ──
      case 'daily_login':
      case 'wallet.daily_login': {
        const { data: wallet } = await supabase
          .from('tcep_wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!wallet) return jsonError('Wallet no encontrado', 404);

        // Check if already claimed today
        const today = new Date().toISOString().split('T')[0];
        const { data: alreadyClaimed } = await supabase
          .from('tcep_transactions')
          .select('id')
          .eq('from_user_id', user.id)
          .eq('tx_type', 'daily_reward')
          .gte('created_at', today)
          .limit(1);

        if (alreadyClaimed && alreadyClaimed.length > 0) {
          return jsonError('Ya reclamaste tu recompensa diaria hoy', 400);
        }

        const rewardAmount = 1;
        const hash = generateHash(JSON.stringify({ user: user.id, type: 'daily', ts: Date.now() }));

        await supabase.from('tcep_wallets').update({
          balance_credits: Number(wallet.balance_credits) + rewardAmount,
          lifetime_earned: Number(wallet.lifetime_earned) + rewardAmount,
        }).eq('user_id', user.id);

        await supabase.from('tcep_transactions').insert({
          from_user_id: user.id,
          to_user_id: user.id,
          amount: rewardAmount,
          tx_type: 'daily_reward',
          description: 'Recompensa diaria de login',
          evidence_hash: hash,
        });

        await supabase.from('msr_events').insert({
          actor_id: user.id,
          action: 'DAILY_REWARD_CLAIMED',
          domain: 'ECONOMY',
          payload: { amount: rewardAmount },
          evidence_hash: hash,
        });

        return jsonOk({ message: 'Recompensa diaria reclamada', amount: rewardAmount, currency: 'TCEP' });
      }

      // ── GET HISTORY ──
      case 'get_history':
      case 'wallet.history.get': {
        const limit = Math.min(Math.max(Number(body.limit) || 50, 1), 200);
        const offset = Math.max(Number(body.offset) || 0, 0);

        const { data: transactions } = await supabase
          .from('tcep_transactions')
          .select('*')
          .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        return jsonOk({ transactions: transactions || [], limit, offset });
      }

      // ── HEALTH CHECK ──
      case 'health': {
        return jsonOk({
          service: 'wallet-service',
          version: '2.1.0',
          status: 'healthy',
          timestamp: new Date().toISOString(),
        });
      }

      default:
        return jsonError('Acción no válida: ' + sanitizeString(action, 50), 400);
    }
  } catch (error) {
    console.error('[Wallet Service]', error);
    return jsonError('Internal server error', 500);
  }
});

function jsonOk(data: any, status = 200) {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
