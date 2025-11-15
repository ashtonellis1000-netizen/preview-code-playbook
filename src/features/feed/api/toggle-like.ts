import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

interface ToggleLikeParams {
  buildId: string;
  userId: string;
  nextValue: boolean;
}

export const toggleLike = async (
  client: SupabaseClient<Database>,
  { buildId, userId, nextValue }: ToggleLikeParams
) => {
  if (nextValue) {
    const { error } = await client.from("likes").upsert({
      build_id: buildId,
      user_id: userId,
    });

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await client
    .from("likes")
    .delete()
    .eq("build_id", buildId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
};
