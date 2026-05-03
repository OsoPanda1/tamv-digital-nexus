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

async function runWithConcurrency(tasks: PipelineTask[], maxConcurrent: number): Promise<void> {
  const queue = [...tasks];

  const workers = Array.from({ length: Math.max(1, maxConcurrent) }, async () => {
    while (queue.length) {
      const task = queue.shift();
      if (!task) return;
      await task.run();
    }
  });

  await Promise.all(workers);
}

export class ParallelPipelineOrchestrator {
  private isSecondaryRunning = false;

  async runPrimary(tasks: PipelineTask[], maxConcurrent = 2): Promise<void> {
    await runWithConcurrency(tasks, maxConcurrent);
  }

  runSecondary(tasks: PipelineTask[], maxConcurrent = 1): void {
    if (this.isSecondaryRunning) return;
    this.isSecondaryRunning = true;

    idle(async () => {
      try {
        await runWithConcurrency(tasks, maxConcurrent);
      } finally {
        this.isSecondaryRunning = false;
      }
    });
  }
}

export const sectionFromPathname = (pathname: string): PipelineSection => {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/isabella")) return "isabella";
  if (pathname.startsWith("/economy") || pathname.startsWith("/marketplace")) return "economy";
  if (pathname.startsWith("/governance") || pathname.startsWith("/territory")) return "governance";
  if (pathname.startsWith("/community") || pathname.startsWith("/realito") || pathname.startsWith("/routes")) return "community";
  if (pathname.startsWith("/repo-unification")) return "repo-unification";

  return "other";
};
