import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ParallelPipelineOrchestrator,
  PipelineSection,
  sectionFromPathname,
  PipelineTask,
} from "@/systems/ParallelPipelineOrchestrator";
import {
  prefetchDAOProposals,
  prefetchDashboardSummary,
  prefetchMSREvents,
  prefetchRepoUnificationSummary,
  prefetchSentinelStatus,
  prefetchSystemHealth,
  prefetchWalletTransactions,
} from "@/services/pipelinePrefetch";

type MembershipTier = "free" | "starter" | "pro" | "business" | "enterprise" | "custom";

const CONCURRENCY_BUDGET: Record<MembershipTier, { primary: number; secondary: number }> = {
  free: { primary: 1, secondary: 1 },
  starter: { primary: 2, secondary: 1 },
  pro: { primary: 2, secondary: 1 },
  business: { primary: 3, secondary: 2 },
  enterprise: { primary: 4, secondary: 2 },
  custom: { primary: 4, secondary: 3 },
};

const getTier = (): MembershipTier => {
  const raw = (localStorage.getItem("tamv.membershipTier") || "free").toLowerCase();
  if (["free", "starter", "pro", "business", "enterprise", "custom"].includes(raw)) {
    return raw as MembershipTier;
  }
  return "free";
};

const safeTask = (id: string, section: PipelineSection, run: () => Promise<unknown>): PipelineTask => ({
  id,
  section,
  run: async () => {
    await run();
  },
});

const buildTasks = (
  section: PipelineSection,
  queryClient: ReturnType<typeof useQueryClient>
): { primary: PipelineTask[]; secondary: PipelineTask[] } => {
  const globalSecondary: PipelineTask[] = [
    safeTask("system-health", "other", () => queryClient.prefetchQuery({ queryKey: ["tamv", "health", "system"], queryFn: prefetchSystemHealth, staleTime: 60_000 })),
    safeTask("sentinel-status", "other", () => queryClient.prefetchQuery({ queryKey: ["tamv", "sentinel", "status"], queryFn: prefetchSentinelStatus, staleTime: 60_000 })),
    safeTask("msr-events", "other", () => queryClient.prefetchQuery({ queryKey: ["tamv", "msr", "events"], queryFn: prefetchMSREvents, staleTime: 45_000 })),
  ];

  const sectionPrimary: Record<PipelineSection, PipelineTask[]> = {
    home: [safeTask("home-health", "home", () => queryClient.prefetchQuery({ queryKey: ["tamv", "health", "system"], queryFn: prefetchSystemHealth, staleTime: 60_000 }))],
    dashboard: [
      safeTask("dashboard-metrics", "dashboard", () => queryClient.prefetchQuery({ queryKey: ["tamv", "dashboard", "summary"], queryFn: prefetchDashboardSummary, staleTime: 30_000 })),
      safeTask("dashboard-sentinel", "dashboard", () => queryClient.prefetchQuery({ queryKey: ["tamv", "sentinel", "status"], queryFn: prefetchSentinelStatus, staleTime: 60_000 })),
    ],
    community: [safeTask("community-msr", "community", () => queryClient.prefetchQuery({ queryKey: ["tamv", "msr", "events"], queryFn: prefetchMSREvents, staleTime: 45_000 }))],
    isabella: [safeTask("isabella-health", "isabella", () => queryClient.prefetchQuery({ queryKey: ["tamv", "health", "system"], queryFn: prefetchSystemHealth, staleTime: 60_000 }))],
    economy: [
      safeTask("economy-wallet-transactions", "economy", () => queryClient.prefetchQuery({ queryKey: ["tamv", "economy", "transactions"], queryFn: prefetchWalletTransactions, staleTime: 15_000 })),
      safeTask("economy-dashboard", "economy", () => queryClient.prefetchQuery({ queryKey: ["tamv", "dashboard", "summary"], queryFn: prefetchDashboardSummary, staleTime: 30_000 })),
    ],
    governance: [
      // Hybrid DAO guardrail: only transparent/auditable proposals are prefetched.
      // Economic policy and core algorithm governance stay outside DAO control by canon.
      safeTask("governance-dao-proposals", "governance", () => queryClient.prefetchQuery({ queryKey: ["tamv", "dao", "proposals"], queryFn: prefetchDAOProposals, staleTime: 30_000 })),
      safeTask("governance-msr-audit", "governance", () => queryClient.prefetchQuery({ queryKey: ["tamv", "msr", "events"], queryFn: prefetchMSREvents, staleTime: 45_000 })),
    ],
    "repo-unification": [safeTask("repo-wave-status", "repo-unification", () => queryClient.prefetchQuery({ queryKey: ["tamv", "repo", "summary"], queryFn: prefetchRepoUnificationSummary, staleTime: 300_000 }))],
    other: [],
  };

  return { primary: sectionPrimary[section], secondary: globalSecondary };
};

export const useAdaptivePipelines = () => {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const orchestrator = useMemo(() => new ParallelPipelineOrchestrator(), []);

  useEffect(() => {
    const section = sectionFromPathname(pathname);
    const { primary, secondary } = buildTasks(section, queryClient);
    const tier = getTier();
    const budget = CONCURRENCY_BUDGET[tier];

    orchestrator.runPrimary(primary, budget.primary).catch(() => undefined);
    orchestrator.runSecondary(secondary, budget.secondary);
  }, [orchestrator, pathname, queryClient]);
};
