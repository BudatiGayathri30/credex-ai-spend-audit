"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareAuditLinkProps {
  publicShareId: string | null;
}

export function ShareAuditLink({ publicShareId }: ShareAuditLinkProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!publicShareId) return null;
    return `${window.location.origin}/audit/${publicShareId}`;
  }, [publicShareId]);

  if (!shareUrl) return null;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 transition-colors duration-200">
      <p className="text-sm font-medium" id="share-audit-label">
        Share your audit
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input value={shareUrl} readOnly className="sm:flex-1 transition-colors" aria-labelledby="share-audit-label" />
        <Button
          type="button"
          aria-label={copied ? "Link copied to clipboard" : "Copy shareable audit link to clipboard"}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(shareUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              // Clipboard can fail on some locked-down browsers; fallback to a simple prompt.
              window.prompt("Copy your share URL:", shareUrl);
            }
          }}
        >
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>
    </div>
  );
}

