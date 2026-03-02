// ============================================================================
// TAMV Wallet Hook - Manages wallet and transactions
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Wallet {
  balance_tcep: number;
  balance_tau: number;
  locked_balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  created_at: string;
  metadata: any;
}

interface UseWalletReturn {
  wallet: Wallet | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  transfer: (toUserId: string, amount: number, currency: "TCEP" | "TAU", description?: string) => Promise<boolean>;
  claimDailyReward: () => Promise<boolean>;
  stake: (amount: number) => Promise<boolean>;
  getHistory: () => Promise<void>;
}

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setWallet(null);
        return;
      }

      // Get or create wallet via edge function
      const response = await fetch(`${SUPABASE_URL}/functions/v1/wallet-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ action: "get_balance" }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al obtener wallet");
      }

      const data = await response.json();
      setWallet(data);
    } catch (err: any) {
      console.error("Wallet fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [SUPABASE_URL, SUPABASE_KEY]);

  const refresh = useCallback(async () => {
    await fetchWallet();
  }, [fetchWallet]);

  const transfer = useCallback(async (
    toUserId: string,
    amount: number,
    currency: "TCEP" | "TAU",
    description?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${SUPABASE_URL}/functions/v1/wallet-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          action: "transfer",
          toUserId,
          amount,
          currency,
          description,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error en transferencia");
      }

      const data = await response.json();
      toast.success(`Transferencia exitosa: ${amount} ${currency}`);
      
      // Refresh wallet
      await fetchWallet();
      
      return true;
    } catch (err: any) {
      console.error("Transfer error:", err);
      setError(err.message);
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [SUPABASE_URL, SUPABASE_KEY, fetchWallet]);

  const claimDailyReward = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${SUPABASE_URL}/functions/v1/wallet-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ action: "daily_login" }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al reclamar recompensa");
      }

      const data = await response.json();
      toast.success(`¡Recompensa diaria reclamada: ${data.amount} TCEP!`);
      
      await fetchWallet();
      
      return true;
    } catch (err: any) {
      console.error("Daily reward error:", err);
      setError(err.message);
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [SUPABASE_URL, SUPABASE_KEY, fetchWallet]);

  const stake = useCallback(async (amount: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${SUPABASE_URL}/functions/v1/wallet-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ action: "stake", amount }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error en staking");
      }

      toast.success("Staking exitoso");
      await fetchWallet();
      
      return true;
    } catch (err: any) {
      console.error("Stake error:", err);
      setError(err.message);
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [SUPABASE_URL, SUPABASE_KEY, fetchWallet]);

  const getHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${SUPABASE_URL}/functions/v1/wallet-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ action: "get_history" }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al obtener historial");
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err: any) {
      console.error("History error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [SUPABASE_URL, SUPABASE_KEY]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return {
    wallet,
    transactions,
    loading,
    error,
    refresh,
    transfer,
    claimDailyReward,
    stake,
    getHistory,
  };
}

export default useWallet;
