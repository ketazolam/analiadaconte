import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Home, Key, TrendingUp, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EASE as ease } from "@/lib/constants";

const DualPathSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  const panels = [
    {
      icon: Home,
      title: "Comprar",
      desc: "200+ propiedades en las mejores zonas de Mar del Plata.",
      cta: "Ver propiedades",
      href: "/propiedades?operacion=venta",
      bgImage: "/images/waiting-room.jpg",
    },
    {
      icon: Key,
      title: "Vender",
      desc: "Tasación sin cargo, fotografía profesional y plan de marketing a medida.",
      cta: "Quiero vender",
      href: "/tasaciones",
      bgImage: "/images/office-wide.jpg",
    },
    {
      icon: Building2,
      title: "Alquilar",
      desc: "Alquileres temporarios y permanentes con asesoramiento integral.",
      cta: "Ver alquileres",
      href: "/propiedades?operacion=alquiler",
      bgImage: "/images/chesterfield-lounge.jpg",
    },
    {
      icon: TrendingUp,
      title: "Invertir",
      desc: "Oportunidades de inversión y desarrollos desde pozo en Mar del Plata.",
      cta: "Explorar inversiones",
      href: "/propiedades",
      bgImage: "/images/mdp-coastline.jpg",
    },
  ];

  return (
    <>
      <div className="section-divider" />
      <section ref={ref} className="section-lazy gpu-layer relative" style={{ contain: "content" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {panels.map((panel, i) => (
            <motion.button
              key={panel.title}
              className="relative overflow-hidden group text-left min-h-[280px] sm:min-h-[360px]"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: i * 0.1 }}
              onClick={() => navigate(panel.href)}
            >
              {/* BG image */}
              <img
                src={panel.bgImage}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
                style={{ background: "linear-gradient(to bottom, rgba(12,11,15,0.4) 0%, rgba(12,11,15,0.8) 100%)", opacity: 0.85 }}
              />
              {/* Border between cards */}
              <div className="absolute inset-0 border-r border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }} />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
                <panel.icon className="w-7 h-7 text-primary mb-4 stroke-[1.2] transition-transform duration-500 group-hover:translate-y-[-4px]" />
                <h3 className="font-display text-3xl sm:text-4xl text-foreground mb-2">{panel.title}</h3>
                <p className="font-body text-[13px] text-foreground/50 mb-5 max-w-[220px] leading-relaxed">{panel.desc}</p>
                <span className="font-body text-xs uppercase tracking-[0.12em] text-primary group-hover:text-gold-light transition-colors">
                  {panel.cta} <span className="ml-1">→</span>
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
      <div className="section-divider" />
    </>
  );
};

export default DualPathSection;
