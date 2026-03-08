import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Home, Key } from "lucide-react";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { EASE as ease } from "@/lib/constants";

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
      target: "propiedades",
      direction: -100,
      bgImage: "/images/waiting-room.jpg",
    },
    {
      icon: Key,
      title: "Vendedores",
      id: "vendedores",
      features: [
        "Fotografía y drone profesional",
        "Plan de marketing a medida",
        "Tasación sin cargo",
      ],
      cta: "Quiero vender",
      target: "tasacion",
      direction: 100,
      bgImage: "/images/office-wide.jpg",
    },
  ];

  return (
    <>
      <div className="section-divider" />
      <section ref={ref} className="section-lazy gpu-layer grid md:grid-cols-2 relative" style={{ contain: "content" }}>
        <div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px z-10"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {panels.map((panel, i) => (
          <motion.div
            key={panel.title}
            id={panel.id}
            className="transition-all duration-500 py-24 px-8 md:px-16 lg:px-24 flex flex-col justify-center min-h-[70vh] md:min-h-[60vh] noise-overlay relative"
            initial={{ opacity: 0, x: panel.direction }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: i * 0.15 }}
            whileHover={{
              borderLeft: i === 0 ? "2px solid rgba(196,154,60,0.4)" : undefined,
              borderRight: i === 1 ? "2px solid rgba(196,154,60,0.4)" : undefined,
            }}
          >
            {/* Lazy background image */}
            <img
              src={panel.bgImage}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(12,11,15,0.5) 0%, rgba(12,11,15,0.75) 100%)", zIndex: 1 }} />

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
              <button
                onClick={() => smoothScrollTo(panel.target)}
                className="font-body text-sm uppercase tracking-[0.1em] text-primary hover:text-gold-light transition-colors bg-transparent border-none cursor-pointer"
              >
                {panel.cta} <span className="text-primary">→</span>
              </button>
            </div>
          </motion.div>
        ))}
      </section>
      <div className="section-divider" />
    </>
  );
};

export default DualPathSection;
