"use client";

import Link from "next/link";
import { Building2, ArrowUpRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      className={`border-t border-border py-12 px-4 sm:px-6 relative overflow-hidden reveal ${visible ? "visible" : ""}`}
    >
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-gold/3 rounded-full blur-[60px] pointer-events-none"/>

      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-gold/20">
                <Building2 className="w-4 h-4 text-black"/>
              </div>
              <span className="font-display text-lg font-semibold text-gradient-gold">ArsaVizyon</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              AI destekli arsa görselleştirme platformu. Arsanızın geleceğini saniyeler içinde görün.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted/60 bg-white/3 border border-white/5 rounded-lg px-3 py-1.5">
              🏙️ Bodrum'dan İstanbul'a 500+ Müteahhit
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/80">Platform</h4>
            <ul className="space-y-2.5">
              {[["Ana Sayfa","/"],["Nasıl Çalışır","/#nasil-calisir"],["Fiyatlar","/#fiyatlar"],["Dashboard","/dashboard"]].map(([l,h]) => (
                <li key={h}>
                  <Link href={h} className="group text-sm text-muted hover:text-white transition-colors flex items-center gap-1">
                    {l}<ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/80">Hesap</h4>
            <ul className="space-y-2.5">
              {[["Giriş Yap","/login"],["Kayıt Ol","/signup"],["Kredi Satın Al","/dashboard/credits"]].map(([l,h]) => (
                <li key={h}>
                  <Link href={h} className="group text-sm text-muted hover:text-white transition-colors flex items-center gap-1">
                    {l}<ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">© 2025 ArsaVizyon. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            {[["Gizlilik","#"],["Kullanım Şartları","#"],["İletişim","#"]].map(([l,h]) => (
              <Link key={l} href={h} className="text-xs text-muted hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
