import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Home, Key, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EASE as ease } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";

const panelsData = [
  {
    icon: Home,
    title: "Comprar",
    desc: "200+ propiedades en las mejores zonas de Mar del Plata.",
    cta: "Ver propiedades",
    href: "/propiedades?operacion=venta",
    bgDesktop: "/images/waiting-room.jpg",
    bgMobile: "/images/hero-aerial-1.jpg",
    imgAlt: "Explorar propiedades en venta en Mar del Plata",
  },
  {
    icon: Key,
    title: "Vender",
    desc: "Tasación profesional, fotografía y plan de marketing a medida.",
    cta: "Quiero vender",
    href: "/tasaciones",
    bgDesktop: "/images/office-wide.jpg",
    bgMobile: "/images/hero-aerial-2.jpg",
    imgAlt: "Vender tu propiedad con Analía Daconte",
  },
  {
    icon: Building2,
    title: "Alquilar",
    desc: "Alquileres temporarios y permanentes con asesoramiento integral.",
    cta: "Ver alquileres",
    href: "/propiedades?operacion=alquiler",
    bgDesktop: "/images/chesterfield-lounge.jpg",
    bgMobile: "/images/hero-aerial-4.jpg",
    imgAlt: "Propiedades en alquiler en Mar del Plata",
  },
];

const DualPathSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="section-divider" />
      <section ref={ref} className="section-lazy gpu-layer relative" style={{ contain: "content" }}>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {panelsData.map((panel, i) => (
            <motion.button
              key={panel.title}
              className="relative overflow-hidden group text-left min-h-[220px] md:min-h-[420px]"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: i * 0.1 }}
              onClick={() => navigate(panel.href)}
            >
              {/* BG image */}
              <img
                src={isMobile ? panel.bgMobile : panel.bgDesktop}
                alt={panel.imgAlt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: isMobile ? "center 40%" : "center" }}
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{ background: "linear-gradient(to bottom, rgba(10,3,20,0.40) 0%, rgba(10,3,20,0.88) 100%)" }}
              />
              {/* Border between cards */}
              <div className="absolute inset-0 border-r border-b" style={{ borderColor: "rgba(100,30,160,0.12)" }} />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
                <panel.icon className="w-9 h-9 mb-5 stroke-[1.2] transition-transform duration-500 group-hover:translate-y-[-4px]" style={{ color: "rgba(200,160,255,0.90)" }} />
                <h3 className="font-display text-4xl mb-3" style={{ color: "white" }}>{panel.title}</h3>
                <p className="font-body text-[15px] mb-6 max-w-[240px] leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>{panel.desc}</p>
                <span className="font-body text-sm font-medium uppercase tracking-[0.10em] transition-colors underline underline-offset-2" style={{ color: "rgba(220,180,255,1.0)", textDecorationColor: "rgba(220,180,255,0.35)" }}>
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
