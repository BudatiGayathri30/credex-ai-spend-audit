import type { ToolRecommendation } from "@/types/audit-result";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ToolRecommendationCardProps {
  recommendation: ToolRecommendation;
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function confidenceTone(confidence: number): string {
  if (confidence >= 0.85) return "bg-emerald-100 text-emerald-700";
  if (confidence >= 0.7) return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

export function ToolRecommendationCard({ recommendation }: ToolRecommendationCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700">{recommendation.type}</span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${confidenceTone(recommendation.confidence)}`}>
            {Math.round(recommendation.confidence * 100)}% confidence
          </span>
        </div>
        <CardTitle className="text-lg">{recommendation.title}</CardTitle>
        <CardDescription>
          {recommendation.currentPlan} {"->"} {recommendation.recommendedPlan}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Monthly savings</p>
            <p className="mt-1 text-lg font-semibold">{formatUsd(recommendation.savings.monthly)}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Annual savings</p>
            <p className="mt-1 text-lg font-semibold">{formatUsd(recommendation.savings.annual)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {recommendation.badges.map((badge) => (
            <span key={badge} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
              {badge}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
