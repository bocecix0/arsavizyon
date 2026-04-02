"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { GenerationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  label: string;
  status: "waiting" | "active" | "done" | "error";
}

interface StepProgressProps {
  generationId: string;
  includeVideo: boolean;
  onComplete: (id: string) => void;
  onError: (message: string) => void;
}

export default function StepProgress({
  generationId,
  includeVideo,
  onComplete,
  onError,
}: StepProgressProps) {
  const [steps, setSteps] = useState<ProgressStep[]>([
    { id: "upload", label: "Fotoğraf yüklendi", status: "done" },
    { id: "render", label: "AI binanızı tasarlıyor...", status: "active" },
    ...(includeVideo
      ? [{ id: "video", label: "Video oluşturuluyor...", status: "waiting" as const }]
      : []),
    { id: "complete", label: "Hazır!", status: "waiting" },
  ]);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 120; // 10 minutes

    const poll = async () => {
      try {
        const res = await fetch(`/api/generate/status/${generationId}`);
        const data = await res.json();

        const status: GenerationStatus = data.status;

        setSteps((prev) =>
          prev.map((step) => {
            if (step.id === "render") {
              if (status === "rendering") return { ...step, status: "active" };
              if (["generating_video", "completed"].includes(status))
                return { ...step, status: "done" };
              if (status === "failed") return { ...step, status: "error" };
            }
            if (step.id === "video" && includeVideo) {
              if (status === "generating_video") return { ...step, status: "active" };
              if (status === "completed") return { ...step, status: "done" };
              if (status === "failed") return { ...step, status: "error" };
            }
            if (step.id === "complete") {
              if (status === "completed") return { ...step, status: "done" };
              if (status === "failed") return { ...step, status: "error" };
            }
            return step;
          })
        );

        if (status === "completed") {
          clearInterval(pollInterval);
          setTimeout(() => onComplete(generationId), 1000);
        } else if (status === "failed") {
          clearInterval(pollInterval);
          onError("Görsel oluşturma başarısız oldu. Krediniz iade edilmedi.");
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            onError("İşlem zaman aşımına uğradı. Lütfen daha sonra tekrar deneyin.");
          }
        }
      } catch {
        // Network error, continue polling
      }
    };

    poll();
    pollInterval = setInterval(poll, 5000);
    return () => clearInterval(pollInterval);
  }, [generationId, includeVideo, onComplete, onError]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}d ${sec}s` : `${sec}s`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-xl font-semibold mb-2">
          Görseliniz Hazırlanıyor
        </h2>
        <p className="text-muted text-sm">
          Bu işlem 30 saniye ile {includeVideo ? "3 dakika" : "1 dakika"} sürebilir
        </p>
      </div>

      {/* Animated building silhouette */}
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-2xl bg-gold/5 border border-gold/20 flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 80 80"
              className="w-20 h-20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Building silhouette */}
              <rect x="15" y="25" width="50" height="45" fill="rgba(201,168,76,0.15)" stroke="rgba(201,168,76,0.4)" strokeWidth="1" className="animate-pulse" />
              <rect x="25" y="15" width="30" height="15" fill="rgba(201,168,76,0.2)" stroke="rgba(201,168,76,0.4)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
              <rect x="30" y="5" width="20" height="12" fill="rgba(201,168,76,0.25)" stroke="rgba(201,168,76,0.5)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: "0.6s" }} />
              {/* Windows */}
              {[20, 35, 50].map((x) =>
                [30, 45, 55].map((y) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="7" height="7" fill="rgba(201,168,76,0.4)" className="animate-pulse" style={{ animationDelay: `${Math.random()}s` }} />
                ))
              )}
            </svg>
          </div>
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-gold/30 border-t-gold animate-spin" style={{ animationDuration: "3s" }} />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 max-w-xs mx-auto">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-3">
            {/* Icon */}
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                step.status === "done" && "bg-emerald-500/20 border border-emerald-500/30",
                step.status === "active" && "bg-gold/20 border border-gold/40",
                step.status === "waiting" && "bg-white/5 border border-border",
                step.status === "error" && "bg-red-500/20 border border-red-500/30"
              )}
            >
              {step.status === "done" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              {step.status === "active" && <Loader2 className="w-3.5 h-3.5 text-gold animate-spin" />}
              {step.status === "waiting" && <span className="w-2 h-2 rounded-full bg-muted/40" />}
              {step.status === "error" && <X className="w-3.5 h-3.5 text-red-400" />}
            </div>

            {/* Label */}
            <span
              className={cn(
                "text-sm transition-colors",
                step.status === "done" && "text-white",
                step.status === "active" && "text-gold font-medium animate-pulse-gold",
                step.status === "waiting" && "text-muted",
                step.status === "error" && "text-red-400"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Timer */}
      <p className="text-center text-xs text-muted">
        Geçen süre: {formatTime(elapsedTime)}
      </p>
    </div>
  );
}
