import { useParams, Link } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { BuildOverview } from "@/features/builds/components/build-overview";
import { useBuildQuery } from "@/features/builds/hooks/use-build";

export default function BuildDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useBuildQuery(id);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-6 pb-24 px-6 max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Build #{id}</p>
            <h1 className="text-3xl font-bold text-foreground">Build overview</h1>
            <p className="text-sm text-muted-foreground">
              Track project milestones, performance gains, and community engagement for this SPEC build.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/build/${id}/comments`}>Comments</Link>
            </Button>
            <Button asChild>
              <Link to={`/quote/${id}`}>Request quote</Link>
            </Button>
          </div>
        </div>

        {isLoading && <p className="text-muted-foreground">Loading build details…</p>}
        {isError && (
          <p className="text-destructive">
            We couldn't load this build from Supabase yet. Confirm the record exists or try again shortly.
          </p>
        )}
        {data && <BuildOverview build={data} />}
      </div>
      <BottomNavigation />
    </div>
  );
}
