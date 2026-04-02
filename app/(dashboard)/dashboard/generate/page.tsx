"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BuildingStyle, OutputType } from "@/lib/types";
import StepUpload from "@/components/GenerateFlow/StepUpload";
import StepStyle from "@/components/GenerateFlow/StepStyle";
import StepOutput from "@/components/GenerateFlow/StepOutput";
import StepProgress from "@/components/GenerateFlow/StepProgress";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Step = "upload" | "style" | "output" | "generating";

const STEP_LABELS = ["Fotoğraf", "Stil", "Çıktı", "Oluşturuluyor"];
const STEP_KEYS: Step[] = ["upload", "style", "output", "generating"];

export default function GeneratePage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>("upload");
  const [landImageUrl, setLandImageUrl] = useState("");
  const [style, setStyle] = useState<BuildingStyle | null>(null);
  const [outputType, setOutputType] = useState<OutputType>("image_and_video");
  const [credits, setCredits] = useState(0);
  const [generationId, setGenerationId] = useState("");
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [startError, setStartError] = useState("");

  useEffect(() => {
    const fetchCredits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();
      if (data) setCredits(data.credits);
    };
    fetchCredits();
  }, []);

  const currentStepIndex = STEP_KEYS.indexOf(step);

  const handleGenerate = async (type: OutputType) => {
    setOutputType(type);
    setStartError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landImageUrl,
          style,
          outputType: type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setShowCreditsModal(true);
          return;
        }
        throw new Error(data.error || "Bir hata oluştu");
      }

      setGenerationId(data.generationId);
      setStep("generating");
    } catch (err) {
      setStartError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-2">
          Yeni Görselleştirme
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-4">
          {STEP_LABELS.slice(0, 3).map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-2",
                  i < currentStepIndex && "text-gold",
                  i === currentStepIndex && "text-white",
                  i > currentStepIndex && "text-muted"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border",
                    i < currentStepIndex && "bg-gold border-gold text-black",
                    i === currentStepIndex && "border-gold text-gold bg-gold/10",
                    i > currentStepIndex && "border-border text-muted"
                  )}
                >
                  {i < currentStepIndex ? "✓" : i + 1}
                </div>
                <span className="text-sm hidden sm:block">{label}</span>
              </div>
              {i < 2 && (
                <div
                  className={cn(
                    "flex-1 h-px w-8 sm:w-12",
                    i < currentStepIndex ? "bg-gold/50" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-xl">
        {step === "upload" && (
          <StepUpload
            onNext={(url) => {
              setLandImageUrl(url);
              setStep("style");
            }}
          />
        )}

        {step === "style" && (
          <StepStyle
            onNext={(s) => {
              setStyle(s);
              setStep("output");
            }}
            onBack={() => setStep("upload")}
          />
        )}

        {step === "output" && (
          <>
            <StepOutput
              credits={credits}
              onNext={handleGenerate}
              onBack={() => setStep("style")}
              onBuyCredits={() => setShowCreditsModal(true)}
            />
            {startError && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                {startError}
              </div>
            )}
          </>
        )}

        {step === "generating" && generationId && (
          <StepProgress
            generationId={generationId}
            includeVideo={outputType === "image_and_video"}
            onComplete={(id) => router.push(`/dashboard/result/${id}`)}
            onError={(msg) => {
              setStartError(msg);
              setStep("output");
            }}
          />
        )}
      </div>

      {/* Credits modal */}
      <Modal
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        title="Kredi Yetersiz"
      >
        <div className="text-center">
          <div className="text-5xl mb-4">💳</div>
          <p className="text-muted text-sm mb-6">
            Bu işlem için yeterli krediniz bulunmuyor. Kredi satın alarak
            görselleştirmeye devam edebilirsiniz.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowCreditsModal(false)}
              fullWidth
            >
              İptal
            </Button>
            <Link href="/dashboard/credits" className="flex-1">
              <Button fullWidth>Kredi Satın Al</Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
