"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { CREDIT_PACKAGES } from "@/lib/types";

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return { ref, visible };
}

function PricingCard({ pkg, delay }: { pkg: typeof CREDIT_PACKAGES[0]; delay: number }) {
  const { ref, visible } = useReveal(delay);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`reveal reveal-scale ${visible ? "visible" : ""} relative group cursor-default`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {pkg.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-1.5 btn-shimmer bg-gradient-to-r from-gold via-[#E8C97A] to-gold text-black text-xs font-bold px-5 py-1.5 rounded-full shadow-lg shadow-gold/40">
            <Sparkles className="w-3 h-3"/>En Popüler
          </div>
        </div>
      )}

      <div className={`relative overflow-hidden rounded-2xl border transition-all duration-400 h-full
        ${pkg.popular
          ? "border-gold/40 bg-gradient-to-b from-[#1f1a0a] to-card shadow-2xl shadow-gold/15 scale-[1.03]"
          : "border-border bg-card hover:border-gold/25 hover:shadow-xl hover:shadow-gold/5"
        }`}
      >
        {/* Animated top border glow for popular */}
        {pkg.popular && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"/>
        )}

        {/* Hover glow bg */}
        <div className={`absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}/>

        <div className="relative z-10 p-7">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{pkg.name}</h3>
            {pkg.popular && <Zap className="w-4 h-4 text-gold fill-gold"/>}
          </div>

          {/* Price */}
          <div className="flex items-end gap-1 my-4">
            <span className={`font-display text-5xl font-bold ${pkg.popular ? "text-gradient-gold" : "text-white group-hover:text-gold transition-colors duration-300"}`}>
              ₺{pkg.price}
            </span>
          </div>

          {/* Credits badge */}
          <div className="flex items-center gap-2 mb-6 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-lg">💎</div>
            <div>
              <div className="font-bold text-white">{pkg.credits} Kredi</div>
              <div className="text-xs text-muted">Sona ermez</div>
            </div>
          </div>

          <ul className="space-y-3 mb-7">
            {[
              `${pkg.credits} görsel render`,
              `${Math.floor(pkg.credits / 4)} görsel+video paketi`,
              "Tüm mimari stiller",
              "Yüksek çözünürlük indirme",
              "Kalıcı bulut depolama",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-muted">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${pkg.popular ? "bg-gold/20" : "bg-white/10"}`}>
                  <Check className={`w-2.5 h-2.5 ${pkg.popular ? "text-gold" : "text-white/60"}`}/>
                </div>
                {f}
              </li>
            ))}
          </ul>

          <Link href="/signup">
            <Button variant={pkg.popular ? "primary" : "outline"} fullWidth className={pkg.popular ? "btn-shimmer" : ""}>
              {pkg.popular ? "Hemen Başla" : "Satın Al"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, visible } = useReveal();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const total = 60;
    const timer = setInterval(() => {
      frame++;
      setCount(Math.round((frame / total) * target));
      if (frame >= total) clearInterval(timer);
    }, 1200 / total);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <div ref={ref} className={`text-center reveal ${visible ? "visible" : ""}`}>
      <div className="font-display text-4xl font-bold text-gradient-gold">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted mt-1">{label}</div>
    </div>
  );
}

export default function Pricing() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="fiyatlar" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[80px]"/>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div ref={headerRef} className={`text-center mb-6 reveal ${headerVisible ? "visible" : ""}`}>
          <div className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-4">
            <div className="w-8 h-px bg-gold/50"/>GELECEĞİNİZ<div className="w-8 h-px bg-gold/50"/>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Hayallerinize <span className="text-gradient-gold">Değer Katın</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Yeni hayatınıza başlamak için ilk adımı atın. Abonelik stresi olmadan, sadece ihtiyacınız kadar kullanın.
          </p>
        </div>

        {/* Credit cost pills */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 reveal ${headerVisible ? "visible delay-200" : ""}`}>
          {[
            { emoji: "🖼️", label: "Geleceğinize Bir Bakış", cost: "1 kredi" },
            { emoji: "🎬", label: "Yuvanızın Doğuş Hikayesi", cost: "4 kredi" },
            { emoji: "🎁", label: "Tanışma Hediyesi", cost: "3 ücretsiz" },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 text-sm hover:border-gold/30 transition-colors">
              <span>{p.emoji}</span>
              <span className="text-muted">{p.label}</span>
              <span className="text-white font-medium">= {p.cost}</span>
            </div>
          ))}
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {CREDIT_PACKAGES.map((pkg, i) => (
            <PricingCard key={pkg.id} pkg={pkg} delay={i * 100} />
          ))}
        </div>

        {/* Free note */}
        <p className={`text-center text-muted text-sm mt-8 reveal ${headerVisible ? "visible delay-400" : ""}`}>
          Kayıt olun ve{" "}
          <span className="text-gold font-medium">3 ücretsiz kredi</span> ile hemen başlayın.
          Kredi kartı gerekmez.
        </p>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-3 gap-6 border-t border-border pt-12">
          <StatCounter target={500} suffix="+" label="Mutlu Aile"/>
          <StatCounter target={30} suffix="sn" label="Gerçekleşen Hayal"/>
          <StatCounter target={6} suffix="" label="Sıcak Yuva Stili"/>
        </div>
      </div>
    </section>
  );
}
