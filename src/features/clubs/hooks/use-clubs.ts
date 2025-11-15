import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";

export interface SpecClub {
  id: string;
  name: string;
  city: string | null;
}

export const useClubsQuery = () => {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ["clubs"],
    queryFn: async (): Promise<SpecClub[]> => {
      const { data, error } = await supabase
        .from("clubs")
        .select("id, name, city")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      return (
        data?.map((club) => ({
          id: club.id,
          name: club.name,
          city: club.city,
        })) ?? []
      );
    },
  });
};
