"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type AuditFormValues, auditFormSchema } from "@/lib/validations/audit-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const aiTools = [
  { label: "ChatGPT", value: "chatgpt" },
  { label: "Claude", value: "claude" },
  { label: "Cursor", value: "cursor" },
  { label: "Gemini", value: "gemini" },
  { label: "Copilot", value: "copilot" },
  { label: "Other", value: "other" }
];

const planOptions = [
  { label: "Free", value: "free" },
  { label: "Starter", value: "starter" },
  { label: "Pro", value: "pro" },
  { label: "Team", value: "team" },
  { label: "Enterprise", value: "enterprise" }
];

export function AuditForm() {
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

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Start your AI spend audit</CardTitle>
        <CardDescription>Fill in your details to prepare an audit-ready snapshot of your current AI tooling spend.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="aiTool">AI tool</Label>
              <Select value={watch("aiTool")} onValueChange={(value) => setValue("aiTool", value, { shouldValidate: true })}>
                <SelectTrigger id="aiTool">
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
              {errors.aiTool && <p className="text-xs text-red-600">{errors.aiTool.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Select value={watch("plan")} onValueChange={(value) => setValue("plan", value, { shouldValidate: true })}>
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {planOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.plan && <p className="text-xs text-red-600">{errors.plan.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlySpend">Monthly spend (USD)</Label>
              <Input id="monthlySpend" type="number" min={0} step="1" {...register("monthlySpend", { valueAsNumber: true })} />
              {errors.monthlySpend && <p className="text-xs text-red-600">{errors.monthlySpend.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seats">Seats</Label>
              <Input id="seats" type="number" min={1} step="1" {...register("seats", { valueAsNumber: true })} />
              {errors.seats && <p className="text-xs text-red-600">{errors.seats.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="teamSize">Team size</Label>
              <Input id="teamSize" type="number" min={1} step="1" {...register("teamSize", { valueAsNumber: true })} />
              {errors.teamSize && <p className="text-xs text-red-600">{errors.teamSize.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase">Use case</Label>
            <Textarea id="useCase" placeholder="Describe how your team uses AI tools today." {...register("useCase")} />
            {errors.useCase && <p className="text-xs text-red-600">{errors.useCase.message}</p>}
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Preparing..." : "Audit My AI Spend"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
