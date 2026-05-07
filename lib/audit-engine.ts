import type { AuditFormValues } from "@/lib/validations/audit-form";
import { estimateMonthlyCost, getPlan, resolveToolKey, TOOL_PRICING } from "@/lib/pricing";
import type { AuditResult, RecommendationType, SupportedToolKey, ToolRecommendation } from "@/types/audit-result";

const CONFIDENCE_FLOOR = 0.55;
const CONFIDENCE_CAP = 0.96;

function roundCurrency(value: number): number {
  return Math.max(0, Math.round(value * 100) / 100);
}

function yearly(monthly: number): number {
  return roundCurrency(monthly * 12);
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

  const seatCount = Math.max(1, input.seats);
  const modeledCurrent = estimateMonthlyCost(tool, activePlan.key, seatCount);
  const measuredCurrent = Math.max(input.monthlySpend, modeledCurrent);

  const proPlan = getPlan(tool, "pro") ?? getPlan(tool, "plus") ?? getPlan(tool, "individual");
  if (!proPlan) return null;

  if (activePlan.monthlyPerSeat <= proPlan.monthlyPerSeat) return null;

  const canDowngradeToPro = seatCount <= 2 || input.teamSize <= 4;
  if (!canDowngradeToPro) return null;

  const optimized = roundCurrency(proPlan.monthlyPerSeat * seatCount);
  const savings = measuredCurrent - optimized;
  if (savings <= 0) return null;

  return createRecommendation({
    id: `${tool}-downgrade`,
    type: "downgrade",
    title: `${TOOL_PRICING[tool].displayName}: move to ${proPlan.name}`,
    currentPlan: activePlan.name,
    recommendedPlan: proPlan.name,
    reasoning:
      "Your current seat count is low for a team-tier plan. A pro-grade plan keeps quality while removing management-tier overhead.",
    confidence: confidenceFromContext(seatCount, input.teamSize, savings),
    monthlySavings: savings,
    badges: ["Quick win", "Low migration effort"]
  });
}

function resolveAlternativeStack(input: AuditFormValues, tool: SupportedToolKey): ToolRecommendation | null {
  const seatCount = Math.max(1, input.seats);
  const teamSize = Math.max(1, input.teamSize);
  const activePlan = getPlan(tool, input.plan);
  const measuredCurrent = Math.max(input.monthlySpend, activePlan ? estimateMonthlyCost(tool, activePlan.key, seatCount) : input.monthlySpend);

  if (teamSize < 10 || seatCount < 8) return null;

  const cursorBusiness = estimateMonthlyCost("cursor", "business", seatCount);
  const chatgptTeam = estimateMonthlyCost("chatgpt", "team", Math.ceil(seatCount * 0.45));
  const blendedAlternative = roundCurrency(cursorBusiness + chatgptTeam);

  const savings = measuredCurrent - blendedAlternative;
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
  const seatCount = Math.max(1, input.seats);
  const plans = TOOL_PRICING[tool].plans.filter((plan) => plan.monthlyPerSeat > 0);
  const cheapest = plans.reduce((best, current) => (current.monthlyPerSeat < best.monthlyPerSeat ? current : best), plans[0]);
  const measuredCurrent = Math.max(input.monthlySpend, estimateMonthlyCost(tool, input.plan, seatCount));
  const optimized = roundCurrency(cheapest.monthlyPerSeat * seatCount);

  return createRecommendation({
    id: `${tool}-optimization`,
    type: "optimization",
    title: `${TOOL_PRICING[tool].displayName}: normalize to efficient seats`,
    currentPlan: getPlan(tool, input.plan)?.name ?? "Current setup",
    recommendedPlan: cheapest.name,
    reasoning: "Seat-level pricing indicates lower-cost plans can support your current team profile with limited operational tradeoffs.",
    confidence: confidenceFromContext(seatCount, input.teamSize, measuredCurrent - optimized),
    monthlySavings: Math.max(0, measuredCurrent - optimized),
    badges: ["Seat right-sizing"]
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

  const currentMonthlyCost = roundCurrency(Math.max(input.monthlySpend, estimateMonthlyCost(tool, input.plan, input.seats)));
  const optimizedMonthlyCost = roundCurrency(
    recommendations.length > 0
      ? Math.max(0, currentMonthlyCost - recommendations.reduce((sum, item) => sum + item.savings.monthly, 0))
      : currentMonthlyCost
  );
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
    recommendations: recommendations.sort((a, b) => b.savings.monthly - a.savings.monthly)
  };
}
