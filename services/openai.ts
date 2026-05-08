import "server-only";
import OpenAI from "openai";
import type { ToolRecommendation } from "@/types/audit-result";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

export interface GenerateAuditSummaryInput {
  recommendations: ToolRecommendation[];
  monthlySavings: number;
  annualSavings: number;
  useCase: string;
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Math.round(value));
}

function pickTopRecommendations(recommendations: ToolRecommendation[], limit = 3) {
  return recommendations
    .slice()
    .sort((a, b) => b.savings.monthly - a.savings.monthly)
    .slice(0, limit);
}

function fallbackAuditSummary(input: GenerateAuditSummaryInput): string {
  const top = pickTopRecommendations(input.recommendations, 2);
  const first = top[0];

  const headline = first
    ? `Credex’s quick take: ${first.title} (${first.currentPlan} -> ${first.recommendedPlan}).`
    : "Credex’s quick take: your current AI spend looks close, but there are still improvements available.";

  const savingsLine = `You’re estimating about ${formatUsd(input.monthlySavings)} in savings per month (roughly ${formatUsd(
    input.annualSavings
  )} per year) if you adopt the recommended plan and seat sizing.`;

  const realityLine =
    "Actual savings depend on rollout speed, how many seats you truly need, and any usage changes during migration.";

  const useCaseLine = input.useCase ? `For your use case, the goal is to keep quality while cutting overhead.` : "";

  // Aim for ~100 words without being overly strict.
  return `${headline} ${savingsLine} ${realityLine} ${useCaseLine}`.trim();
}

const AUDIT_SUMMARY_USER_PROMPT = `You are a founder-friendly financial advisor helping startups optimize AI spend.

Use the inputs below to write a concise, realistic audit summary of about 90-120 words.

Requirements:
- Mention the estimated monthly savings and (if useful) the annual equivalent.
- Reference the single biggest recommendation and why it matters.
- Keep it financially realistic: note that savings depend on rollout, seat sizing, and adoption.
- Tone: optimistic, practical, non-judgmental.
- Do NOT mention email addresses or personal data.
- Output ONLY valid JSON in the form: {"summary":"..."} (no extra keys, no markdown).

Inputs:
- Use case: {{use_case}}
- Estimated savings: {{monthly_savings}} per month ({{annual_savings}} per year)
- Recommendations (top opportunities):
{{recommendations_json}}
`;

export async function generateAuditSummary(input: GenerateAuditSummaryInput): Promise<string> {
  // Always provide a summary, even if the model is unavailable or errors out.
  const fallback = fallbackAuditSummary(input);

  try {
    if (!openai) {
      return fallback;
    }

    const top = pickTopRecommendations(input.recommendations, 3);
    const recommendationsJson = JSON.stringify(
      top.map((r) => ({
        title: r.title,
        currentPlan: r.currentPlan,
        recommendedPlan: r.recommendedPlan,
        monthlySavings: r.savings.monthly,
        confidence: r.confidence
      })),
      null,
      2
    );

    const monthly = formatUsd(input.monthlySavings);
    const annual = formatUsd(input.annualSavings);

    const userPrompt = AUDIT_SUMMARY_USER_PROMPT.replaceAll("{{use_case}}", input.useCase).replaceAll(
      "{{monthly_savings}}",
      monthly
    ).replaceAll("{{annual_savings}}", annual).replaceAll("{{recommendations_json}}", recommendationsJson);

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.4,
      messages: [{ role: "user", content: userPrompt }],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(content) as { summary?: string };
    if (!parsed.summary || typeof parsed.summary !== "string") return fallback;

    const trimmed = parsed.summary.trim();
    if (!trimmed) return fallback;
    return trimmed;
  } catch {
    return fallback;
  }
}

