import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Home, Key } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const DualPathSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const panels = [
    {
      icon: Home,
      title: "Compradores",
      features: [
        "200+ propiedades disponibles",
        "Búsqueda por zona y precio",
        "Asesoramiento personalizado",
      ],
      cta: "Ver propiedades",
      direction: -100,
    },
    {
      icon: Key,
      title: "Vendedores",
      features: [
        "Fotografía y drone profesional",
        "Plan de marketing a medida",
        "Tasación sin cargo",
      ],
      cta: "Quiero vender",
      direction: 100,
    },
  ];

  return (
    <>
      <div className="section-divider" />
      <section ref={ref} className="grid md:grid-cols-2 relative">
        {/* Center divider */}
        <div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px z-10"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {panels.map((panel, i) => (
          <motion.div
            key={panel.title}
            className="transition-all duration-500 py-24 px-8 md:px-16 lg:px-24 flex flex-col justify-center min-h-[60vh] noise-overlay"
            style={{
              backgroundColor: i === 0 ? "#0C0B0F" : "#111015",
            }}
            initial={{ opacity: 0, x: panel.direction }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: i * 0.15 }}
            whileHover={{
              borderLeft: i === 0 ? "2px solid rgba(196,154,60,0.4)" : undefined,
              borderRight: i === 1 ? "2px solid rgba(196,154,60,0.4)" : undefined,
            }}
          >
            <div className="relative z-10">
              <panel.icon className="w-8 h-8 text-primary mb-8 stroke-[1]" />
              <h2 className="font-display text-5xl text-foreground mb-8">{panel.title}</h2>
              <ul className="space-y-4 mb-10">
                {panel.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 font-body text-[15px] text-text-secondary">
                    <span className="text-primary mt-1">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="font-body text-sm uppercase tracking-[0.1em] text-primary hover:text-gold-light transition-colors"
              >
                {panel.cta} <span className="text-primary">→</span>
              </a>
            </div>
          </motion.div>
        ))}
      </section>
      <div className="section-divider" />
    </>
  );
};

export default DualPathSection;
