"use client";

import { useRef, useEffect, useState } from "react";
import { Zap, Film, Palette, Shield, Clock, Download } from "lucide-react";

const features = [
  { icon: Zap, title: "Anında Görsel", desc: "Fotoğraf yükle, 30 saniyede profesyonel render. AI teknolojisi ile arsanızın üzerine mükemmel bina tasarımı.", tag: "~30 saniye", color: "from-amber-500/20 to-yellow-600/5" },
  { icon: Film, title: "İnşaat Videosu", desc: "8 saniyelik sinematik drone videosu ile müşterilerinizi ikna edin. Temel kazımadan tamamlanmaya kadar.", tag: "8 sn video", color: "from-purple-500/20 to-purple-700/5" },
  { icon: Palette, title: "6 Bina Stili", desc: "Ege villasından modern rezidansa, Osmanlı mimarisinden eco tasarıma — her tarza uygun stil.", tag: "6 seçenek", color: "from-pink-500/20 to-rose-700/5" },
  { icon: Shield, title: "Güvenli Depolama", desc: "Tüm görsel ve videolarınız güvenli bulutumuzda saklanır. İstediğiniz zaman indirin veya paylaşın.", tag: "Kalıcı", color: "from-emerald-500/20 to-green-700/5" },
  { icon: Clock, title: "7/24 Erişim", desc: "Saat fark etmeksizin, istediğiniz yerden görsel üretin. Sunucularımız her zaman aktif.", tag: "7/24 aktif", color: "from-blue-500/20 to-sky-700/5" },
  { icon: Download, title: "4K Çözünürlük", desc: "Baskı kalitesinde render çıktıları. Profesyonel sunumlar için hazır yüksek çözünürlüklü dosyalar.", tag: "4K", color: "from-gold/20 to-amber-700/5" },
];

const steps = [
  { n: "01", emoji: "📸", title: "Fotoğraf Yükle", desc: "Arsa veya arazinizin fotoğrafını yükleyin. JPG, PNG veya WebP." },
  { n: "02", emoji: "🎨", title: "Stil Seç", desc: "6 farklı mimari stil arasından projenize uygun olanı seçin." },
  { n: "03", emoji: "✨", title: "Görsel Al", desc: "30 saniye bekleyin, render ve/veya videoyu indirin." },
];

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return { ref, visible };
}

function FeatureCard({ feature, delay }: { feature: typeof features[0]; delay: number }) {
  const { ref, visible } = useReveal(delay);
  return (
    <div
      ref={ref}
      className={`reveal reveal-scale ${visible ? "visible" : ""} group relative bg-card border border-border rounded-2xl p-6 overflow-hidden hover:border-gold/30 transition-all duration-300 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1`}
    >
      {/* Gradient bg on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}/>

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gold/20 group-hover:border-gold/40 transition-all duration-300">
          <feature.icon className="w-5 h-5 text-gold"/>
        </div>
        <h3 className="font-semibold text-white mb-2 group-hover:text-gold transition-colors duration-200">{feature.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
        <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-gold bg-gold/10 border border-gold/20 rounded-full px-3 py-1 group-hover:bg-gold/20 transition-colors">
          {feature.tag}
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [stepsVisible, setStepsVisible] = useState(false);

  useEffect(() => {
    const obs = (el: Element | null, cb: () => void) => {
      if (!el) return;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { cb(); o.disconnect(); } }, { threshold: 0.1 });
      o.observe(el);
    };
    obs(headerRef.current, () => setHeaderVisible(true));
    obs(stepsRef.current, () => setStepsVisible(true));
  }, []);

  return (
    <section id="nasil-calisir" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 reveal ${headerVisible ? "visible" : ""}`}
        >
          <div className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-4">
            <div className="w-8 h-px bg-gold/50"/>ÖZELLİKLER<div className="w-8 h-px bg-gold/50"/>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Neden <span className="text-gradient-gold">ArsaVizyon</span>?
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Bodrum'dan İstanbul'a yüzlerce müteahhit ve gayrimenkul geliştirici
            ArsaVizyon ile müşterilerine çarpıcı sunumlar yapıyor.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} delay={i * 80} />
          ))}
        </div>

        {/* Divider */}
        <div className="mt-24 mb-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border"/>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-gold text-sm font-medium">
              <div className="w-6 h-px bg-gold/50"/>NASIL ÇALIŞIR<div className="w-6 h-px bg-gold/50"/>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
              3 Adımda Profesyonel Görsel
            </h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border"/>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line desktop */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"/>

          {steps.map((s, i) => (
            <div
              key={i}
              className={`text-center reveal ${stepsVisible ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="relative inline-block mb-5">
                <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-4xl mx-auto hover:scale-110 hover:bg-gold/20 transition-all duration-300 cursor-default">
                  {s.emoji}
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-black text-xs font-bold shadow-lg shadow-gold/30">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed max-w-[200px] mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
