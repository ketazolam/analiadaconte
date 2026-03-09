import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { EASE } from "@/lib/constants";
import { useFeaturedProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";

const FeaturedProperties = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data: properties, isLoading } = useFeaturedProperties(6);

  return (
    <section id="propiedades" ref={ref} className="section-lazy section-padding overflow-hidden noise-overlay" style={{ backgroundColor: "#0C0B0F", contain: "content" }}>
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <motion.h2
              className="font-display text-[clamp(40px,5vw,56px)] text-foreground leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
            >
              Propiedades
              <br />
              <span className="italic gold-gradient-text">destacadas</span>
            </motion.h2>
            <motion.p
              className="font-body text-sm text-text-secondary mt-4 max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            >
              Una selección de propiedades exclusivas en las mejores ubicaciones de Mar del Plata.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] animate-pulse"
                style={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              />
            ))}
          </div>
        ) : !properties || properties.length === 0 ? (
          <p className="font-body text-sm text-text-secondary text-center py-12">
            No hay propiedades destacadas actualmente.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop, i) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
              >
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTAs */}
      <motion.div
        className="max-w-7xl mx-auto mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        <Link
          to="/propiedades"
          className="font-body text-sm uppercase tracking-[0.1em] text-primary hover:text-gold-light transition-colors"
        >
          Ver todas las propiedades →
        </Link>
        <span className="hidden sm:block text-text-muted/30 text-xs">|</span>
        <Link
          to="/mapa"
          className="font-body text-sm uppercase tracking-[0.1em] text-text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5" />
          Explorar en el mapa
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedProperties;
