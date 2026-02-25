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
      ctaArrowColor: "text-violet-mid",
      bg: "#0D0A14",
      hoverStyle: "hover:border-l-[3px] hover:border-l-violet",
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
      ctaArrowColor: "text-primary",
      bg: "#130E1E",
      hoverStyle: "hover:border-r-[3px] hover:border-r-violet",
      direction: 100,
    },
  ];

  return (
    <>
      <div className="section-divider" />
      <section ref={ref} className="grid md:grid-cols-2 relative">
        {/* Center divider — gradient violet to gold */}
        <div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px z-10"
          style={{ background: "linear-gradient(180deg, hsl(274,69%,40%) 0%, hsl(38,54%,50%) 100%)" }}
        />

        {panels.map((panel, i) => (
          <motion.div
            key={panel.title}
            className={`${panel.hoverStyle} transition-all duration-500 py-24 px-8 md:px-16 lg:px-24 flex flex-col justify-center min-h-[60vh] noise-overlay`}
            style={{
              backgroundColor: panel.bg,
            }}
            initial={{ opacity: 0, x: panel.direction }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: i * 0.15 }}
            whileHover={{
              boxShadow: "inset 0 -2px 40px rgba(107,33,168,0.1)",
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
                className={`font-body text-sm uppercase tracking-[0.1em] text-primary hover:text-gold-light transition-colors`}
              >
                {panel.cta} <span className={panel.ctaArrowColor}>→</span>
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
