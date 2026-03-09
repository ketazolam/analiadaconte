import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollProgress from "@/components/ScrollProgress";
import Navigation from "@/components/sections/Navigation";
import PropertyFiltersBar from "@/components/PropertyFilters";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardRow from "@/components/PropertyCardRow";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/sections/Footer";
import { useProperties } from "@/hooks/useProperties";
import { useFavorites } from "@/hooks/useFavorites";
import type { PropertyFilters } from "@/lib/types";
import type { Propiedad } from "@/lib/types";
import { EASE } from "@/lib/constants";

/* ── URL ↔ Filters sync helpers ── */
function filtersFromParams(sp: URLSearchParams): PropertyFilters {
  return {
    operacion: sp.get("operacion") || undefined,
    tipo: sp.get("tipo") || undefined,
    dormitorios: sp.get("dormitorios") ? Number(sp.get("dormitorios")) : undefined,
    precioMin: sp.get("precioMin") ? Number(sp.get("precioMin")) : undefined,
    precioMax: sp.get("precioMax") ? Number(sp.get("precioMax")) : undefined,
    superficieMin: sp.get("superficieMin") ? Number(sp.get("superficieMin")) : undefined,
    superficieMax: sp.get("superficieMax") ? Number(sp.get("superficieMax")) : undefined,
    destacada: sp.get("destacada") === "1" ? true : undefined,
    sort: (sp.get("sort") as PropertyFilters["sort"]) || "recientes",
    searchText: sp.get("q") || undefined,
  };
}

function filtersToParams(f: PropertyFilters): Record<string, string> {
  const p: Record<string, string> = {};
  if (f.operacion) p.operacion = f.operacion;
  if (f.tipo) p.tipo = f.tipo;
  if (f.dormitorios) p.dormitorios = String(f.dormitorios);
  if (f.precioMin) p.precioMin = String(f.precioMin);
  if (f.precioMax) p.precioMax = String(f.precioMax);
  if (f.superficieMin) p.superficieMin = String(f.superficieMin);
  if (f.superficieMax) p.superficieMax = String(f.superficieMax);
  if (f.destacada) p.destacada = "1";
  if (f.sort && f.sort !== "recientes") p.sort = f.sort;
  if (f.searchText) p.q = f.searchText;
  return p;
}

const Propiedades = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [accumulated, setAccumulated] = useState<Propiedad[]>([]);
  const [prevCount, setPrevCount] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<PropertyFilters>(() => filtersFromParams(searchParams));
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data, isLoading, isError } = useProperties(filters, page);

  // Accumulate properties across pages
  useEffect(() => {
    if (data?.properties) {
      if (page === 0) {
        setAccumulated(data.properties);
        setPrevCount(0);
      } else {
        setAccumulated((prev) => {
          setPrevCount(prev.length);
          const existingIds = new Set(prev.map((p) => p.id));
          const newProps = data.properties.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newProps];
        });
      }
    }
  }, [data, page]);

  const handleFiltersChange = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setPage(0);
    setAccumulated([]);
    setPrevCount(0);
    // Sync to URL
    setSearchParams(filtersToParams(newFilters), { replace: true });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [setSearchParams]);

  const total = data?.total ?? 0;
  const showingCount = accumulated.length;

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />

      <Navigation />
      
      {/* Header */}
      <div className="pt-24 pb-8 px-6 md:px-12 lg:px-20 noise-overlay" style={{ backgroundColor: "hsl(var(--bg-secondary))" }}>
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="font-display text-[clamp(36px,5vw,56px)] text-foreground leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Propiedades en{" "}
            <span className="italic gold-gradient-text">Mar del Plata</span>
          </motion.h1>
          <motion.p
            className="font-body text-sm text-text-secondary mt-3 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            Explorá nuestro catálogo completo de propiedades en venta y alquiler.
          </motion.p>
        </div>
      </div>

      {/* Sticky Filters */}
      <div className="sticky top-[73px] z-40">
        <PropertyFiltersBar
          filters={filters}
          onChange={handleFiltersChange}
          total={total}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
        {isLoading && page === 0 ? (
          <div className={viewMode === "list" ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} variant={viewMode} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="font-body text-text-secondary">Error al cargar propiedades. Intentá de nuevo.</p>
          </div>
        ) : accumulated.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-foreground mb-2">No encontramos propiedades</p>
            <p className="font-body text-sm text-text-secondary mb-6">Probá ajustando los filtros de búsqueda.</p>
            <button
              onClick={() => handleFiltersChange({ sort: "recientes" })}
              className="font-body text-sm text-primary hover:text-gold-light transition-colors"
            >
              Limpiar filtros →
            </button>
          </div>
        ) : (
          <>
            <div className={viewMode === "list" ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
              {accumulated.map((prop, i) => {
                const isNew = i >= prevCount;
                return (
                  <motion.div
                    key={prop.id}
                    initial={isNew ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: isNew ? Math.min((i - prevCount) * 0.05, 0.3) : 0 }}
                  >
                    {viewMode === "list" ? (
                      <PropertyCardRow property={prop} />
                    ) : (
                      <PropertyCard property={prop} />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Load more */}
            <div className="text-center mt-12 space-y-3">
              <p className="font-body text-xs text-text-muted">
                Mostrando {showingCount} de {total}
              </p>
              {data?.hasMore && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoading}
                  className="font-body text-sm uppercase tracking-[0.1em] px-8 py-3 text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                  style={{ border: "1px solid hsl(var(--primary))" }}
                >
                  {isLoading ? "Cargando..." : "Cargar más propiedades"}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <WhatsAppFAB />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Propiedades;
