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
      cta: "Ver propiedades →",
      bg: "bg-background",
      hoverBorder: "hover:border-r hover:border-r-primary/30",
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
      cta: "Quiero vender →",
      bg: "bg-bg-secondary",
      hoverBorder: "hover:border-l hover:border-l-primary/30",
      direction: 100,
    },
  ];

  return (
    <section ref={ref} className="grid md:grid-cols-2 relative">
      {/* Center divider */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 z-10" />

      {panels.map((panel, i) => (
        <motion.div
          key={panel.title}
          className={`${panel.bg} ${panel.hoverBorder} transition-all duration-500 py-24 px-8 md:px-16 lg:px-24 flex flex-col justify-center min-h-[60vh]`}
          initial={{ opacity: 0, x: panel.direction }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: i * 0.15 }}
        >
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
            {panel.cta}
          </a>
        </motion.div>
      ))}
    </section>
  );
};

export default DualPathSection;
