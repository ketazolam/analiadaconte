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
    <>
      <div className="section-divider" />
      <section ref={ref} className="section-padding noise-overlay" style={{ backgroundColor: "#0D0A14" }}>
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
                style={{ backgroundColor: "#1A1228" }}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: i * 0.1 }}
                whileHover={{
                  backgroundColor: "#1E1535",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet/5 to-transparent group-hover:from-violet/10 transition-all duration-500" />
                
                {/* Diagonal ribbon */}
                <div
                  className="absolute top-3 right-[-35px] w-[140px] text-center rotate-45 font-body text-[9px] uppercase tracking-wider py-1"
                  style={
                    deal.status === "VENDIDO"
                      ? { backgroundColor: "hsl(274,69%,40%)", color: "white" }
                      : { backgroundColor: "hsl(38,54%,50%)", color: "#0D0A14" }
                  }
                >
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
    </>
  );
};

export default ClosedDeals;
