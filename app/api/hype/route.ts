// app/api/hype/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const postText = formData.get("postText") as string;
    const style = formData.get("style") as string;

    if (!postText || !style) {
      return NextResponse.json(
        { error: "Missing text or style" },
        { status: 400 }
      );
    }

    let imageUrl = null;

    if (file) {
      // 1. Generate a unique file name
      // We use the timestamp to ensure uniqueness
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
      
      // 2. Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("hype-images") // Make sure this matches your bucket name
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase Upload Error:", error);
        throw new Error("Failed to upload image");
      }

      // 3. Get the Public URL
      const { data: publicUrlData } = supabase.storage
        .from("hype-images")
        .getPublicUrl(data.path);
        
      imageUrl = publicUrlData.publicUrl;
    }

    // 4. Prepare Payload for Webhook
    const webhookPayload = {
      prompt: postText,
      style: style,
      imageUrl: imageUrl, 
      timestamp: new Date().toISOString(),
    };

    // 5. Send to External Webhook
    const webhookUrl = process.env.HYPE_WEBHOOK_URL;
    
    if (webhookUrl) {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!webhookResponse.ok) {
        throw new Error("Failed to trigger webhook");
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: webhookPayload 
    });

  } catch (error) {
    console.error("Hype API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}