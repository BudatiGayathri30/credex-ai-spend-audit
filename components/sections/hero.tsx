import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-muted/40 to-background" aria-labelledby="hero-heading">
      <div className="container py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            AI Spend Audit for startups
          </p>
          <h1 id="hero-heading" className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Stop Overpaying for AI Tools
          </h1>
          <p className="mt-6 text-pretty text-base text-muted-foreground md:text-lg">
            Analyze your AI stack and uncover hidden savings across ChatGPT, Claude, Cursor, Copilot, and more.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="transition-transform duration-200 hover:-translate-y-0.5">
              <a href="#audit-form">Audit My AI Spend</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
