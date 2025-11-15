import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface ThreadMessage {
  id: string;
  senderId: string;
  body: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface MessageThreadDetail {
  id: string;
  counterpartName: string;
  counterpartId: string | null;
  buildId: string | null;
  buildTitle: string | null;
  lastMessageAt: string | null;
  messages: ThreadMessage[];
}

const sortMessages = (messages: ThreadMessage[]) =>
  [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

export const fetchMessageThread = async (
  client: SupabaseClient<Database>,
  threadId: string,
  viewerId: string | null
): Promise<MessageThreadDetail | null> => {
  if (!threadId) return null;

  const { data, error } = await client
    .from("message_threads")
    .select(
      `
        id,
        last_message_at,
        build:build_id ( id, title ),
        shop:shop_id ( id, name ),
        customer_id,
        messages:messages ( id, sender_id, body, created_at, read_at )
      `
    )
    .eq("id", threadId)
    .single();

  if (error || !data) {
    console.warn("Failed to load message thread", error);
    return null;
  }

  const build = data.build as { id?: string; title?: string } | null;
  const shop = data.shop as { id?: string; name?: string } | null;
  const customerId = data.customer_id as string | null;

  const viewerIsCustomer = viewerId ? viewerId === customerId : false;

  return {
    id: data.id,
    lastMessageAt: data.last_message_at ?? null,
    counterpartName: viewerIsCustomer
      ? shop?.name ?? "Verified shop"
      : "Customer",
    counterpartId: viewerIsCustomer ? shop?.id ?? null : customerId,
    buildId: build?.id ?? null,
    buildTitle: build?.title ?? null,
    messages: sortMessages(
      (data.messages as Array<{ id: string; sender_id: string; body: string | null; created_at: string; read_at: string | null }> | null)?.map(
        (message) => ({
          id: message.id,
          senderId: message.sender_id,
          body: message.body,
          createdAt: message.created_at,
          readAt: message.read_at,
        })
      ) ?? []
    ),
  };
};
