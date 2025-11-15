import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface OwnedShop {
  id: string;
  name: string;
  verified: boolean;
}

export const fetchOwnedShops = async (
  client: SupabaseClient<Database>,
  ownerId: string
): Promise<OwnedShop[]> => {
  const { data, error } = await client
    .from("shops")
    .select("id, name, verified")
    .eq("owner_id", ownerId);

  if (error || !data) {
    console.warn("Failed to load owned shops", error);
    return [];
  }

  return data.map((shop) => ({
    id: shop.id,
    name: shop.name,
    verified: Boolean(shop.verified),
  }));
};
