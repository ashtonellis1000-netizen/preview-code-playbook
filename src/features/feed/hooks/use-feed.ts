import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";
import { useAuth } from "@/app/providers/auth";
import { fetchBuildFeed } from "../api/get-build-feed";
import type { FeedFilter } from "./use-feed-preferences";

export const FEED_QUERY_KEY = "feed";

export const useFeedQuery = (filter: FeedFilter) => {
  const supabase = useSupabase();
  const { session } = useAuth();

  return useQuery({
    queryKey: [FEED_QUERY_KEY, filter],
    queryFn: () => fetchBuildFeed(supabase, { filter, viewerId: session?.user.id }),
    enabled: Boolean(supabase),
  });
};
