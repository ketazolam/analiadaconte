import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="section-padding bg-background">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[45%_55%] gap-12 lg:gap-20 items-center">
        {/* Photo with gold frame */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease }}
        >
          <div className="absolute -top-4 -left-4 w-full h-full border border-primary/40" />
          <div className="relative aspect-[3/4] bg-bg-surface overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          className="py-4"
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        >
          <p className="label-eyebrow text-primary mb-6">Quién soy</p>
          <h2 className="font-display text-[clamp(32px,4vw,42px)] text-foreground font-light leading-[1.15] mb-6">
            25 años eligiendo el mejor futuro para mis clientes
          </h2>
          <div className="w-12 h-px bg-primary mb-8" />
          <p className="font-body text-[15px] text-text-secondary leading-relaxed mb-4">
            Soy Analía Daconte, Martillera y Corredora Pública (Matrícula 2815). 
            Llevo más de dos décadas trabajando en el mercado inmobiliario de Mar del Plata, 
            una ciudad que conozco propiedad por propiedad.
          </p>
          <p className="font-body text-[15px] text-text-secondary leading-relaxed mb-8">
            Mi trabajo no termina en la firma del boleto. Acompaño cada etapa del proceso 
            con honestidad, dedicación y el conocimiento que solo dan los años.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Matrícula 2815", "+25 años", "Mar del Plata"].map((badge) => (
              <span
                key={badge}
                className="border border-primary/40 text-primary label-accent px-4 py-2"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
