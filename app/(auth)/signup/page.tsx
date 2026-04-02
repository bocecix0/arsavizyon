"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Gift } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Bu e-posta adresi zaten kayıtlı");
      } else {
        setError("Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.");
      }
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6 text-4xl">
          🎉
        </div>
        <h2 className="font-display text-2xl font-bold mb-3">Hoş Geldiniz!</h2>
        <p className="text-muted mb-2">Hesabınız başarıyla oluşturuldu.</p>
        <p className="text-gold font-medium">3 ücretsiz krediniz hazır! 🎁</p>
        <p className="text-muted text-sm mt-4">Dashboard'a yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Kayıt Ol</h1>
        <p className="text-muted text-sm">
          Ücretsiz hesap oluşturun, 3 kredi kazanın
        </p>
      </div>

      {/* Free credits badge */}
      <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-4 py-3 mb-6">
        <Gift className="w-5 h-5 text-gold shrink-0" />
        <div>
          <p className="text-sm font-medium text-gold">3 Ücretsiz Kredi</p>
          <p className="text-xs text-muted">Kayıt bonusu — kredi kartı gerekmez</p>
        </div>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSignup} className="space-y-5">
          <Input
            id="fullName"
            label="Ad Soyad"
            type="text"
            placeholder="Ahmet Yılmaz"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />

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
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
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
            <UserPlus className="w-4 h-4" />
            Kayıt Ol
          </Button>
        </form>
      </Card>

      <p className="text-center text-muted text-sm mt-6">
        Zaten hesabınız var mı?{" "}
        <Link
          href="/login"
          className="text-gold hover:text-gold-light transition-colors font-medium"
        >
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
