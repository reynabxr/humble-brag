import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import sharp from "sharp";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { imageUrl, prompt, jobId, duration } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const videoDuration = duration || 8;

    let videoParams: any = {
      model: "sora-2",
      prompt: prompt,
    };

    // Only process image if imageUrl is provided
    if (imageUrl && imageUrl.trim() !== '') {
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }

        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        
        const resizedBuffer = await sharp(imageBuffer)
          .resize(1280, 720, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 90 })
          .toBuffer();

        const imageFile = await toFile(resizedBuffer, "input.jpg", { type: "image/jpeg" });
        
        videoParams.image = imageFile;
      } catch (imageError: any) {
        console.warn("Image processing failed, continuing without image:", imageError.message);
      }
    }

    // Create video with Sora
    const video = await openai.videos.create(videoParams);

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