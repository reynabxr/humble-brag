"use client";

import {
  Download,
  Linkedin,
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
import type { StyleMode } from "@/app/page";
import { cn } from "@/lib/utils";

interface ResultViewProps {
  mode: StyleMode;
  onStartOver: () => void;
}

export function ResultView({ mode, onStartOver }: ResultViewProps) {
  const isMovie = mode === "movie";

  return (
    <div className="min-h-screen py-8 bg-linkedin-gray">
      <div className="container mx-auto max-w-3xl px-4">
        <Card className="mb-6 p-6 border-none shadow-sm bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-linkedin-blue rounded flex items-center justify-center">
              <span className="text-white font-bold">in</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">HumbleBrag</p>
              <p className="text-sm text-muted-foreground">
                Your content is ready to share
              </p>
            </div>
          </div>

          <div
            className={cn(
              "rounded-lg p-4 text-center",
              isMovie
                ? "bg-linear-to-r from-amber-50 via-yellow-50 to-amber-50 border border-movie-gold/30"
                : "bg-linear-to-r from-blue-50 via-sky-50 to-blue-50 border border-linkedin-blue/30",
            )}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              {isMovie ? (
                <>
                  <Sparkles className="h-6 w-6 text-movie-gold" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-amber-700">
                    Your Disney Story is Complete!
                  </h1>
                  <Castle className="h-6 w-6 text-movie-gold" />
                </>
              ) : (
                <>
                  <Trophy className="h-6 w-6 text-linkedin-blue" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-linkedin-blue">
                    Your Highlight Reel is Ready!
                  </h1>
                  <Medal className="h-6 w-6 text-linkedin-blue" />
                </>
              )}
            </div>
            <p
              className={cn(
                "text-sm",
                isMovie ? "text-amber-600" : "text-sky-600",
              )}
            >
              {isMovie
                ? "A tale of professional triumph, fit for any kingdom."
                : "SportsCenter called. They want this clip."}
            </p>
          </div>
        </Card>

        <Card
          className={cn(
            "overflow-hidden border-2 shadow-lg bg-white",
            isMovie ? "border-movie-gold/50" : "border-linkedin-blue/50",
          )}
        >
          <CardContent className="p-0">
            <div
              className={cn(
                "relative aspect-video flex items-center justify-center",
                isMovie
                  ? "bg-linear-to-br from-amber-100 via-yellow-50 to-orange-100"
                  : "bg-linear-to-br from-blue-100 via-sky-50 to-cyan-100",
              )}
            >
              {isMovie ? (
                <>
                  <Sparkles className="absolute top-4 left-4 h-6 w-6 text-movie-gold/40 animate-pulse" />
                  <Star className="absolute top-8 right-8 h-5 w-5 text-amber-400/50 animate-bounce" />
                  <Castle className="absolute bottom-4 right-4 h-8 w-8 text-movie-gold/30" />
                </>
              ) : (
                <>
                  <Trophy className="absolute top-4 left-4 h-6 w-6 text-linkedin-blue/40 animate-pulse" />
                  <Medal className="absolute top-8 right-8 h-5 w-5 text-sky-400/50 animate-bounce" />
                  <Star className="absolute bottom-4 right-4 h-8 w-8 text-linkedin-blue/30" />
                </>
              )}

              <div className="text-center z-10">
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 cursor-pointer hover:scale-110 transition-transform shadow-lg",
                    isMovie
                      ? "bg-white border-2 border-movie-gold text-movie-gold"
                      : "bg-white border-2 border-linkedin-blue text-linkedin-blue",
                  )}
                >
                  <Play className="h-10 w-10 ml-1" />
                </div>
                <p
                  className={cn(
                    "font-medium",
                    isMovie ? "text-amber-700" : "text-linkedin-blue",
                  )}
                >
                  {isMovie
                    ? "Watch Your Disney Story"
                    : "Watch Your Highlight Reel"}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  (AI video generation coming soon)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            className={cn(
              "flex-1 h-12 font-semibold shadow-md",
              isMovie
                ? "bg-movie-gold hover:bg-amber-600 text-white"
                : "bg-linkedin-blue hover:bg-linkedin-blue/90 text-white",
            )}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Video
          </Button>

          <Button className="flex-1 h-12 font-semibold bg-linkedin-blue hover:bg-linkedin-blue/90 text-white shadow-md">
            <Linkedin className="mr-2 h-5 w-5" />
            Post to LinkedIn
          </Button>
        </div>

        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={onStartOver}
            className="text-muted-foreground hover:text-foreground hover:bg-linkedin-gray"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Create Another Masterpiece
          </Button>
        </div>
      </div>
    </div>
  );
}
