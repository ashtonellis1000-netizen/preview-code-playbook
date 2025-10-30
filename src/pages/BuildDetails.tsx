import { useParams, Link } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";

export default function BuildDetails() {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="p-4 pt-20 pb-20">
        <h1 className="text-2xl font-bold text-foreground mb-4">Build #{id}</h1>
        <p className="text-muted-foreground mb-6">Full build details and progress will appear here.</p>
        
        <div className="flex gap-4">
          <Link to={`/build/${id}/comments`}>
            <Button variant="outline">View Comments</Button>
          </Link>
          <Link to={`/quote/${id}`}>
            <Button variant="default">Request Quote</Button>
          </Link>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
