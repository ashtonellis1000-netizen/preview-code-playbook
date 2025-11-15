import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface MessagePreview {
  id: string;
  lastMessageAt: string | null;
  counterpartName: string;
  counterpartAvatar?: string | null;
  unreadCount: number;
  lastMessageSnippet: string | null;
}

export const fetchMessageThreads = async (
  client: SupabaseClient<Database>,
  userId: string | null
): Promise<MessagePreview[]> => {
  if (!userId) return [];

  const { data, error } = await client
    .from("message_threads")
    .select(
      `id, last_message_at, shop:shop_id ( name, id ), customer:customer_id ( id ), participants:thread_participants(user_id), messages:messages(count), last_message:messages(order=created_at.desc,limit=1) ( body, created_at )`
    )
    .eq("customer_id", userId)
    .order("last_message_at", { ascending: false });

  if (error || !data) {
    console.warn("Failed to fetch message threads", error);
    return [];
  }

  const threadIds = data.map((thread) => thread.id);
  const unreadMap = new Map<string, number>();

  if (threadIds.length > 0) {
    const { data: unreadMessages, error: unreadError } = await client
      .from("messages")
      .select("thread_id")
      .in("thread_id", threadIds)
      .is("read_at", null)
      .neq("sender_id", userId);

    if (unreadError) {
      console.warn("Failed to fetch unread counts", unreadError);
    } else {
      unreadMessages?.forEach((message) => {
        const id = message.thread_id as string;
        unreadMap.set(id, (unreadMap.get(id) ?? 0) + 1);
      });
    }
  }

  return data.map((thread) => ({
    id: thread.id,
    lastMessageAt: thread.last_message_at ?? null,
    counterpartName:
      (thread.shop as { name?: string } | null)?.name ??
      (thread.customer as { id?: string } | null)?.id ??
      "Conversation",
    counterpartAvatar: null,
    unreadCount: unreadMap.get(thread.id) ?? 0,
    lastMessageSnippet:
      (thread.last_message as Array<{ body?: string | null }> | null)?.[0]?.body ?? null,
  }));
};
