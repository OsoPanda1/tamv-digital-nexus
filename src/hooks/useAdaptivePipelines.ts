import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ParallelPipelineOrchestrator,
  PipelineSection,
  sectionFromPathname,
  PipelineTask,
} from "@/systems/ParallelPipelineOrchestrator";

const buildTasks = (section: PipelineSection, queryClient: ReturnType<typeof useQueryClient>): { primary: PipelineTask[]; secondary: PipelineTask[] } => {
  const warm = (key: string) => async () => {
    await queryClient.prefetchQuery({
      queryKey: ["tamv", "warm", key],
      queryFn: async () => ({ key, warmedAt: new Date().toISOString() }),
      staleTime: 1000 * 60 * 4,
    });
  };

  const globalSecondary: PipelineTask[] = [
    { id: "federated-health", section: "other", run: warm("federated-health") },
    { id: "repo-priority-cache", section: "repo-unification", run: warm("repo-priority-cache") },
  ];

  const sectionPrimary: Record<PipelineSection, PipelineTask[]> = {
    home: [{ id: "home-feed", section: "home", run: warm("home-feed") }],
    dashboard: [{ id: "dashboard-kpi", section: "dashboard", run: warm("dashboard-kpi") }],
    community: [{ id: "social-presence", section: "community", run: warm("social-presence") }],
    isabella: [{ id: "isabella-context", section: "isabella", run: warm("isabella-context") }],
    economy: [{ id: "economy-prices", section: "economy", run: warm("economy-prices") }],
    governance: [{ id: "governance-votes", section: "governance", run: warm("governance-votes") }],
    "repo-unification": [{ id: "repo-wave-status", section: "repo-unification", run: warm("repo-wave-status") }],
    other: [{ id: "baseline-context", section: "other", run: warm("baseline-context") }],
  };

  return {
    primary: sectionPrimary[section],
    secondary: globalSecondary,
  };
};

export const useAdaptivePipelines = () => {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const orchestrator = useMemo(() => new ParallelPipelineOrchestrator(), []);

  useEffect(() => {
    const section = sectionFromPathname(pathname);
    const { primary, secondary } = buildTasks(section, queryClient);

    orchestrator.runPrimary(primary).catch(() => undefined);
    orchestrator.runSecondary(secondary);
  }, [orchestrator, pathname, queryClient]);
};
