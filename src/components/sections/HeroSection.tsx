import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Search, TrendingUp } from "lucide-react";
import GoogleLogo from "@/components/GoogleLogo";
import { EASE, GOOGLE_MAPS_URL } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";

const heroImages = [
  "/images/hero-aerial-1.webp",
  "/images/hero-aerial-2.webp",
  "/images/hero-aerial-3.webp",
  "/images/hero-aerial-4.webp",
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
  // Track which slides have been loaded into DOM (start with only slide 0)
  const [mountedSlides, setMountedSlides] = useState<Set<number>>(() => new Set([0]));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => {
        const next = (prev + 1) % heroImages.length;
        // Mount the next slide before it becomes active
        setMountedSlides(s => new Set(s).add(next));
        return next;
      });
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    startTimer();

    // Preload remaining slides in background after initial mount (no DOM nodes)
    const preloadTimer = setTimeout(() => {
      heroImages.slice(1).forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(preloadTimer);
    };
  }, []);

  const goToSlide = (i: number) => {
    setMountedSlides(s => new Set(s).add(i));
    setCurrentSlide(i);
    startTimer();
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
            poster="/images/mdp-aerial-hero.webp"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/images/office-video.mp4" type="video/mp4" />
          </video>
        ) : (
          /* ── Desktop: carousel — only mounted slides rendered ── */
          <>
            {heroImages.map((src, i) =>
              mountedSlides.has(i) ? (
                <motion.img
                  key={src}
                  src={src}
                  alt=""
                  fetchPriority={i === 0 ? "high" : "auto"}
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
              ) : null
            )}
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
        {/* Certification badge */}
        <motion.div
          className="inline-flex items-center gap-2 mb-6"
          style={{
            border: "1px solid rgba(180,130,255,0.32)",
            borderRadius: "2px",
            padding: "6px 14px",
            backdropFilter: "blur(8px)",
            background: "rgba(120,45,190,0.12)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        >
          <span style={{
            color: "hsl(275, 80%, 74%)",
            fontSize: 10,
            fontFamily: "var(--font-body)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}>
            28 años en el mercado inmobiliario
          </span>
        </motion.div>

        <motion.h1 className="font-display text-[clamp(42px,6.5vw,88px)] leading-[1.0] mb-8">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            style={{ color: "white", textShadow: "0 2px 24px rgba(0,0,0,0.65)" }}
          >
            Inversiones reales
          </motion.span>
          <motion.span
            className="block italic"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.65)" }}
          >
            <span style={{ color: "rgba(240,230,255,0.96)" }}>para </span>
            <span style={{ color: "hsl(275 70% 78%)", textShadow: "0 2px 24px rgba(0,0,0,0.65)" }}>proyectos de vida</span>
          </motion.span>
        </motion.h1>

        {/* Hero CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 md:mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.1 }}
        >
          {/* Comprar / Alquilar */}
          <motion.button
            onClick={() => navigate("/propiedades")}
            className="group relative flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-4 w-full sm:w-auto justify-center overflow-hidden"
            style={{
              background: "hsl(275, 62%, 38%)",
              border: "1px solid hsl(275, 62%, 52%)",
              borderRadius: "2px",
              color: "white",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            {/* Shine overlay on hover */}
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)" }}
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            <Search className="w-4 h-4 shrink-0 opacity-80" />
            <span>Comprar / Alquilar</span>
          </motion.button>

          {/* Vender */}
          <motion.button
            onClick={() => navigate("/tasaciones")}
            className="group flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-4 w-full sm:w-auto justify-center"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: "2px",
              color: "rgba(255,255,255,0.90)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
            whileHover={{
              background: "rgba(255,255,255,0.13)",
              borderColor: "rgba(255,255,255,0.40)",
              color: "rgba(255,255,255,1)",
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <TrendingUp className="w-4 h-4 shrink-0 opacity-80" />
            <span>Vender</span>
          </motion.button>
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

      {/* Scroll indicator */}
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
