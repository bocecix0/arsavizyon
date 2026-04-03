"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Star, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePos = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePos(x);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-black cursor-col-resize select-none"
      onMouseDown={(e) => { dragging.current = true; updatePos(e.clientX); }}
      onTouchStart={(e) => { dragging.current = true; updatePos(e.touches[0].clientX); }}
    >
      {/* After (full width underneath) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a1c12] to-[#140c06] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-3">🏡</div>
          <div className="text-gold text-sm font-medium">Geleceğiniz</div>
          <div className="text-xs text-muted mt-1">Sıcak, güvenli yuvanız</div>
        </div>
        <div className="absolute bottom-4 right-4 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-lg px-3 py-1.5 text-xs text-gold font-medium">
          ✨ Gelecek
        </div>
        {/* Fake building lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 225" fill="none">
          <rect x="120" y="60" width="160" height="140" stroke="#D4A373" strokeWidth="1"/>
          <rect x="160" y="30" width="80" height="35" stroke="#D4A373" strokeWidth="1"/>
          {[130,150,170,190,210,230,250].map(x =>
            [70,100,130,160].map(y => (
              <rect key={`${x}-${y}`} x={x} y={y} width="12" height="18" fill="#D4A373" opacity="0.4"/>
            ))
          )}
        </svg>
      </div>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1C1714] to-[#120E0B] flex items-center justify-center"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <div className="text-center">
          <div className="text-6xl mb-3">🌱</div>
          <div className="text-white/60 text-sm font-medium">Bugün</div>
          <div className="text-xs text-muted mt-1">Boş bir arsa</div>
        </div>
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 text-xs text-muted">
          Bugün
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
        style={{ left: `${pos}%` }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-gold">
          <div className="flex gap-0.5">
            <ChevronRight className="w-3 h-3 text-black -rotate-180" />
            <ChevronRight className="w-3 h-3 text-black" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gold/6 rounded-full blur-[120px] pointer-events-none float-slow" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-gold/4 rounded-full blur-[80px] pointer-events-none float-med" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-amber-600/4 rounded-full blur-[60px] pointer-events-none float-fast" />

      {/* Architectural grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C9A84C" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* Badge */}
        <div className={`inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-8 transition-all duration-700 delay-100 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="flex -space-x-1">
            {["bg-gold/80","bg-gold/60","bg-gold/40"].map((c,i) => (
              <div key={i} className={`w-5 h-5 rounded-full ${c} border border-gold/50`}/>
            ))}
          </div>
          <Star className="w-3.5 h-3.5 text-gold fill-gold" />
          <span className="text-xs text-gold font-medium">Binlerce mutlu aile kullanıyor</span>
        </div>

        {/* Headline */}
        <h1 className={`font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          Hayalinizdeki{" "}
          <span className="text-gradient-gold">Yuvayı</span>
          <br />
          <span className="text-white">Bugün Görün</span>
        </h1>

        {/* Sub */}
        <p className={`text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          Arsanız sadece topraktan ibaret değil; ailenizin geleceği, yeni yuvanızın temeli.
          <br className="hidden sm:block"/>
          Hayallerinizdeki yaşam alanını{" "}
          <span className="text-white font-medium">saniyeler içinde gerçeğe dönüştürün.</span>
        </p>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Link href="/signup">
            <button className="btn-shimmer group relative inline-flex items-center gap-2 h-13 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-gold via-[#E8C97A] to-gold text-black shadow-lg shadow-gold/30 hover:shadow-gold/50 hover:scale-[1.03] transition-all duration-200 active:scale-[0.97]">
              Ücretsiz Dene
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
            </button>
          </Link>
          <button className="group flex items-center gap-3 text-muted hover:text-white transition-colors duration-200">
            <div className="pulse-ring w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-gold/40 transition-colors bg-white/5">
              <Play className="w-4 h-4 fill-current ml-0.5"/>
            </div>
            <span className="text-sm font-medium">Demo İzle</span>
          </button>
        </div>

        {/* Before/After slider */}
        <div className={`max-w-3xl mx-auto transition-all duration-1000 delay-500 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="mb-3 flex items-center justify-center gap-2 text-xs text-muted">
            <span>← Kaydırın →</span>
          </div>
          <BeforeAfterSlider />
        </div>

        {/* Stats */}
        <div className={`mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto transition-all duration-700 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {[
            { value: "30sn", label: "Gerçekleşen Hayal" },
            { value: "Sınırsız", label: "Yaşam Alanı" },
            { value: "500+", label: "Mutlu Aile" },
          ].map((s) => (
            <div key={s.label} className="text-center group">
              <div className="font-display text-3xl font-bold text-gradient-gold group-hover:scale-110 transition-transform duration-200 inline-block">{s.value}</div>
              <div className="text-xs text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
