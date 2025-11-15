import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";

export interface BuildComment {
  id: string;
  body: string;
  authorId: string;
  createdAt: string;
}

export const useCommentsQuery = (buildId: string | undefined) => {
  const supabase = useSupabase();

  return useQuery({
    enabled: Boolean(buildId),
    queryKey: ["build", buildId, "comments"],
    queryFn: async (): Promise<BuildComment[]> => {
      if (!buildId) {
        return [];
      }

      const { data, error } = await supabase
        .from("comments")
        .select("id, body, author_id, created_at")
        .eq("build_id", buildId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return (
        data?.map((comment) => ({
          id: comment.id,
          body: comment.body,
          authorId: comment.author_id,
          createdAt: comment.created_at,
        })) ?? []
      );
    },
  });
};
