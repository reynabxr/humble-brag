"use client"

import { Download, Linkedin, RotateCcw, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { StyleMode } from "@/app/page"
import { cn } from "@/lib/utils"

interface ResultViewProps {
  mode: StyleMode
  onStartOver: () => void
}

export function ResultView({ mode, onStartOver }: ResultViewProps) {
  const isMovie = mode === "blockbuster"

  return (
    <div className={cn("min-h-screen py-8", isMovie ? "bg-movie-dark" : "bg-sports-dark")}>
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-8">
          <h1 className={cn("text-3xl sm:text-4xl font-bold mb-2", isMovie ? "text-movie-gold" : "text-sports-green")}>
            {isMovie ? "🎬 Your Blockbuster is Ready" : "🏆 Your Highlight Reel is Ready"}
          </h1>
          <p className="text-white/70">
            {isMovie ? "Oscar-worthy content, if we say so ourselves." : "SportsCenter called. They want this clip."}
          </p>
        </div>

        <Card
          className={cn(
            "overflow-hidden border-2",
            isMovie ? "border-movie-gold bg-black/50" : "border-sports-green bg-black/50",
          )}
        >
          <CardContent className="p-0">
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <div
                className={cn(
                  "absolute inset-0 opacity-10",
                  isMovie
                    ? "bg-gradient-to-br from-movie-gold to-transparent"
                    : "bg-gradient-to-br from-sports-green to-transparent",
                )}
              />
              <div className="text-center z-10">
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 cursor-pointer hover:scale-110 transition-transform",
                    isMovie ? "bg-movie-gold/20 text-movie-gold" : "bg-sports-green/20 text-sports-green",
                  )}
                >
                  <Play className="h-10 w-10 ml-1" />
                </div>
                <p className="text-white/60 text-sm">Video Preview</p>
                <p className="text-white/40 text-xs mt-1">(AI video generation coming soon)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            className={cn(
              "flex-1 h-12 font-semibold",
              isMovie
                ? "bg-movie-gold hover:bg-movie-gold/90 text-black"
                : "bg-sports-green hover:bg-sports-green/90 text-black",
            )}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Video
          </Button>

          <Button
            variant="outline"
            className={cn(
              "flex-1 h-12 font-semibold border-2",
              isMovie
                ? "border-movie-gold text-movie-gold hover:bg-movie-gold/10 bg-transparent"
                : "border-sports-green text-sports-green hover:bg-sports-green/10 bg-transparent",
            )}
          >
            <Linkedin className="mr-2 h-5 w-5" />
            Post to LinkedIn
          </Button>
        </div>

        <div className="text-center mt-8">
          <Button variant="ghost" onClick={onStartOver} className="text-white/60 hover:text-white hover:bg-white/10">
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </div>
      </div>
    </div>
  )
}
