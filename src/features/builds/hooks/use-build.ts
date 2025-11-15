import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";
import { fetchBuildById, type BuildDetail } from "../api/get-build";

export const buildKeys = {
  detail: (id: string) => ["build", id] as const,
};

export const useBuildQuery = (id: string | undefined) => {
  const supabase = useSupabase();

  return useQuery<BuildDetail>({
    enabled: Boolean(id),
    queryKey: id ? buildKeys.detail(id) : ["build", "unknown"],
    queryFn: () => {
      if (!id) throw new Error("Missing build identifier");
      return fetchBuildById(supabase, id);
    },
  });
};
