import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";
import { fetchShops, type ShopDirectoryItem } from "../api/get-shops";

export const shopsQueryKey = (verifiedOnly: boolean) => ["shops", { verifiedOnly }];

export const useShopsQuery = (verifiedOnly = false) => {
  const client = useSupabase();

  return useQuery<ShopDirectoryItem[]>({
    queryKey: shopsQueryKey(verifiedOnly),
    queryFn: () => fetchShops(client, { verifiedOnly }),
    staleTime: 1000 * 60 * 5,
  });
};
