export interface Propiedad {
  id: number;
  pixel_slug: string | null;
  pixel_codigo: string | null;
  operacion: string | null;
  tipo: string | null;
  titulo: string | null;
  precio: number | null;
  moneda: string | null;
  precio_texto: string | null;
  descripcion: string | null;
  direccion: string | null;
  barrio: string | null;
  ciudad: string | null;
  lat: number | null;
  lng: number | null;
  superficie_total: number | null;
  superficie_cubierta: number | null;
  ambientes: number | null;
  dormitorios: number | null;
  banos: number | null;
  toilets: number | null;
  cochera: boolean | null;
  apto_credito: boolean | null;
  acepta_mascotas: boolean | null;
  fotos: string[] | null;
  estado: string | null;
  destacada: boolean | null;
  url_original: string | null;
  created_at: string;
  updated_at: string;
  last_scraped_at: string | null;
}

export interface PropertyFilters {
  operacion?: string;
  tipo?: string;
  dormitorios?: number;
  precioMin?: number;
  precioMax?: number;
  barrio?: string;
  superficieMin?: number;
  superficieMax?: number;
  cochera?: boolean;
  aptoCreditico?: boolean;
  aceptaMascotas?: boolean;
  destacada?: boolean;
  sort?: "precio_asc" | "precio_desc" | "recientes";
  searchText?: string;
}
