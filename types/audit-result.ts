export type SupportedToolKey = "cursor" | "copilot" | "claude" | "chatgpt" | "gemini" | "windsurf";

export type RecommendationType = "downgrade" | "alternative" | "optimization";

export interface SavingsBreakdown {
  monthly: number;
  annual: number;
}

export interface ToolRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  currentPlan: string;
  recommendedPlan: string;
  reasoning: string;
  confidence: number;
  savings: SavingsBreakdown;
  badges: string[];
}

export interface AuditSummary {
  currentMonthlyCost: number;
  optimizedMonthlyCost: number;
  totalSavings: SavingsBreakdown;
  averageConfidence: number;
}

export interface AuditResult {
  tool: SupportedToolKey;
  createdAt: string;
  summary: AuditSummary;
  recommendations: ToolRecommendation[];
}
