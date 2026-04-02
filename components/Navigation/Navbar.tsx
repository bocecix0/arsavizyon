"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Coins, LogOut, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => fetchProfile());
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/#nasil-calisir", label: "Nasıl Çalışır" },
    { href: "/#fiyatlar", label: "Fiyatlar" },
  ];

  const navOpacity = Math.min(scrollY / 80, 1);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled
            ? `rgba(10,10,10,${0.6 + navOpacity * 0.3})`
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-lg shadow-gold/30 group-hover:scale-110 group-hover:shadow-gold/50 transition-all duration-200">
                <Building2 className="w-4 h-4 text-black"/>
              </div>
              <span className="font-display text-lg font-semibold text-gradient-gold">
                ArsaVizyon
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm transition-all duration-200 hover:text-white relative group",
                    pathname === link.href ? "text-gold" : "text-muted"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-200",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}/>
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {profile ? (
                <>
                  <Link href="/dashboard/credits">
                    <div className="flex items-center gap-1.5 bg-gold/10 border border-gold/20 rounded-lg px-3 py-1.5 text-sm text-gold hover:bg-gold/20 transition-all duration-200 hover:scale-[1.03] cursor-pointer">
                      <Coins className="w-3.5 h-3.5"/>
                      <span className="font-semibold">{profile.credits}</span>
                      <span className="text-gold/70 text-xs">kredi</span>
                    </div>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="secondary" size="sm">Dashboard</Button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-muted hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                  >
                    <LogOut className="w-4 h-4"/>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Giriş Yap</Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Ücretsiz Dene</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden text-muted hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      />

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-40 w-72 md:hidden bg-card border-l border-border flex flex-col transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-black"/>
            </div>
            <span className="font-display text-base font-semibold text-gradient-gold">ArsaVizyon</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="text-muted hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
            <X className="w-4 h-4"/>
          </button>
        </div>

        <nav className="flex-1 p-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all",
                pathname === link.href ? "bg-gold/10 text-gold" : "text-muted hover:text-white hover:bg-white/5"
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-5 border-t border-border space-y-2">
          {profile ? (
            <>
              <div className="flex items-center gap-2 text-gold text-sm mb-3 bg-gold/10 border border-gold/20 rounded-xl px-4 py-2.5">
                <Coins className="w-4 h-4"/>
                <span className="font-semibold">{profile.credits} kredi</span>
              </div>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" fullWidth>Dashboard</Button>
              </Link>
              <Button variant="ghost" fullWidth onClick={handleSignOut}>
                <LogOut className="w-4 h-4"/>Çıkış Yap
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" fullWidth>Giriş Yap</Button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button fullWidth>Ücretsiz Dene</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
