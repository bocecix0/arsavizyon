import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const userId = session.metadata?.userId;
    const priceId = session.metadata?.priceId;

    if (!userId || !priceId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const packageInfo = STRIPE_PRICE_IDS[priceId];
    if (!packageInfo) {
      console.error("Unknown price ID:", priceId);
      return NextResponse.json({ error: "Unknown package" }, { status: 400 });
    }

    const adminClient = await createAdminClient();

    // Get current credits
    const { data: profile } = await adminClient
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add credits
    const newCredits = profile.credits + packageInfo.credits;
    await adminClient
      .from("profiles")
      .update({ credits: newCredits })
      .eq("id", userId);

    // Log transaction
    await adminClient.from("credit_transactions").insert({
      user_id: userId,
      amount: packageInfo.credits,
      description: `${packageInfo.name} satın alındı`,
      stripe_session_id: session.id,
    });
  }

  return NextResponse.json({ received: true });
}
