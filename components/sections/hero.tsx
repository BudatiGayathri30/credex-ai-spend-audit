import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-muted/40 to-background">
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            AI Spend Audit for startups
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">Stop Overpaying for AI Tools</h1>
          <p className="mt-6 text-pretty text-base text-muted-foreground md:text-lg">
            Analyze your AI stack and uncover hidden savings across ChatGPT, Claude, Cursor, Copilot, and more.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <a href="#audit-form">Audit My AI Spend</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
