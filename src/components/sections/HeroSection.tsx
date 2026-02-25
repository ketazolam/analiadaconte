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

  return (
    <section ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center">
      {/* Background gradient — violet radial */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: bgY,
          background: "radial-gradient(ellipse at center, #1A0A2E 0%, #0D0A14 70%)",
        }}
      />

      {/* Texture overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 800px 600px at 30% 20%, rgba(107,33,168,0.08) 0%, transparent 60%), radial-gradient(ellipse 600px 500px at 80% 80%, rgba(196,154,60,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Particles */}
      <ParticleField />

      {/* Large background text — violet */}
      <motion.div
        className="absolute bottom-0 right-0 font-display font-black text-[20vw] leading-none select-none pointer-events-none whitespace-nowrap"
        style={{
          y: useTransform(scrollYProgress, [0, 1], ["0%", "20%"]),
          color: "rgba(107,33,168,0.04)",
        }}
      >
        MAR DEL PLATA
      </motion.div>

      {/* Violet glow behind title */}
      <div
        className="absolute pointer-events-none z-[5]"
        style={{
          width: "600px",
          height: "400px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse 600px 400px at 50% 50%, rgba(107,33,168,0.12) 0%, transparent 70%)",
        }}
      />

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
          <MagneticButton variant="violet">Quiero vender</MagneticButton>
        </motion.div>
      </motion.div>

      {/* Bottom line + scroll indicator */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-primary/30" />
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="animate-rotate-slow">
            <svg viewBox="0 0 100 100" className="w-12 h-12">
              <path
                id="curve"
                d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text className="fill-text-muted" style={{ fontSize: 10, letterSpacing: 5 }}>
                <textPath href="#curve">
                  SCROLL · SCROLL · SCROLL ·
                </textPath>
              </text>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
