"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { leadCaptureSchema, type LeadCaptureValues } from "@/lib/validations/lead-capture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LeadCaptureFormProps {
  auditId: string | null;
  onLeadSaved?: () => void;
}

export function LeadCaptureForm({ auditId, onLeadSaved }: LeadCaptureFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [leadSaved, setLeadSaved] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit = useMemo(() => Boolean(auditId) && !isSaving && !leadSaved, [auditId, isSaving, leadSaved]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LeadCaptureValues>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: { email: "", companyName: "", role: "" }
  });

  const onSubmit = async (values: LeadCaptureValues) => {
    if (!auditId) return;
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/audits/${auditId}/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const data = (await res.json()) as { error?: string; email_sent?: boolean };

      if (!res.ok) {
        setErrorMessage(data.error ?? "Could not save your details. Please try again.");
        return;
      }

      setLeadSaved(true);
      setEmailSent(Boolean(data.email_sent));
      onLeadSaved?.();
    } catch {
      setErrorMessage("Something went wrong. Please try again in a moment.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-border bg-card/50 transition-colors duration-200">
      <CardHeader>
        <CardTitle className="text-xl">Get your confirmation</CardTitle>
        <CardDescription className="text-sm">
          Leave your email so we can confirm your audit. Optional details help us tailor follow-ups.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leadSaved ? (
          <div
            className="flex gap-3 rounded-lg border border-emerald-200/80 bg-emerald-50/50 p-4 text-emerald-950 opacity-100 transition-opacity duration-300"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden />
            <div className="space-y-2">
              <p className="text-sm font-medium">Saved — thanks.</p>
              <p className="text-sm text-muted-foreground">
                {emailSent
                  ? "Check your inbox for the confirmation email."
                  : "We saved your details. Email confirmation could not be sent right now; you can still use your share link."}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="leadEmail">Work email</Label>
              <Input
                id="leadEmail"
                type="email"
                placeholder="you@startup.com"
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                {...register("email")}
                disabled={!auditId}
              />
              {errors.email ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company (optional)</Label>
                <Input
                  id="companyName"
                  placeholder="Credex Labs"
                  {...register("companyName")}
                  disabled={!auditId}
                />
                {errors.companyName ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors.companyName.message}
                </p>
              ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role (optional)</Label>
                <Input id="role" placeholder="Founder / Head of Engineering" {...register("role")} disabled={!auditId} />
                {errors.role ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors.role.message}
                </p>
              ) : null}
              </div>
            </div>

            {errorMessage ? (
              <p className="text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <Button type="submit" className="w-full transition-opacity" disabled={!canSubmit}>
              {isSaving ? "Saving…" : "Save & send confirmation"}
            </Button>

            <p className="text-xs text-muted-foreground">
              We won't share your email on the public audit page.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

