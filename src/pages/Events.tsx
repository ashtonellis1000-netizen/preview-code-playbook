import { TopBar } from "@/components/TopBar";
import { BottomNavigation } from "@/components/BottomNavigation";

export default function Events() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="p-4 pt-20 pb-20">
        <h1 className="text-2xl font-bold text-foreground mb-4">Events</h1>
        <p className="text-muted-foreground">Upcoming car meets and events will appear here.</p>
      </div>
      <BottomNavigation />
    </div>
  );
}
