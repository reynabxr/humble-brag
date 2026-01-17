import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import sharp from "sharp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl parameter required" },
        { status: 400 }
      );
    }

    const jobId = `disney_${Date.now()}`;

    // Return immediately with "in progress" status
    processDisneyImageInBackground(imageUrl, jobId);

    return NextResponse.json({
      success: true,
      status: "in_progress",
      job_id: jobId,
      message: "Disney image generation started in background"
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Background processing function
async function processDisneyImageInBackground(
  imageUrl: string,
  jobId: string
) {
  try {
    console.log(`[${jobId}] Starting Disney image generation...`);

    // Step 1: Fetch image from Supabase
    console.log(`[${jobId}] Fetching image from Supabase...`);
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const base64Image = imageBuffer.toString("base64");

    // Determine image type from URL or default to jpeg
    const imageType = imageUrl.includes("png") ? "image/png" : "image/jpeg";

    // Step 2: Vision describe using base64
    console.log(`[${jobId}] Analyzing image with GPT-4o vision...`);
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe this person's facial features, age, gender, ethnicity, hair, hair colour, hair style, eye colour and clothing for exact recreation."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${imageType};base64,${base64Image}`
              }
            }
          ]
        }
      ]
    });

    const personDesc = visionResponse.choices[0].message.content;
    console.log(`[${jobId}] Person description: ${personDesc}`);

    // Step 3: Generate Disney Pixar style image with DALL-E-3
    console.log(`[${jobId}] Generating Disney Pixar image with DALL-E-3...`);
    const prompt = `Disney Pixar 3D character of ${personDesc}. Preserve ethnicity, age, gender. Smooth shading, expressive eyes, vibrant colors, clean background, high quality. Do not put any text in the image.`;

    const dalleResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1792",
      quality: "hd",
      n: 1
    });

    if (!dalleResponse.data || !dalleResponse.data[0]?.url) {
      throw new Error("Failed to generate image with DALL-E-3");
    }

    const generatedImageUrl = dalleResponse.data[0].url;
    console.log(`[${jobId}] Image generated: ${generatedImageUrl}`);

    // Step 4: Download generated image
    console.log(`[${jobId}] Downloading generated image...`);
    const generatedImageResponse = await fetch(generatedImageUrl);
    const generatedImageBuffer = Buffer.from(await generatedImageResponse.arrayBuffer());

    // Step 4.5: Resize image to 720x1280
    console.log(`[${jobId}] Resizing image to 720x1280...`);
    const resizedImageBuffer = await sharp(generatedImageBuffer)
      .resize(720, 1280, {
        fit: "cover",
        position: "center"
      })
      .png()
      .toBuffer();

    // Step 5: Upload to Supabase "disney" bucket
    console.log(`[${jobId}] Uploading to Supabase disney bucket...`);
    const fileName = `${jobId}.png`;

    const { error: uploadError } = await supabase.storage
      .from("disney")
      .upload(fileName, resizedImageBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Step 6: Get public URL
    const { data: urlData } = supabase.storage
      .from("disney")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    console.log(`[${jobId}] Disney image ready: ${publicUrl}`);

  } catch (error: any) {
    console.error(`[${jobId}] Error:`, error.message);
  }
}
