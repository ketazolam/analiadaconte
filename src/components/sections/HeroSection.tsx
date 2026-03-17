import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import MagneticButton from "../MagneticButton";
import HeroSearchBar from "../HeroSearchBar";
import GoogleLogo from "@/components/GoogleLogo";
import { EASE, GOOGLE_MAPS_URL } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";

const heroImages = [
  "/images/hero-aerial-1.jpg",
  "/images/hero-aerial-2.jpg",
  "/images/hero-aerial-3.png",
  "/images/hero-aerial-4.jpg",
];

const heroImagesMobile = [
  "/images/hero-aerial-1.jpg",
  "/images/hero-aerial-2.jpg",
  "/images/hero-aerial-3.png",
  "/images/hero-aerial-4.jpg",
];

const SLIDE_DURATION = 5000; // ms por slide
const CROSSFADE_DURATION = 1.2; // segundos

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const disableParallax = isMobile || prefersReduced;

  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = (length: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % length);
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    const length = isMobile ? heroImagesMobile.length : heroImages.length;
    setCurrentSlide(0);
    startTimer(length);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isMobile]);

  const goToSlide = (i: number) => {
    setCurrentSlide(i);
    const length = isMobile ? heroImagesMobile.length : heroImages.length;
    startTimer(length);
  };

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], disableParallax ? ["0%", "0%"] : ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], disableParallax ? ["0%", "0%"] : ["0%", "20%"]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden flex items-start pt-[28vh] md:items-center md:pt-0 justify-center">
      {/* Background: video en mobile, carousel en desktop */}
      <motion.div className="absolute inset-0 overflow-hidden" style={{ y: bgY }}>
        {isMobile ? (
          /* ── Mobile: video ── */
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/images/mdp-aerial-hero.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/images/office-video.mp4" type="video/mp4" />
          </video>
        ) : (
          /* ── Desktop: carousel de 4 imágenes con crossfade ── */
          <>
            {heroImages.map((src, i) => (
              <motion.img
                key={src}
                src={src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1 }}
                animate={
                  i === currentSlide
                    ? { opacity: 1, scale: 1.05 }
                    : { opacity: 0, scale: 1 }
                }
                transition={
                  i === currentSlide
                    ? { opacity: { duration: CROSSFADE_DURATION, ease: "easeInOut" }, scale: { duration: SLIDE_DURATION / 1000, ease: "linear" } }
                    : { opacity: { duration: CROSSFADE_DURATION, ease: "easeInOut" } }
                }
              />
            ))}
          </>
        )}

        {/* Dark neutral overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(5,2,10,0.25) 0%, rgba(5,2,10,0.65) 45%, rgba(5,2,10,0.82) 100%)"
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl px-6"
        style={{ y: textY }}
      >
        <motion.h1 className="font-display text-[clamp(48px,7vw,100px)] leading-[1.0] mb-8">
          {["Inmobiliaria en", "Mar del Plata"].map((line, i) => (
            <motion.span
              key={line}
              className={`block ${i === 1 ? "italic" : "font-light"}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.4 + i * 0.25 }}
              style={{
                color: i === 0 ? "white" : "rgba(240,230,255,0.96)",
                textShadow: "0 2px 24px rgba(0,0,0,0.65)"
              }}
            >
              {line}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="font-body text-lg md:text-xl mb-6 md:mb-10 max-w-md mx-auto"
          style={{ color: "white", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
        >
          28 años convirtiendo decisiones en hogares
        </motion.p>

        {/* Search bar — visible en mobile también */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.1 }}
        >
          <HeroSearchBar />
        </motion.div>

        {/* Google rating badge */}
        <motion.a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-6 hover:opacity-80 transition-opacity cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.3 }}
        >
          <GoogleLogo className="w-4 h-4" />
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" className="w-3 h-3" style={{ fill: "#FBBC04" }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="font-body text-[12px] underline underline-offset-2" style={{ color: "rgba(255,255,255,0.65)", textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
            4.5 en Google
          </span>
        </motion.a>
      </motion.div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px" style={{ background: "rgba(130,50,200,0.3)" }} />
      </div>

      {/* Dots de navegación — solo desktop */}
      {!isMobile && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                background: i === currentSlide ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                transform: i === currentSlide ? "scale(1.3)" : "scale(1)",
              }}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </motion.div>
      )}

      {/* Scroll indicator — chevron elegante */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.5, duration: 0.7 }, y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
      >
        <ChevronDown className="w-6 h-6" style={{ color: "rgba(255,255,255,0.40)" }} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
