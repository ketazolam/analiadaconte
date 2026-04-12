import { useQuery } from "@tanstack/react-query";
import { externalSupabase as supabase } from "@/lib/externalSupabase";
import type { Propiedad, PropertyFilters } from "@/lib/types";

const PAGE_SIZE = 21;

function applyCommonFilters(query: any, filters: Omit<PropertyFilters, "sort" | "searchText" | "superficieMin" | "superficieMax" | "destacada">) {
  if (filters.operacion) query = query.eq("operacion", filters.operacion);
  if (filters.tipos && filters.tipos.length > 0) query = query.in("tipo", filters.tipos);
  if (filters.barrio) query = query.eq("barrio", filters.barrio);
  if (filters.dormitorios) query = query.gte("dormitorios", filters.dormitorios);
  if (filters.precioMin) query = query.gte("precio", filters.precioMin);
  if (filters.precioMax) query = query.lte("precio", filters.precioMax);
  if (filters.cochera) query = query.eq("cochera", true);
  if (filters.aptoCreditico) query = query.eq("apto_credito", true);
  if (filters.aceptaMascotas) query = query.eq("acepta_mascotas", true);
  return query;
}

export function useProperties(filters: PropertyFilters, page = 0) {
  return useQuery({
    queryKey: ["propiedades", filters, page],
    queryFn: async () => {
      let query = supabase
        .from("propiedades")
        .select("*", { count: "exact" });

      query = applyCommonFilters(query, filters);

      if (filters.superficieMin) query = query.gte("superficie_total", filters.superficieMin);
      if (filters.superficieMax) query = query.lte("superficie_total", filters.superficieMax);
      if (filters.destacada) query = query.eq("destacada", true);

      // Text search across titulo, direccion and barrio
      if (filters.searchText) {
        const term = `%${filters.searchText}%`;
        query = query.or(`titulo.ilike.${term},direccion.ilike.${term},barrio.ilike.${term}`);
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

export function useAllMapProperties(filters: Omit<PropertyFilters, "sort">) {
  return useQuery({
    queryKey: ["propiedades-mapa", filters],
    queryFn: async () => {
      let query = supabase
        .from("propiedades")
        .select("id,pixel_slug,titulo,barrio,ciudad,precio,precio_texto,moneda,fotos,lat,lng,operacion,tipo,superficie_total,dormitorios,banos,cochera,apto_credito,acepta_mascotas")
        .not("lat", "is", null)
        .not("lng", "is", null);

      query = applyCommonFilters(query, filters);

      // Fetch up to 1000 (Supabase default max)
      query = query.limit(1000);

      const { data, error } = await query;
      if (error) throw error;
      return (data as unknown as Propiedad[]) || [];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useEmprendimientos(limit = 6) {
  return useQuery({
    queryKey: ["emprendimientos", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("propiedades")
        .select("id,pixel_slug,titulo,tipo,operacion,precio,precio_texto,moneda,fotos,barrio,ciudad,direccion,etiqueta,a_estrenar,superficie_total,dormitorios,cantidad_plantas")
        .ilike("tipo", "%emprendimiento%")
        .order("destacada", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data as unknown as Propiedad[]) || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePropertyFilterOptions() {
  return useQuery({
    queryKey: ["property-filter-options"],
    queryFn: async () => {
      const [tipos, barrios] = await Promise.all([
        supabase.from("propiedades").select("tipo").not("tipo", "is", null),
        supabase.from("propiedades").select("barrio").not("barrio", "is", null),
      ]);

      const uniqueTipos = [...new Set((tipos.data || []).map((r: any) => r.tipo))].filter(Boolean).sort() as string[];
      const uniqueBarrios = [...new Set((barrios.data || []).map((r: any) => r.barrio))].filter(Boolean).sort() as string[];

      return { tipos: uniqueTipos, barrios: uniqueBarrios };
    },
    staleTime: 5 * 60 * 1000,
  });
}
