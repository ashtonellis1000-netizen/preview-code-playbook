import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";

export interface SpecEvent {
  id: string;
  title: string;
  location: string | null;
  startsAt: string | null;
}

export const useEventsQuery = () => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<SpecEvent[]> => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, location, starts_at")
        .order("starts_at", { ascending: true });

      if (error) {
        throw error;
      }

      return (
        data?.map((event) => ({
          id: event.id,
          title: event.title,
          location: event.location,
          startsAt: event.starts_at,
        })) ?? []
      );
    },
  });
};
