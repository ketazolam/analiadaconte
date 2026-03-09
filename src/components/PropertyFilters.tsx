import { useState, useEffect } from "react";
import { Search, X, Map, SlidersHorizontal, LayoutGrid, LayoutList, Star, Car, PawPrint, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { usePropertyFilterOptions } from "@/hooks/useProperties";
import type { PropertyFilters as Filters } from "@/lib/types";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

interface PropertyFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  total?: number;
  showMapLink?: boolean;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

const PropertyFiltersBar = ({ filters, onChange, total, showMapLink = true, viewMode = "grid", onViewModeChange }: PropertyFiltersProps) => {
  const { data: options } = usePropertyFilterOptions();
  const [searchInput, setSearchInput] = useState(filters.searchText || "");

  // Sync external filter changes to local search input
  useEffect(() => {
    setSearchInput(filters.searchText || "");
  }, [filters.searchText]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== (filters.searchText || "")) {
        onChange({ ...filters, searchText: searchInput || undefined });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const hasFilters = filters.operacion || filters.tipo || filters.dormitorios || filters.barrio || filters.precioMin || filters.precioMax || filters.superficieMin || filters.superficieMax || filters.destacada || filters.searchText || filters.cochera || filters.aptoCreditico || filters.aceptaMascotas;

  const activeCount = [filters.operacion, filters.tipo, filters.dormitorios, filters.barrio, filters.searchText, filters.precioMin, filters.precioMax, filters.superficieMin, filters.superficieMax, filters.destacada, filters.cochera, filters.aptoCreditico, filters.aceptaMascotas].filter(Boolean).length;

  const selectClass =
    "font-body text-xs bg-transparent border px-3 py-2.5 text-foreground appearance-none outline-none focus:border-primary transition-colors border-[hsl(var(--border))] w-auto shrink-0";

  const inputClass =
    "font-body text-xs bg-transparent border border-[hsl(var(--border))] px-3 py-2.5 text-foreground outline-none focus:border-primary transition-colors placeholder:text-text-muted w-full";

  const clearAll = () => { onChange({ sort: filters.sort }); setSearchInput(""); };

  /* ── Shared filter rows ── */
  const operacionPills = (className = "") => (
    <div className={`flex gap-0 ${className}`}>
      {["venta", "alquiler"].map((op) => (
        <button
          key={op}
          onClick={() => update({ operacion: filters.operacion === op ? undefined : op })}
          className={`font-body text-xs uppercase tracking-wider px-4 py-2.5 transition-colors border ${
            filters.operacion === op
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-transparent text-text-secondary border-[hsl(var(--border))] hover:text-foreground"
          } ${className}`}
        >
          {op}
        </button>
      ))}
    </div>
  );

  const destacadaToggle = (className = "") => (
    <button
      onClick={() => update({ destacada: filters.destacada ? undefined : true })}
      className={`flex items-center gap-1.5 font-body text-xs uppercase tracking-wider px-3 py-2.5 transition-colors border ${
        filters.destacada
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent text-text-secondary border-[hsl(var(--border))] hover:text-foreground"
      } ${className}`}
    >
      <Star className="w-3 h-3" /> Destacadas
    </button>
  );

  const tipoSelect = (className = "") => (
    <select className={`${selectClass} ${className}`} value={filters.tipo || ""} onChange={(e) => update({ tipo: e.target.value || undefined })}>
      <option value="">Tipo</option>
      {(options?.tipos || []).map((t) => (<option key={t} value={t}>{t}</option>))}
    </select>
  );

  const dormSelect = (className = "") => (
    <select className={`${selectClass} ${className}`} value={filters.dormitorios || ""} onChange={(e) => update({ dormitorios: e.target.value ? Number(e.target.value) : undefined })}>
      <option value="">Dormitorios</option>
      {[1, 2, 3, 4, 5].map((n) => (<option key={n} value={n}>{n}+</option>))}
    </select>
  );

  const barrioSelect = (className = "") => (
    <select className={`${selectClass} ${className}`} value={filters.barrio || ""} onChange={(e) => update({ barrio: e.target.value || undefined })}>
      <option value="">Ubicación</option>
      {(options?.barrios || []).map((b) => (<option key={b} value={b}>{b}</option>))}
    </select>
  );


  const amenityToggle = (
    field: "cochera" | "aptoCreditico" | "aceptaMascotas",
    label: string,
    Icon: React.ElementType,
    className = ""
  ) => (
    <button
      onClick={() => update({ [field]: filters[field] ? undefined : true })}
      className={`flex items-center gap-1.5 font-body text-xs uppercase tracking-wider px-3 py-2.5 transition-colors border ${
        filters[field]
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent text-text-secondary border-[hsl(var(--border))] hover:text-foreground"
      } ${className}`}
    >
      <Icon className="w-3 h-3" /> {label}
    </button>
  );

  const sortSelect = (className = "") => (
    <select className={`${selectClass} ${className}`} value={filters.sort || "recientes"} onChange={(e) => update({ sort: e.target.value as Filters["sort"] })}>
      <option value="recientes">Más recientes</option>
      <option value="precio_asc">Precio ↑</option>
      <option value="precio_desc">Precio ↓</option>
    </select>
  );

  const priceRange = (className = "") => (
    <div className={`flex items-center gap-1 ${className}`}>
      <input
        type="number"
        placeholder="Precio desde"
        value={filters.precioMin || ""}
        onChange={(e) => update({ precioMin: e.target.value ? Number(e.target.value) : undefined })}
        className={`${inputClass} w-[110px]`}
      />
      <span className="text-text-muted text-xs">–</span>
      <input
        type="number"
        placeholder="Precio hasta"
        value={filters.precioMax || ""}
        onChange={(e) => update({ precioMax: e.target.value ? Number(e.target.value) : undefined })}
        className={`${inputClass} w-[110px]`}
      />
    </div>
  );

  const surfaceRange = (className = "") => (
    <div className={`flex items-center gap-1 ${className}`}>
      <input
        type="number"
        placeholder="m² desde"
        value={filters.superficieMin || ""}
        onChange={(e) => update({ superficieMin: e.target.value ? Number(e.target.value) : undefined })}
        className={`${inputClass} w-[100px]`}
      />
      <span className="text-text-muted text-xs">–</span>
      <input
        type="number"
        placeholder="m² hasta"
        value={filters.superficieMax || ""}
        onChange={(e) => update({ superficieMax: e.target.value ? Number(e.target.value) : undefined })}
        className={`${inputClass} w-[100px]`}
      />
    </div>
  );

  return (
    <div className="w-full noise-overlay" style={{ backgroundColor: "hsl(var(--card))", borderBottom: "1px solid hsl(var(--border))" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4">
        {/* Desktop filters */}
        <div className="hidden md:flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por zona, dirección..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="font-body text-xs bg-transparent border border-[hsl(var(--border))] pl-9 pr-3 py-2.5 w-full text-foreground outline-none focus:border-primary transition-colors placeholder:text-text-muted"
            />
          </div>

          {operacionPills()}
          {tipoSelect()}
          {barrioSelect()}
          {dormSelect()}
          {banosSelect()}
          {sortSelect()}

          {hasFilters && (
            <button onClick={clearAll} className="flex items-center gap-1 font-body text-xs text-text-muted hover:text-primary transition-colors">
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>

        {/* Desktop row 2: ranges + amenities */}
        <div className="hidden md:flex flex-wrap items-center gap-3 mt-3">
          <span className="font-body text-[10px] uppercase tracking-wider text-text-muted">Precio</span>
          {priceRange()}
          <span className="font-body text-[10px] uppercase tracking-wider text-text-muted ml-2">Superficie</span>
          {surfaceRange()}
          <div className="ml-2 flex gap-1.5">
            {amenityToggle("cochera", "Cochera", Car)}
            {amenityToggle("aptoCreditico", "Apto crédito", CreditCard)}
            {amenityToggle("aceptaMascotas", "Mascotas", PawPrint)}
            {destacadaToggle()}
          </div>
        </div>

        {/* Mobile: search + drawer */}
        <div className="md:hidden flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="font-body text-xs bg-transparent border border-[hsl(var(--border))] pl-9 pr-3 py-2.5 w-full text-foreground outline-none focus:border-primary transition-colors placeholder:text-text-muted"
            />
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <button className="relative flex items-center gap-2 font-body text-xs uppercase tracking-wider px-4 py-2.5 text-foreground" style={{ border: "1px solid hsl(var(--border))" }}>
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filtros
                {activeCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>
            </DrawerTrigger>
            <DrawerContent className="px-6 pb-8">
              <div className="pt-4 space-y-4">
                <p className="font-display text-lg text-foreground">Filtros</p>

                {operacionPills("flex-1")}
                {tipoSelect("w-full")}
                {barrioSelect("w-full")}
                {dormSelect("w-full")}
                {banosSelect("w-full")}

                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-text-muted mb-2">Rango de precio</p>
                  {priceRange("w-full")}
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-text-muted mb-2">Superficie (m²)</p>
                  {surfaceRange("w-full")}
                </div>

                <div className="flex flex-wrap gap-2">
                  {amenityToggle("cochera", "Cochera", Car)}
                  {amenityToggle("aptoCreditico", "Apto crédito", CreditCard)}
                  {amenityToggle("aceptaMascotas", "Mascotas", PawPrint)}
                  {destacadaToggle()}
                </div>

                {sortSelect("w-full")}

                {hasFilters && (
                  <button onClick={clearAll} className="w-full font-body text-xs text-text-muted hover:text-primary transition-colors py-2">
                    Limpiar filtros
                  </button>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Results row */}
        <div className="flex items-center justify-between mt-3">
          <p className="font-body text-xs text-text-secondary">
            {total !== undefined ? (
              <>{total} propiedad{total !== 1 ? "es" : ""} encontrada{total !== 1 ? "s" : ""}</>
            ) : (
              "Cargando..."
            )}
          </p>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            {onViewModeChange && (
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`p-1.5 transition-colors ${viewMode === "grid" ? "text-primary" : "text-text-muted hover:text-foreground"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewModeChange("list")}
                  className={`p-1.5 transition-colors ${viewMode === "list" ? "text-primary" : "text-text-muted hover:text-foreground"}`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            )}
            {showMapLink && (
              <Link
                to={`/mapa${filters.operacion ? `?operacion=${filters.operacion}` : ""}`}
                className="flex items-center gap-1.5 font-body text-xs text-primary hover:text-gold-light transition-colors"
              >
                <Map className="w-3.5 h-3.5" /> Ver en mapa
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFiltersBar;
