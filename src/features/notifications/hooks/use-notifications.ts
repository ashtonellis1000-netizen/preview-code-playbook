import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/app/providers/auth";
import { useSupabase } from "@/app/providers/supabase";
import { fetchNotifications, type NotificationItem } from "../api/get-notifications";

export const useNotifications = () => {
  const { profile } = useAuth();
  const client = useSupabase();

  return useQuery<NotificationItem[]>({
    queryKey: ["notifications", profile?.user_id ?? null],
    queryFn: () => fetchNotifications(client, profile?.user_id ?? null),
    enabled: Boolean(profile?.user_id),
    refetchInterval: 1000 * 30,
  });
};
