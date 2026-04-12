import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollProgress from "@/components/ScrollProgress";
import { usePageMeta } from "@/hooks/usePageMeta";

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
import { EASE } from "@/lib/constants";

/* ── URL ↔ Filters sync helpers ── */
function filtersFromParams(sp: URLSearchParams): PropertyFilters {
  return {
    operacion: sp.get("operacion") || undefined,
    tipos: sp.get("tipo") ? sp.get("tipo")!.split(",") : undefined,
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
  if (f.tipos && f.tipos.length > 0) p.tipo = f.tipos.join(",");
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
  usePageMeta({
    title: "Propiedades en Venta y Alquiler en Mar del Plata",
    description:
      "Explorá más de 200 propiedades en Mar del Plata: departamentos, casas, PHs, lotes. Filtros por zona, precio y dormitorios.",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<PropertyFilters>(() => filtersFromParams(searchParams));
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data, isLoading, isError } = useProperties(filters, page);

  const handleFiltersChange = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setPage(0);
    setSearchParams(filtersToParams(newFilters), { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [setSearchParams]);

  const total = data?.total ?? 0;
  const PAGE_SIZE = 21;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const properties = data?.properties ?? [];

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navigation />
      <h1 className="sr-only">Propiedades en Venta y Alquiler en Mar del Plata</h1>

      {/* Nav spacer */}
      <div className="h-[73px] md:h-[92px]" />

      {/* Sticky Filters */}
      <div className="sticky top-[73px] md:top-[92px] z-40">
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
        ) : properties.length === 0 ? (
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
              {properties.map((prop, i) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE, delay: Math.min(i * 0.04, 0.25) }}
                >
                  {viewMode === "list" ? (
                    <PropertyCardRow property={prop} />
                  ) : (
                    <PropertyCard property={prop} isFavorite={isFavorite(prop.id)} onToggleFavorite={toggleFavorite} />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-12">
                <p className="font-body text-xs text-text-muted">
                  {total} propiedades · página {page + 1} de {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 0 || isLoading}
                    className="font-body text-xs uppercase tracking-[0.1em] px-4 py-2 transition-colors disabled:opacity-30 hover:bg-primary/8"
                    style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                  >
                    ← Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => {
                    const show =
                      i === 0 || i === totalPages - 1 ||
                      Math.abs(i - page) <= 1;
                    const showEllipsisBefore = i === 1 && page > 2;
                    const showEllipsisAfter = i === totalPages - 2 && page < totalPages - 3;
                    if (!show) return null;
                    if (showEllipsisBefore) return <span key={`el-${i}`} className="font-body text-xs text-text-muted px-1">…</span>;
                    if (showEllipsisAfter) return (
                      <>
                        <button
                          key={i}
                          onClick={() => goToPage(i)}
                          disabled={isLoading}
                          className="font-body text-xs w-8 h-8 transition-colors"
                          style={i === page
                            ? { background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
                            : { border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                        >
                          {i + 1}
                        </button>
                        <span key={`el-after-${i}`} className="font-body text-xs text-text-muted px-1">…</span>
                      </>
                    );
                    return (
                      <button
                        key={i}
                        onClick={() => goToPage(i)}
                        disabled={isLoading}
                        className="font-body text-xs w-8 h-8 transition-colors"
                        style={i === page
                          ? { background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
                          : { border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={!data?.hasMore || isLoading}
                    className="font-body text-xs uppercase tracking-[0.1em] px-4 py-2 transition-colors disabled:opacity-30 hover:bg-primary/8"
                    style={{ border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            )}
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
