import { useQuery } from "@tanstack/react-query";
import { externalSupabase as supabase } from "@/lib/externalSupabase";
import type { Propiedad, PropertyFilters } from "@/lib/types";

const PAGE_SIZE = 21;

export function useProperties(filters: PropertyFilters, page = 0) {
  return useQuery({
    queryKey: ["propiedades", filters, page],
    queryFn: async () => {
      let query = supabase
        .from("propiedades")
        .select("*", { count: "exact" });

      if (filters.operacion) query = query.eq("operacion", filters.operacion);
      if (filters.tipo) query = query.eq("tipo", filters.tipo);
      if (filters.dormitorios) query = query.gte("dormitorios", filters.dormitorios);
      if (filters.precioMin) query = query.gte("precio", filters.precioMin);
      if (filters.precioMax) query = query.lte("precio", filters.precioMax);
      if (filters.superficieMin) query = query.gte("superficie_total", filters.superficieMin);
      if (filters.superficieMax) query = query.lte("superficie_total", filters.superficieMax);
      if (filters.destacada) query = query.eq("destacada", true);

      // Text search across titulo and direccion
      if (filters.searchText) {
        const term = `%${filters.searchText}%`;
        query = query.or(`titulo.ilike.${term},direccion.ilike.${term}`);
      }

      // Sort
      if (filters.sort === "precio_asc") {
        query = query.order("precio", { ascending: true, nullsFirst: false });
      } else if (filters.sort === "precio_desc") {
        query = query.order("precio", { ascending: false, nullsFirst: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const from = page * PAGE_SIZE;
      query = query.range(from, from + PAGE_SIZE - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        properties: (data as unknown as Propiedad[]) || [],
        total: count || 0,
        hasMore: (count || 0) > from + PAGE_SIZE,
      };
    },
  });
}

export function useFeaturedProperties(limit = 6) {
  return useQuery({
    queryKey: ["propiedades-destacadas", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .eq("destacada", true)
        .order("updated_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as unknown as Propiedad[]) || [];
    },
  });
}

export function usePropertyFilterOptions() {
  return useQuery({
    queryKey: ["property-filter-options"],
    queryFn: async () => {
      const [tipos] = await Promise.all([
        supabase.from("propiedades").select("tipo").not("tipo", "is", null),
      ]);

      const uniqueTipos = [...new Set((tipos.data || []).map((r: any) => r.tipo))].filter(Boolean).sort();

      return { tipos: uniqueTipos as string[] };
    },
    staleTime: 5 * 60 * 1000,
  });
}
