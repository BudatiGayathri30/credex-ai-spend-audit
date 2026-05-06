import { z } from "zod";

export const auditFormSchema = z.object({
  aiTool: z.string().min(1, "Please select an AI tool."),
  plan: z.string().min(1, "Please select a plan."),
  monthlySpend: z
    .number({ invalid_type_error: "Monthly spend must be a number." })
    .nonnegative("Monthly spend cannot be negative."),
  seats: z
    .number({ invalid_type_error: "Seats must be a number." })
    .int("Seats must be a whole number.")
    .positive("Seats must be at least 1."),
  teamSize: z
    .number({ invalid_type_error: "Team size must be a number." })
    .int("Team size must be a whole number.")
    .positive("Team size must be at least 1."),
  useCase: z
    .string()
    .min(10, "Use case should be at least 10 characters.")
    .max(400, "Use case cannot exceed 400 characters.")
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;
