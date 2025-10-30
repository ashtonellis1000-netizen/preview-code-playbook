import { TopBar } from "@/components/TopBar";
import { BottomNavigation } from "@/components/BottomNavigation";

export default function Notifications() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="p-4 pt-20 pb-20">
        <h1 className="text-2xl font-bold text-foreground mb-4">Notifications</h1>
        <p className="text-muted-foreground">Your notifications will appear here.</p>
      </div>
      <BottomNavigation />
    </div>
  );
}
