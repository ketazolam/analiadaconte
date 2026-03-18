import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Ruler, Camera, Megaphone, CheckCircle } from "lucide-react";
import MagneticButton from "../MagneticButton";
import { whatsappLink, EASE as ease } from "@/lib/constants";

const steps = [
  { num: "01", icon: Ruler, title: "Tasación", desc: "Evaluamos tu propiedad y te damos un precio de mercado real" },
  { num: "02", icon: Camera, title: "Producción", desc: "Fotografía profesional, drone, recorrido 360° y video" },
  { num: "03", icon: Megaphone, title: "Difusión", desc: "Publicamos en todos los portales + campaña en Meta Ads" },
  { num: "04", icon: CheckCircle, title: "Cierre", desc: "Acompañamiento legal y administrativo hasta la escritura" },
];

const SellProposal = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      <div className="section-divider" />
      <section ref={ref} className="section-lazy relative overflow-hidden noise-overlay" style={{ contain: "content" }}>
        {/* Lazy background image */}
        <img
          src="/images/mdp-coastline.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(60,15,100,0.55) 0%, rgba(30,6,60,0.96) 40%)",
            zIndex: 1,
          }}
        />

        <div className="relative z-10 section-padding">
          <div className="max-w-[680px] mx-auto text-center">
            <motion.p
              className="label-eyebrow mb-6"
              style={{ color: "rgba(200,160,255,0.85)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease }}
            >
              Para propietarios
            </motion.p>

            <motion.h2
              className="font-display text-[clamp(36px,4.5vw,58px)] leading-[1.05] mb-4"
              style={{ color: "white" }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
            >
              Tu propiedad merece
              <br />
              <span className="italic block" style={{ color: "rgba(240,230,255,0.96)" }}>
                la mejor estrategia
              </span>
            </motion.h2>

            <motion.p
              className="font-body text-base mb-16 max-w-lg mx-auto"
              style={{ color: "rgba(255,255,255,0.88)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
            >
              Vendemos 1 de cada 3 propiedades en menos de 60 días. No es suerte — es método.
            </motion.p>

          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 relative">
              <div
                className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px z-0"
                style={{ borderTop: "1px dashed rgba(160,80,220,0.35)" }}
              />
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="relative z-10 flex flex-col items-center text-center px-4 py-6 md:py-0"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease, delay: 0.4 + i * 0.15 }}
                >
                  <span
                    className="font-body text-xs font-medium mb-3 block"
                    style={{ color: "rgba(200,160,255,0.70)", letterSpacing: "0.1em" }}
                  >
                    {step.num}
                  </span>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ border: "1px solid rgba(160,80,220,0.35)", backgroundColor: "rgba(40,8,80,0.85)" }}
                  >
                    <step.icon className="w-5 h-5 text-primary stroke-[1.5]" />
                  </div>
                  <h4 className="font-body text-base md:text-lg font-bold mb-2" style={{ color: "white" }}>{step.title}</h4>
                  <p className="font-body text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.80)" }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.9 }}
          >
            <a
              href={whatsappLink("Hola Analía, me interesa conocer más sobre la venta de mi propiedad")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MagneticButton variant="filled" className="text-base py-5 px-12 shadow-[0_0_40px_rgba(160,80,220,0.15)]">
                Quiero vender mi propiedad
              </MagneticButton>
            </a>
            <p className="mt-4 font-body text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>
              Sin compromiso
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SellProposal;
