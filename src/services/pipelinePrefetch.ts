import { supabase } from "@/integrations/supabase/client";
import { fetchSystemHealth } from "@/lib/omni-kernel/api-client";

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tamv-unified-api`;

function isUnauthorizedError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes("unauthorized") || message.includes("401") || message.includes("authentication required");
}

async function unifiedApiGet<T>(path: string): Promise<T> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;

  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || json.message || `Unified API error ${res.status}`);
  return json;
}

export async function prefetchSystemHealth() {
  return fetchSystemHealth();
}

export async function prefetchDashboardSummary() {
  const { data, error } = await supabase.functions.invoke("dashboard-metrics", {
    body: { action: "summary" },
  });

  if (error) throw error;
  return data;
}

export async function prefetchRepoUnificationSummary() {
  const { data, error } = await supabase.functions.invoke("github-repo-scanner");
  if (error) throw error;
  if (!data?.ok) throw new Error(data?.error || "repo scanner failed");

  return { scannedAt: data.scannedAt, targetUser: data.targetUser, summary: data.summary };
}

export async function prefetchDAOProposals() {
  try {
    return await unifiedApiGet("/dao/proposals");
  } catch (error) {
    if (isUnauthorizedError(error)) return { proposals: [] };
    throw error;
  }
}

export async function prefetchWalletTransactions() {
  try {
    return await unifiedApiGet("/economy/transactions");
  } catch (error) {
    if (isUnauthorizedError(error)) return { transactions: [] };
    throw error;
  }
}

export async function prefetchMSREvents() {
  try {
    return await unifiedApiGet("/msr/events");
  } catch (error) {
    if (isUnauthorizedError(error)) return { events: [] };
    throw error;
  }
}

export async function prefetchSentinelStatus() {
  try {
    return await unifiedApiGet("/sentinel/status");
  } catch (error) {
    if (isUnauthorizedError(error)) return { status: "unauthorized", alerts: [] };
    throw error;
  }
}
