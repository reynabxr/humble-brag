import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-linkedin-border sticky top-0 z-50">
      <div className="h-1 bg-linear-to-r from-linkedin-blue via-movie-gold to-sports-accent" />
      <div className="container mx-auto max-w-2xl px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-linkedin-blue text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-foreground leading-tight">
                HumbleBrag
              </h1>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Turn your update into a masterpiece
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline px-2 py-1 rounded-full bg-linkedin-gray">
              Beta
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
