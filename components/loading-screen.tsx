"use client";

import { useState, useEffect } from "react";
import { Trophy, Sparkles, Star, Medal } from "lucide-react";
import type { StyleMode } from "@/app/page";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface LoadingScreenProps {
  mode: StyleMode;
}

const movieMessages = [
  "Once upon a time in your career...",
  "The fairy godmother of networking appeared...",
  "A glass slipper promotion awaits...",
  "Wishing upon a LinkedIn star...",
  "Bibbidi-bobbidi-boo-ing your post...",
  "Adding pixie dust to your achievements...",
  "The castle of success awaits...",
];

const sportsMessages = [
  "Warming up the commentators...",
  "Pumping crowd noise to 11...",
  "Polishing your MVP trophy...",
  "Queuing the instant replay...",
  "The crowd is going WILD...",
  "Cue the confetti cannons...",
  "Champions League music intensifies...",
];

export function LoadingScreen({ mode }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = mode === "movie" ? movieMessages : sportsMessages;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 800);

    return () => clearInterval(interval);
  }, [messages.length]);

  const isMovie = mode === "movie";

  return (
    <div className="min-h-screen bg-linkedin-gray flex flex-col items-center justify-center p-4">
      <Card
        className={cn(
          "w-full max-w-md p-8 border-2 bg-white shadow-lg",
          isMovie ? "border-movie-gold/50" : "border-linkedin-blue/50",
        )}
      >
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-linkedin-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">in</span>
            </div>
            <span className="text-linkedin-blue font-semibold">HumbleBrag</span>
          </div>

          <div
            className={cn(
              "inline-flex items-center justify-center p-6 rounded-full mx-auto",
              isMovie
                ? "bg-linear-to-br from-amber-100 to-yellow-200 border-2 border-movie-gold/30"
                : "bg-linear-to-br from-blue-100 to-sky-200 border-2 border-linkedin-blue/30",
            )}
          >
            {isMovie ? (
              <div className="relative">
                <Sparkles className="h-12 w-12 text-movie-gold animate-pulse" />
                <Star className="absolute -top-1 -right-1 h-5 w-5 text-amber-400 animate-bounce" />
              </div>
            ) : (
              <div className="relative">
                <Trophy className="h-12 w-12 text-linkedin-blue animate-bounce" />
                <Medal className="absolute -top-1 -right-1 h-5 w-5 text-sky-500 animate-pulse" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2
              className={cn(
                "text-2xl font-bold",
                isMovie ? "text-amber-700" : "text-linkedin-blue",
              )}
            >
              {isMovie
                ? "Creating Your Disney Magic"
                : "Building Your Highlight Reel"}
            </h2>
            <p
              className={cn(
                "text-lg h-7 transition-all duration-300 font-medium",
                isMovie ? "text-amber-600" : "text-sky-600",
              )}
            >
              {messages[messageIndex]}
            </p>
          </div>

          <div className="pt-4">
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    isMovie ? "bg-movie-gold" : "bg-linkedin-blue",
                  )}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {isMovie
              ? "Where dreams of professional success come true..."
              : "Get ready to spike those engagement numbers..."}
          </p>
        </div>
      </Card>
    </div>
  );
}
