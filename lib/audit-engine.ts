import type { AuditFormValues } from "@/lib/validations/audit-form";
import { estimateMonthlyCost, getPlan, resolveToolKey, TOOL_PRICING } from "@/lib/pricing";
import type { AuditResult, RecommendationType, SupportedToolKey, ToolRecommendation } from "@/types/audit-result";

const CONFIDENCE_FLOOR = 0.55;
const CONFIDENCE_CAP = 0.96;
const LOW_SPEND_PER_SEAT_THRESHOLD = 3;
const MAX_SAVINGS_RATIO = 0.8;

function roundCurrency(value: number): number {
  return Math.max(0, Math.round(value * 100) / 100);
}

function yearly(monthly: number): number {
  return roundCurrency(monthly * 12);
}

function normalizeSeats(seats: number): number {
  return Number.isFinite(seats) ? Math.max(1, Math.floor(seats)) : 1;
}

function normalizeTeamSize(teamSize: number): number {
  return Number.isFinite(teamSize) ? Math.max(1, Math.floor(teamSize)) : 1;
}

function normalizeSpend(spend: number): number {
  return Number.isFinite(spend) ? Math.max(0, spend) : 0;
}

function isLowSpendAnomaly(monthlySpend: number, seatCount: number): boolean {
  return seatCount > 0 && monthlySpend / seatCount < LOW_SPEND_PER_SEAT_THRESHOLD;
}

function clampSavings(savings: number, currentMonthlyCost: number): number {
  if (currentMonthlyCost <= 0) return 0;
  const capped = Math.min(savings, currentMonthlyCost * MAX_SAVINGS_RATIO);
  return roundCurrency(Math.max(0, capped));
}

function confidenceFromContext(seats: number, teamSize: number, measuredSpendGap: number): number {
  const usageSignal = Math.min(0.2, seats / Math.max(teamSize, 1) / 5);
  const costSignal = Math.min(0.16, measuredSpendGap / 120);
  return Math.min(CONFIDENCE_CAP, CONFIDENCE_FLOOR + usageSignal + costSignal);
}

function createRecommendation(input: {
  id: string;
  type: RecommendationType;
  title: string;
  currentPlan: string;
  recommendedPlan: string;
  reasoning: string;
  confidence: number;
  monthlySavings: number;
  badges: string[];
}): ToolRecommendation {
  const monthly = roundCurrency(input.monthlySavings);
  return {
    id: input.id,
    type: input.type,
    title: input.title,
    currentPlan: input.currentPlan,
    recommendedPlan: input.recommendedPlan,
    reasoning: input.reasoning,
    confidence: roundCurrency(input.confidence),
    savings: {
      monthly,
      annual: yearly(monthly)
    },
    badges: input.badges
  };
}

function resolveDowngrade(input: AuditFormValues, tool: SupportedToolKey): ToolRecommendation | null {
  const activePlan = getPlan(tool, input.plan);
  if (!activePlan) return null;

  const seatCount = normalizeSeats(input.seats);
  const teamSize = normalizeTeamSize(input.teamSize);
  const modeledCurrent = estimateMonthlyCost(tool, activePlan.key, seatCount);
  const measuredCurrent = Math.max(normalizeSpend(input.monthlySpend), modeledCurrent);
  if (isLowSpendAnomaly(measuredCurrent, seatCount)) return null;

  const proPlan = getPlan(tool, "pro") ?? getPlan(tool, "plus") ?? getPlan(tool, "individual");
  if (!proPlan) return null;

  if (activePlan.monthlyPerSeat <= proPlan.monthlyPerSeat) return null;

  const canDowngradeToPro = seatCount <= 2 || teamSize <= 4;
  if (!canDowngradeToPro) return null;

  const optimized = roundCurrency(proPlan.monthlyPerSeat * seatCount);
  const savings = clampSavings(measuredCurrent - optimized, measuredCurrent);
  if (savings <= 0) return null;

  return createRecommendation({
    id: `${tool}-downgrade`,
    type: "downgrade",
    title: `${TOOL_PRICING[tool].displayName}: move to ${proPlan.name}`,
    currentPlan: activePlan.name,
    recommendedPlan: proPlan.name,
    reasoning:
      "Your current seat count is low for a team-tier plan. A pro-grade plan keeps quality while removing management-tier overhead.",
    confidence: confidenceFromContext(seatCount, teamSize, savings),
    monthlySavings: savings,
    badges: ["Quick win", "Low migration effort"]
  });
}

