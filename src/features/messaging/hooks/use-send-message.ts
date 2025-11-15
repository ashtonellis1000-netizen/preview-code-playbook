import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";
import { useAuth } from "@/app/providers/auth";
import { sendMessage, type SendMessagePayload } from "../api/send-message";
import { threadKey } from "./use-message-thread";

export const useSendMessage = (threadId: string | undefined) => {
  const client = useSupabase();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const senderId = profile?.user_id ?? null;

  return useMutation({
    mutationFn: async (body: string) => {
      if (!threadId) throw new Error("Missing thread identifier");
      if (!senderId) throw new Error("You must be signed in to send a message");

      const payload: SendMessagePayload = {
        threadId,
        senderId,
        body,
      };

      await sendMessage(client, payload);
    },
    onSuccess: () => {
      if (!threadId) return;
      queryClient.invalidateQueries({ queryKey: threadKey(threadId) });
    },
  });
};
