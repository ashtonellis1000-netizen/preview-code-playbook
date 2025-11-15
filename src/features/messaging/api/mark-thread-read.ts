import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const markThreadAsRead = async (
  client: SupabaseClient<Database>,
  threadId: string,
  viewerId: string
) => {
  if (!threadId || !viewerId) return;

  const { error } = await client
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("thread_id", threadId)
    .neq("sender_id", viewerId)
    .is("read_at", null);

  if (error) {
    console.warn("Failed to mark messages as read", error);
  }
};
