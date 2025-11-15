import { BottomNavigation } from "@/components/BottomNavigation";
import { useEventsQuery } from "@/features/events/hooks/use-events";
import { EventsList } from "@/features/events/components/events-list";

export default function Events() {
  const { data, isLoading, isError } = useEventsQuery();

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-6 pb-24 px-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events calendar</h1>
          <p className="text-sm text-muted-foreground">
            Track upcoming SPEC meets, dyno days, and shop-hosted activations.
          </p>
        </div>

        {isLoading && <p className="text-muted-foreground">Loading events…</p>}
        {isError && <p className="text-destructive">We couldn't load the events calendar yet.</p>}
        {data && <EventsList events={data} />}
      </div>
      <BottomNavigation />
    </div>
  );
}
