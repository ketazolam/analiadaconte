import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Bed, Bath, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { whatsappLink, EASE } from "@/lib/constants";

const properties = [
  { type: "VENTA", price: "USD 185.000", title: "Chalet 3 dormitorios", location: "Playa Grande", beds: 3, baths: 2, area: "180 m²", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=70&auto=format", imageSm: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=350&q=70&auto=format" },
  { type: "ALQUILER", price: "USD 1.200/mes", title: "Departamento vista al mar", location: "La Perla", beds: 2, baths: 1, area: "95 m²", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=70&auto=format", imageSm: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=350&q=70&auto=format" },
  { type: "VENTA", price: "USD 65.000", title: "Lote en barrio cerrado", location: "Sierra de los Padres", beds: 0, baths: 0, area: "600 m²", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=70&auto=format", imageSm: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=350&q=70&auto=format" },
  { type: "VENTA", price: "USD 210.000", title: "PH reciclado con terraza", location: "Güemes", beds: 3, baths: 2, area: "145 m²", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=70&auto=format", imageSm: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=350&q=70&auto=format" },
];

const CARD_W = 380;
const GAP = 24;

const FeaturedProperties = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [scrollX, setScrollX] = useState(0);
  const maxScroll = -((properties.length - 1) * (CARD_W + GAP));

  const scroll = (dir: number) => {
    setScrollX((prev) => {
      const next = prev + dir * (CARD_W + GAP);
      return Math.max(maxScroll, Math.min(0, next));
    });
  };

  return (
    <section id="propiedades" ref={ref} className="section-padding overflow-hidden noise-overlay" style={{ backgroundColor: "#0C0B0F", contain: "content" }}>
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <div className="flex items-end justify-between gap-4">
          <div>
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

          {/* Navigation arrows - desktop */}
          <motion.div
            className="hidden md:flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => scroll(1)}
              disabled={scrollX >= 0}
              className="w-10 h-10 flex items-center justify-center transition-colors duration-200 disabled:opacity-20"
              style={{ border: "1px solid rgba(196,154,60,0.4)", color: "hsl(38,54%,50%)" }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(-1)}
              disabled={scrollX <= maxScroll}
              className="w-10 h-10 flex items-center justify-center transition-colors duration-200 disabled:opacity-20"
              style={{ border: "1px solid rgba(196,154,60,0.4)", color: "hsl(38,54%,50%)" }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Mobile scroll hint */}
        <motion.p
          className="md:hidden font-body text-xs text-text-muted mt-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Deslizá para ver más →
        </motion.p>
      </div>

      {/* Horizontal scroll */}
      <motion.div
        className="flex gap-6 cursor-grab active:cursor-grabbing pb-4 relative z-10"
        drag="x"
        dragConstraints={{ left: maxScroll, right: 0 }}
        dragElastic={0.1}
        animate={{ x: scrollX }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {properties.map((prop, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 w-[340px] md:w-[380px] h-[520px] relative group overflow-hidden transition-[border-color,box-shadow] duration-300 hover:scale-[1.02]"
            style={{
              background: "#141218",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: i * 0.12 }}
          >
            {/* Image */}
            <div className="h-[65%] relative overflow-hidden">
              <img
                src={prop.image}
                srcSet={`${prop.imageSm} 350w, ${prop.image} 500w`}
                sizes="(max-width: 768px) 350px, 500px"
                alt={prop.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width={500}
                height={375}
                fetchPriority="low"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(12,11,15,0.95) 0%, transparent 60%)" }} />
              <span
                className="absolute top-4 left-4 font-body text-[10px] uppercase tracking-wider px-3 py-1"
                style={
                  prop.type === "VENTA"
                    ? { backgroundColor: "#C49A3C", color: "#0C0B0F" }
                    : { backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }
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

              <a
                href={whatsappLink(`Hola Analía, me interesa la propiedad: ${prop.title} en ${prop.location}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full font-body text-xs uppercase tracking-wider py-3 text-primary-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: "#C49A3C" }}
              >
                <MessageCircle className="w-3.5 h-3.5" /> Consultar
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Ver todas button */}
      <motion.div
        className="max-w-7xl mx-auto mt-10 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        <a
          href={whatsappLink("Hola Analía, me gustaría ver más propiedades disponibles")}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm uppercase tracking-[0.1em] text-primary hover:text-gold-light transition-colors"
        >
          Ver todas las propiedades →
        </a>
      </motion.div>
    </section>
  );
};

export default FeaturedProperties;
