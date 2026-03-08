import { Search, X, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { usePropertyFilterOptions } from "@/hooks/useProperties";
import type { PropertyFilters as Filters } from "@/lib/types";

interface PropertyFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  total?: number;
  showMapLink?: boolean;
}

const PropertyFiltersBar = ({ filters, onChange, total, showMapLink = true }: PropertyFiltersProps) => {
  const { data: options } = usePropertyFilterOptions();

  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const hasFilters = filters.operacion || filters.tipo || filters.barrio || filters.dormitorios || filters.precioMin || filters.precioMax;

  const selectClass =
    "font-body text-xs bg-transparent border px-3 py-2.5 text-foreground appearance-none outline-none focus:border-primary transition-colors"
    + " border-[hsl(var(--border))]";

  return (
    <div className="w-full noise-overlay" style={{ backgroundColor: "hsl(var(--card))", borderBottom: "1px solid hsl(var(--border))" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4">
        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3">
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

          {/* Barrio */}
          <select
            className={selectClass}
            value={filters.barrio || ""}
            onChange={(e) => update({ barrio: e.target.value || undefined })}
          >
            <option value="">Barrio</option>
            {(options?.barrios || []).map((b) => (
              <option key={b} value={b}>{b}</option>
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
              onClick={() => onChange({ sort: filters.sort })}
              className="flex items-center gap-1 font-body text-xs text-text-muted hover:text-primary transition-colors"
            >
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
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
