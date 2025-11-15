import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";
import { useAuth } from "@/app/providers/auth";

export const useNotificationSubscription = () => {
  const client = useSupabase();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const userId = profile?.user_id;

  useEffect(() => {
    if (!userId) return;

    const channel = client
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        }
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [client, queryClient, userId]);
};
