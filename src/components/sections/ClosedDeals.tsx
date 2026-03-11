import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE as ease } from "@/lib/constants";

const dealImages = [
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=350&q=70&auto=format",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=350&q=70&auto=format",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=350&q=70&auto=format",
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=350&q=70&auto=format",
  "https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=350&q=70&auto=format",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=350&q=70&auto=format",
];

const deals = [
  { type: "Chalet", year: "2025", status: "VENDIDO" },
  { type: "Departamento", year: "2025", status: "RESERVADO" },
  { type: "PH", year: "2024", status: "VENDIDO" },
  { type: "Lote", year: "2024", status: "VENDIDO" },
  { type: "Departamento", year: "2024", status: "RESERVADO" },
  { type: "Chalet", year: "2023", status: "VENDIDO" },
];

const ClosedDeals = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      <div className="section-divider" />
      <section ref={ref} className="section-lazy section-padding noise-overlay" style={{ backgroundColor: "hsl(270 18% 97%)", contain: "content" }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.p
            className="label-eyebrow text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
          >
            Operaciones concretadas
          </motion.p>
          <motion.h2
            className="font-display text-[clamp(32px,4vw,44px)] text-foreground mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >
            Propiedades que encontraron su dueño
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {deals.map((deal, i) => (
              <motion.div
                key={i}
                className="relative aspect-[4/3] overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: i * 0.1 }}
              >
                <img
                  src={dealImages[i]}
                  alt={deal.type}
                  className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500"
                  loading="lazy"
                  decoding="async"
                  width={350}
                  height={263}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,6,60,0.65) 0%, transparent 55%)" }} />
                
                {/* Status badge */}
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 font-body text-[11px] uppercase tracking-wider rounded-sm"
                  style={
                    deal.status === "VENDIDO"
                      ? { backgroundColor: "hsl(275,62%,38%)", color: "white", backdropFilter: "blur(4px)" }
                      : { backgroundColor: "rgba(160,80,220,0.75)", color: "white", backdropFilter: "blur(4px)" }
                  }
                >
                  {deal.status}
                </div>

                <div className="absolute bottom-4 left-4">
                  <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{deal.year}</p>
                  <p className="font-body text-sm" style={{ color: "white", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{deal.type}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ClosedDeals;
