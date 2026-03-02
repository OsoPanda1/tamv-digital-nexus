// ============================================================================
// TAMV Wallet Service - Edge Function
// Handles wallet operations, transactions, and balance management
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// ============================================================================
// CONSTANTS
// ============================================================================

const TRANSACTION_LIMITS = {
  min_amount: 0.00000001,
  max_single_transaction: 1000000,
  daily_limit: 5000000,
};

const REWARD_RATES = {
  daily_login: 1,
  referral: 50,
  content_creation: 5,
  course_completion: 20,
  dream_space_visit: 0.5,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getOrCreateWallet(supabase: any, userId: string) {
  const { data: wallet, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    // Wallet doesn't exist, create it
    const { data: newWallet, error: createError } = await supabase
      .from("wallets")
      .insert({ user_id: userId })
      .select()
      .single();

    if (createError) throw createError;
    return newWallet;
  }

  if (error) throw error;
  return wallet;
}

function validateTransaction(amount: number, type: string) {
  if (amount < TRANSACTION_LIMITS.min_amount) {
    throw new Error(`Monto mínimo: ${TRANSACTION_LIMITS.min_amount}`);
  }
  if (amount > TRANSACTION_LIMITS.max_single_transaction) {
    throw new Error(`Monto máximo por transacción: ${TRANSACTION_LIMITS.max_single_transaction}`);
  }
  return true;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    const body = await req.json();
    const { action, amount, currency, description, toUserId, metadata } = body;

    let result;

    switch (action) {
      case "get_balance": {
        const wallet = await getOrCreateWallet(supabase, user.id);
        result = {
          balance_tcep: wallet.balance_tcep,
          balance_tau: wallet.balance_tau,
          locked_balance: wallet.locked_balance,
          lifetime_earned: wallet.lifetime_earned,
          lifetime_spent: wallet.lifetime_spent,
        };
        break;
      }

      case "transfer": {
        if (!toUserId || !amount || !currency) {
          throw new Error("Faltan parámetros requeridos");
        }

        validateTransaction(amount, "transfer");

        const fromWallet = await getOrCreateWallet(supabase, user.id);
        const toWallet = await getOrCreateWallet(supabase, toUserId);

        // Check balance
        const balanceKey = currency === "TAU" ? "balance_tau" : "balance_tcep";
        if (fromWallet[balanceKey] < amount) {
          throw new Error("Saldo insuficiente");
        }

        // Execute transfer
        await supabase.from("wallets").update({
          [balanceKey]: fromWallet[balanceKey] - amount,
          lifetime_spent: fromWallet.lifetime_spent + amount,
        }).eq("id", fromWallet.id);

        await supabase.from("wallets").update({
          [balanceKey]: toWallet[balanceKey] + amount,
          lifetime_earned: toWallet.lifetime_earned + amount,
        }).eq("id", toWallet.id);

        // Record transaction
        await supabase.from("transactions").insert({
          wallet_id: fromWallet.id,
          type: "transfer",
          amount: -amount,
          currency,
          status: "completed",
          description: description || "Transferencia",
          reference_id: toUserId,
          metadata: { to_user: toUserId, ...metadata },
        });

        await supabase.from("transactions").insert({
          wallet_id: toWallet.id,
          type: "transfer",
          amount: amount,
          currency,
          status: "completed",
          description: description || "Recepción",
          reference_id: user.id,
          metadata: { from_user: user.id, ...metadata },
        });

        result = {
          message: "Transferencia exitosa",
          amount,
          currency,
          to_user: toUserId,
        };
        break;
      }

      case "reward": {
        if (!amount || !currency) {
          throw new Error("Faltan parámetros requeridos");
        }

        // Only admins can give rewards
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!profile || !["admin", "moderator"].includes(profile.role)) {
          throw new Error("No autorizado para dar recompensas");
        }

        const wallet = await getOrCreateWallet(supabase, user.id);

        await supabase.from("wallets").update({
          [currency === "TAU" ? "balance_tau" : "balance_tcep"]:
            wallet[currency === "TAU" ? "balance_tau" : "balance_tcep"] + amount,
          lifetime_earned: wallet.lifetime_earned + amount,
        }).eq("id", wallet.id);

        // Record reward transaction
        await supabase.from("transactions").insert({
          wallet_id: wallet.id,
          type: "reward",
          amount,
          currency,
          status: "completed",
          description: description || "Recompensa",
          metadata,
        });

        result = {
          message: "Recompensa aplicada",
          amount,
          currency,
        };
        break;
      }

      case "daily_login": {
        const wallet = await getOrCreateWallet(supabase, user.id);
        
        // Check if already claimed today
        const today = new Date().toISOString().split("T")[0];
        const { data: recentTransaction } = await supabase
          .from("transactions")
          .select("created_at")
          .eq("wallet_id", wallet.id)
          .eq("type", "reward")
          .eq("description", "Daily login bonus")
          .gte("created_at", today)
          .single();

        if (recentTransaction) {
          throw new Error("Ya has reclamación tu recompensa diaria");
        }

        const rewardAmount = REWARD_RATES.daily_login;

        await supabase.from("wallets").update({
          balance_tcep: wallet.balance_tcep + rewardAmount,
          lifetime_earned: wallet.lifetime_earned + rewardAmount,
        }).eq("id", wallet.id);

        await supabase.from("transactions").insert({
          wallet_id: wallet.id,
          type: "reward",
          amount: rewardAmount,
          currency: "TCEP",
          status: "completed",
          description: "Daily login bonus",
        });

        result = {
          message: "Recompensa diaria reclamada",
          amount: rewardAmount,
          currency: "TCEP",
        };
        break;
      }

      case "get_history": {
        const wallet = await getOrCreateWallet(supabase, user.id);
        
        const { data: transactions, error: txError } = await supabase
          .from("transactions")
          .select("*")
          .eq("wallet_id", wallet.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (txError) throw txError;

        result = { transactions };
        break;
      }

      case "stake": {
        if (!amount || amount <= 0) {
          throw new Error("Monto de staking inválido");
        }

        const wallet = await getOrCreateWallet(supabase, user.id);
        const balanceKey = "balance_tcep";

        if (wallet[balanceKey] < amount) {
          throw new Error("Saldo insuficiente para staking");
        }

        const newStakingAmount = wallet.staking_amount + amount;

        await supabase.from("wallets").update({
          [balanceKey]: wallet[balanceKey] - amount,
          staking_amount: newStakingAmount,
          staking_started_at: wallet.staking_started_at || new Date().toISOString(),
        }).eq("id", wallet.id);

        result = {
          message: "Staking exitoso",
          staked_amount: newStakingAmount,
        };
        break;
      }

      default:
        throw new Error("Acción no válida");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Wallet Service Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error de wallet" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