function resolveAlternativeStack(input: AuditFormValues, tool: SupportedToolKey): ToolRecommendation | null {
  const seatCount = normalizeSeats(input.seats);
  const teamSize = normalizeTeamSize(input.teamSize);
  const activePlan = getPlan(tool, input.plan);
  const measuredCurrent = Math.max(
    normalizeSpend(input.monthlySpend),
    activePlan ? estimateMonthlyCost(tool, activePlan.key, seatCount) : normalizeSpend(input.monthlySpend)
  );
  if (isLowSpendAnomaly(measuredCurrent, seatCount)) return null;

  if (teamSize < 10 || seatCount < 8) return null;

  const cursorBusiness = estimateMonthlyCost("cursor", "business", seatCount);
  const chatgptTeam = estimateMonthlyCost("chatgpt", "team", Math.ceil(seatCount * 0.45));
  const blendedAlternative = roundCurrency(cursorBusiness + chatgptTeam);

  const savings = clampSavings(measuredCurrent - blendedAlternative, measuredCurrent);
  if (savings <= 0) return null;

  return createRecommendation({
    id: `${tool}-alternative-stack`,
    type: "alternative",
    title: "Large-team blended stack opportunity",
    currentPlan: activePlan?.name ?? "Current setup",
    recommendedPlan: "Cursor Business + ChatGPT Team (shared seats)",
    reasoning:
      "For large coding teams, a coding-first assistant plus shared general AI seats typically outperforms all-on-one premium subscriptions.",
    confidence: confidenceFromContext(seatCount, teamSize, savings),
    monthlySavings: savings,
    badges: ["Team strategy", "High impact"]
  });
}

function resolveOptimization(input: AuditFormValues, tool: SupportedToolKey): ToolRecommendation {
  const seatCount = normalizeSeats(input.seats);
  const teamSize = normalizeTeamSize(input.teamSize);
  const plans = TOOL_PRICING[tool].plans.filter((plan) => plan.monthlyPerSeat > 0);
  const cheapest = plans.reduce((best, current) => (current.monthlyPerSeat < best.monthlyPerSeat ? current : best), plans[0]);
  const measuredCurrent = Math.max(normalizeSpend(input.monthlySpend), estimateMonthlyCost(tool, input.plan, seatCount));
  const optimized = roundCurrency(cheapest.monthlyPerSeat * seatCount);
  const savings = isLowSpendAnomaly(measuredCurrent, seatCount) ? 0 : clampSavings(measuredCurrent - optimized, measuredCurrent);
  const fallbackReasoning =
    "Current spend appears already optimized for this seat profile. Focus on quarterly usage reviews and removing inactive seats to avoid drift.";
  const reasoning =
    savings > 0
      ? "Seat-level pricing indicates lower-cost plans can support your current team profile with limited operational tradeoffs."
      : fallbackReasoning;

  return createRecommendation({
    id: `${tool}-optimization`,
    type: "optimization",
    title: `${TOOL_PRICING[tool].displayName}: normalize to efficient seats`,
    currentPlan: getPlan(tool, input.plan)?.name ?? "Current setup",
    recommendedPlan: cheapest.name,
    reasoning,
    confidence: confidenceFromContext(seatCount, teamSize, savings),
    monthlySavings: savings,
    badges: savings > 0 ? ["Seat right-sizing"] : ["No urgent action"]
  });
}

export function generateAuditResult(input: AuditFormValues): AuditResult {
  const tool = resolveToolKey(input.aiTool);
  const recommendations: ToolRecommendation[] = [];

  const downgrade = resolveDowngrade(input, tool);
  if (downgrade) recommendations.push(downgrade);

  const alternative = resolveAlternativeStack(input, tool);
  if (alternative) recommendations.push(alternative);

  const optimization = resolveOptimization(input, tool);
  if (optimization.savings.monthly > 0) recommendations.push(optimization);

  const safeSeats = normalizeSeats(input.seats);
  const currentMonthlyCost = roundCurrency(Math.max(normalizeSpend(input.monthlySpend), estimateMonthlyCost(tool, input.plan, safeSeats)));
  const realizedSavings = recommendations.reduce((max, item) => Math.max(max, item.savings.monthly), 0);
  const optimizedMonthlyCost = roundCurrency(Math.max(0, currentMonthlyCost - realizedSavings));
  const totalSavingsMonthly = roundCurrency(Math.max(0, currentMonthlyCost - optimizedMonthlyCost));
  const averageConfidence =
    recommendations.length > 0
      ? roundCurrency(recommendations.reduce((sum, item) => sum + item.confidence, 0) / recommendations.length)
      : CONFIDENCE_FLOOR;

  return {
    tool,
    createdAt: new Date().toISOString(),
    summary: {
      currentMonthlyCost,
      optimizedMonthlyCost,
      totalSavings: {
        monthly: totalSavingsMonthly,
        annual: yearly(totalSavingsMonthly)
      },
      averageConfidence
    },
    recommendations: recommendations.length > 0 ? recommendations.sort((a, b) => b.savings.monthly - a.savings.monthly) : [optimization]
  };
}
