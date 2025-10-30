import { useParams } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { BottomNavigation } from "@/components/BottomNavigation";

export default function Comments() {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="p-4 pt-20 pb-20">
        <h1 className="text-2xl font-bold text-foreground mb-4">Comments</h1>
        <p className="text-muted-foreground">Comments for Build #{id} will appear here.</p>
      </div>
      <BottomNavigation />
    </div>
  );
}
