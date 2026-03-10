// ============================================================================
// TAMV MD-X4™ — Hook: Live Ecosystem Metrics from Supabase
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { fetchEcosystemMetrics, fetchRecentActivity, fetchFederationHealth } from "@/lib/tamv-ecosystem";

export function useEcosystemMetrics() {
  return useQuery({
    queryKey: ["tamv-ecosystem-metrics"],
    queryFn: fetchEcosystemMetrics,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useRecentActivity(limit = 10) {
  return useQuery({
    queryKey: ["tamv-recent-activity", limit],
    queryFn: () => fetchRecentActivity(limit),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useFederationHealth() {
  return useQuery({
    queryKey: ["tamv-federation-health"],
    queryFn: fetchFederationHealth,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
