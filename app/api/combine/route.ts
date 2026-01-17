import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { videoUrls, jobId } = await req.json();

    if (!videoUrls || !Array.isArray(videoUrls) || videoUrls.length !== 6) {
      return NextResponse.json(
        { error: "videoUrls array with 6 URLs required" },
        { status: 400 }
      );
    }

    const combineJobId = `combine_${jobId}_${Date.now()}`;

    // Start background processing
    combineVideosInBackground(videoUrls, combineJobId);

    return NextResponse.json({
      success: true,
      status: "in_progress",
      job_id: combineJobId,
      message: "Video combination started"
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function combineVideosInBackground(videoUrls: string[], jobId: string) {
  const tmpDir = path.join(os.tmpdir(), jobId);
  
  try {
    console.log(`[${jobId}] Starting video combination...`);
    
    // Create temp directory
    await fs.mkdir(tmpDir, { recursive: true });

    // Download all 6 videos
    console.log(`[${jobId}] Downloading 6 scene videos...`);
    const localPaths: string[] = [];
    
    for (let i = 0; i < videoUrls.length; i++) {
      const response = await fetch(videoUrls[i]);
      const buffer = Buffer.from(await response.arrayBuffer());
      const localPath = path.join(tmpDir, `scene_${i + 1}.mp4`);
      await fs.writeFile(localPath, buffer);
      localPaths.push(localPath);
      console.log(`[${jobId}] Downloaded scene ${i + 1}`);
    }

    // Create FFmpeg filter for crossfade
    // Scene durations: 4s, 8s, 8s, 8s, 4s, 4s
    // Crossfade: 1 second between each
    const outputPath = path.join(tmpDir, "combined.mp4");
    
    // Build complex filter for 6 videos with crossfades
    // Each crossfade reduces total duration by 1 second
    // Total: 36s - 5s (5 crossfades) = 31s
    const crossfadeDuration = 1;
    const durations = [4, 8, 8, 8, 4, 4];
    
    // Calculate offsets for each crossfade
    // offset[i] = sum of (durations[0..i]) - (i * crossfadeDuration)
    let filterComplex = "";
    let currentOffset = 0;
    
    // First, set up the inputs
    const inputs = localPaths.map((p, i) => `-i "${p}"`).join(" ");
    
    // Build xfade filter chain
    // [0][1]xfade=transition=fade:duration=1:offset=3[v01];
    // [v01][2]xfade=transition=fade:duration=1:offset=10[v02];
    // etc.
    
    let lastOutput = "0:v";
    for (let i = 1; i < 6; i++) {
      const offset = durations.slice(0, i).reduce((a, b) => a + b, 0) - (i * crossfadeDuration);
      const outputLabel = i === 5 ? "vout" : `v${i}`;
      filterComplex += `[${lastOutput}][${i}:v]xfade=transition=fade:duration=${crossfadeDuration}:offset=${offset}[${outputLabel}];`;
      lastOutput = outputLabel;
    }
    
    // Audio: amerge all tracks, or use first track
    // For simplicity, let's concat audio
    filterComplex += `[0:a][1:a][2:a][3:a][4:a][5:a]concat=n=6:v=0:a=1[aout]`;
    
    const ffmpegCmd = `ffmpeg ${inputs} -filter_complex "${filterComplex}" -map "[vout]" -map "[aout]" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k -y "${outputPath}"`;
    
    console.log(`[${jobId}] Running FFmpeg...`);
    await execAsync(ffmpegCmd);
    console.log(`[${jobId}] FFmpeg completed`);

    // Upload to Supabase
    const finalVideo = await fs.readFile(outputPath);
    const fileName = `final/${jobId}.mp4`;

    const { error: uploadError } = await supabase.storage
      .from("hype-videos")
      .upload(fileName, finalVideo, {
        contentType: "video/mp4",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("hype-videos")
      .getPublicUrl(fileName);

    console.log(`[${jobId}] Combined video ready: ${urlData.publicUrl}`);

    // Cleanup temp files
    await fs.rm(tmpDir, { recursive: true, force: true });

  } catch (error: any) {
    console.error(`[${jobId}] Error:`, error.message);
    // Cleanup on error
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}
