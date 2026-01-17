"use client";

import type React from "react";

import { Clapperboard, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
        <StyleCard
          title="The movie"
          description="Hans Zimmer style. Epic. Suspenseful."
          icon={<Clapperboard className="h-8 w-8" />}
          isSelected={selectedStyle === "movie"}
          onClick={() => onStyleSelect("movie")}
          accentColor="movie"
        />

        <StyleCard
          title="The sports"
          description="High-octane sports commentary. The crowd goes wild."
          icon={<Trophy className="h-8 w-8" />}
          isSelected={selectedStyle === "sports"}
          onClick={() => onStyleSelect("sports")}
          accentColor="sports"
        />
      </div>
    </div>
  );
}

interface StyleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  accentColor: "movie" | "sports";
}

function StyleCard({
  title,
  description,
  icon,
  isSelected,
  onClick,
  accentColor,
}: StyleCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md bg-white",
        isSelected &&
          accentColor === "movie" &&
          "border-3 border-movie-gold shadow-lg shadow-movie-gold/20 bg-movie-dark",
        isSelected &&
          accentColor === "sports" &&
          "border-3 border-sports-green shadow-lg shadow-sports-green/20 bg-sports-dark",
        !isSelected && "border-linkedin-border hover:border-linkedin-blue/50",
      )}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-3 rounded-lg transition-colors",
              isSelected &&
                accentColor === "movie" &&
                "bg-movie-gold/20 text-movie-gold",
              isSelected &&
                accentColor === "sports" &&
                "bg-sports-green/20 text-sports-green",
              !isSelected && "bg-muted text-muted-foreground",
            )}
          >
            {icon}
          </div>

          <div className="flex-1">
            <h3
              className={cn(
                "font-semibold text-lg",
                isSelected && accentColor === "movie" && "text-movie-gold",
                isSelected && accentColor === "sports" && "text-sports-green",
                !isSelected && "text-foreground",
              )}
            >
              {title}
            </h3>
            <p
              className={cn(
                "text-sm mt-1",
                isSelected ? "text-white/70" : "text-muted-foreground",
              )}
            >
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
