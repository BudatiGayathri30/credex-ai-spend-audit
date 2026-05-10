import "server-only";
import { Resend } from "resend";

export interface SendLeadConfirmationInput {
  toEmail: string;
  monthlySavings: number;
  annualSavings: number;
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Math.round(value));
}

export async function sendLeadConfirmationEmail(input: SendLeadConfirmationInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey) {
    throw new Error("Missing env var RESEND_API_KEY");
  }
  if (!fromEmail) {
    throw new Error("Missing env var RESEND_FROM_EMAIL");
  }

  const resend = new Resend(apiKey);

  const subject = "Your Credex AI Spend Audit is ready";
  const monthly = formatUsd(input.monthlySavings);
  const annual = formatUsd(input.annualSavings);

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
      <h2 style="margin: 0 0 12px 0; font-size: 18px;">Thanks for checking your AI spend</h2>

      <p style="margin: 0 0 12px 0; color: #334155;">
        Your Credex audit is complete. Based on your inputs, you have an estimated savings opportunity of
        <strong>${monthly} / month</strong> (~${annual} / year).
      </p>

      <p style="margin: 0 0 12px 0; color: #334155;">
        If your estimated savings are especially strong, Credex will follow up with a quick next-steps note.
        Otherwise, we’ll keep it lightweight and you can share your audit link at any time.
      </p>

      <p style="margin: 0; color: #64748b;">
        - Credex Team
      </p>
    </div>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: input.toEmail,
    subject,
    html
  });
}

