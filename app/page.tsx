import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { BenefitsSection } from "@/components/sections/benefits";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { AuditFormSection } from "@/components/sections/audit-form-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <AuditFormSection />
      <Footer />
    </main>
  );
}
