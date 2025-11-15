import { format } from "date-fns";
import type { SpecEvent } from "../hooks/use-events";

interface EventsListProps {
  events: SpecEvent[];
}

const formatDate = (value: string | null) => {
  if (!value) return "Date TBD";

  try {
    return format(new Date(value), "MMM d, yyyy h:mmaaa");
  } catch {
    return "Date TBD";
  }
};

export const EventsList = ({ events }: EventsListProps) => {
  if (events.length === 0) {
    return <p className="text-muted-foreground">No events scheduled yet. Curate track days and meets to activate the community.</p>;
  }

  return (
    <ul className="space-y-4">
      {events.map((event) => (
        <li key={event.id} className="rounded-xl border border-border bg-card/80 backdrop-blur p-4">
          <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
          <p className="text-sm text-muted-foreground">{formatDate(event.startsAt)}</p>
          <p className="text-sm text-muted-foreground">{event.location ?? "Location to be announced"}</p>
        </li>
      ))}
    </ul>
  );
};
