import type { SupportedToolKey } from "@/types/audit-result";

export interface PricingPlan {
  key: string;
  name: string;
  monthlyBase: number;
  monthlyPerSeat: number;
  maxSeats?: number;
  bestFor: string;
}

export interface ToolPricing {
  key: SupportedToolKey;
  displayName: string;
  category: "coding" | "assistant" | "general";
  plans: PricingPlan[];
  metadata: {
    notes: string;
    billingModel: "per-seat" | "hybrid";
  };
}

export const TOOL_PRICING: Record<SupportedToolKey, ToolPricing> = {
  cursor: {
    key: "cursor",
    displayName: "Cursor",
    category: "coding",
    plans: [
      { key: "free", name: "Free", monthlyBase: 0, monthlyPerSeat: 0, maxSeats: 1, bestFor: "Individual trial" },
      { key: "pro", name: "Pro", monthlyBase: 0, monthlyPerSeat: 20, bestFor: "Power users and solo builders" },
      { key: "business", name: "Business", monthlyBase: 0, monthlyPerSeat: 40, bestFor: "Teams with policy controls" }
    ],
    metadata: { notes: "Business includes admin and governance controls.", billingModel: "per-seat" }
  },
  copilot: {
    key: "copilot",
    displayName: "GitHub Copilot",
    category: "coding",
    plans: [
      { key: "free", name: "Free", monthlyBase: 0, monthlyPerSeat: 0, maxSeats: 1, bestFor: "Casual or educational use" },
      { key: "individual", name: "Individual", monthlyBase: 0, monthlyPerSeat: 10, bestFor: "Individual developers" },
      { key: "business", name: "Business", monthlyBase: 0, monthlyPerSeat: 19, bestFor: "Managed engineering teams" },
      { key: "enterprise", name: "Enterprise", monthlyBase: 0, monthlyPerSeat: 39, bestFor: "Large regulated organizations" }
    ],
    metadata: { notes: "Enterprise layers advanced controls on top of Business.", billingModel: "per-seat" }
  },
  claude: {
    key: "claude",
    displayName: "Claude",
    category: "assistant",
    plans: [
      { key: "free", name: "Free", monthlyBase: 0, monthlyPerSeat: 0, maxSeats: 1, bestFor: "Light personal usage" },
      { key: "pro", name: "Pro", monthlyBase: 0, monthlyPerSeat: 20, bestFor: "Heavy individual usage" },
      { key: "team", name: "Team", monthlyBase: 0, monthlyPerSeat: 30, bestFor: "Small to mid-size cross-functional teams" }
    ],
    metadata: { notes: "Team seats are most efficient at 3+ active users.", billingModel: "per-seat" }
  },
  chatgpt: {
    key: "chatgpt",
    displayName: "ChatGPT",
    category: "general",
    plans: [
      { key: "free", name: "Free", monthlyBase: 0, monthlyPerSeat: 0, maxSeats: 1, bestFor: "Occasional use" },
      { key: "plus", name: "Plus", monthlyBase: 0, monthlyPerSeat: 20, bestFor: "Solo professionals" },
      { key: "team", name: "Team", monthlyBase: 0, monthlyPerSeat: 30, bestFor: "Collaborative teams and shared workspaces" },
      { key: "enterprise", name: "Enterprise", monthlyBase: 0, monthlyPerSeat: 60, bestFor: "Security and compliance heavy companies" }
    ],
    metadata: { notes: "Team is usually cost-effective for 3+ consistent users.", billingModel: "per-seat" }
  },
  gemini: {
    key: "gemini",
    displayName: "Gemini",
    category: "general",
    plans: [
      { key: "free", name: "Free", monthlyBase: 0, monthlyPerSeat: 0, maxSeats: 1, bestFor: "General lightweight use" },
      { key: "advanced", name: "Advanced", monthlyBase: 0, monthlyPerSeat: 20, bestFor: "Power users" },
      { key: "workspace", name: "Workspace Business", monthlyBase: 0, monthlyPerSeat: 32, bestFor: "Google Workspace teams" }
    ],
    metadata: { notes: "Workspace bundle often overlaps with existing Google spend.", billingModel: "per-seat" }
  },
  windsurf: {
    key: "windsurf",
    displayName: "Windsurf",
    category: "coding",
    plans: [
      { key: "free", name: "Free", monthlyBase: 0, monthlyPerSeat: 0, maxSeats: 1, bestFor: "Exploratory use" },
      { key: "pro", name: "Pro", monthlyBase: 0, monthlyPerSeat: 15, bestFor: "Individual coding flow" },
      { key: "teams", name: "Teams", monthlyBase: 0, monthlyPerSeat: 30, bestFor: "Growing engineering organizations" }
    ],
    metadata: { notes: "Competitive coding assistant pricing for small teams.", billingModel: "per-seat" }
  }
};

export const TOOL_ALIASES: Record<string, SupportedToolKey> = {
  cursor: "cursor",
  copilot: "copilot",
  githubcopilot: "copilot",
  claude: "claude",
  chatgpt: "chatgpt",
  gemini: "gemini",
  windsurf: "windsurf",
  v0: "windsurf"
};

export function resolveToolKey(rawTool: string): SupportedToolKey {
  const normalized = rawTool.toLowerCase().replace(/[^a-z0-9]/g, "");
  return TOOL_ALIASES[normalized] ?? "chatgpt";
}

export function getPlan(tool: SupportedToolKey, rawPlan: string): PricingPlan | undefined {
  const normalized = rawPlan.toLowerCase().trim();
  return TOOL_PRICING[tool].plans.find((plan) => plan.key === normalized || plan.name.toLowerCase() === normalized);
}

export function estimateMonthlyCost(tool: SupportedToolKey, planKey: string, seats: number): number {
  const plan = getPlan(tool, planKey);
  if (!plan) return 0;
  return plan.monthlyBase + plan.monthlyPerSeat * seats;
}
