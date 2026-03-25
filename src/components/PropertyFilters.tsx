import { useState, useEffect, useRef } from "react";
import { Search, X, Map, SlidersHorizontal, LayoutGrid, LayoutList, Star, Car, PawPrint, CreditCard, ChevronDown, Check } from "lucide-react";
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

/* ── Shared style tokens ── */
const BORDER = "1px solid hsl(var(--border))";
const pillBase = "font-body text-xs uppercase tracking-wider px-4 py-2.5 transition-colors border shrink-0";
const pillActive = "bg-primary text-primary-foreground border-primary";
const pillInactive = "bg-transparent text-text-secondary border-[hsl(var(--border))] hover:text-foreground hover:border-foreground/30";
const selectBase = "font-body text-xs bg-transparent border border-[hsl(var(--border))] px-3 py-2.5 text-foreground appearance-none outline-none focus:border-primary transition-colors shrink-0";

const PropertyFiltersBar = ({ filters, onChange, total, showMapLink = true, viewMode = "grid", onViewModeChange }: PropertyFiltersProps) => {
  const { data: options } = usePropertyFilterOptions();
  const [searchInput, setSearchInput] = useState(filters.searchText || "");
  const [tipoOpen, setTipoOpen] = useState(false);
  const tipoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tipoRef.current && !tipoRef.current.contains(e.target as Node)) setTipoOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setSearchInput(filters.searchText || "");
  }, [filters.searchText]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== (filters.searchText || "")) {
        onChange({ ...filters, searchText: searchInput || undefined });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  const hasFilters = filters.operacion || (filters.tipos && filters.tipos.length > 0) || filters.dormitorios || filters.barrio
    || filters.precioMin || filters.precioMax || filters.superficieMin || filters.superficieMax
    || filters.destacada || filters.searchText || filters.cochera || filters.aptoCreditico || filters.aceptaMascotas;

  const activeCount = [
    filters.operacion, filters.tipos?.length ? true : undefined, filters.dormitorios, filters.barrio, filters.searchText,
    filters.precioMin, filters.precioMax, filters.superficieMin, filters.superficieMax,
    filters.destacada, filters.cochera, filters.aptoCreditico, filters.aceptaMascotas,
  ].filter(Boolean).length;

  const clearAll = () => { onChange({ sort: filters.sort }); setSearchInput(""); };

  /* ── Reusable pieces ── */
  const operacionPills = (className = "") => (
    <div className={`flex gap-0 ${className}`}>
      {["venta", "alquiler"].map((op) => (
        <button
          key={op}
          onClick={() => update({ operacion: filters.operacion === op ? undefined : op })}
          className={`${pillBase} ${filters.operacion === op ? pillActive : pillInactive}`}
        >
          {op}
        </button>
      ))}
    </div>
  );

  const selectedTipos = filters.tipos || [];
  const tipoLabel =
    selectedTipos.length === 0 ? "Tipo" :
    selectedTipos.length === 1 ? selectedTipos[0] :
    `${selectedTipos[0]} +${selectedTipos.length - 1}`;

  const toggleTipo = (t: string) => {
    const next = selectedTipos.includes(t)
      ? selectedTipos.filter((x) => x !== t)
      : [...selectedTipos, t];
    update({ tipos: next.length > 0 ? next : undefined });
  };

  const tipoDropdown = (className = "") => (
    <div className={`relative ${className}`} ref={tipoRef}>
      <button
        type="button"
        onClick={() => setTipoOpen((v) => !v)}
        className={`${selectBase} flex items-center gap-2 w-full ${selectedTipos.length > 0 ? "border-primary text-primary" : ""}`}
      >
        <span className="truncate flex-1 text-left">{tipoLabel}</span>
        <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
      </button>
      {tipoOpen && (
        <div
          className="absolute left-0 top-full mt-1 z-50 min-w-[170px] py-1 shadow-xl bg-white"
          style={{ border: BORDER, borderRadius: "2px" }}
        >
          {(options?.tipos || []).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTipo(t)}
              className="flex items-center gap-2.5 w-full px-3 py-2 font-body text-xs text-left transition-colors hover:bg-gray-50 text-foreground"
            >
              <span
                className="w-4 h-4 shrink-0 flex items-center justify-center border rounded-sm transition-colors"
                style={{
                  borderColor: selectedTipos.includes(t) ? "hsl(var(--primary))" : "hsl(var(--border))",
                  background: selectedTipos.includes(t) ? "hsl(var(--primary))" : "transparent",
                }}
              >
                {selectedTipos.includes(t) && <Check className="w-2.5 h-2.5 text-white" />}
              </span>
              {t}
            </button>
          ))}
          {selectedTipos.length > 0 && (
            <button
              type="button"
              onClick={() => update({ tipos: undefined })}
              className="w-full px-3 py-2 font-body text-[11px] uppercase tracking-wider text-center text-text-muted hover:text-primary transition-colors"
              style={{ borderTop: BORDER }}
            >
              Limpiar
            </button>
          )}
        </div>
      )}
    </div>
  );

  const dormSelect = (className = "") => (
    <select className={`${selectBase} ${className}`} value={filters.dormitorios || ""} onChange={(e) => update({ dormitorios: e.target.value ? Number(e.target.value) : undefined })}>
      <option value="">Dormitorios</option>
      {[1, 2, 3, 4, 5].map((n) => (<option key={n} value={n}>{n}+</option>))}
    </select>
  );

  const barrioSelect = (className = "") => (
    <select className={`${selectBase} ${className}`} value={filters.barrio || ""} onChange={(e) => update({ barrio: e.target.value || undefined })}>
      <option value="">Ubicación</option>
      {(options?.barrios || []).map((b) => (<option key={b} value={b}>{b}</option>))}
    </select>
  );

  const sortSelect = (className = "") => (
    <select className={`${selectBase} ${className}`} value={filters.sort || "recientes"} onChange={(e) => update({ sort: e.target.value as Filters["sort"] })}>
      <option value="recientes">Más recientes</option>
      <option value="precio_asc">Precio ↑</option>
      <option value="precio_desc">Precio ↓</option>
    </select>
  );

  const amenityBtn = (
    field: "cochera" | "aptoCreditico" | "aceptaMascotas" | "destacada",
    label: string,
    Icon: React.ElementType,
    className = ""
  ) => (
    <button
      onClick={() => update({ [field]: filters[field] ? undefined : true })}
      className={`flex items-center gap-1.5 ${pillBase} ${filters[field] ? pillActive : pillInactive} ${className}`}
    >
      <Icon className="w-3 h-3" /> {label}
    </button>
  );

  /* ── Grouped range input ── */
  const RangeGroup = ({
    label,
    fromVal, fromChange, fromPlaceholder,
    toVal, toChange, toPlaceholder,
  }: {
    label: string;
    fromVal: number | undefined; fromChange: (v: number | undefined) => void; fromPlaceholder: string;
    toVal: number | undefined; toChange: (v: number | undefined) => void; toPlaceholder: string;
  }) => (
    <div className="flex items-center shrink-0" style={{ border: BORDER }}>
      <span
        className="font-body text-[10px] uppercase tracking-wider text-text-muted px-3 py-2.5 shrink-0"
        style={{ borderRight: BORDER }}
      >
        {label}
      </span>
      <input
        type="number"
        placeholder={fromPlaceholder}
        value={fromVal || ""}
        onChange={(e) => fromChange(e.target.value ? Number(e.target.value) : undefined)}
        className="font-body text-xs bg-transparent outline-none px-3 py-2.5 w-[88px] text-foreground placeholder:text-text-muted focus:text-primary transition-colors"
      />
      <span className="font-body text-xs text-text-muted px-1">–</span>
      <input
        type="number"
        placeholder={toPlaceholder}
        value={toVal || ""}
        onChange={(e) => toChange(e.target.value ? Number(e.target.value) : undefined)}
        className="font-body text-xs bg-transparent outline-none px-3 py-2.5 w-[88px] text-foreground placeholder:text-text-muted focus:text-primary transition-colors"
        style={{ borderLeft: BORDER }}
      />
    </div>
  );

  return (
    <div
      className="w-full noise-overlay"
      style={{ backgroundColor: "hsl(var(--card))", borderBottom: BORDER, borderTop: "2px solid hsl(var(--primary) / 0.18)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-3.5">

        {/* Desktop Row 1: search + operation + selects + sort + clear */}
        <div className="hidden md:flex items-center gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[180px] max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar zona, dirección..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="font-body text-xs bg-transparent border border-[hsl(var(--border))] pl-9 pr-3 py-2.5 w-full text-foreground outline-none focus:border-primary transition-colors placeholder:text-text-muted"
            />
          </div>

          {/* Separator */}
          <div className="h-5 w-px" style={{ backgroundColor: "hsl(var(--border))" }} />

          {operacionPills()}

          {/* Separator */}
          <div className="h-5 w-px" style={{ backgroundColor: "hsl(var(--border))" }} />

          {tipoDropdown()}
          {barrioSelect()}
          {dormSelect()}

          <div className="ml-auto flex items-center gap-2.5">
            {sortSelect()}
            <Drawer>
              <DrawerTrigger asChild>
                <button
                  className="relative flex items-center gap-2 font-body text-xs uppercase tracking-wider px-4 py-2.5 text-foreground shrink-0"
                  style={{ border: BORDER }}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Más filtros
                  {activeCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                      {activeCount}
                    </span>
                  )}
                </button>
              </DrawerTrigger>
              <DrawerContent className="z-[1200] px-6 pb-8">
                <div className="pt-4 space-y-4">
                  <p className="font-display text-lg text-foreground">Filtros avanzados</p>
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-wider text-text-muted mb-2">Rango de precio</p>
                    <RangeGroup
                      label="Precio"
                      fromVal={filters.precioMin} fromChange={(v) => update({ precioMin: v })} fromPlaceholder="Desde"
                      toVal={filters.precioMax} toChange={(v) => update({ precioMax: v })} toPlaceholder="Hasta"
                    />
                  </div>
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-wider text-text-muted mb-2">Superficie (m²)</p>
                    <RangeGroup
                      label="m²"
                      fromVal={filters.superficieMin} fromChange={(v) => update({ superficieMin: v })} fromPlaceholder="Desde"
                      toVal={filters.superficieMax} toChange={(v) => update({ superficieMax: v })} toPlaceholder="Hasta"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {amenityBtn("cochera", "Cochera", Car)}
                    {amenityBtn("aptoCreditico", "Apto crédito", CreditCard)}
                    {amenityBtn("aceptaMascotas", "Mascotas", PawPrint)}
                    {amenityBtn("destacada", "Destacadas", Star)}
                  </div>
                  {hasFilters && (
                    <button onClick={clearAll} className="w-full font-body text-xs text-text-muted hover:text-primary transition-colors py-2">
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 font-body text-xs text-text-muted hover:text-primary transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Limpiar
              </button>
            )}
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
              <button
                className="relative flex items-center gap-2 font-body text-xs uppercase tracking-wider px-4 py-2.5 text-foreground shrink-0"
                style={{ border: BORDER }}
              >
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
                {tipoDropdown("w-full")}
                {barrioSelect("w-full")}
                {dormSelect("w-full")}
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-text-muted mb-2">Rango de precio</p>
                  <RangeGroup
                    label="Precio"
                    fromVal={filters.precioMin} fromChange={(v) => update({ precioMin: v })} fromPlaceholder="Desde"
                    toVal={filters.precioMax} toChange={(v) => update({ precioMax: v })} toPlaceholder="Hasta"
                  />
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-text-muted mb-2">Superficie (m²)</p>
                  <RangeGroup
                    label="m²"
                    fromVal={filters.superficieMin} fromChange={(v) => update({ superficieMin: v })} fromPlaceholder="Desde"
                    toVal={filters.superficieMax} toChange={(v) => update({ superficieMax: v })} toPlaceholder="Hasta"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {amenityBtn("cochera", "Cochera", Car)}
                  {amenityBtn("aptoCreditico", "Apto crédito", CreditCard)}
                  {amenityBtn("aceptaMascotas", "Mascotas", PawPrint)}
                  {amenityBtn("destacada", "Destacadas", Star)}
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

        {/* Results + view mode + map link */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: BORDER }}>
          <p className="font-body text-xs text-text-muted">
            {total !== undefined ? (
              <><span className="text-foreground font-medium">{total}</span> propiedad{total !== 1 ? "es" : ""} encontrada{total !== 1 ? "s" : ""}</>
            ) : "Cargando..."}
          </p>
          <div className="flex items-center gap-4">
            {onViewModeChange && (
              <div className="hidden md:flex items-center gap-0.5">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`p-1.5 transition-colors rounded ${viewMode === "grid" ? "text-primary" : "text-text-muted hover:text-foreground"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewModeChange("list")}
                  className={`p-1.5 transition-colors rounded ${viewMode === "list" ? "text-primary" : "text-text-muted hover:text-foreground"}`}
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
