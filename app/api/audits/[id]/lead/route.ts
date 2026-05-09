import { NextRequest, NextResponse } from "next/server";
import { leadCaptureSchema } from "@/lib/validations/lead-capture";
import { sendLeadConfirmationEmail } from "@/services/resend";
import { updateLeadCapture } from "@/services/supabase";
import type { LeadCaptureResponse } from "@/types/audit-persistence";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const values = leadCaptureSchema.parse(body);

    const { id: auditId } = await context.params;
    const updated = await updateLeadCapture({
      auditId,
      email: values.email,
      companyName: values.companyName,
      role: values.role
    });

    let emailSent = false;
    try {
      await sendLeadConfirmationEmail({
        toEmail: values.email,
        monthlySavings: updated.monthlySavings,
        annualSavings: updated.annualSavings
      });
      emailSent = true;
    } catch {
      // Lead is saved; email failure should not block the user.
      emailSent = false;
    }

    const response: LeadCaptureResponse = {
      public_share_id: updated.publicShareId,
      email_sent: emailSent
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save lead capture.";
    const status = message.includes("Invalid") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

