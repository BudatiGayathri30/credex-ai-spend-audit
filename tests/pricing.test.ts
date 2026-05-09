import { describe, expect, it } from "vitest";

import { estimateMonthlyCost, getPlan, resolveToolKey, TOOL_PRICING } from "@/lib/pricing";

describe("pricing helpers", () => {
  it("resolves tool aliases to canonical keys", () => {
    expect(resolveToolKey("GitHub Copilot")).toBe("copilot");
    expect(resolveToolKey("v0")).toBe("windsurf");
    expect(resolveToolKey("unknown-tool")).toBe("chatgpt");
  });

  it("resolves plans by key or display name", () => {
    expect(getPlan("chatgpt", "plus")?.monthlyPerSeat).toBe(20);
    expect(getPlan("chatgpt", "Team")?.key).toBe("team");
    expect(getPlan("chatgpt", "non-existent")).toBeUndefined();
  });

  it("estimates monthly costs with per-seat math", () => {
    expect(estimateMonthlyCost("cursor", "business", 5)).toBe(200);
    expect(estimateMonthlyCost("copilot", "individual", 3)).toBe(30);
  });

  it("keeps all supported tools with at least one paid plan", () => {
    for (const tool of Object.values(TOOL_PRICING)) {
      const paidPlan = tool.plans.find((plan) => plan.monthlyPerSeat > 0);
      expect(paidPlan, `${tool.displayName} missing paid plan`).toBeDefined();
    }
  });
});
