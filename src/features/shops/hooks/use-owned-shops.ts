import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";
import { useAuth } from "@/app/providers/auth";
import { fetchOwnedShops, type OwnedShop } from "../api/get-owned-shops";

export const useOwnedShops = () => {
  const client = useSupabase();
  const { profile } = useAuth();
  const ownerId = profile?.user_id;

  return useQuery<OwnedShop[]>({
    queryKey: ["owned-shops", ownerId ?? null],
    queryFn: () => {
      if (!ownerId) return Promise.resolve<OwnedShop[]>([]);
      return fetchOwnedShops(client, ownerId);
    },
    enabled: Boolean(ownerId),
    staleTime: 1000 * 60,
  });
};
