import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { imageUrl, prompt, jobId } = await req.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json({ error: "imageUrl and prompt required" }, { status: 400 });
    }

    // Download image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    
    // Save to temp file (Sora SDK needs a file)
    const tempPath = path.join(os.tmpdir(), `${jobId}_input.jpg`);
    fs.writeFileSync(tempPath, imageBuffer);

    // Use OpenAI SDK with input_reference (like your Python code)
    const video = await openai.videos.create({
      model: "sora-2",
      prompt: prompt,
      size: "1080x1920",
      seconds: 8,
      // @ts-ignore - input_reference may not be in types yet
      input_reference: fs.createReadStream(tempPath),
    });

    // Cleanup temp file
    try { fs.unlinkSync(tempPath); } catch (e) {}

    return NextResponse.json({
      success: true,
      status: "started",
      sora_job_id: video.id,
      job_id: jobId
    });

  } catch (error: any) {
    console.error("Start video error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
