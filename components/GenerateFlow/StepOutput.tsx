"use client";

import { useState } from "react";
import { ImageIcon, Film, Sparkles, AlertCircle } from "lucide-react";
import { OutputType } from "@/lib/types";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface StepOutputProps {
  credits: number;
  onNext: (outputType: OutputType) => void;
  onBack: () => void;
  onBuyCredits: () => void;
}

const options = [
  {
    id: "image_only" as OutputType,
    title: "Sadece Görsel",
    subtitle: "Fotoğrafik render",
    description: "Arsanızın üzerine gerçekçi bina görseli oluşturulur",
    credits: 1,
    icon: ImageIcon,
    emoji: "🖼️",
    features: ["4K çözünürlük render", "Anında hazır (~30sn)", "İndirme & paylaşım"],
  },
  {
    id: "image_and_video" as OutputType,
    title: "Görsel + Video",
    subtitle: "Sinematik deneyim",
    description: "Render + 8 saniyelik drone kamera videosu",
    credits: 4,
    icon: Film,
    emoji: "🎬",
    recommended: true,
    features: ["Görsel render dahil", "8 sn sinematik video", "Müşteri sunumu için ideal"],
  },
];

export default function StepOutput({
  credits,
  onNext,
  onBack,
  onBuyCredits,
}: StepOutputProps) {
  const [selected, setSelected] = useState<OutputType>("image_and_video");

  const selectedOption = options.find((o) => o.id === selected)!;
  const hasEnoughCredits = credits >= selectedOption.credits;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">
          Çıktı Türü Seçin
        </h2>
        <p className="text-muted text-sm">
          Bakiyeniz:{" "}
          <span className="text-gold font-medium">{credits} kredi</span>
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const canAfford = credits >= option.credits;
          return (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={cn(
                "w-full text-left rounded-xl border-2 p-5 transition-all duration-200",
                selected === option.id
                  ? "border-gold bg-gold/5"
                  : "border-border hover:border-gold/30",
                !canAfford && "opacity-60"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0",
                    selected === option.id
                      ? "bg-gold/20"
                      : "bg-[#111]"
                  )}
                >
                  {option.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{option.title}</span>
                    {option.recommended && (
                      <span className="flex items-center gap-1 bg-gold/20 text-gold text-xs font-medium px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Önerilen
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted mb-3">{option.description}</p>
                  <ul className="space-y-1">
                    {option.features.map((f) => (
                      <li key={f} className="text-xs text-muted flex items-center gap-1.5">
                        <span className="text-gold">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-gold text-lg">{option.credits}</div>
                  <div className="text-xs text-muted">kredi</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Insufficient credits warning */}
      {!hasEnoughCredits && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-400">Yetersiz Kredi</p>
            <p className="text-xs text-muted mt-1">
              Bu seçenek için {selectedOption.credits} kredi gerekirken{" "}
              {credits} krediniz var.
            </p>
            <button
              onClick={onBuyCredits}
              className="text-xs text-gold underline mt-1 hover:text-gold-light"
            >
              Kredi satın al →
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onBack} size="lg" className="flex-1">
          ← Geri
        </Button>
        <Button
          onClick={() => onNext(selected)}
          disabled={!hasEnoughCredits}
          size="lg"
          className="flex-1"
        >
          Oluştur ({selectedOption.credits} kredi)
        </Button>
      </div>
    </div>
  );
}
