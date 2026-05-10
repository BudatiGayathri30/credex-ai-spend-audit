"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { type AuditFormValues, auditFormSchema } from "@/lib/validations/audit-form";
import { generateAuditResult } from "@/lib/audit-engine";
import { ResultsSummary } from "@/components/audit/results-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AuditResult } from "@/types/audit-result";
import type { CreateAuditResponse } from "@/types/audit-persistence";
import { LeadCaptureForm } from "@/components/forms/lead-capture";
import { ShareAuditLink } from "@/components/audit/share-audit-link";

const aiTools = [
  { label: "ChatGPT", value: "chatgpt" },
  { label: "Claude", value: "claude" },
  { label: "Cursor", value: "cursor" },
  { label: "Gemini", value: "gemini" },
  { label: "Copilot", value: "copilot" },
  { label: "Windsurf", value: "windsurf" },
  { label: "v0", value: "v0" }
];

const planOptionsByTool: Record<string, { label: string; value: string }[]> = {
  chatgpt: [
    { label: "Free", value: "free" },
    { label: "Plus", value: "plus" },
    { label: "Team", value: "team" },
    { label: "Enterprise", value: "enterprise" }
  ],
  claude: [
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
    { label: "Team", value: "team" }
  ],
  cursor: [
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
    { label: "Business", value: "business" }
  ],
  gemini: [
    { label: "Free", value: "free" },
    { label: "Advanced", value: "advanced" },
    { label: "Workspace Business", value: "workspace" }
  ],
  copilot: [
    { label: "Free", value: "free" },
    { label: "Individual", value: "individual" },
    { label: "Business", value: "business" },
    { label: "Enterprise", value: "enterprise" }
  ],
  windsurf: [
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
    { label: "Teams", value: "teams" }
  ],
  v0: [
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
    { label: "Teams", value: "teams" }
  ]
};

export function AuditForm() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [publicShareId, setPublicShareId] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [persistError, setPersistError] = useState<string | null>(null);
  const [isPersisting, setIsPersisting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      aiTool: "",
      plan: "",
      monthlySpend: 0,
      seats: 1,
      teamSize: 1,
      useCase: ""
    }
  });

  const selectedTool = watch("aiTool");
  const planOptions = useMemo(() => {
    return planOptionsByTool[selectedTool] ?? [{ label: "Select tool first", value: "__placeholder" }];
  }, [selectedTool]);

  const onSubmit = async (values: AuditFormValues) => {
    // Optimistic UI: show local results immediately, then persist + enrich in the background.
    const local = generateAuditResult(values);
    setAuditResult(local);
    setAuditId(null);
    setPublicShareId(null);
    setAiSummary(null);
    setPersistError(null);

    await new Promise((resolve) => setTimeout(resolve, 300));

    setIsPersisting(true);
    try {
      const res = await fetch("/api/audits/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const data = (await res.json()) as CreateAuditResponse;

      if (!res.ok) {
        setPersistError((data as unknown as { error?: string })?.error ?? "Could not save your audit. Please try again.");
        return;
      }

      setAuditId(data.id);
      setPublicShareId(data.public_share_id);
      setAiSummary(data.ai_summary);
      setAuditResult(data.auditResult);
    } catch {
      setPersistError("Could not save your audit. You can still view results, but saving and sharing may be unavailable.");
    } finally {
      setIsPersisting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Start your AI spend audit</CardTitle>
          <CardDescription>Fill in your details to generate savings recommendations from our local audit engine.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-busy={isSubmitting || isPersisting} noValidate>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="aiTool">AI tool</Label>
                <Select
                  value={watch("aiTool")}
                  onValueChange={(value) => {
                    setValue("aiTool", value, { shouldValidate: true });
                    setValue("plan", "", { shouldValidate: true });
                  }}
                >
                  <SelectTrigger id="aiTool" aria-invalid={Boolean(errors.aiTool)} aria-required>
                    <SelectValue placeholder="Select an AI tool" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiTools.map((tool) => (
                      <SelectItem key={tool.value} value={tool.value}>
                        {tool.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.aiTool ? (
                  <p className="text-xs text-red-600" role="alert">
                    {errors.aiTool.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select value={watch("plan")} onValueChange={(value) => setValue("plan", value, { shouldValidate: true })}>
                  <SelectTrigger id="plan" aria-invalid={Boolean(errors.plan)} aria-required>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {planOptions
                      .filter((option) => option.value !== "__placeholder")
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.plan ? (
                  <p className="text-xs text-red-600" role="alert">
                    {errors.plan.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlySpend">Monthly spend (USD)</Label>
                <Input
                  id="monthlySpend"
                  type="number"
                  min={0}
                  step="1"
                  aria-invalid={Boolean(errors.monthlySpend)}
                  inputMode="decimal"
                  {...register("monthlySpend", { valueAsNumber: true })}
                />
                {errors.monthlySpend ? (
                  <p className="text-xs text-red-600" role="alert">
                    {errors.monthlySpend.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  min={1}
                  step="1"
                  aria-invalid={Boolean(errors.seats)}
                  inputMode="numeric"
                  {...register("seats", { valueAsNumber: true })}
                />
                {errors.seats ? (
                  <p className="text-xs text-red-600" role="alert">
                    {errors.seats.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="teamSize">Team size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  min={1}
                  step="1"
                  aria-invalid={Boolean(errors.teamSize)}
                  inputMode="numeric"
                  {...register("teamSize", { valueAsNumber: true })}
                />
                {errors.teamSize ? (
                  <p className="text-xs text-red-600" role="alert">
                    {errors.teamSize.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="useCase">Use case</Label>
              <Textarea
                id="useCase"
                placeholder="Describe how your team uses AI tools today."
                aria-invalid={Boolean(errors.useCase)}
                rows={4}
                className="min-h-[100px]"
                {...register("useCase")}
              />
              {errors.useCase ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors.useCase.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="w-full md:w-auto transition-opacity" disabled={isSubmitting || isPersisting}>
              {isPersisting ? "Saving audit…" : isSubmitting ? "Calculating…" : "Audit My AI Spend"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {auditResult && (
        <div className="space-y-6">
          <span className="sr-only" aria-live="polite">
            {isPersisting && !auditId ? "Saving audit and generating an AI summary." : ""}
            {!isPersisting && auditId ? "Audit saved. Share link is available below." : ""}
          </span>

          <ResultsSummary
            result={auditResult}
            aiSummary={aiSummary}
            aiSummarySkeleton={Boolean(isPersisting && !auditId && !aiSummary)}
          />

          <ShareAuditLink publicShareId={publicShareId} />

          {isPersisting && !auditId ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4" role="status" aria-busy="true">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-2 w-2 shrink-0 animate-pulse rounded-full bg-primary"
                  aria-hidden
                />
                <p className="text-sm text-muted-foreground">
                  Saving your audit and drafting the AI summary. You can scroll results while we finish.
                </p>
              </div>
              <div className="mt-3 space-y-2" aria-hidden>
                <div className="h-2 w-full max-w-md animate-pulse rounded bg-muted" />
                <div className="h-2 w-4/5 max-w-sm animate-pulse rounded bg-muted" />
              </div>
            </div>
          ) : null}

          {persistError ? (
            <p className="text-sm text-red-600" role="alert">
              {persistError}
            </p>
          ) : null}

          <LeadCaptureForm auditId={auditId} />
        </div>
      )}
    </div>
  );
}
