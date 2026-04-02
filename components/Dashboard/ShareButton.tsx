"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          Kopyalandı
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Paylaş
        </>
      )}
    </Button>
  );
}
