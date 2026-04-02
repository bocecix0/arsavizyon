"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { BuildingStyle, BUILDING_STYLES } from "@/lib/types";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface StepStyleProps {
  onNext: (style: BuildingStyle) => void;
  onBack: () => void;
}

const styleColors: Record<BuildingStyle, string> = {
  modern_minimal: "from-zinc-800 to-zinc-900",
  luxury_villa: "from-amber-900/50 to-stone-900",
  bodrum_ege: "from-blue-900/40 to-sky-950",
  industrial_loft: "from-neutral-800 to-neutral-900",
  classic_ottoman: "from-amber-950 to-red-950/50",
  green_eco: "from-emerald-900/40 to-green-950",
};

export default function StepStyle({ onNext, onBack }: StepStyleProps) {
  const [selected, setSelected] = useState<BuildingStyle | null>(null);

  const styles = Object.entries(BUILDING_STYLES) as [
    BuildingStyle,
    (typeof BUILDING_STYLES)[BuildingStyle]
  ][];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">
          Mimari Stil Seçin
        </h2>
        <p className="text-muted text-sm">
          Projenize en uygun mimari stilini seçin
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {styles.map(([key, style]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={cn(
              "relative rounded-xl overflow-hidden border-2 transition-all duration-200 text-left group",
              selected === key
                ? "border-gold shadow-lg shadow-gold/20"
                : "border-border hover:border-gold/30"
            )}
          >
            {/* Gradient bg */}
            <div
              className={`h-20 bg-gradient-to-br ${styleColors[key]} flex items-center justify-center`}
            >
              <span className="text-4xl">{style.emoji}</span>
            </div>

            {/* Info */}
            <div className="p-3 bg-card">
              <div className="font-medium text-sm text-white">{style.label}</div>
              <div className="text-xs text-muted mt-0.5">{style.description}</div>
            </div>

            {/* Selected indicator */}
            {selected === key && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-black font-bold" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onBack} size="lg" className="flex-1">
          ← Geri
        </Button>
        <Button
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          size="lg"
          className="flex-1"
        >
          Devam Et →
        </Button>
      </div>
    </div>
  );
}
