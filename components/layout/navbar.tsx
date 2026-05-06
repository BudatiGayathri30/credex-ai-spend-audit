import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Benefits", href: "#benefits" },
  { label: "Audit Form", href: "#audit-form" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Credex
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>

        <Button asChild size="sm">
          <a href="#audit-form">Audit My AI Spend</a>
        </Button>
      </div>
    </header>
  );
}
