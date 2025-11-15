import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface ShopDirectoryItem {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  verified: boolean;
  buildsPublished: number;
  ownerId: string | null;
}

export const fetchShops = async (
  client: SupabaseClient<Database>,
  { verifiedOnly }: { verifiedOnly?: boolean } = {}
): Promise<ShopDirectoryItem[]> => {
  let query = client
    .from("shops")
    .select("id, name, city, state, verified, owner_id, builds:builds(count)")
    .order("verified", { ascending: false })
    .order("name", { ascending: true });

  if (verifiedOnly) {
    query = query.eq("verified", true);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.warn("Failed to load shops", error);
    return [];
  }

  return data.map((shop) => ({
    id: shop.id,
    name: shop.name,
    city: shop.city ?? null,
    state: shop.state ?? null,
    verified: Boolean(shop.verified),
    buildsPublished: shop.builds?.[0]?.count ?? 0,
    ownerId: (shop as { owner_id?: string | null })?.owner_id ?? null,
  }));
};
