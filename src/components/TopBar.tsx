import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TopBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleFilterClick = (filter: string) => {
    localStorage.setItem("feed_filter", filter);
    window.location.reload();
  };

  return (
    <>
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
            <Badge 
              variant="default" 
              className="cursor-pointer bg-primary hover:bg-primary/90"
              onClick={() => handleFilterClick("for_you")}
            >
              For You
            </Badge>
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => handleFilterClick("verified")}
            >
              Verified
            </Badge>
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => handleFilterClick("following")}
            >
              Following
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate("/notifications")}
              className="text-muted-foreground hover:text-foreground transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <input
              type="text"
              placeholder="Search builds, shops, users..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg"
              autoFocus
            />
            <button 
              onClick={() => setIsSearchOpen(false)} 
              className="ml-4 text-muted-foreground hover:text-foreground px-4 py-2 border border-border rounded-md"
            >
              Close
            </button>
          </div>
          <div className="flex-1 p-6">
            <p className="text-muted-foreground text-center mt-8">Start typing to search...</p>
          </div>
        </div>
      )}
    </>
  );
};
