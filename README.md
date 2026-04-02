# ArsaVizyon — AI Arsa Görselleştirme Platformu

AI destekli arsa görselleştirme SaaS uygulaması. Türk gayrimenkul pazarı için tasarlanmıştır.

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env.local.example` dosyasını `.env.local` olarak kopyalayın ve doldurun:

```bash
cp .env.local.example .env.local
```

Gerekli değişkenler:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase proje URL'i
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `FAL_KEY` — fal.ai API key
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `NEXT_PUBLIC_APP_URL` — Uygulama URL'i (geliştirmede: http://localhost:3000)

### 3. Supabase Kurulumu

Supabase projenizi oluşturun ve `supabase/schema.sql` dosyasını Supabase SQL editöründe çalıştırın.

Bu script:
- `profiles`, `generations`, `credit_transactions` tablolarını oluşturur
- Row Level Security politikalarını ayarlar
- Yeni kullanıcı kaydında otomatik profil oluşturan trigger'ı ekler
- Storage bucket'larını oluşturur: `land-photos`, `renders`, `videos`

### 4. Stripe Kurulumu

**Ürünleri oluşturun:**
- Başlangıç: ₺149 (10 kredi)
- Profesyonel: ₺349 (30 kredi)
- Ajans: ₺999 (100 kredi)

**Fiyat ID'lerini** `.env.local` dosyasına ekleyin:
```
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_AGENCY=price_xxx
```

**Webhook kurun:**
```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 5. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

## Teknoloji Yığını

- **Next.js 14** — App Router, TypeScript
- **Supabase** — Auth, PostgreSQL, Storage, Realtime
- **fal.ai** — AI görsel (flux-pro) ve video (veo3.1) üretimi
- **Stripe** — Ödeme işlemleri
- **Tailwind CSS** — Styling

## Özellikler

- 🔐 E-posta/şifre authentication
- 💰 Kredi sistemi (3 ücretsiz kredi ile başla)
- 🏗️ AI ile arsa görselleştirme (6 mimari stil)
- 🎬 Sinematik drone videosu üretimi
- 💳 Stripe entegrasyonu ile kredi satın alma
- 📱 Mobile-first, responsive tasarım
- 🌙 Lüks dark theme (altın aksan)

## Kredi Maliyetleri

| Çıktı | Kredi |
|-------|-------|
| Sadece görsel | 1 kredi |
| Görsel + Video | 4 kredi |

## Dosya Yapısı

```
app/
├── (auth)/login, signup    # Auth sayfaları
├── (dashboard)/            # Korumalı dashboard
│   └── dashboard/
│       ├── page.tsx        # Geçmiş listesi
│       ├── generate/       # Oluşturma akışı
│       ├── credits/        # Kredi satın alma
│       └── result/[id]/    # Sonuç sayfası
├── api/
│   ├── generate/           # fal.ai entegrasyonu
│   └── stripe/             # Ödeme webhook
├── page.tsx                # Landing page
components/
├── ui/                     # Temel UI bileşenleri
├── GenerateFlow/           # 4 adımlı form
├── Dashboard/              # Dashboard bileşenleri
├── Landing/                # Landing sayfası bölümleri
└── Navigation/             # Navbar & mobile nav
lib/
├── supabase/               # Supabase client/server/middleware
├── fal.ts                  # fal.ai entegrasyonu
├── stripe.ts               # Stripe instance
└── types.ts                # TypeScript tipleri
```
