import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ParticleField from "../ParticleField";
import MagneticButton from "../MagneticButton";
import GoogleLogo from "@/components/GoogleLogo";
import { EASE, GOOGLE_MAPS_URL } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const disableParallax = isMobile || prefersReduced;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], disableParallax ? ["0%", "0%"] : ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], disableParallax ? ["0%", "0%"] : ["0%", "20%"]);
  const bgTextY = useTransform(scrollYProgress, [0, 1], disableParallax ? ["0%", "0%"] : ["0%", "20%"]);

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
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
        >
          Inversiones Inmobiliarias · Mar del Plata
        </motion.p>

        <motion.h1
          className="font-display text-[clamp(40px,7vw,100px)] leading-[0.95] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
        >
          <span className="font-light text-foreground">Expertos en</span>
          <br />
          <span className="italic gold-gradient-text">Mar del Plata</span>
        </motion.h1>

        <motion.p
          className="font-body text-base mb-12 max-w-md mx-auto" style={{ color: "rgba(242,239,232,0.7)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
        >
          25 años construyendo confianza en Mar del Plata
        </motion.p>

        <motion.div
          className="flex flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
        >
          <MagneticButton variant="filled" onClick={() => smoothScrollTo("propiedades")}>Quiero comprar</MagneticButton>
          <MagneticButton variant="outline" onClick={() => smoothScrollTo("tasacion")}>Quiero vender</MagneticButton>
        </motion.div>

        {/* Google rating badge */}
        <motion.a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-8 hover:opacity-80 transition-opacity cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.2 }}
        >
          <GoogleLogo className="w-4 h-4" />
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
