import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

interface ToggleSaveParams {
  buildId: string;
  userId: string;
  nextValue: boolean;
}

export const toggleSave = async (
  client: SupabaseClient<Database>,
  { buildId, userId, nextValue }: ToggleSaveParams
) => {
  if (nextValue) {
    const { error } = await client.from("saves").upsert({
      build_id: buildId,
      user_id: userId,
    });

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await client
    .from("saves")
    .delete()
    .eq("build_id", buildId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
};
