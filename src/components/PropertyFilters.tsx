import { useState, useEffect } from "react";
import { Search, X, Map, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { usePropertyFilterOptions } from "@/hooks/useProperties";
import type { PropertyFilters as Filters } from "@/lib/types";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

interface PropertyFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  total?: number;
  showMapLink?: boolean;
}

const PropertyFiltersBar = ({ filters, onChange, total, showMapLink = true }: PropertyFiltersProps) => {
  const { data: options } = usePropertyFilterOptions();
  const [searchInput, setSearchInput] = useState(filters.searchText || "");

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
  const hasFilters = filters.operacion || filters.tipo || filters.dormitorios || filters.precioMin || filters.precioMax || filters.searchText;

  const activeCount = [filters.operacion, filters.tipo, filters.dormitorios, filters.searchText].filter(Boolean).length;

  const selectClass =
    "font-body text-xs bg-transparent border px-3 py-2.5 text-foreground appearance-none outline-none focus:border-primary transition-colors border-[hsl(var(--border))]";

  const filterControls = (
    <>
      {/* Search input */}
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

      {/* Operacion pills */}
      <div className="flex gap-0">
        {["venta", "alquiler"].map((op) => (
          <button
            key={op}
            onClick={() => update({ operacion: filters.operacion === op ? undefined : op })}
            className={`font-body text-xs uppercase tracking-wider px-4 py-2.5 transition-colors border ${
              filters.operacion === op
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-text-secondary border-[hsl(var(--border))] hover:text-foreground"
            }`}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Tipo */}
      <select
        className={selectClass}
        value={filters.tipo || ""}
        onChange={(e) => update({ tipo: e.target.value || undefined })}
      >
        <option value="">Tipo</option>
        {(options?.tipos || []).map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* Dormitorios */}
      <select
        className={selectClass}
        value={filters.dormitorios || ""}
        onChange={(e) => update({ dormitorios: e.target.value ? Number(e.target.value) : undefined })}
      >
        <option value="">Dormitorios</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}+</option>
        ))}
      </select>

      {/* Sort */}
      <select
        className={selectClass}
        value={filters.sort || "recientes"}
        onChange={(e) => update({ sort: e.target.value as Filters["sort"] })}
      >
        <option value="recientes">Más recientes</option>
        <option value="precio_asc">Precio ↑</option>
        <option value="precio_desc">Precio ↓</option>
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => { onChange({ sort: filters.sort }); setSearchInput(""); }}
          className="flex items-center gap-1 font-body text-xs text-text-muted hover:text-primary transition-colors"
        >
          <X className="w-3 h-3" /> Limpiar
        </button>
      )}
    </>
  );

  return (
    <div className="w-full noise-overlay" style={{ backgroundColor: "hsl(var(--card))", borderBottom: "1px solid hsl(var(--border))" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4">
        {/* Desktop filters */}
        <div className="hidden md:flex flex-wrap items-center gap-3">
          {filterControls}
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

                {/* Operacion */}
                <div className="flex gap-0">
                  {["venta", "alquiler"].map((op) => (
                    <button
                      key={op}
                      onClick={() => update({ operacion: filters.operacion === op ? undefined : op })}
                      className={`flex-1 font-body text-xs uppercase tracking-wider px-4 py-3 transition-colors border ${
                        filters.operacion === op
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-transparent text-text-secondary border-[hsl(var(--border))] hover:text-foreground"
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>

                <select className={`${selectClass} w-full`} value={filters.tipo || ""} onChange={(e) => update({ tipo: e.target.value || undefined })}>
                  <option value="">Tipo de propiedad</option>
                  {(options?.tipos || []).map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>

                <select className={`${selectClass} w-full`} value={filters.dormitorios || ""} onChange={(e) => update({ dormitorios: e.target.value ? Number(e.target.value) : undefined })}>
                  <option value="">Dormitorios</option>
                  {[1, 2, 3, 4, 5].map((n) => (<option key={n} value={n}>{n}+</option>))}
                </select>

                <select className={`${selectClass} w-full`} value={filters.sort || "recientes"} onChange={(e) => update({ sort: e.target.value as Filters["sort"] })}>
                  <option value="recientes">Más recientes</option>
                  <option value="precio_asc">Precio ↑</option>
                  <option value="precio_desc">Precio ↓</option>
                </select>

                {hasFilters && (
                  <button
                    onClick={() => { onChange({ sort: filters.sort }); setSearchInput(""); }}
                    className="w-full font-body text-xs text-text-muted hover:text-primary transition-colors py-2"
                  >
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
  );
};

export default PropertyFiltersBar;
