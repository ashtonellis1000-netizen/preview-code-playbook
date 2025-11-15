import { useCallback, useMemo, useState } from "react";

export type FeedFilter = "for_you" | "verified" | "following";

const FEED_FILTER_STORAGE_KEY = "spec.feed.filter";

const defaultFilter: FeedFilter = "for_you";

const readStoredFilter = (): FeedFilter => {
  if (typeof window === "undefined") {
    return defaultFilter;
  }

  const stored = window.localStorage.getItem(FEED_FILTER_STORAGE_KEY) as FeedFilter | null;
  return stored ?? defaultFilter;
};

export const useFeedPreferences = () => {
  const [filter, setFilter] = useState<FeedFilter>(() => readStoredFilter());

  const updateFilter = useCallback((nextFilter: FeedFilter) => {
    setFilter(nextFilter);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(FEED_FILTER_STORAGE_KEY, nextFilter);
    }
  }, []);

  const filters = useMemo(
    () => [
      { id: "for_you" as const, label: "For You" },
      { id: "verified" as const, label: "Verified" },
      { id: "following" as const, label: "Following" },
    ],
    []
  );

  return {
    filter,
    filters,
    setFilter: updateFilter,
  };
};
