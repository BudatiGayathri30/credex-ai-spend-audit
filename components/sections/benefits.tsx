import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Lightbulb, Share2 } from "lucide-react";

const benefits = [
  {
    title: "Instant audit",
    description: "Capture your AI tooling footprint quickly with a streamlined input flow.",
    icon: Zap
  },
  {
    title: "Savings recommendations",
    description: "Identify waste across duplicated seats, unused tiers, and overlapping subscriptions.",
    icon: Sparkles
  },
  {
    title: "AI-generated insights",
    description: "Get clear insights tailored for founders, finance leads, and engineering teams.",
    icon: Lightbulb
  },
  {
    title: "Shareable reports",
    description: "Prepare stakeholder-friendly snapshots for monthly budget and planning reviews.",
    icon: Share2
  }
];

export function BenefitsSection() {
  return (
    <section id="features" className="container px-4 py-16 md:py-24 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Built to optimize your AI budget</h2>
        <p className="mt-3 text-muted-foreground">Everything your startup needs to control AI spend without slowing teams down.</p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <Card key={benefit.title} className="h-full">
            <CardHeader>
              <benefit.icon className="h-5 w-5 text-primary" />
              <CardTitle className="pt-3 text-xl">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{benefit.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
