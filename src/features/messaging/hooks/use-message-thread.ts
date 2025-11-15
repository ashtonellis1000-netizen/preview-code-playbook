import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";
import { useAuth } from "@/app/providers/auth";
import {
  fetchMessageThread,
  type MessageThreadDetail,
} from "../api/get-message-thread";
import { markThreadAsRead } from "../api/mark-thread-read";

export const threadKey = (threadId: string | undefined) => ["message-thread", threadId];

export const useMessageThread = (threadId: string | undefined) => {
  const client = useSupabase();
  const { profile } = useAuth();
  const viewerId = profile?.user_id ?? null;

  const query = useQuery<MessageThreadDetail | null>({
    queryKey: threadId ? threadKey(threadId) : threadKey("unknown"),
    queryFn: () => {
      if (!threadId) return Promise.resolve(null);
      return fetchMessageThread(client, threadId, viewerId);
    },
    enabled: Boolean(threadId && viewerId),
    refetchInterval: 1000 * 30,
  });

  useEffect(() => {
    if (!threadId || !viewerId) return;
    if (!query.data) return;

    void markThreadAsRead(client, threadId, viewerId);
  }, [client, query.data, threadId, viewerId]);

  return query;
};

export const useRealtimeThreadSubscription = (
  threadId: string | undefined
) => {
  const client = useSupabase();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!threadId) return;

    const channel = client
      .channel(`messages-thread-${threadId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `thread_id=eq.${threadId}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: threadKey(threadId) });
          return payload;
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages", filter: `thread_id=eq.${threadId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: threadKey(threadId) });
        }
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [client, queryClient, threadId]);
};
