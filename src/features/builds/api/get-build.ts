import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  normaliseBuildRow,
  type BuildRow,
  type BuildFeedItem,
} from "@/features/feed/api/get-build-feed";

export interface BuildModListItem {
  id: string;
  partName: string;
  manufacturer: string | null;
  partNumber: string | null;
  category: string | null;
  cost: number | null;
  status: string | null;
  createdAt: string;
}

export interface BuildModList {
  id: string;
  title: string;
  items: BuildModListItem[];
}

export interface BuildUpdateItem {
  id: string;
  title: string | null;
  body: string | null;
  progressPercent: number | null;
  createdAt: string;
}

export interface BuildVehicleSpecs {
  vin: string | null;
  exteriorColor: string | null;
  interiorColor: string | null;
  mileage: number | null;
  acquisitionSource: string | null;
  askingPrice: number | null;
  conditionNotes: string | null;
}

export interface BuildDetail extends BuildFeedItem {
  vehicleSpecs: BuildVehicleSpecs | null;
  modLists: BuildModList[];
  updates: BuildUpdateItem[];
}

interface BuildRowExtended extends BuildRow {
  vehicle_specs?:
    | {
        vin: string | null;
        exterior_color: string | null;
        interior_color: string | null;
        mileage: number | null;
        acquisition_source: string | null;
        asking_price: number | null;
        condition_notes: string | null;
      }
    | null;
  mod_lists?: Array<{
    id: string;
    title: string;
    items?: Array<{
      id: string;
      part_name: string;
      manufacturer: string | null;
      part_number: string | null;
      category: string | null;
      cost: number | null;
      status: string | null;
      created_at: string;
    }> | null;
  }> | null;
  updates?: Array<{
    id: string;
    title: string | null;
    body: string | null;
    progress_percent: number | null;
    created_at: string;
  }> | null;
}

const normaliseModLists = (
  modLists: BuildRowExtended["mod_lists"]
): BuildModList[] => {
  if (!modLists?.length) return [];

  return modLists.map((list) => ({
    id: list.id,
    title: list.title,
    items:
      list.items?.map((item) => ({
        id: item.id,
        partName: item.part_name,
        manufacturer: item.manufacturer,
        partNumber: item.part_number,
        category: item.category,
        cost: item.cost,
        status: item.status,
        createdAt: item.created_at,
      })) ?? [],
  }));
};

const normaliseUpdates = (
  updates: BuildRowExtended["updates"]
): BuildUpdateItem[] => {
  if (!updates?.length) return [];

  return updates
    .map((update) => ({
      id: update.id,
      title: update.title,
      body: update.body,
      progressPercent: update.progress_percent,
      createdAt: update.created_at,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const normaliseVehicleSpecs = (
  specs: BuildRowExtended["vehicle_specs"]
): BuildVehicleSpecs | null => {
  if (!specs) return null;

  return {
    vin: specs.vin,
    exteriorColor: specs.exterior_color,
    interiorColor: specs.interior_color,
    mileage: specs.mileage,
    acquisitionSource: specs.acquisition_source,
    askingPrice: specs.asking_price,
    conditionNotes: specs.condition_notes,
  };
};

export const fetchBuildById = async (
  client: SupabaseClient<Database>,
  id: string
): Promise<BuildDetail> => {
  const { data, error } = await client
    .from("builds")
    .select(
      `
        id,
        title,
        cover_url,
        specs,
        created_at,
        shop:shops ( id, name, verified ),
        likes:likes(count),
        comments:comments(count),
        vehicle_specs:build_vehicle_specs ( vin, exterior_color, interior_color, mileage, acquisition_source, asking_price, condition_notes ),
        mod_lists:mod_lists ( id, title, items:mod_list_items ( id, part_name, manufacturer, part_number, category, cost, status, created_at ) ),
        updates:build_updates ( id, title, body, progress_percent, created_at )
      `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    throw error ?? new Error("Build not found");
  }

  const base = normaliseBuildRow(data as BuildRow);
  const extended = data as BuildRowExtended;

  return {
    ...base,
    vehicleSpecs: normaliseVehicleSpecs(extended.vehicle_specs ?? null),
    modLists: normaliseModLists(extended.mod_lists ?? null),
    updates: normaliseUpdates(extended.updates ?? null),
  };
};
