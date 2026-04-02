import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { generateBuildingRender, submitVideoGeneration } from "@/lib/fal";
import { BuildingStyle, OutputType } from "@/lib/types";

const CREDIT_COST: Record<OutputType, number> = {
  image_only: 1,
  image_and_video: 4,
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = await createAdminClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 });
    }

    const body = await request.json();
    const { landImageUrl, style, outputType } = body as {
      landImageUrl: string;
      style: BuildingStyle;
      outputType: OutputType;
    };

    if (!landImageUrl || !style || !outputType) {
      return NextResponse.json({ error: "Eksik parametreler" }, { status: 400 });
    }

    const creditCost = CREDIT_COST[outputType];

    // Check credits
    const { data: profile } = await adminClient
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits < creditCost) {
      return NextResponse.json(
        { error: "Kredi yetersiz", creditsNeeded: creditCost, creditsHave: profile?.credits || 0 },
        { status: 402 }
      );
    }

    // Deduct credits
    const { error: creditError } = await adminClient
      .from("profiles")
      .update({ credits: profile.credits - creditCost })
      .eq("id", user.id);

    if (creditError) {
      return NextResponse.json({ error: "Kredi güncellenemedi" }, { status: 500 });
    }

    // Log transaction
    await adminClient.from("credit_transactions").insert({
      user_id: user.id,
      amount: -creditCost,
      description: `Görsel oluşturma - ${style} (${outputType === "image_and_video" ? "Görsel + Video" : "Sadece Görsel"})`,
    });

    // Create generation record
    const { data: generation, error: genError } = await adminClient
      .from("generations")
      .insert({
        user_id: user.id,
        land_image_url: landImageUrl,
        building_style: style,
        status: "rendering",
        credits_used: creditCost,
      })
      .select()
      .single();

    if (genError || !generation) {
      return NextResponse.json({ error: "İşlem başlatılamadı" }, { status: 500 });
    }

    // Start async generation
    processGeneration(generation.id, landImageUrl, style, outputType, adminClient);

    return NextResponse.json({ generationId: generation.id });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

async function processGeneration(
  generationId: string,
  landImageUrl: string,
  style: BuildingStyle,
  outputType: OutputType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminClient: any
) {
  try {
    // Step 1: Generate render image
    const renderUrl = await generateBuildingRender(landImageUrl, style);

    // Download and store in Supabase
    const renderStorageUrl = await downloadAndStore(
      renderUrl,
      `renders/${generationId}/render.jpg`,
      "renders",
      adminClient
    );

    await adminClient
      .from("generations")
      .update({
        render_image_url: renderStorageUrl || renderUrl,
        status: outputType === "image_and_video" ? "generating_video" : "completed",
      })
      .eq("id", generationId);

    if (outputType === "image_and_video") {
      // Step 2: Submit video generation
      const requestId = await submitVideoGeneration(renderStorageUrl || renderUrl);

      await adminClient
        .from("generations")
        .update({ fal_request_id: requestId })
        .eq("id", generationId);

      // Poll for video completion
      await pollVideoCompletion(generationId, requestId, adminClient);
    }
  } catch (error) {
    console.error("Generation process error:", error);
    await adminClient
      .from("generations")
      .update({ status: "failed" })
      .eq("id", generationId);
  }
}

async function pollVideoCompletion(
  generationId: string,
  requestId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminClient: any
) {
  const { checkVideoStatus } = await import("@/lib/fal");
  const maxAttempts = 120;
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 5000));
    attempts++;

    const status = await checkVideoStatus(requestId);

    if (status.status === "completed" && status.videoUrl) {
      const videoStorageUrl = await downloadAndStore(
        status.videoUrl,
        `videos/${generationId}/video.mp4`,
        "videos",
        adminClient
      );

      await adminClient
        .from("generations")
        .update({
          video_url: videoStorageUrl || status.videoUrl,
          status: "completed",
        })
        .eq("id", generationId);
      return;
    }

    if (status.status === "failed") {
      // Complete without video
      await adminClient
        .from("generations")
        .update({ status: "completed" })
        .eq("id", generationId);
      return;
    }
  }

  // Timeout - complete without video
  await adminClient
    .from("generations")
    .update({ status: "completed" })
    .eq("id", generationId);
}

async function downloadAndStore(
  url: string,
  path: string,
  bucket: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminClient: any
): Promise<string | null> {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    const { error } = await adminClient.storage
      .from(bucket)
      .upload(path, buffer, { contentType, upsert: true });

    if (error) return null;

    const { data: { publicUrl } } = adminClient.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  } catch {
    return null;
  }
}
