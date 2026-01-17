"use client";

import {
  RotateCcw,
  Play,
  Castle,
  Trophy,
  Star,
  Sparkles,
  Medal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// 1. Import the new component
import { LinkedInVideoShare } from "@/components/linkedin-video-share";
import type { StyleMode } from "@/app/page";
import { cn } from "@/lib/utils";

interface ResultViewProps {
  mode: StyleMode;
  onStartOver: () => void;
}

export function ResultView({ mode, onStartOver }: ResultViewProps) {
  const isMovie = mode === "movie";

  // Use local fallback video from public folder
  const videoUrl = "/humblebrag.mp4";

  // 3. Dynamic captions based on the theme
  const shareCaption = isMovie
    ? "Just turned my career journey into a fairytale! 🏰✨ Created with the HumbleBrag AI. #Storytelling #DreamBig #DisneyStyle"
    : "Here are the highlights from my latest season. 🏆📈 Stats don't lie. Generated with HumbleBrag. #ProfessionalGrowth #Wins #HighlightReel";

  return (
    <div className="min-h-screen py-8 bg-[#F3F2EF]">
      {" "}
      {/* Used LinkedIn Gray hex directly for safety */}
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header Card */}
        <Card className="mb-6 p-6 border-none shadow-sm bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0a66c2] rounded flex items-center justify-center">
              <span className="text-white font-bold">in</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">HumbleBrag</p>
              <p className="text-sm text-gray-500">
                Your content is ready to share
              </p>
            </div>
          </div>

          <div
            className={cn(
              "rounded-lg p-4 text-center border",
              isMovie
                ? "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-amber-200"
                : "bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 border-blue-200",
            )}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              {isMovie ? (
                <>
                  <Sparkles className="h-6 w-6 text-amber-500" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-amber-700">
                    Your Disney Story is Complete!
                  </h1>
                  <Castle className="h-6 w-6 text-amber-500" />
                </>
              ) : (
                <>
                  <Trophy className="h-6 w-6 text-[#0a66c2]" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0a66c2]">
                    Your Highlight Reel is Ready!
                  </h1>
                  <Medal className="h-6 w-6 text-[#0a66c2]" />
                </>
              )}
            </div>
            <p
              className={cn(
                "text-sm font-medium",
                isMovie ? "text-amber-600" : "text-[#0a66c2]",
              )}
            >
              {isMovie
                ? "A tale of professional triumph, fit for any kingdom."
                : "SportsCenter called. They want this clip."}
            </p>
          </div>
        </Card>

        {/* Video Preview Card */}
        <Card
          className={cn(
            "overflow-hidden border-2 shadow-lg bg-white mb-6",
            isMovie ? "border-amber-200" : "border-blue-200",
          )}
        >
          <CardContent className="p-0">
            <video
              controls
              className="w-full aspect-video bg-black"
              src={videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </CardContent>
        </Card>

        {/* 4. THE SMART SHARE SECTION */}
        {/* We replaced the old buttons with this component */}
        <div className="mb-8">
          <LinkedInVideoShare videoUrl={videoUrl} caption={shareCaption} />
        </div>

        <div className="text-center pb-8">
          <Button
            variant="ghost"
            onClick={onStartOver}
            className="text-gray-500 hover:text-gray-900 hover:bg-gray-200"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Create Another Masterpiece
          </Button>
        </div>
      </div>
    </div>
  );
}
