import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";
import { fetchShopById, type ShopDetail } from "../api/get-shop";

export const useShopQuery = (id: string | undefined) => {
  const client = useSupabase();

  return useQuery<ShopDetail | null>({
    enabled: Boolean(id),
    queryKey: ["shop", id ?? "unknown"],
    queryFn: async () => {
      if (!id) return null;
      return fetchShopById(client, id);
    },
    staleTime: 1000 * 60,
  });
};
