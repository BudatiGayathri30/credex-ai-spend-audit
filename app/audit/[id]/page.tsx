import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicShareAudit } from "@/services/supabase";
import type { AuditResult } from "@/types/audit-result";
import { ResultsSummary } from "@/components/audit/results-summary";

function formatUsdNoCents(value: number): string {
  const rounded = Math.round(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(rounded);
}

function truncate(text: string, maxLength: number): string {
  const t = text.trim();
  if (t.length <= maxLength) return t;
  return `${t.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const audit = await getPublicShareAudit(id);
  if (!audit) {
    return {
      title: "Credex | AI Spend Audit",
      description: "AI spend audit platform for startups."
    };
  }

  const monthly = formatUsdNoCents(audit.monthlySavings);
  const description = truncate(audit.aiSummary, 160);
  const title = `Credex AI Spend Audit: Save ${monthly}/mo`;

  const canonicalBase = process.env.NEXT_PUBLIC_APP_URL;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalBase ? `${canonicalBase.replace(/\/$/, "")}/audit/${id}` : undefined
    },
    twitter: {
      card: "summary",
      title,
      description
    }
  };
}

export default async function AuditSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getPublicShareAudit(id);
  if (!audit) notFound();

  const auditResult: AuditResult = {
    tool: audit.tool,
    createdAt: audit.createdAt,
    summary: {
      currentMonthlyCost: audit.currentMonthlyCost,
      optimizedMonthlyCost: audit.optimizedMonthlyCost,
      totalSavings: {
        monthly: audit.monthlySavings,
        annual: audit.annualSavings
      },
      averageConfidence: audit.averageConfidence
    },
    recommendations: audit.recommendations
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-12">
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Public audit preview</p>
            <h1 className="text-3xl font-semibold tracking-tight">Your Credex AI Spend Audit</h1>
            <p className="text-sm text-muted-foreground">Founder-friendly recommendations based on your inputs.</p>
          </div>

          <ResultsSummary result={auditResult} aiSummary={audit.aiSummary} resultsHeadingLevel={2} />
        </div>
      </div>
    </main>
  );
}

