import { BottomNavigation } from "@/components/BottomNavigation";
import { useClubsQuery } from "@/features/clubs/hooks/use-clubs";
import { ClubsList } from "@/features/clubs/components/clubs-list";

export default function Clubs() {
  const { data, isLoading, isError } = useClubsQuery();

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-6 pb-24 px-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SPEC clubs</h1>
          <p className="text-sm text-muted-foreground">
            Highlight local crews and builder communities unlocking SPEC collabs.
          </p>
        </div>

        {isLoading && <p className="text-muted-foreground">Loading clubs…</p>}
        {isError && <p className="text-destructive">Unable to load clubs right now.</p>}
        {data && <ClubsList clubs={data} />}
      </div>
      <BottomNavigation />
    </div>
  );
}
