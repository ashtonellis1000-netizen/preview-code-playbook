import { Search, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TopBar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-b border-border z-50">
      <div className="flex items-center justify-between h-16 max-w-screen-xl mx-auto px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="text-2xl font-black tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-performance">SPEC</span>
          </div>
        </div>

        {/* Feed Selector */}
        <div className="flex gap-2">
          <Badge variant="default" className="cursor-pointer bg-primary hover:bg-primary/90">
            For You
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
            Verified
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
            Following
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};
