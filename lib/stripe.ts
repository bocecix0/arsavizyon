import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export const STRIPE_PRICE_IDS: Record<string, { credits: number; name: string }> = {
  [process.env.STRIPE_PRICE_STARTER || "price_starter"]: {
    credits: 10,
    name: "Başlangıç Paketi",
  },
  [process.env.STRIPE_PRICE_PRO || "price_professional"]: {
    credits: 30,
    name: "Profesyonel Paket",
  },
  [process.env.STRIPE_PRICE_AGENCY || "price_agency"]: {
    credits: 100,
    name: "Ajans Paketi",
  },
};
