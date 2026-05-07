import type { AuditResult } from "@/types/audit-result";
import { SavingsHero } from "@/components/audit/savings-hero";
import { ToolRecommendationCard } from "@/components/audit/tool-recommendation-card";

interface ResultsSummaryProps {
  result: AuditResult;
}

export function ResultsSummary({ result }: ResultsSummaryProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-2xl font-semibold tracking-tight">Your audit recommendations</h3>
        <p className="text-sm text-muted-foreground">Avg confidence: {Math.round(result.summary.averageConfidence * 100)}%</p>
      </div>

      <SavingsHero summary={result.summary} />

      {result.recommendations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {result.recommendations.map((recommendation) => (
            <ToolRecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No strong savings recommendations found. Your current setup is already close to efficient.
        </div>
      )}
    </section>
  );
}
