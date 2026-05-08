import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const metadataBase = process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : undefined;

export const metadata: Metadata = {
  title: "Credex | AI Spend Audit",
  description: "AI spend audit platform for startups.",
  metadataBase,
  openGraph: {
    title: "Credex | AI Spend Audit",
    description: "AI spend audit platform for startups.",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Credex | AI Spend Audit",
    description: "AI spend audit platform for startups."
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
