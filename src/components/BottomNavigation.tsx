import { Home, Calendar, Users, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-4">
        <button 
          onClick={() => toast({ title: "Feed", description: "Already on Feed page" })}
          className="flex flex-col items-center gap-1 text-primary transition-colors"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Feed</span>
        </button>
        
        <button 
          onClick={() => toast({ title: "Events", description: "Events page coming soon!" })}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs font-medium">Events</span>
        </button>
        
        <button 
          onClick={() => toast({ title: "Clubs", description: "Clubs page coming soon!" })}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Users className="w-6 h-6" />
          <span className="text-xs font-medium">Clubs</span>
        </button>
        
        <button 
          onClick={() => toast({ title: "Profile", description: "Profile page coming soon!" })}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};
