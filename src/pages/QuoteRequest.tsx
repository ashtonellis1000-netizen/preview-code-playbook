import { QuoteRequestForm } from "@/features/quotes/components/quote-request-form";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function QuoteRequest() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-6 pb-24 px-6 max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to={id ? `/build/${id}` : "/feed"}>Back</Link>
          </Button>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Build #{id}</p>
            <h1 className="text-3xl font-bold text-foreground">Request a build quote</h1>
            <p className="text-sm text-muted-foreground">
              Share the essentials so the shop can price the work, confirm availability, and follow up with questions.
            </p>
          </div>
        </div>

        <QuoteRequestForm buildId={id} />
      </div>
      <BottomNavigation />
    </div>
  );
}
