import type { AuditSummary } from "@/types/audit-result";

interface SavingsHeroProps {
  summary: AuditSummary;
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function SavingsHero({ summary }: SavingsHeroProps) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
      <p className="text-sm font-medium text-emerald-700">Estimated savings opportunity</p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-emerald-900 md:text-4xl">
        {formatUsd(summary.totalSavings.monthly)} / month
      </h3>
      <p className="mt-1 text-sm text-emerald-700">~{formatUsd(summary.totalSavings.annual)} per year</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Current spend</p>
          <p className="mt-1 text-xl font-semibold">{formatUsd(summary.currentMonthlyCost)}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Optimized spend</p>
          <p className="mt-1 text-xl font-semibold">{formatUsd(summary.optimizedMonthlyCost)}</p>
        </div>
      </div>
    </div>
  );
}
