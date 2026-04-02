"use client";

import { useState, useEffect } from "react";
import { Check, Sparkles, Coins, Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CREDIT_PACKAGES } from "@/lib/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  created_at: string;
}

export default function CreditsPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, txRes] = await Promise.all([
        supabase.from("profiles").select("credits").eq("id", user.id).single(),
        supabase
          .from("credit_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (profileRes.data) setCredits(profileRes.data.credits);
      if (txRes.data) setTransactions(txRes.data);
    };
    fetchData();
  }, []);

  const handlePurchase = async (priceId: string, pkgId: string) => {
    setLoadingPkg(pkgId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Ödeme işlemi başlatılamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoadingPkg(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Kredi Satın Al</h1>
        <p className="text-muted text-sm mt-1">
          Mevcut bakiye:{" "}
          {credits === null ? (
            <span className="text-muted">Yükleniyor...</span>
          ) : (
            <span className="text-gold font-semibold">{credits} kredi</span>
          )}
        </p>
      </div>

      {/* Usage info */}
      <Card className="p-4 mb-8 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-xl">🖼️</span>
          <span>Sadece görsel = <span className="text-white font-medium">1 kredi</span></span>
        </div>
        <div className="w-px h-5 bg-border hidden sm:block" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-xl">🎬</span>
          <span>Görsel + video = <span className="text-white font-medium">4 kredi</span></span>
        </div>
        <div className="w-px h-5 bg-border hidden sm:block" />
        <div className="flex items-center gap-2 text-sm text-muted">
          Krediler sona ermez
        </div>
      </Card>

      {/* Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            gold={pkg.popular}
            className={cn("p-6 relative", pkg.popular && "scale-[1.02]")}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <div className="flex items-center gap-1 bg-gradient-gold text-black text-xs font-bold px-4 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  En Popüler
                </div>
              </div>
            )}

            <div className="mb-5">
              <h3 className="font-semibold text-lg">{pkg.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="font-display text-3xl font-bold text-gold">
                  ₺{pkg.price}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-muted text-sm">
                <Coins className="w-4 h-4 text-gold" />
                <span className="font-semibold text-white">{pkg.credits} kredi</span>
              </div>
            </div>

            <ul className="space-y-2 mb-5">
              {[
                `${pkg.credits} görsel render`,
                `${Math.floor(pkg.credits / 4)} görsel+video paketi`,
                "Tüm mimari stiller",
                "Yüksek çözünürlük",
                "Sona ermez",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted">
                  <Check className="w-4 h-4 text-gold shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant={pkg.popular ? "primary" : "outline"}
              fullWidth
              loading={loadingPkg === pkg.id}
              onClick={() => handlePurchase(pkg.priceId, pkg.id)}
            >
              Satın Al
            </Button>
          </Card>
        ))}
      </div>

      {/* Transaction history */}
      {transactions.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-gold" />
            İşlem Geçmişi
          </h2>
          <Card>
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted">{formatDate(tx.created_at)}</p>
                  </div>
                  <Badge variant={tx.amount > 0 ? "success" : "warning"}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount} kredi
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
