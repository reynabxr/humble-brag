"use client";

import { Clapperboard, Trophy, Castle, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StyleMode } from "@/app/page";

interface StyleSelectorProps {
  selectedStyle: StyleMode;
  onStyleSelect: (style: StyleMode) => void;
}

export function StyleSelector({
  selectedStyle,
  onStyleSelect,
}: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">
        Choose your hype style
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onStyleSelect("movie")}
          className={cn(
            "relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300",
            "border-2 hover:shadow-lg",
            selectedStyle === "movie"
              ? "border-movie-gold bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-lg shadow-movie-gold/20"
              : "border-linkedin-border bg-white hover:border-movie-gold/50",
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl transition-all",
                selectedStyle === "movie"
                  ? "bg-gradient-to-br from-movie-gold to-amber-600 text-white shadow-md"
                  : "bg-amber-100 text-amber-700",
              )}
            >
              <Castle className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-semibold text-base",
                    selectedStyle === "movie"
                      ? "text-amber-900"
                      : "text-foreground",
                  )}
                >
                  The Movie
                </h3>
                {selectedStyle === "movie" && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-movie-gold text-white rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "text-xs mt-1",
                  selectedStyle === "movie"
                    ? "text-amber-700"
                    : "text-muted-foreground",
                )}
              >
                Disney magic meets career milestones.
              </p>
            </div>
          </div>
          {selectedStyle === "movie" && (
            <>
              <div className="absolute top-2 right-2">
                <Clapperboard className="h-4 w-4 text-movie-gold/40" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-movie-gold/10 rounded-full blur-xl" />
            </>
          )}
        </button>

        <button
          onClick={() => onStyleSelect("sports")}
          className={cn(
            "relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300",
            "border-2 hover:shadow-lg",
            selectedStyle === "sports"
              ? "border-sports-accent bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 shadow-lg shadow-sports-accent/20"
              : "border-linkedin-border bg-white hover:border-sports-accent/50",
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl transition-all",
                selectedStyle === "sports"
                  ? "bg-gradient-to-br from-sports-accent to-blue-700 text-white shadow-md"
                  : "bg-blue-100 text-blue-700",
              )}
            >
              <Trophy className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-semibold text-base",
                    selectedStyle === "sports"
                      ? "text-blue-900"
                      : "text-foreground",
                  )}
                >
                  The Sports
                </h3>
                {selectedStyle === "sports" && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-sports-accent text-white rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "text-xs mt-1",
                  selectedStyle === "sports"
                    ? "text-blue-700"
                    : "text-muted-foreground",
                )}
              >
                High-octane sports commentary. The crowd goes wild.
              </p>
            </div>
          </div>
          {selectedStyle === "sports" && (
            <>
              <div className="absolute top-2 right-2">
                <Medal className="h-4 w-4 text-sports-accent/40" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-sports-accent/10 rounded-full blur-xl" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
