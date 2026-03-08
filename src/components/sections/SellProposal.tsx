import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Ruler, Camera, Megaphone, CheckCircle } from "lucide-react";
import MagneticButton from "../MagneticButton";
import { whatsappLink, EASE as ease } from "@/lib/constants";

const miniStats = [
  { value: "60 días", label: "promedio de venta" },
  { value: "100%", label: "gestión profesional" },
  { value: "0$", label: "tasación sin cargo" },
];

const steps = [
  { num: "01", icon: Ruler, title: "Tasación", desc: "Evaluamos tu propiedad sin cargo y sin compromiso" },
  { num: "02", icon: Camera, title: "Producción", desc: "Fotografía profesional, drone, recorrido 360° y video" },
  { num: "03", icon: Megaphone, title: "Difusión", desc: "Publicamos en todos los portales + campaña en Meta Ads" },
  { num: "04", icon: CheckCircle, title: "Cierre", desc: "Acompañamiento legal y administrativo hasta la escritura" },
];

const tags = [
  "📸 Fotografía profesional", "🚁 Video con drone", "🔄 Recorrido 360°",
  "🪑 Amoblamiento virtual", "📊 Plan de marketing", "📱 Campaña en redes",
  "⚖️ Asesoramiento legal", "📄 PDF descargable",
];

const SellProposal = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      <div className="section-divider" />
      <section ref={ref} className="relative overflow-hidden noise-overlay" style={{ contain: "content" }}>
        {/* Lazy background image */}
        <img
          src="/images/chesterfield-lounge.jpg"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(12,11,15,0.6) 0%, rgba(12,11,15,0.97) 40%)",
            zIndex: 1,
          }}
        />

        <div className="relative z-10 section-padding">
          <div className="max-w-[680px] mx-auto text-center">
            <motion.p
              className="label-eyebrow text-primary mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease }}
            >
              Para propietarios
            </motion.p>

            <motion.h2
              className="font-display text-[clamp(40px,5vw,64px)] leading-[1.05] text-foreground mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
            >
              Tu propiedad merece
              <br />
              <span className="italic gold-gradient-text">la mejor estrategia</span>
            </motion.h2>

            <motion.p
              className="font-body text-base text-text-secondary mb-12 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
            >
              Vendemos 1 de cada 3 propiedades en menos de 60 días. No es suerte — es método.
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-0 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.3 }}
            >
              {miniStats.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className="flex flex-col items-center px-6 md:px-10">
                    <span className="font-display text-[clamp(28px,3vw,36px)] text-primary leading-none">{s.value}</span>
                    <span className="label-accent mt-1 text-text-muted">{s.label}</span>
                  </div>
                  {i < miniStats.length - 1 && (
                    <div className="w-px h-10" style={{ backgroundColor: "rgba(196,154,60,0.3)" }} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
              <div
                className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-px z-0"
                style={{ borderTop: "1px dashed rgba(196,154,60,0.3)" }}
              />
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="relative z-10 flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center px-4 py-4 md:py-0"
                  style={i < steps.length - 1 ? { borderLeft: "1px dashed rgba(196,154,60,0.3)" } : undefined}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease, delay: 0.4 + i * 0.15 }}
                >
                  <div className="flex flex-col items-center md:items-center">
                    <span className="label-accent text-primary mb-2" style={{ fontSize: 10 }}>{step.num}</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ border: "1px solid rgba(196,154,60,0.3)", backgroundColor: "rgba(12,11,15,0.9)" }}>
                      <step.icon className="w-4 h-4 text-primary stroke-[1.5]" />
                    </div>
                  </div>
                  <div className="md:mt-0">
                    <h4 className="font-body text-sm font-bold text-foreground mb-1">{step.title}</h4>
                    <p className="font-body text-[13px] text-text-secondary leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2 mb-16"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {tags.map((tag, i) => (
              <motion.span
                key={tag}
                className="font-body text-xs px-3.5 py-1.5"
                style={{
                  border: "1px solid rgba(196,154,60,0.25)",
                  background: "rgba(196,154,60,0.05)",
                  color: "rgba(255,255,255,0.7)",
                  borderRadius: 2,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 1 + i * 0.05 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 1.4 }}
          >
            <a
              href={whatsappLink("Hola Analía, me interesa conocer más sobre la venta de mi propiedad")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MagneticButton variant="filled" className="text-base py-5 px-12 shadow-[0_0_40px_rgba(196,154,60,0.25)]">
                Quiero vender mi propiedad
              </MagneticButton>
            </a>
            <p className="mt-4">
              <button
                onClick={() => smoothScrollTo("tasacion")}
                className="font-body text-[13px] text-text-muted hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
              >
                O si preferís, coordinamos una tasación sin cargo →
              </button>
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SellProposal;
