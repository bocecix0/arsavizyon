import { fal } from "@fal-ai/client";
import { BuildingStyle, STYLE_PROMPTS } from "./types";


export async function generateBuildingRender(
  landPhotoUrl: string,
  style: BuildingStyle
): Promise<string> {
  const stylePrompt = STYLE_PROMPTS[style];

  const result = await fal.run("fal-ai/flux-pro", {
    input: {
      prompt: `${stylePrompt}, built on empty plot of land, incorporating the surrounding landscape and terrain, ultra realistic, professional architectural visualization`,
      image_url: landPhotoUrl,
      image_size: "landscape_16_9",
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
    },
  });

  const output = result.data as { images?: Array<{ url: string }> };
  if (!output?.images?.[0]?.url) {
    throw new Error("AI görsel oluşturulamadı");
  }

  return output.images[0].url;
}

export async function submitVideoGeneration(
  renderImageUrl: string
): Promise<string> {
  const { request_id } = await fal.queue.submit(
    "fal-ai/veo3.1/fast/image-to-video",
    {
      input: {
        image_url: renderImageUrl,
        prompt:
          "Slow cinematic drone shot orbiting the building, rising from ground level to aerial view, golden hour warm lighting, professional real estate film, smooth camera movement",
        duration: "8s",
        aspect_ratio: "16:9",
      },
    }
  );

  return request_id;
}

export async function checkVideoStatus(requestId: string): Promise<{
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  logs?: string[];
}> {
  const status = await fal.queue.status(
    "fal-ai/veo3.1/fast/image-to-video",
    {
      requestId,
      logs: true,
    }
  );

  if ((status.status as string) === "COMPLETED") {
    const result = await fal.queue.result(
      "fal-ai/veo3.1/fast/image-to-video",
      { requestId }
    );
    const output = result.data as { video?: { url: string } };
    return {
      status: "completed",
      videoUrl: output?.video?.url,
    };
  }

  if ((status.status as string) === "FAILED") {
    return { status: "failed" };
  }

  return {
    status: (status.status as string) === "IN_QUEUE" ? "pending" : "processing",
    logs: ((status as any).logs as Array<{ message: string }>)?.map((l) => l.message),
  };
}
