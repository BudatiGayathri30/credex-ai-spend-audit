import { z } from "zod";

const optionalTrimmedString = (maxLength: number) =>
  z.preprocess(
    (v) => (typeof v === "string" ? (v.trim() === "" ? undefined : v.trim()) : v),
    z.string().max(maxLength).optional()
  );

export const leadCaptureSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email."),
  companyName: optionalTrimmedString(120).optional(),
  role: optionalTrimmedString(80).optional()
});

export type LeadCaptureValues = z.infer<typeof leadCaptureSchema>;

