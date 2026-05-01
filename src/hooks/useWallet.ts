// ============================================================================
// TAMV Wallet Hook v2 — Uses proper auth tokens & tcep_wallets
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WalletData {
  balance_tcep: number;
  balance_locked: number;
  lifetime_earned: number;
  lifetime_spent: number;
  membership_tier: string;
  commission_rate: number;
}

interface Transaction {
  id: string;
  from_user_id: string | null;
  to_user_id: string | null;
  amount: number;
  tx_type: string;
  description: string | null;
  evidence_hash: string | null;
  created_at: string;
}

async function callWalletService(action: string, extra: Record<string, unknown> = {}) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("No autenticado");

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wallet-service`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ action, ...extra }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setWallet(null); setLoading(false); return; }

      const data = await callWalletService("get_balance");
      setWallet(data);
    } catch (err: any) {
      console.error("Wallet fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const transfer = useCallback(async (
    toUserId: string, amount: number, _currency: "TCEP" | "TAU" = "TCEP", description?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await callWalletService("transfer", { toUserId, amount, description });
      toast.success(`Transferencia exitosa: ${amount} TCEP`);
      await fetchWallet();
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchWallet]);

  const claimDailyReward = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const data = await callWalletService("daily_login");
      toast.success(`¡Recompensa diaria: ${data.amount} TCEP!`);
      await fetchWallet();
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchWallet]);

  const getHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await callWalletService("get_history");
      setTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWallet(); }, [fetchWallet]);

  return {
    wallet, transactions, loading, error,
    refresh: fetchWallet, transfer, claimDailyReward,
    stake: async (_amount: number) => { toast.info("Staking próximamente"); return false; },
    getHistory,
  };
}

export default useWallet;
