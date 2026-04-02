"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  Home,
  Sparkles,
  Coins,
  LogOut,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Ana Sayfa", exact: true },
  { href: "/dashboard/generate", icon: Sparkles, label: "Yeni Görsel" },
  { href: "/dashboard/credits", icon: Coins, label: "Kredi Satın Al" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();

    // Refresh on focus
    const handleFocus = () => fetchProfile();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-30">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
            <Building2 className="w-4 h-4 text-black" />
          </div>
          <span className="font-display text-lg font-semibold text-gradient-gold">
            ArsaVizyon
          </span>
        </Link>
      </div>

      {/* Credit balance */}
      {profile && (
        <div className="mx-4 mt-4">
          <Link
            href="/dashboard/credits"
            className="flex items-center gap-3 bg-gold/10 border border-gold/20 rounded-xl px-4 py-3 hover:bg-gold/15 transition-colors"
          >
            <Coins className="w-5 h-5 text-gold" />
            <div>
              <div className="text-xs text-muted">Kredi Bakiyesi</div>
              <div className="font-bold text-gold">{profile.credits} kredi</div>
            </div>
          </Link>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      {profile && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
              <User className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {profile.full_name || "Kullanıcı"}
              </div>
              <div className="text-xs text-muted truncate">{profile.email}</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors w-full px-2 py-2 rounded-lg hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      )}
    </aside>
  );
}
