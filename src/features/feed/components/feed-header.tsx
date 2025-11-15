import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { FeedFilter } from "../hooks/use-feed-preferences";

interface FeedHeaderProps {
  filter: FeedFilter;
  filters: Array<{ id: FeedFilter; label: string }>;
  onFilterChange: (filter: FeedFilter) => void;
}

export const FeedHeader = ({ filter, filters, onFilterChange }: FeedHeaderProps) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-b border-border z-50">
        <div className="flex items-center justify-between h-16 max-w-screen-xl mx-auto px-6">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-black tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-performance">SPEC</span>
            </div>
          </div>

          <div className="flex gap-2">
            {filters.map((item) => (
              <Badge
                key={item.id}
                variant={item.id === filter ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  item.id === filter ? "bg-primary hover:bg-primary/90" : "hover:bg-secondary/80"
                }`}
                onClick={() => onFilterChange(item.id)}
              >
                {item.label}
              </Badge>
            ))}
          </div>

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
            <Input
              type="text"
              placeholder="Search builds, shops, users..."
              className="flex-1 text-lg"
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
            <p className="text-muted-foreground text-center mt-8">
              Start typing to search across builds, shops, and creators.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
