import { supabase } from "@/integrations/supabase/client";
import { fetchSystemHealth } from "@/lib/omni-kernel/api-client";

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

  if (!data?.ok) {
    throw new Error(data?.error || "repo scanner failed");
  }

  return {
    scannedAt: data.scannedAt,
    targetUser: data.targetUser,
    summary: data.summary,
  };
}

export async function prefetchUnifiedApiInfo() {
  const { data, error } = await supabase.functions.invoke("tamv-unified-api", {
    body: { path: "/info", method: "GET" },
  });

  if (error) throw error;
  return data;
}
