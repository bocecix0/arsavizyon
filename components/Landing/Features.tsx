"use client";

import { useRef, useEffect, useState } from "react";
import { Heart, Sun, Home, Shield, Leaf, Gem } from "lucide-react";

const features = [
  { icon: Heart, title: "Hayalinize Dokunun", desc: "Boş arsanızın üzerine inşa edilecek yuvanızı saniyeler içinde görün. Yapay zeka değil, geleceğinize ayna tutuyoruz.", tag: "Hızlı & Etkileyici", color: "from-rose-500/20 to-red-600/5" },
  { icon: Sun, title: "Geleceği İzleyin", desc: "Evinizin temelden çatıya yükselişini izleyin. Hayalinizdeki yaşam alanının doğuşuna şahit olun.", tag: "Sinematik", color: "from-amber-500/20 to-yellow-600/5" },
  { icon: Home, title: "Size Özel Stiller", desc: "Sıcak bir taş ev, modern bir villa veya doğayla iç içe eko-yaşam. Sizin aileniz, sizin tarzınız.", tag: "Kişiselleştirilmiş", color: "from-orange-500/20 to-red-700/5" },
  { icon: Shield, title: "Güvenli Mimari", desc: "Hayalleriniz bizimle güvende. İstediğiniz zaman ailenizle paylaşın, geleceği birlikte planlayın.", tag: "Sonsuz Güven", color: "from-emerald-500/20 to-green-700/5" },
  { icon: Leaf, title: "Doğa ile Uyum", desc: "Arsanızın doğal yapısına en uygun, aileniz için huzur dolu alanlar yaratın.", tag: "Huzurlu Yaşam", color: "from-teal-500/20 to-emerald-700/5" },
  { icon: Gem, title: "Paha Biçilemez Detaylar", desc: "Gerçek kadar net, hayal kadar kusursuz. En küçük ayrıntısına kadar yuvanızı hissedin.", tag: "Eşsiz Kalite", color: "from-gold/20 to-amber-700/5" },
];

const steps = [
  { n: "01", emoji: "🌱", title: "Arsanızı Ekleyin", desc: "Geleceğinizi inşa edeceğiniz toprağın fotoğrafını yükleyin." },
  { n: "02", emoji: "🏡", title: "Hayalinizi Seçin", desc: "Sizi en çok yansıtan, aileniz için en huzurlu stili belirleyin." },
  { n: "03", emoji: "✨", title: "Yuvanızla Tanışın", desc: "Saniyeler içinde gelecekteki evinizin kapılarını aralayın." },
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
            Hayalleriniz <span className="text-gradient-gold">Gerçekleşiyor</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Yüzlerce aile, bir toprak parçasının nasıl sıcak bir yuvaya dönüşebileceğini ArsaVizyon ile keşfetti. Geleceğinize giden ilk adımı atın.
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
              <div className="w-6 h-px bg-gold/50"/>ADIM ADIM<div className="w-6 h-px bg-gold/50"/>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
              3 Adımda Yeni Hayatınız
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
