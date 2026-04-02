import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Download, Share2, Plus, Calendar, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BUILDING_STYLES } from "@/lib/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import ShareButton from "@/components/Dashboard/ShareButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: generation } = await supabase
    .from("generations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!generation) notFound();

  const style =
    BUILDING_STYLES[generation.building_style as keyof typeof BUILDING_STYLES];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">
            {style?.label || "Görselleştirme"}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-muted text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(generation.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {generation.credits_used} kredi
            </span>
          </div>
        </div>
        <Link href="/dashboard/generate">
          <Button>
            <Plus className="w-4 h-4" />
            Yeni Proje
          </Button>
        </Link>
      </div>

      {generation.status !== "completed" ? (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4">
            {generation.status === "failed" ? "❌" : "⏳"}
          </div>
          <h2 className="font-display text-xl font-semibold mb-2">
            {generation.status === "failed"
              ? "Oluşturma Başarısız"
              : "İşleniyor..."}
          </h2>
          <p className="text-muted text-sm">
            {generation.status === "failed"
              ? "Bu görsel oluşturulurken bir hata oluştu."
              : "Görseliniz hazırlanıyor. Lütfen bekleyin..."}
          </p>
          {generation.status !== "failed" && (
            <div className="mt-4 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gold/60 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Render image */}
          {generation.render_image_url && (
            <Card gold className="overflow-hidden">
              <div className="relative aspect-video bg-[#111]">
                <Image
                  src={generation.render_image_url}
                  alt={`${style?.label} render`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Mimari Render</p>
                  <p className="text-xs text-muted">4K çözünürlük</p>
                </div>
                <div className="flex gap-2">
                  <ShareButton url={generation.render_image_url} />
                  <a
                    href={generation.render_image_url}
                    download="arsa-render.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4" />
                      İndir
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          )}

          {/* Video */}
          {generation.video_url && (
            <Card gold className="overflow-hidden">
              <div className="relative bg-[#111]">
                <video
                  src={generation.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="w-full aspect-video"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Sinematik Video</p>
                  <p className="text-xs text-muted">8 saniye · 16:9</p>
                </div>
                <div className="flex gap-2">
                  <ShareButton url={generation.video_url} />
                  <a
                    href={generation.video_url}
                    download="arsa-video.mp4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4" />
                      İndir
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          )}

          {/* Details */}
          <Card className="p-5">
            <h3 className="font-semibold mb-4">Detaylar</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted text-xs mb-1">Mimari Stil</p>
                <p className="font-medium">
                  {style?.emoji} {style?.label}
                </p>
              </div>
              <div>
                <p className="text-muted text-xs mb-1">Durum</p>
                <Badge variant="success">Tamamlandı</Badge>
              </div>
              <div>
                <p className="text-muted text-xs mb-1">Harcanan Kredi</p>
                <p className="font-medium text-gold">{generation.credits_used} kredi</p>
              </div>
              <div>
                <p className="text-muted text-xs mb-1">Oluşturma Tarihi</p>
                <p className="font-medium">{formatDate(generation.created_at)}</p>
              </div>
              <div>
                <p className="text-muted text-xs mb-1">Çıktı</p>
                <p className="font-medium">
                  {generation.video_url ? "Görsel + Video" : "Sadece Görsel"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
