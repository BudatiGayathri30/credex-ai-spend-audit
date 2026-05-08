"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="text-xl">Get your confirmation</CardTitle>
        <CardDescription className="text-sm">
          Leave your email so we can confirm your audit. Optional details help us tailor follow-ups.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leadSaved ? (
          <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm font-medium">Saved.</p>
            <p className="text-sm text-muted-foreground">
              {emailSent ? "Check your inbox for the confirmation email." : "We saved your audit details. We couldn’t send email right now."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leadEmail">Work email</Label>
              <Input id="leadEmail" type="email" placeholder="you@startup.com" {...register("email")} disabled={!auditId} />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
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
                {errors.companyName && <p className="text-xs text-red-600">{errors.companyName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role (optional)</Label>
                <Input id="role" placeholder="Founder / Head of Engineering" {...register("role")} disabled={!auditId} />
                {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
              </div>
            </div>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {isSaving ? "Saving..." : "Save & send confirmation"}
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

