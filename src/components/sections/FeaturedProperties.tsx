import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Bed, Bath, MessageCircle } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const properties = [
  { type: "VENTA", price: "USD 185.000", title: "Chalet 3 dormitorios", location: "Playa Grande", beds: 3, baths: 2, area: "180 m²" },
  { type: "ALQUILER", price: "USD 1.200/mes", title: "Departamento vista al mar", location: "La Perla", beds: 2, baths: 1, area: "95 m²" },
  { type: "VENTA", price: "USD 65.000", title: "Lote en barrio cerrado", location: "Sierra de los Padres", beds: 0, baths: 0, area: "600 m²" },
  { type: "VENTA", price: "USD 210.000", title: "PH reciclado con terraza", location: "Güemes", beds: 3, baths: 2, area: "145 m²" },
];

const FeaturedProperties = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="propiedades" ref={ref} className="section-padding overflow-hidden noise-overlay" style={{ backgroundColor: "#0D0A14" }}>
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <motion.h2
          className="font-display text-[clamp(40px,5vw,56px)] text-foreground leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          Propiedades
          <br />
          <span className="italic gold-gradient-text">destacadas</span>
        </motion.h2>
        <motion.p
          className="font-body text-sm text-text-secondary mt-4 max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
        >
          Una selección de propiedades exclusivas en las mejores ubicaciones de Mar del Plata.
        </motion.p>
      </div>

      {/* Horizontal scroll */}
      <motion.div
        className="flex gap-6 cursor-grab active:cursor-grabbing pb-4 relative z-10"
        drag="x"
        dragConstraints={{ left: -((properties.length - 1) * 400), right: 0 }}
        dragElastic={0.1}
      >
        {properties.map((prop, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 w-[340px] md:w-[380px] h-[520px] relative group overflow-hidden border border-border"
            style={{ background: "linear-gradient(135deg, #1A1228 0%, #130E1E 100%)" }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: i * 0.12 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 60px rgba(107,33,168,0.2), 0 0 0 1px rgba(196,154,60,0.15)",
            }}
          >
            {/* Image placeholder */}
            <div className="h-[65%] relative" style={{ background: "linear-gradient(135deg, #2D1B69 0%, #1A0A2E 100%)" }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #130E1E 0%, transparent 60%)" }} />
              {/* Badge */}
              <span
                className="absolute top-4 left-4 font-body text-[10px] uppercase tracking-wider px-3 py-1"
                style={
                  prop.type === "VENTA"
                    ? { backgroundColor: "hsl(274,69%,40%)", color: "white" }
                    : { backgroundColor: "hsl(38,54%,50%)", color: "#0D0A14" }
                }
              >
                {prop.type}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-display text-[28px] text-primary mb-1">{prop.price}</p>
              <p className="font-body text-sm text-foreground mb-1">{prop.title}</p>
              <p className="flex items-center gap-1 font-body text-xs text-text-muted mb-3">
                <MapPin className="w-3 h-3" /> {prop.location}
              </p>
              {(prop.beds > 0 || prop.baths > 0) && (
                <div className="flex items-center gap-4 font-body text-xs text-text-secondary mb-4">
                  {prop.beds > 0 && (
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {prop.beds}</span>
                  )}
                  {prop.baths > 0 && (
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {prop.baths}</span>
                  )}
                  <span>{prop.area}</span>
                </div>
              )}

              {/* WhatsApp hover button — violet */}
              <motion.a
                href="https://wa.me/5492235000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full font-body text-xs uppercase tracking-wider py-3 text-white"
                style={{ backgroundColor: "hsl(274,69%,40%)", opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <MessageCircle className="w-3.5 h-3.5" /> Consultar
              </motion.a>
              <style>{`
                .group:hover a[href*="wa.me"] { opacity: 1 !important; }
              `}</style>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedProperties;
