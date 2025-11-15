import type { SpecClub } from "../hooks/use-clubs";

interface ClubsListProps {
  clubs: SpecClub[];
}

export const ClubsList = ({ clubs }: ClubsListProps) => {
  if (clubs.length === 0) {
    return <p className="text-muted-foreground">Start curating verified clubs and crews to power SPEC's community layer.</p>;
  }

  return (
    <ul className="space-y-4">
      {clubs.map((club) => (
        <li key={club.id} className="rounded-xl border border-border bg-card/80 backdrop-blur p-4">
          <h3 className="text-lg font-semibold text-foreground">{club.name}</h3>
          <p className="text-sm text-muted-foreground">{club.city ?? "Location coming soon"}</p>
        </li>
      ))}
    </ul>
  );
};
