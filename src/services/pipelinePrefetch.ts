import { supabase } from "@/integrations/supabase/client";
import { fetchSystemHealth } from "@/lib/omni-kernel/api-client";

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tamv-unified-api`;

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

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Unified API error ${res.status}`);
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
  const { data, error } = await supabase.functions.invoke("github-repo-scanner", {
    body: { targetUser: "OsoPanda1", topRepos: 100, includePlan: true },
  });
  if (error) throw error;
  if (!data?.ok) throw new Error(data?.error || "repo scanner failed");

  return { scannedAt: data.scannedAt, targetUser: data.targetUser, summary: data.summary, topRepos: data.topRepos, absorptionPlan: data.absorptionPlan };
}

export async function prefetchDAOProposals() {
  return unifiedApiGet("/dao/proposals");
}

export async function prefetchWalletTransactions() {
  return unifiedApiGet("/economy/transactions");
}

export async function prefetchMSREvents() {
  return unifiedApiGet("/msr/events");
}

export async function prefetchSentinelStatus() {
  return unifiedApiGet("/sentinel/status");
}
