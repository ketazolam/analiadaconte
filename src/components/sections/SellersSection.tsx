import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Plane, RotateCcw, FileText } from "lucide-react";
import MagneticButton from "../MagneticButton";

const ease = [0.22, 1, 0.36, 1] as const;

const features = [
  { icon: Camera, title: "Fotografía Profesional", desc: "Imágenes de alta calidad que resaltan cada detalle" },
  { icon: Plane, title: "Drone y Video Aéreo", desc: "Perspectivas únicas que ninguna foto puede capturar" },
  { icon: RotateCcw, title: "Recorrido Virtual 360°", desc: "Tu propiedad disponible para visitar las 24 horas" },
  { icon: FileText, title: "Plan de Marketing PDF", desc: "Estrategia personalizada y descargable" },
];

const SellersSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="vendedores" ref={ref} className="section-padding bg-background">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h2
          className="font-display text-[clamp(36px,5vw,52px)] text-foreground mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          ¿Querés vender tu propiedad?
        </motion.h2>
        <motion.p
          className="font-body text-base text-text-secondary max-w-[560px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
        >
          Implementamos tecnología de vanguardia para comercializar tu propiedad 
          al mejor precio y en el menor tiempo.
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="p-8 border border-border bg-bg-secondary/50"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: i * 0.12 }}
          >
            <f.icon className="w-6 h-6 text-primary mb-5 stroke-[1.2]" />
            <h3 className="font-display text-[22px] text-foreground mb-2">{f.title}</h3>
            <p className="font-body text-sm text-text-secondary">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease, delay: 0.6 }}
      >
        <MagneticButton variant="filled">Conocé nuestra propuesta completa</MagneticButton>
      </motion.div>
    </section>
  );
};

export default SellersSection;
