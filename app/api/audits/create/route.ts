import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { auditFormSchema } from "@/lib/validations/audit-form";
import { generateAuditResult } from "@/lib/audit-engine";
import { generateAuditSummary } from "@/services/openai";
import { createAuditSubmission } from "@/services/supabase";
import type { CreateAuditResponse } from "@/types/audit-persistence";

function generatePublicShareId() {
  // Short but collision-resistant for MVP.
  return randomBytes(10).toString("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const values = auditFormSchema.parse(body);

    const auditResult = generateAuditResult(values);

    const aiSummary = await generateAuditSummary({
      recommendations: auditResult.recommendations,
      monthlySavings: auditResult.summary.totalSavings.monthly,
      annualSavings: auditResult.summary.totalSavings.annual,
      useCase: values.useCase
    });

    const publicShareId = generatePublicShareId();

    const created = await createAuditSubmission({
      publicShareId,
      tool: auditResult.tool,
      useCase: values.useCase,
      recommendations: auditResult.recommendations,
      monthlySavings: auditResult.summary.totalSavings.monthly,
      annualSavings: auditResult.summary.totalSavings.annual,
      currentMonthlyCost: auditResult.summary.currentMonthlyCost,
      optimizedMonthlyCost: auditResult.summary.optimizedMonthlyCost,
      averageConfidence: auditResult.summary.averageConfidence,
      aiSummary
    });

    const response: CreateAuditResponse = {
      id: created.id,
      public_share_id: created.publicShareId,
      ai_summary: aiSummary,
      auditResult
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create audit submission.";
    // Zod parse errors should return a 400 with a readable message.
    const status = message.includes("Invalid") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

