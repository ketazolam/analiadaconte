import { useQuery } from "@tanstack/react-query";
import { externalSupabase as supabase } from "@/lib/externalSupabase";
import type { Propiedad } from "@/lib/types";

export function useProperty(slug: string | undefined) {
  return useQuery({
    queryKey: ["propiedad", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .eq("pixel_slug", slug!)
        .single();

      if (error) throw error;
      return data as unknown as Propiedad;
    },
  });
}
