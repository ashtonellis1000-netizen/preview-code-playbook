import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface ShopDetail {
  id: string;
  name: string;
  description: string | null;
  city: string | null;
  state: string | null;
  verified: boolean;
  builds: Array<{
    id: string;
    title: string;
    coverUrl: string | null;
  }>;
}

export const fetchShopById = async (
  client: SupabaseClient<Database>,
  id: string
): Promise<ShopDetail | null> => {
  const { data, error } = await client
    .from("shops")
    .select(
      `id, name, description, city, state, verified, builds:builds ( id, title, cover_url )`
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.warn("Failed to load shop", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    description: (data as { description?: string | null }).description ?? null,
    city: data.city ?? null,
    state: data.state ?? null,
    verified: Boolean(data.verified),
    builds:
      (data.builds as Array<{ id: string; title: string; cover_url: string | null }> | null)?.map((build) => ({
        id: build.id,
        title: build.title,
        coverUrl: build.cover_url,
      })) ?? [],
  };
};
