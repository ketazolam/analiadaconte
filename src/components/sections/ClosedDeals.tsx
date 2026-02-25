import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

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
    <section ref={ref} className="section-padding bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
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
              className="relative aspect-[4/3] bg-bg-surface overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: i * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:from-primary/10 transition-all duration-500" />
              
              {/* Diagonal ribbon */}
              <div className="absolute top-3 right-[-35px] w-[140px] text-center rotate-45 bg-primary text-primary-foreground font-body text-[9px] uppercase tracking-wider py-1">
                {deal.status}
              </div>

              <div className="absolute bottom-4 left-4">
                <p className="font-body text-xs text-text-muted">{deal.year}</p>
                <p className="font-body text-sm text-text-secondary">{deal.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClosedDeals;
