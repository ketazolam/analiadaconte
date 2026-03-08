import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ParticleField from "../ParticleField";
import MagneticButton from "../MagneticButton";
import { smoothScrollTo } from "@/lib/smoothScroll";

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
            linear-gradient(to bottom, rgba(12,11,15,0.55) 0%, rgba(12,11,15,0.65) 50%, rgba(12,11,15,0.88) 100%),
            url('/images/mdp-aerial-hero.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
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
        style={{ y: textY, textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
      >
        <motion.p
          className="label-eyebrow text-primary mb-8" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
        >
          Inversiones Inmobiliarias · Mar del Plata
        </motion.p>

        <motion.h1
          className="font-display text-[clamp(40px,7vw,100px)] leading-[0.95] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.5 }}
        >
          <span className="font-light text-foreground">Encontrá tu</span>
          <br />
          <span className="italic gold-gradient-text">próxima propiedad</span>
        </motion.h1>

        <motion.p
          className="font-body text-base mb-12 max-w-md mx-auto" style={{ color: "rgba(242,239,232,0.7)" }}
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
          <MagneticButton variant="filled" onClick={() => smoothScrollTo("propiedades")}>Quiero comprar</MagneticButton>
          <MagneticButton variant="outline" onClick={() => smoothScrollTo("tasacion")}>Quiero vender</MagneticButton>
        </motion.div>

        {/* Google rating badge */}
        <motion.a
          href="https://www.google.com/maps/place/Anal%C3%ADa+Daconte+Propiedades"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-8 hover:opacity-80 transition-opacity cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease, delay: 1.2 }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" className="w-3 h-3 fill-primary text-primary">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="font-body text-[12px] text-foreground/70 underline underline-offset-2 decoration-foreground/30" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
            4.9 en Google
          </span>
        </motion.a>
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
