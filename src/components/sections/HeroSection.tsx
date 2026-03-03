import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ParticleField from "../ParticleField";
import MagneticButton from "../MagneticButton";

const ease = [0.22, 1, 0.36, 1] as const;

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgTextY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center">
      {/* Background photo */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: bgY,
          backgroundImage: `
            linear-gradient(to bottom, rgba(12,11,15,0.3) 0%, rgba(12,11,15,0.5) 50%, rgba(12,11,15,0.85) 100%),
            url('/images/mdp-aerial-hero.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Particles */}
      <ParticleField />

      {/* Large background text */}
      <motion.div
        className="absolute bottom-0 right-0 font-display font-black text-[20vw] leading-none select-none pointer-events-none whitespace-nowrap"
        style={{
          y: bgTextY,
          color: "rgba(255,255,255,0.025)",
        }}
      >
        MAR DEL PLATA
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl px-6"
        style={{ y: textY }}
      >
        <motion.p
          className="label-eyebrow text-primary mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
        >
          Inversiones Inmobiliarias · Mar del Plata
        </motion.p>

        <motion.h1
          className="font-display text-[clamp(52px,7vw,120px)] leading-[0.95] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.5 }}
        >
          <span className="font-light text-foreground">Encontrá tu</span>
          <br />
          <span className="italic gold-gradient-text">próxima propiedad</span>
        </motion.h1>

        <motion.p
          className="font-body text-base text-text-secondary mb-12 max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.7 }}
        >
          25 años construyendo confianza en Mar del Plata
        </motion.p>

        <motion.div
          className="flex flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.9 }}
        >
          <MagneticButton variant="filled">Quiero comprar</MagneticButton>
          <MagneticButton variant="outline">Quiero vender</MagneticButton>
        </motion.div>
      </motion.div>

      {/* Bottom line + scroll indicator */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px" style={{ background: "rgba(196,154,60,0.3)" }} />
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div
            className="w-px h-10"
            style={{
              backgroundColor: "hsl(38,54%,50%)",
              animation: "scroll-pulse 2s ease-in-out infinite",
            }}
          />
          <span className="label-accent text-text-muted" style={{ fontSize: 9 }}>
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
