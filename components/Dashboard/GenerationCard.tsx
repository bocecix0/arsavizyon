import Link from "next/link";
import Image from "next/image";
import { Calendar, Sparkles } from "lucide-react";
import { Generation } from "@/lib/types";
import { BUILDING_STYLES } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import { formatDateShort } from "@/lib/utils";

interface GenerationCardProps {
  generation: Generation;
}

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "error" | "info" | "default" | "gold" }
> = {
  pending: { label: "Bekliyor", variant: "warning" },
  rendering: { label: "Render ediliyor...", variant: "info" },
  generating_video: { label: "Video oluşturuluyor...", variant: "info" },
  completed: { label: "Tamamlandı", variant: "success" },
  failed: { label: "Başarısız", variant: "error" },
};

export default function GenerationCard({ generation }: GenerationCardProps) {
  const style = BUILDING_STYLES[generation.building_style as keyof typeof BUILDING_STYLES];
  const status = statusConfig[generation.status] || { label: generation.status, variant: "default" as const };

  return (
    <Link href={`/dashboard/result/${generation.id}`}>
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-200 group cursor-pointer">
        {/* Thumbnail */}
        <div className="aspect-video bg-[#111] relative overflow-hidden">
          {generation.render_image_url ? (
            <Image
              src={generation.render_image_url}
              alt={style?.label || "Render"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="text-3xl">{style?.emoji || "🏢"}</div>
              {generation.status !== "completed" && generation.status !== "failed" && (
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video badge */}
          {generation.video_url && (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 text-xs text-gold">
              🎬 Video
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-sm truncate">
              {style?.label || generation.building_style}
            </h3>
            <Badge variant={status.variant as "success" | "warning" | "error" | "info" | "default" | "gold"}>
              {status.label}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDateShort(generation.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {generation.credits_used} kredi
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
