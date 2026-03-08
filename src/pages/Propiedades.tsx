import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import Navigation from "@/components/sections/Navigation";
import PropertyFiltersBar from "@/components/PropertyFilters";
import PropertyCard from "@/components/PropertyCard";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/sections/Footer";
import { useProperties } from "@/hooks/useProperties";
import type { PropertyFilters } from "@/lib/types";
import type { Propiedad } from "@/lib/types";
import { EASE } from "@/lib/constants";

const Propiedades = () => {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [accumulated, setAccumulated] = useState<Propiedad[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({
    operacion: searchParams.get("operacion") || undefined,
    tipo: searchParams.get("tipo") || undefined,
    sort: "recientes",
  });

  const { data, isLoading, isError } = useProperties(filters, page);

  // Accumulate properties across pages
  useEffect(() => {
    if (data?.properties) {
      if (page === 0) {
        setAccumulated(data.properties);
      } else {
        setAccumulated((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newProps = data.properties.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newProps];
        });
      }
    }
  }, [data, page]);

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setPage(0);
    setAccumulated([]);
  };

  const total = data?.total ?? 0;
  const showingCount = accumulated.length;

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <CustomCursor />
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
        />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
        {isLoading && page === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] animate-pulse"
                style={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accumulated.map((prop, i) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.05, 0.3) }}
                >
                  <PropertyCard property={prop} />
                </motion.div>
              ))}
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
