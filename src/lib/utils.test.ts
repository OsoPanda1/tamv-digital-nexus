import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn utility", () => {
  it("joins plain tailwind classes", () => {
    expect(cn("px-2", "py-1", "text-sm")).toBe("px-2 py-1 text-sm");
    expect(cn("px-2", "py-1", "text-sm")).toContain("text-sm");
  });

  it("resolves conflicting classes via tailwind-merge", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("supports quantum options object", () => {
    const result = cn({
      theme: "quantum",
      state: "active",
      effect: ["glow"],
      extra: ["custom-class"],
    });

    expect(result).toContain("custom-class");
    expect(result).toContain("animate-pulse-glow");
  });
});
