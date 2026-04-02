export type BuildingStyle =
  | "modern_minimal"
  | "luxury_villa"
  | "bodrum_ege"
  | "industrial_loft"
  | "classic_ottoman"
  | "green_eco";

export type GenerationStatus =
  | "pending"
  | "rendering"
  | "generating_video"
  | "completed"
  | "failed";

export type OutputType = "image_only" | "image_and_video";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  credits: number;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  land_image_url: string | null;
  render_image_url: string | null;
  video_url: string | null;
  building_style: BuildingStyle;
  status: GenerationStatus;
  credits_used: number;
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  stripe_session_id: string | null;
  created_at: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceId: string;
  popular?: boolean;
}

export const BUILDING_STYLES: Record<
  BuildingStyle,
  { label: string; description: string; emoji: string }
> = {
  modern_minimal: {
    label: "Modern Minimal",
    description: "Gri-Beyaz, büyük pencereler",
    emoji: "🏢",
  },
  luxury_villa: {
    label: "Luxury Villa",
    description: "Taş ve ahşap, havuzlu",
    emoji: "🏰",
  },
  bodrum_ege: {
    label: "Bodrum Ege",
    description: "Beyaz badana, mavi detaylar",
    emoji: "🏖️",
  },
  industrial_loft: {
    label: "Industrial Loft",
    description: "Beton, çelik",
    emoji: "🏭",
  },
  classic_ottoman: {
    label: "Classic Ottoman",
    description: "Geleneksel Türk mimarisi",
    emoji: "🕌",
  },
  green_eco: {
    label: "Green Eco",
    description: "Doğal malzeme, yeşil çatı",
    emoji: "🌿",
  },
};

export const STYLE_PROMPTS: Record<BuildingStyle, string> = {
  modern_minimal:
    "photorealistic architectural render, modern minimalist building, grey and white facade, large black-framed floor-to-ceiling windows, glass balcony railings, flat anthracite roof, warm wood accents on entrance, professional real estate photography, golden hour lighting, ultra detailed, 8k",
  luxury_villa:
    "photorealistic render, luxury mediterranean villa, natural stone and wood facade, large swimming pool, lush landscaping, terracotta accents, professional architectural photography, dramatic sky",
  bodrum_ege:
    "photorealistic render, aegean style Turkish house, white washed walls, blue window frames and shutters, terrace with sea view, bougainvillea, cobblestone path, professional real estate photo",
  industrial_loft:
    "photorealistic architectural render, industrial loft building, exposed concrete and steel, large warehouse windows, modern minimalist design, urban setting",
  classic_ottoman:
    "photorealistic render, traditional Ottoman Turkish architecture, ornate wooden details, decorative tiles, arched windows, garden courtyard",
  green_eco:
    "photorealistic render, sustainable eco home, living green roof, natural wood and stone, solar panels, surrounded by mature trees, organic architecture",
};

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "Başlangıç",
    credits: 10,
    price: 149,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || "price_starter",
  },
  {
    id: "professional",
    name: "Profesyonel",
    credits: 30,
    price: 349,
    priceId:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "price_professional",
    popular: true,
  },
  {
    id: "agency",
    name: "Ajans",
    credits: 100,
    price: 999,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY || "price_agency",
  },
];
