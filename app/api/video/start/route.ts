import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import sharp from "sharp";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { imageUrl, prompt, jobId, duration } = await req.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json({ error: "imageUrl and prompt required" }, { status: 400 });
    }

    // Default duration is 8 seconds
    const videoDuration = duration || 8;

    // Download image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    
    // Ensure image is 1280x720 landscape
    const resizedBuffer = await sharp(imageBuffer)
      .resize(1280, 720, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Convert to File
    const imageFile = await toFile(resizedBuffer, "input.jpg", { type: "image/jpeg" });

    // Create video with Sora
    const video = await openai.videos.create({
      model: "sora-2",
      prompt: prompt,
      // @ts-ignore
      size: "1280x720",
      // @ts-ignore
      seconds: videoDuration,
      // @ts-ignore
      input_reference: imageFile,
    });

    return NextResponse.json({
      success: true,
      status: "started",
      sora_job_id: video.id,
      job_id: jobId,
      duration: videoDuration
    });

  } catch (error: any) {
    console.error("Start video error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
