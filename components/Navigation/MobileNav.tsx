"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, History, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Ana Sayfa" },
  { href: "/dashboard/generate", icon: Sparkles, label: "Oluştur" },
  { href: "/dashboard", icon: History, label: "Geçmiş" },
  { href: "/dashboard/credits", icon: Coins, label: "Kredi" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
                isActive ? "text-gold" : "text-muted hover:text-white"
              )}
            >
              <item.icon
                className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_6px_rgba(201,168,76,0.6)]")}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
