import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { AuditResult, ToolRecommendation } from "@/types/audit-result";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl) {
    throw new Error("Missing env var SUPABASE_URL");
  }
  if (!serviceRoleKey) {
    throw new Error("Missing env var SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export interface CreateAuditSubmissionInput {
  publicShareId: string;
  tool: AuditResult["tool"];
  useCase: string;
  recommendations: ToolRecommendation[];
  monthlySavings: number;
  annualSavings: number;
  currentMonthlyCost: number;
  optimizedMonthlyCost: number;
  averageConfidence: number;
  aiSummary: string;
}

export interface CreateAuditSubmissionResult {
  id: string;
  publicShareId: string;
}

export async function createAuditSubmission(input: CreateAuditSubmissionInput): Promise<CreateAuditSubmissionResult> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("audit_submissions")
    .insert({
      tools: [input.tool],
      public_share_id: input.publicShareId,
      use_case: input.useCase,
      recommendations: input.recommendations,
      monthly_savings: input.monthlySavings,
      annual_savings: input.annualSavings,
      current_monthly_cost: input.currentMonthlyCost,
      optimized_monthly_cost: input.optimizedMonthlyCost,
      average_confidence: input.averageConfidence,
      ai_summary: input.aiSummary
    })
    .select("id, public_share_id")
    .single();

  if (error) {
    throw new Error(`Failed to create audit submission: ${error.message}`);
  }
  if (!data) {
    throw new Error("Failed to create audit submission: no data returned");
  }

  return { id: data.id as string, publicShareId: data.public_share_id as string };
}

export interface UpdateLeadInput {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
}

export interface UpdateLeadResult {
  publicShareId: string;
  monthlySavings: number;
  annualSavings: number;
  aiSummary: string;
}

export async function updateLeadCapture(input: UpdateLeadInput): Promise<UpdateLeadResult> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("audit_submissions")
    .update({
      email: input.email,
      company_name: input.companyName ?? null,
      role: input.role ?? null
    })
    .eq("id", input.auditId)
    .select("public_share_id, monthly_savings, annual_savings, ai_summary")
    .single();

  if (error) {
    throw new Error(`Failed to update lead capture: ${error.message}`);
  }
  if (!data) {
    throw new Error("Failed to update lead capture: no data returned");
  }

  return {
    publicShareId: data.public_share_id as string,
    monthlySavings: Number(data.monthly_savings),
    annualSavings: Number(data.annual_savings),
    aiSummary: data.ai_summary as string
  };
}

export interface PublicShareAudit {
  id: string;
  createdAt: string;
  tool: AuditResult["tool"];
  recommendations: ToolRecommendation[];
  currentMonthlyCost: number;
  optimizedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  averageConfidence: number;
  aiSummary: string;
}

export async function getPublicShareAudit(publicShareId: string): Promise<PublicShareAudit | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("audit_submissions")
    .select(
      [
        "id",
        "created_at",
        "tools",
        "recommendations",
        "monthly_savings",
        "annual_savings",
        "current_monthly_cost",
        "optimized_monthly_cost",
        "average_confidence",
        "ai_summary"
      ].join(",")
    )
    .eq("public_share_id", publicShareId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch public share audit: ${error.message}`);
  }

  if (!data) return null;

  type PublicShareAuditRow = {
    id: string;
    created_at: string;
    tools?: string[] | null;
    recommendations: ToolRecommendation[];
    current_monthly_cost: number | string;
    optimized_monthly_cost: number | string;
    monthly_savings: number | string;
    annual_savings: number | string;
    average_confidence: number | string;
    ai_summary: string;
  };

  const row = data as unknown as PublicShareAuditRow;
  const tool = (row.tools?.[0] ?? "chatgpt") as AuditResult["tool"];
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    tool,
    recommendations: row.recommendations as ToolRecommendation[],
    currentMonthlyCost: Number(row.current_monthly_cost),
    optimizedMonthlyCost: Number(row.optimized_monthly_cost),
    monthlySavings: Number(row.monthly_savings),
    annualSavings: Number(row.annual_savings),
    averageConfidence: Number(row.average_confidence),
    aiSummary: row.ai_summary as string
  };
}

