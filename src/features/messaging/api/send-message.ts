import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface SendMessagePayload {
  threadId: string;
  senderId: string;
  body: string;
}

export const sendMessage = async (
  client: SupabaseClient<Database>,
  payload: SendMessagePayload
) => {
  const { error } = await client.from("messages").insert({
    thread_id: payload.threadId,
    sender_id: payload.senderId,
    body: payload.body,
  });

  if (error) {
    throw error;
  }

  const { error: updateError } = await client
    .from("message_threads")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", payload.threadId);

  if (updateError) {
    console.warn("Failed to update thread timestamp", updateError);
  }
};
