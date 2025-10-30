import { useParams } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { BottomNavigation } from "@/components/BottomNavigation";

export default function QuoteRequest() {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="p-4 pt-20 pb-20">
        <h1 className="text-2xl font-bold text-foreground mb-4">Request Quote</h1>
        <p className="text-muted-foreground mb-6">Quote request form for Build #{id}</p>
        <p className="text-sm text-muted-foreground">Form fields will include: name, vehicle, description, ZIP code, and media upload.</p>
      </div>
      <BottomNavigation />
    </div>
  );
}
