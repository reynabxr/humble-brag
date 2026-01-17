import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if file exists in disney bucket
    const fileName = `${jobId}.png`;
    
    const { data, error } = await supabase.storage
      .from("disney")
      .list("", {
        search: fileName
      });

    if (error) {
      throw new Error(`Failed to check status: ${error.message}`);
    }

    // If file exists, it's completed
    if (data && data.length > 0) {
      const { data: urlData } = supabase.storage
        .from("disney")
        .getPublicUrl(fileName);

      return NextResponse.json({
        success: true,
        status: "completed",
        completed: true,
        image_url: urlData.publicUrl
      });
    }

    // If file doesn't exist, still in progress
    return NextResponse.json({
      success: true,
      status: "in_progress",
      completed: false
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
