import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    step: "01",
    title: "Enter AI tool spending",
    description: "Share monthly spend, seats, and team context across your AI subscriptions."
  },
  {
    step: "02",
    title: "Analyze optimization opportunities",
    description: "Review usage patterns and subscription overlaps to identify budget inefficiencies."
  },
  {
    step: "03",
    title: "Get savings recommendations",
    description: "Receive clear recommendations to reduce spend while preserving team productivity."
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-border bg-background py-16 md:py-24">
      <div className="container px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">A fast, founder-friendly workflow to understand and optimize AI costs.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <Card
              key={item.step}
              className="h-full border-border/80 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <CardHeader>
                <p className="text-sm font-semibold text-primary">{item.step}</p>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
