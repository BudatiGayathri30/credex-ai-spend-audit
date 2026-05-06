import Link from "next/link";

const footerLinks = [
  { label: "Benefits", href: "#benefits" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Audit Form", href: "#audit-form" }
];

const socialLinks = [
  { label: "X", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" }
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight">
              Credex
            </Link>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">AI Spend Audit platform helping startups optimize AI tool budgets.</p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
            <nav className="space-y-2">
              <p className="text-sm font-medium">Navigation</p>
              {footerLinks.map((link) => (
                <a key={link.label} href={link.href} className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="space-y-2">
              <p className="text-sm font-medium">Social</p>
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">© {currentYear} Credex. All rights reserved.</div>
      </div>
    </footer>
  );
}
