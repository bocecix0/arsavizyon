"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-posta veya şifre hatalı"
          : "Giriş yapılırken bir hata oluştu"
      );
      setLoading(false);
    } else {
      router.push(redirect);
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Giriş Yap</h1>
        <p className="text-muted text-sm">
          Hesabınıza giriş yaparak görselleştirmeye devam edin
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            id="email"
            label="E-posta"
            type="email"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-white/80">
              Şifre
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full h-11 px-4 pr-11 rounded-lg bg-[#111] border border-border text-white placeholder-muted text-sm transition-all focus:outline-none focus:border-gold/50"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} fullWidth size="lg">
            <LogIn className="w-4 h-4" />
            Giriş Yap
          </Button>
        </form>
      </Card>

      <p className="text-center text-muted text-sm mt-6">
        Hesabınız yok mu?{" "}
        <Link
          href="/signup"
          className="text-gold hover:text-gold-light transition-colors font-medium"
        >
          Kayıt Ol
        </Link>
      </p>

      <p className="text-center text-muted/50 text-xs mt-3">
        Kayıt olunca{" "}
        <span className="text-gold/70">3 ücretsiz kredi</span> kazanırsınız
      </p>
    </div>
  );
}
