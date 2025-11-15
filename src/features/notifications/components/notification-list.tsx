import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useNotifications } from "../hooks/use-notifications";
import { useAuth } from "@/app/providers/auth";
import { useSupabase } from "@/app/providers/supabase";
import { markNotificationsAsRead } from "../api/mark-notifications-read";
import { useNotificationSubscription } from "../hooks/use-notification-subscription";

const formatTimestamp = (timestamp: string) => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    console.warn("Failed to parse notification timestamp", error);
    return "just now";
  }
};

export const NotificationList = () => {
  const { profile } = useAuth();
  const client = useSupabase();
  const { data, isLoading } = useNotifications();
  useNotificationSubscription();

  useEffect(() => {
    if (!profile?.user_id || !data?.length) return;

    void markNotificationsAsRead(client, profile.user_id);
  }, [client, data, profile?.user_id]);

  if (!isLoading && (!data || data.length === 0)) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          You’re all caught up. Likes, quote replies, and DMs will appear here instantly.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {isLoading && <div className="text-sm text-muted-foreground">Loading activity…</div>}
      {(data ?? []).map((notification) => (
        <Card key={notification.id}>
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm text-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(notification.createdAt)}
              </p>
            </div>
            {!notification.readAt && <Badge variant="secondary">New</Badge>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
