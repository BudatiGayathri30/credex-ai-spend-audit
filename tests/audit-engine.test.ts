import { describe, expect, it } from "vitest";

import { generateAuditResult } from "@/lib/audit-engine";
import type { AuditFormValues } from "@/lib/validations/audit-form";

function buildInput(overrides: Partial<AuditFormValues> = {}): AuditFormValues {
  return {
    aiTool: "chatgpt",
    plan: "team",
    monthlySpend: 300,
    seats: 10,
    teamSize: 14,
    useCase: "Engineering and product documentation support.",
    ...overrides
  };
}

describe("generateAuditResult", () => {
  it("calculates monthly and annual savings consistently", () => {
    const result = generateAuditResult(buildInput());

    expect(result.summary.currentMonthlyCost).toBe(300);
    expect(result.summary.optimizedMonthlyCost).toBe(200);
    expect(result.summary.totalSavings.monthly).toBe(100);
    expect(result.summary.totalSavings.annual).toBe(1200);
  });

  it("applies downgrade logic for low-seat premium plans", () => {
    const result = generateAuditResult(
      buildInput({
        aiTool: "cursor",
        plan: "business",
        monthlySpend: 80,
        seats: 2,
        teamSize: 3
      })
    );

    const downgrade = result.recommendations.find((item) => item.type === "downgrade");
    expect(downgrade).toBeDefined();
    expect(downgrade?.recommendedPlan).toBe("Pro");
    expect(downgrade?.savings.monthly).toBe(40);
  });

  it("adds alternative recommendation for large teams", () => {
    const result = generateAuditResult(
      buildInput({
        aiTool: "claude",
        plan: "team",
        monthlySpend: 1200,
        seats: 15,
        teamSize: 30
      })
    );

    const alternative = result.recommendations.find((item) => item.type === "alternative");
    expect(alternative).toBeDefined();
    expect(alternative?.recommendedPlan).toContain("Cursor Business");
    expect(alternative?.savings.monthly).toBeGreaterThan(0);
  });

  it("keeps confidence scores inside floor and cap", () => {
    const result = generateAuditResult(
      buildInput({
        aiTool: "claude",
        plan: "team",
        monthlySpend: 3000,
        seats: 50,
        teamSize: 60
      })
    );

    for (const recommendation of result.recommendations) {
      expect(recommendation.confidence).toBeGreaterThanOrEqual(0.55);
      expect(recommendation.confidence).toBeLessThanOrEqual(0.96);
    }
  });

  it("handles zero-seat input safely and returns fallback messaging", () => {
    const result = generateAuditResult(
      buildInput({
        aiTool: "cursor",
        plan: "pro",
        monthlySpend: 0,
        seats: 0 as unknown as number,
        teamSize: 0 as unknown as number
      })
    );

    expect(result.summary.currentMonthlyCost).toBe(20);
    expect(result.summary.totalSavings.monthly).toBe(0);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].reasoning).toContain("already optimized");
  });

  it("suppresses aggressive savings for low-spend anomalies", () => {
    const result = generateAuditResult(
      buildInput({
        aiTool: "chatgpt",
        plan: "free",
        seats: 20,
        teamSize: 30,
        monthlySpend: 20
      })
    );

    expect(result.summary.totalSavings.monthly).toBe(0);
    expect(result.recommendations[0].type).toBe("optimization");
    expect(result.recommendations[0].badges).toContain("No urgent action");
  });
});
