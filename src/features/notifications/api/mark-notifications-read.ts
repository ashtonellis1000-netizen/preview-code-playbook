import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const markNotificationsAsRead = async (
  client: SupabaseClient<Database>,
  userId: string
) => {
  if (!userId) return;

  const { error } = await client
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) {
    console.warn("Failed to mark notifications as read", error);
  }
};
