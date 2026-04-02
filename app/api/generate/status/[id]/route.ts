import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: generation } = await supabase
      .from("generations")
      .select("id, status, render_image_url, video_url")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!generation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(generation);
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
