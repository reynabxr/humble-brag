import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 });
    }

    const fileName = `final/${jobId}.mp4`;

    // Check if combined video exists
    const { data, error } = await supabase.storage
      .from("hype-videos")
      .list("final", { 
        limit: 100,
        search: jobId 
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const fileExists = data?.some(f => f.name === `${jobId}.mp4`);

    if (fileExists) {
      const { data: urlData } = supabase.storage
        .from("hype-videos")
        .getPublicUrl(fileName);

      return NextResponse.json({
        status: "completed",
        job_id: jobId,
        video_url: urlData.publicUrl
      });
    }

    return NextResponse.json({
      status: "processing",
      job_id: jobId
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
