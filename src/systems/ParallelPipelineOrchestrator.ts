export type PipelineSection =
  | "home"
  | "dashboard"
  | "community"
  | "isabella"
  | "economy"
  | "governance"
  | "repo-unification"
  | "other";

export interface PipelineTask {
  id: string;
  section: PipelineSection;
  run: () => Promise<void>;
}

const idle = (cb: () => void) => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    (window as Window & { requestIdleCallback: (fn: () => void) => number }).requestIdleCallback(cb);
    return;
  }

  setTimeout(cb, 32);
};

export class ParallelPipelineOrchestrator {
  private isSecondaryRunning = false;

  async runPrimary(tasks: PipelineTask[]): Promise<void> {
    await Promise.all(tasks.map((task) => task.run()));
  }

  runSecondary(tasks: PipelineTask[]): void {
    if (this.isSecondaryRunning) return;
    this.isSecondaryRunning = true;

    idle(async () => {
      try {
        for (const task of tasks) {
          await task.run();
        }
      } finally {
        this.isSecondaryRunning = false;
      }
    });
  }
}

export const sectionFromPathname = (pathname: string): PipelineSection => {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/community")) return "community";
  if (pathname.startsWith("/isabella")) return "isabella";
  if (pathname.startsWith("/economy")) return "economy";
  if (pathname.startsWith("/governance")) return "governance";
  if (pathname.startsWith("/repo-unification")) return "repo-unification";

  return "other";
};
