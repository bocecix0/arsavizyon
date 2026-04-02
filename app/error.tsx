"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="font-display text-3xl font-bold mb-3">Bir Hata Oluştu</h1>
        <p className="text-muted mb-8 max-w-sm">
          Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <Button size="lg" onClick={reset}>
          Tekrar Dene
        </Button>
      </div>
    </div>
  );
}
