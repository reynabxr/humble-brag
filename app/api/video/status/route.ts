import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { soraJobId, jobId } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check Sora status
    const statusResponse = await fetch(`https://api.openai.com/v1/videos/${soraJobId}`, {
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` }
    });

    const statusData = await statusResponse.json();
    console.log(`[${jobId}] Sora status:`, statusData.status);

    if (statusData.status === "completed") {
      // Download video
      const downloadResponse = await fetch(`https://api.openai.com/v1/videos/${soraJobId}/content`, {
        headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` }
      });

      const videoBuffer = Buffer.from(await downloadResponse.arrayBuffer());
      const fileName = `scenes/${jobId}.mp4`;

      await supabase.storage
        .from("hype-videos")
        .upload(fileName, videoBuffer, { contentType: "video/mp4", upsert: true });

      const { data: urlData } = supabase.storage
        .from("hype-videos")
        .getPublicUrl(fileName);

      return NextResponse.json({
        success: true,
        status: "completed",
        job_id: jobId,
        video_url: urlData.publicUrl
      });
    }

    if (statusData.status === "failed") {
      return NextResponse.json({
        success: false,
        status: "failed",
        job_id: jobId,
        error: statusData.error || "Video generation failed"
      });
    }

    return NextResponse.json({
      success: true,
      status: statusData.status,
      job_id: jobId
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
