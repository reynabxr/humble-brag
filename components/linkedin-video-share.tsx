"use client";

import { useState } from "react";
import { Linkedin, Check, ArrowDownToLine } from "lucide-react";

interface LinkedInPostProps {
  // This should be the blob URL or public URL of your generated video
  videoUrl: string;
  // Optional default caption
  caption?: string;
}

export function LinkedInVideoShare({
  videoUrl,
  caption = "Check out my new highlight reel! 🎬 Generated with AI. #Tech #WebDev #Highlights",
}: LinkedInPostProps) {
  const [step, setStep] = useState<"idle" | "downloaded">("idle");
  const [isLoading, setIsLoading] = useState(false);

  const handleSmartPost = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      // STEP 1: Copy Caption to Clipboard
      await navigator.clipboard.writeText(caption);

      // STEP 2: Trigger Video Download
      // Fetching as blob ensures it downloads instead of opening in a new tab
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "humblebrag.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStep("downloaded");

      // Ensure minimum 5 second loading time
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 10000 - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      // STEP 3: Notify User (Simple browser alert is reliable here)
      alert(
        "Video saved to Downloads!\n Caption copied to clipboard!\n\nRedirecting you to LinkedIn to post it...",
      );

      // STEP 4: Open LinkedIn Feed
      window.open("https://www.linkedin.com/feed/", "_blank");
    } catch (error) {
      console.error("Error preparing post:", error);
      alert(
        "Could not download the video automatically. Please right-click the video to save it.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm max-w-sm w-full mx-auto">
      <div className="text-center space-y-1">
        <h3 className="font-bold text-gray-800 text-lg">Share to LinkedIn</h3>
        <p className="text-xs text-gray-500 max-w-[250px] mx-auto leading-relaxed">
          We'll save the video and copy your caption so you can post a{" "}
          <b>Native Video</b> (algorithms love this!)
        </p>
      </div>

      <button
        onClick={handleSmartPost}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-[#0a66c2] hover:bg-[#004182] disabled:opacity-70 disabled:cursor-not-allowed text-white py-3 px-6 rounded-full font-semibold transition-all active:scale-95 shadow-md"
      >
        {isLoading ? (
          <span className="animate-pulse">Preparing...</span>
        ) : step === "idle" ? (
          <>
            <Linkedin className="w-5 h-5" />
            <span>Download & Post</span>
          </>
        ) : (
          <>
            <ArrowDownToLine className="w-5 h-5" />
            <span>Download Again</span>
          </>
        )}
      </button>

      {step === "downloaded" && (
        <div className="text-xs text-green-600 font-medium flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full animate-in fade-in slide-in-from-top-2">
          <Check className="w-3 h-3" />
          Ready to paste!
        </div>
      )}
    </div>
  );
}
