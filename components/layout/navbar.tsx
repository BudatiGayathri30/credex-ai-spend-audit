import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Audit", href: "#audit" }
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
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground active:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-200 hover:w-full" />
            </a>
          ))}
        </nav>

        <Button asChild size="sm">
          <a href="#audit">Audit My AI Spend</a>
        </Button>
      </div>

      <nav className="container flex h-12 items-center gap-5 overflow-x-auto whitespace-nowrap md:hidden">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground active:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
