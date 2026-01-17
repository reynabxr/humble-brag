import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageUrl, prompt, jobId } = await req.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json({ error: "imageUrl and prompt required" }, { status: 400 });
    }

    // Fetch image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const imageBase64 = imageBuffer.toString("base64");

    // Start Sora job (don't wait for completion)
    const createResponse = await fetch("https://api.openai.com/v1/videos", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sora-2",
        prompt: prompt,
        size: "1080x1920",
        seconds: 8,
        image: { type: "base64", data: imageBase64 }
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Sora failed: ${await createResponse.text()}`);
    }

    const video = await createResponse.json();

    return NextResponse.json({
      success: true,
      status: "started",
      sora_job_id: video.id,
      job_id: jobId
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
