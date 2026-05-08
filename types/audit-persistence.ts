import type { AuditResult } from "@/types/audit-result";

export interface CreateAuditResponse {
  id: string;
  public_share_id: string;
  ai_summary: string;
  auditResult: AuditResult;
}

export interface LeadCaptureResponse {
  public_share_id: string;
  email_sent: boolean;
}

