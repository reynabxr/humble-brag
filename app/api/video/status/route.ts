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
    console.log("Full Sora response:", JSON.stringify(statusData, null, 2));

    if (statusData.status === "completed") {
      // Download and upload to Supabase
      const downloadResponse = await fetch(`https://api.openai.com/v1/videos/${soraJobId}/content`, {
        headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` }
      });

      const videoBuffer = Buffer.from(await downloadResponse.arrayBuffer());
      const fileName = `videos/${jobId}.mp4`;

      await supabase.storage
        .from("hype-videos")
        .upload(fileName, videoBuffer, { contentType: "video/mp4", upsert: true });

      const { data: urlData } = supabase.storage
        .from("hype-videos")
        .getPublicUrl(fileName);

      return NextResponse.json({
        success: true,
        status: "completed",
        video_url: urlData.publicUrl
      });
    }

    return NextResponse.json({
      success: true,
      status: statusData.status, // "queued" or "in_progress"
      full_response: statusData
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
