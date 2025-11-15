import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface NotificationItem {
  id: string;
  type: string;
  createdAt: string;
  readAt: string | null;
  message: string;
}

const typeToMessage = (type: string): string => {
  switch (type) {
    case "like":
      return "Someone loved your build.";
    case "comment":
      return "You received a new comment.";
    case "message":
      return "New direct message waiting.";
    case "quote_update":
      return "Quote status updated.";
    case "build_update":
      return "A build you follow posted an update.";
    default:
      return "Activity in SPEC.";
  }
};

export const fetchNotifications = async (
  client: SupabaseClient<Database>,
  userId: string | null
): Promise<NotificationItem[]> => {
  if (!userId) return [];

  const { data, error } = await client
    .from("notifications")
    .select("id, type, created_at, read_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    console.warn("Failed to fetch notifications", error);
    return [];
  }

  return data.map((notification) => ({
    id: notification.id,
    type: notification.type,
    createdAt: notification.created_at,
    readAt: notification.read_at ?? null,
    message: typeToMessage(notification.type ?? "system"),
  }));
};
