import type { Database } from "@/integrations/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface BuildStage {
  id: string;
  title: string;
  image: string;
  description?: string | null;
}

export interface BuildFeedItem {
  id: string;
  title: string;
  headline?: string | null;
  coverUrl?: string | null;
  shop: {
    id: string | null;
    name: string | null;
    verified: boolean;
  };
  stats: {
    horsepower?: number | null;
    torque?: number | null;
    zeroToSixty?: number | null;
    quarterMile?: number | null;
  };
  stages: BuildStage[];
  likes: number;
  comments: number;
  viewerHasLiked: boolean;
  viewerHasSaved: boolean;
}

const DEFAULT_STAGE_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600";

const safeNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

interface BuildSpecsPayload {
  headline?: string | null;
  stats?: {
    horsepower?: number | string | null;
    torque?: number | string | null;
    zeroToSixty?: number | string | null;
    quarterMile?: number | string | null;
  };
  stages?: Array<{
    id?: string | null;
    title?: string | null;
    image?: string | null;
    description?: string | null;
  }>;
}

const parseBuildSpecs = (specs: unknown): BuildSpecsPayload => {
  if (!specs || typeof specs !== "object") {
    return {};
  }

  return specs as BuildSpecsPayload;
};

const normaliseStages = (rawStages: BuildSpecsPayload["stages"]): BuildStage[] => {
  if (!rawStages || rawStages.length === 0) {
    return [
      {
        id: "default",
        title: "Featured",
        description: "This build is awaiting rich media.",
        image: DEFAULT_STAGE_IMAGE,
      },
    ];
  }

  return rawStages.map((stage, index) => ({
    id: stage?.id ?? `stage-${index}`,
    title: stage?.title ?? `Stage ${index + 1}`,
    description: stage?.description,
    image: stage?.image ?? DEFAULT_STAGE_IMAGE,
  }));
};

export type BuildRow = Database["public"]["Tables"]["builds"]["Row"] & {
  shop?: {
    id?: string | null;
    name?: string | null;
    verified?: boolean | null;
  } | null;
  likes?: Array<{ count: number }>;
  comments?: Array<{ count: number }>;
};

export const normaliseBuildRow = (row: BuildRow): BuildFeedItem => {
  const parsedSpecs = parseBuildSpecs(row.specs);

  return {
    id: row.id,
    title: row.title,
    headline: parsedSpecs.headline ?? null,
    coverUrl: row.cover_url,
    shop: {
      id: row.shop?.id ?? null,
      name: row.shop?.name ?? null,
      verified: Boolean(row.shop?.verified),
    },
    stats: {
      horsepower: safeNumber(parsedSpecs.stats?.horsepower) ?? null,
      torque: safeNumber(parsedSpecs.stats?.torque) ?? null,
      zeroToSixty: safeNumber(parsedSpecs.stats?.zeroToSixty) ?? null,
      quarterMile: safeNumber(parsedSpecs.stats?.quarterMile) ?? null,
    },
    stages: normaliseStages(parsedSpecs.stages),
    likes: row.likes?.[0]?.count ?? 0,
    comments: row.comments?.[0]?.count ?? 0,
    viewerHasLiked: false,
    viewerHasSaved: false,
  };
};

export const fetchBuildFeed = async (
  client: SupabaseClient<Database>,
  { filter, viewerId }: { filter: string; viewerId?: string | null }
): Promise<BuildFeedItem[]> => {
  const query = client
    .from("builds")
    .select(
      `id, title, cover_url, specs, created_at, shop:shops ( id, name, verified ), likes:likes(count), comments:comments(count)`
    )
    .order("created_at", { ascending: false })
    .limit(20);

  if (filter === "verified") {
    query.eq("shop.verified", true);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.warn("Failed to fetch builds from Supabase", error);
    return [];
  }

  const normalised = data.map((row) => normaliseBuildRow(row as BuildRow));

  if (!viewerId || normalised.length === 0) {
    return normalised;
  }

  const buildIds = normalised.map((build) => build.id);

  const [likesResponse, savesResponse] = await Promise.all([
    client
      .from("likes")
      .select("build_id")
      .eq("user_id", viewerId)
      .in("build_id", buildIds),
    client
      .from("saves")
      .select("build_id")
      .eq("user_id", viewerId)
      .in("build_id", buildIds),
  ]);

  if (likesResponse.error) {
    console.warn("Failed to fetch viewer likes", likesResponse.error);
  }

  if (savesResponse.error) {
    console.warn("Failed to fetch viewer saves", savesResponse.error);
  }

  const likedSet = new Set(likesResponse.data?.map((row) => row.build_id) ?? []);
  const savedSet = new Set(savesResponse.data?.map((row) => row.build_id) ?? []);

  return normalised.map((build) => ({
    ...build,
    viewerHasLiked: likedSet.has(build.id),
    viewerHasSaved: savedSet.has(build.id),
  }));
};
