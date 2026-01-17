import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="bg-white border-b border-linkedin-border sticky top-0 z-50">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-linkedin-blue">HumbleBrag</h1>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Make your career update a movie.
            </span>
          </div>

          <Avatar className="h-8 w-8 bg-linkedin-blue/10">
            <AvatarFallback className="bg-linkedin-blue/10 text-linkedin-blue">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
