// ============================================================================
// TAMV Wallet Service v2 — FUNCTIONAL with tcep_wallets + tcep_transactions
// Uses real database tables, MSR audit trail, proper auth
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Auth — extract user from JWT
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonError('No authorization header', 401);
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

  if (authErr || !user) {
    return jsonError('Invalid authentication', 401);
  }

  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      // ── GET BALANCE ──
      case 'get_balance': {
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
      case 'transfer': {
        const { toUserId, amount, description } = body;
        if (!toUserId || !amount || amount <= 0) return jsonError('Invalid transfer params', 400);

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
        await supabase.from('tcep_wallets').update({
          balance_credits: Number(fromWallet.balance_credits) - amount,
          lifetime_spent: Number(fromWallet.lifetime_spent) + amount,
        }).eq('user_id', user.id);

        // Credit receiver
        await supabase.from('tcep_wallets').update({
          balance_credits: Number(toWallet.balance_credits) + amount,
          lifetime_earned: Number(toWallet.lifetime_earned) + amount,
        }).eq('user_id', toUserId);

        // Record transaction
        await supabase.from('tcep_transactions').insert({
          from_user_id: user.id,
          to_user_id: toUserId,
          amount,
          tx_type: 'transfer',
          description: description || 'Transferencia TCEP',
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

        return jsonOk({ message: 'Transferencia exitosa', amount, to: toUserId });
      }

      // ── DAILY LOGIN REWARD ──
      case 'daily_login': {
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
      case 'get_history': {
        const { data: transactions } = await supabase
          .from('tcep_transactions')
          .select('*')
          .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(50);

        return jsonOk({ transactions: transactions || [] });
      }

      default:
        return jsonError('Acción no válida: ' + action, 400);
    }
  } catch (error) {
    console.error('[Wallet Service]', error);
    return jsonError(error instanceof Error ? error.message : 'Internal error', 500);
  }
});

function jsonOk(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
