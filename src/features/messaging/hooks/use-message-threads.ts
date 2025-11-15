import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/app/providers/auth";
import { useSupabase } from "@/app/providers/supabase";
import { fetchMessageThreads, type MessagePreview } from "../api/get-message-threads";

export const useMessageThreads = () => {
  const { profile } = useAuth();
  const client = useSupabase();

  return useQuery<MessagePreview[]>({
    queryKey: ["message-threads", profile?.user_id ?? null],
    queryFn: () => fetchMessageThreads(client, profile?.user_id ?? null),
    enabled: Boolean(profile?.user_id),
    staleTime: 1000 * 30,
  });
};
