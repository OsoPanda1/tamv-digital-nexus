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
  prefetchDashboardSummary,
  prefetchRepoUnificationSummary,
  prefetchSystemHealth,
} from "@/services/pipelinePrefetch";

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
    safeTask("system-health", "other", () =>
      queryClient.prefetchQuery({
        queryKey: ["tamv", "health", "system"],
        queryFn: prefetchSystemHealth,
        staleTime: 1000 * 60,
      })
    ),
  ];

  const sectionPrimary: Record<PipelineSection, PipelineTask[]> = {
    home: [
      safeTask("home-health", "home", () =>
        queryClient.prefetchQuery({
          queryKey: ["tamv", "health", "system"],
          queryFn: prefetchSystemHealth,
          staleTime: 1000 * 60,
        })
      ),
    ],
    dashboard: [
      safeTask("dashboard-metrics", "dashboard", () =>
        queryClient.prefetchQuery({
          queryKey: ["tamv", "dashboard", "summary"],
          queryFn: prefetchDashboardSummary,
          staleTime: 1000 * 30,
        })
      ),
    ],
    community: [
      safeTask("community-health", "community", () =>
        queryClient.prefetchQuery({
          queryKey: ["tamv", "health", "system"],
          queryFn: prefetchSystemHealth,
          staleTime: 1000 * 60,
        })
      ),
    ],
    isabella: [
      safeTask("isabella-health", "isabella", () =>
        queryClient.prefetchQuery({
          queryKey: ["tamv", "health", "system"],
          queryFn: prefetchSystemHealth,
          staleTime: 1000 * 60,
        })
      ),
    ],
    economy: [
      safeTask("economy-dashboard", "economy", () =>
        queryClient.prefetchQuery({
          queryKey: ["tamv", "dashboard", "summary"],
          queryFn: prefetchDashboardSummary,
          staleTime: 1000 * 30,
        })
      ),
    ],
    governance: [
      safeTask("governance-health", "governance", () =>
        queryClient.prefetchQuery({
          queryKey: ["tamv", "health", "system"],
          queryFn: prefetchSystemHealth,
          staleTime: 1000 * 60,
        })
      ),
    ],
    "repo-unification": [
      safeTask("repo-wave-status", "repo-unification", () =>
        queryClient.prefetchQuery({
          queryKey: ["tamv", "repo", "summary"],
          queryFn: prefetchRepoUnificationSummary,
          staleTime: 1000 * 60 * 5,
        })
      ),
    ],
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

    orchestrator.runPrimary(primary).catch(() => undefined);
    orchestrator.runSecondary(secondary);
  }, [orchestrator, pathname, queryClient]);
};
