import { AuditForm } from "@/components/forms/audit-form";

export function AuditFormSection() {
  return (
    <section id="audit" className="border-t border-border bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">See where your AI budget can improve</h2>
          <p className="mt-3 text-muted-foreground">
            Run a local pricing audit instantly, then we save it, generate an AI summary, and give you a shareable link.
          </p>
        </div>
        <div className="mx-auto max-w-3xl">
          <AuditForm />
        </div>
      </div>
    </section>
  );
}
