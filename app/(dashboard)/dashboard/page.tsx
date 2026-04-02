import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import GenerationCard from "@/components/Dashboard/GenerationCard";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Generation } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileResult, generationsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const profile = profileResult.data;
  const generations: Generation[] = generationsResult.data || [];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">
            Merhaba,{" "}
            <span className="text-gradient-gold">
              {profile?.full_name?.split(" ")[0] || "Kullanıcı"}
            </span>{" "}
            👋
          </h1>
          <p className="text-muted text-sm mt-1">
            {generations.length === 0
              ? "Henüz görsel oluşturmadınız. Hemen başlayın!"
              : `${generations.length} görselleştirme`}
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button>
            <Plus className="w-4 h-4" />
            Yeni Görselleştirme
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      {generations.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6 text-4xl">
            🏗️
          </div>
          <h2 className="font-display text-xl font-semibold mb-2">
            İlk Görselinizi Oluşturun
          </h2>
          <p className="text-muted text-sm max-w-sm mx-auto mb-6">
            Arsa fotoğrafınızı yükleyin, stil seçin ve 30 saniyede profesyonel
            render alın.
          </p>
          <Link href="/dashboard/generate">
            <Button size="lg">
              <Sparkles className="w-4 h-4" />
              Görsel Oluştur
            </Button>
          </Link>
          <p className="text-muted/60 text-xs mt-4">
            {profile?.credits || 0} krediniz mevcut
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {generations.map((gen) => (
            <GenerationCard key={gen.id} generation={gen} />
          ))}
        </div>
      )}
    </div>
  );
}
