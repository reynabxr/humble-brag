"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import type { StyleMode } from "@/app/page"
import { cn } from "@/lib/utils"

interface LoadingScreenProps {
  mode: StyleMode
}

const movieMessages = [
  "Hiring Hans Zimmer...",
  "Adding dramatic lens flares...",
  "Cueing the slow-motion...",
  "Composing your theme song...",
  "Rolling the red carpet...",
]

const sportsMessages = [
  "Warming up the commentators...",
  "Pumping crowd noise to 11...",
  "Polishing your MVP trophy...",
  "Queuing the instant replay...",
  "The crowd is going WILD...",
]

export function LoadingScreen({ mode }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const messages = mode === "blockbuster" ? movieMessages : sportsMessages

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 600)

    return () => clearInterval(interval)
  }, [messages.length])

  const isMovie = mode === "blockbuster"

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center",
        isMovie ? "bg-movie-dark" : "bg-sports-dark",
      )}
    >
      <div className="text-center space-y-8">
        <div
          className={cn(
            "inline-flex items-center justify-center p-6 rounded-full",
            isMovie ? "bg-movie-gold/20" : "bg-sports-green/20",
          )}
        >
          <Loader2 className={cn("h-12 w-12 animate-spin", isMovie ? "text-movie-gold" : "text-sports-green")} />
        </div>

        <div className="space-y-2">
          <h2 className={cn("text-2xl font-bold", isMovie ? "text-movie-gold" : "text-sports-green")}>
            Creating Your {isMovie ? "Blockbuster" : "Highlight Reel"}
          </h2>
          <p className="text-white/80 text-lg h-7 transition-opacity duration-200">{messages[messageIndex]}</p>
        </div>

        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn("w-2 h-2 rounded-full animate-pulse", isMovie ? "bg-movie-gold" : "bg-sports-green")}
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
