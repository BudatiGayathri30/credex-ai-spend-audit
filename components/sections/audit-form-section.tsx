import { AuditForm } from "@/components/forms/audit-form";

export function AuditFormSection() {
  return (
    <section id="audit" aria-labelledby="audit-section-title" className="border-t border-border bg-muted/30 py-16 md:py-24 scroll-mt-28">
      <span id="audit-form" className="sr-only">
        Audit form start
      </span>
      <div className="container">
        <div className="mx-auto mb-8 max-w-2xl text-center px-4 sm:px-0">
          <h2 id="audit-section-title" className="text-3xl font-semibold tracking-tight md:text-4xl">
            See where your AI budget can improve
          </h2>
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
