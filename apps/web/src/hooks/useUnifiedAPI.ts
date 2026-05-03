// ============================================================================
// TAMV MD-X4™ — Unified API Client Hook
// Connects frontend to tamv-unified-api edge function endpoints
// ============================================================================

import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tamv-unified-api`;

async function apiCall<T = any>(path: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<T> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // The unified API uses path routing: we pass the path in a special header
  // since edge functions receive a single URL. We encode path in the body.
  const res = await fetch(API_BASE + path, {
    method,
    headers,
    ...(method !== 'GET' && body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API Error ${res.status}`);
  return data;
}

// ── Identity ──
export function useIdentity() {
  return useQuery({
    queryKey: ['tamv', 'identity'],
    queryFn: () => apiCall('/id/me'),
    retry: 1,
    staleTime: 60_000,
  });
}

export function useDignityScore() {
  return useQuery({
    queryKey: ['tamv', 'dignity'],
    queryFn: () => apiCall('/id/dignity'),
    retry: 1,
    staleTime: 30_000,
  });
}

// ── Governance ──
export function useGovernanceRoles() {
  return useQuery({
    queryKey: ['tamv', 'governance', 'roles'],
    queryFn: () => apiCall('/governance/roles'),
    retry: 1,
  });
}

// ── DAO ──
export function useDAOProposals() {
  return useQuery({
    queryKey: ['tamv', 'dao', 'proposals'],
    queryFn: () => apiCall('/dao/proposals'),
    staleTime: 30_000,
  });
}

export function useCreateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (proposal: { title: string; description: string; category?: string; impact_economic?: number }) =>
      apiCall('/dao/proposals', 'POST', proposal),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tamv', 'dao'] }),
  });
}

export function useCastVote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vote: { proposal_id: string; vote: boolean; reason?: string }) =>
      apiCall('/dao/vote', 'POST', vote),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tamv', 'dao'] }),
  });
}

// ── Economy ──
export function useTCEPWallet() {
  return useQuery({
    queryKey: ['tamv', 'economy', 'wallet'],
    queryFn: () => apiCall('/economy/wallet'),
    retry: 1,
    staleTime: 15_000,
  });
}

export function useTCEPTransactions() {
  return useQuery({
    queryKey: ['tamv', 'economy', 'transactions'],
    queryFn: () => apiCall('/economy/transactions'),
    staleTime: 15_000,
  });
}

export function useTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tx: { to_user_id: string; amount: number; description?: string }) =>
      apiCall('/economy/transfer', 'POST', tx),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tamv', 'economy'] });
    },
  });
}

export function useCommissionCalculator() {
  return useCallback(
    (membershipLevel: string, amount: number) =>
      apiCall('/economy/commission/calculate', 'POST', { membership_level: membershipLevel, amount }),
    []
  );
}

// ── Lottery ──
export function useActiveLotteryDraws() {
  return useQuery({
    queryKey: ['tamv', 'lottery', 'active'],
    queryFn: () => apiCall('/economy/lottery/active'),
    staleTime: 60_000,
  });
}

export function usePurchaseLotteryTickets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (purchase: { draw_id: string; quantity: number }) =>
      apiCall('/economy/lottery/purchase', 'POST', purchase),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tamv', 'lottery'] }),
  });
}

// ── MSR ──
export function useMSREvents() {
  return useQuery({
    queryKey: ['tamv', 'msr', 'events'],
    queryFn: () => apiCall('/msr/events'),
    staleTime: 30_000,
  });
}

export function useLogMSREvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (event: { action: string; domain?: string; payload?: any; severity?: string }) =>
      apiCall('/msr/log', 'POST', event),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tamv', 'msr'] }),
  });
}

// ── Sentinel ──
export function useSentinelStatus() {
  return useQuery({
    queryKey: ['tamv', 'sentinel'],
    queryFn: () => apiCall('/sentinel/status'),
    staleTime: 60_000,
  });
}

// ── Fenix Fund ──
export function useFenixFundStatus() {
  return useQuery({
    queryKey: ['tamv', 'fenix'],
    queryFn: () => apiCall('/economy/fenix/status'),
    staleTime: 120_000,
  });
}

// ── API Info ──
export function useAPIInfo() {
  return useQuery({
    queryKey: ['tamv', 'api', 'info'],
    queryFn: () => apiCall('/info'),
    staleTime: 300_000,
  });
}
