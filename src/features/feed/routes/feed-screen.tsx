import { FeedHeader } from "../components/feed-header";
import { BuildCard } from "../components/build-card";
import { useFeedPreferences } from "../hooks/use-feed-preferences";
import { useFeedQuery } from "../hooks/use-feed";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useFeedMutations } from "../hooks/use-feed-mutations";
import { useAuth } from "@/app/providers/auth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const FeedScreen = () => {
  const { filter, filters, setFilter } = useFeedPreferences();
  const { data, isLoading, isError } = useFeedQuery(filter);
  const { toggleLike, toggleSave } = useFeedMutations();
  const { status } = useAuth();

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background">
      <FeedHeader filter={filter} filters={filters} onFilterChange={setFilter} />
      <main className="pt-20 pb-24">
        {isLoading && (
          <div className="px-6 pb-8 text-muted-foreground">Loading builds from Supabase…</div>
        )}
        {isError && (
          <div className="px-6 pb-4 text-destructive">
            Failed to load live builds. Check your Supabase credentials and try again.
          </div>
        )}

        {data?.map((build) => (
          <BuildCard
            key={build.id}
            build={build}
            onToggleLike={(buildId, nextValue) => toggleLike(filter, buildId, nextValue)}
            onToggleSave={(buildId, nextValue) => toggleSave(filter, buildId, nextValue)}
          />
        ))}

        {(!data || data.length === 0) && !isLoading && !isError && (
          <div className="px-6 space-y-3 text-muted-foreground">
            <p>No builds published yet. Invite verified shops to ship their first showcase build.</p>
            {status !== "authenticated" && (
              <Button asChild size="sm">
                <Link to="/auth/sign-up">Create a SPEC account</Link>
              </Button>
            )}
          </div>
        )}
      </main>
      <BottomNavigation />
    </div>
  );
};
