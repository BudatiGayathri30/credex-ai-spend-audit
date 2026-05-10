import type { AuditResult } from "@/types/audit-result";
import { SavingsHero } from "@/components/audit/savings-hero";
import { ToolRecommendationCard } from "@/components/audit/tool-recommendation-card";

interface ResultsSummaryProps {
  result: AuditResult;
  aiSummary?: string | null;
  /** Shows a lightweight skeleton while the server summary is loading */
  aiSummarySkeleton?: boolean;
  /** Use `3` nested under landing section `h2`; use `2` on share pages directly under page `h1`. */
  resultsHeadingLevel?: 2 | 3;
}

export function ResultsSummary({ result, aiSummary, aiSummarySkeleton, resultsHeadingLevel = 3 }: ResultsSummaryProps) {
  const HeadingTag = resultsHeadingLevel === 2 ? "h2" : "h3";
  return (
    <section className="space-y-5" aria-labelledby="audit-results-heading">
      <div className="flex flex-wrap items-center justify-between gap-2 gap-y-3">
        <HeadingTag id="audit-results-heading" className="text-2xl font-semibold tracking-tight">
          Your audit recommendations
        </HeadingTag>
        <p className="text-sm text-muted-foreground">Avg confidence: {Math.round(result.summary.averageConfidence * 100)}%</p>
      </div>

      {aiSummarySkeleton ? (
        <div className="rounded-2xl border border-border bg-muted/30 p-5" aria-busy="true" aria-label="Generating AI summary">
          <p className="text-sm font-medium">AI summary</p>
          <div className="mt-3 space-y-2" aria-hidden>
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-[92%] max-w-xl animate-pulse rounded bg-muted" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ) : null}

      {aiSummary ? (
        <div className="rounded-2xl border border-border bg-muted/30 p-5 transition-colors duration-200">
          <p className="text-sm font-medium">AI summary</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{aiSummary}</p>
        </div>
      ) : null}

      <SavingsHero summary={result.summary} />

      {result.recommendations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {result.recommendations.map((recommendation) => (
            <ToolRecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">No headline savings this run</p>
          <p className="mt-2">
            Based on your seats and plan mix, we are not seeing a large, confident cut. Keep the share link for your team review and
            revisit after your next billing cycle or seat change.
          </p>
        </div>
      )}
    </section>
  );
}
