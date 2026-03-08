import { useState } from "react";
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
import { EASE } from "@/lib/constants";

const Propiedades = () => {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<PropertyFilters>({
    operacion: searchParams.get("operacion") || undefined,
    tipo: searchParams.get("tipo") || undefined,
    sort: "recientes",
  });

  const { data, isLoading, isError } = useProperties(filters, page);

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

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
          total={data?.total}
        />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
        {isLoading ? (
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
        ) : data?.properties.length === 0 ? (
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
              {data?.properties.map((prop, i) => (
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
            {data?.hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="font-body text-sm uppercase tracking-[0.1em] px-8 py-3 text-primary transition-colors hover:bg-primary/10"
                  style={{ border: "1px solid hsl(var(--primary))" }}
                >
                  Cargar más propiedades
                </button>
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
