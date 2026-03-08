import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const ease = [0.22, 1, 0.36, 1] as const;

const GOOGLE_REVIEW_URL = "https://www.google.com/maps/place/Analia+Daconte+Inversiones+Inmobiliarias/@-37.9661192,-57.5554955,17z/data=!3m1!4b1!4m6!3m5!1s0x9584d97a632a135b:0x615a919b8924802a!8m2!3d-37.9661235!4d-57.5529206!16s%2Fg%2F1tkmnqyg?entry=ttu";

const reviews = [
  {
    text: "Hola, es muy recomendable, la atención personalizada ayuda en el proceso de venta. Analia es una martillera de trayectoria en la ciudad, la cual nos da tranquilidad.",
    name: "Pablo Lech",
    initial: "P",
    color: "#4285F4",
    time: "Hace 4 meses",
    stars: 5,
  },
  {
    text: "Si bien uno busca trayectoria y reputación en el mercado inmobiliario porque eso supone experiencia y responsabilidad... la Ética profesional de Analía Daconte, combinación perfecta con su empatía, y entrega absoluta...",
    name: "Natalia Rodriguez",
    initial: "N",
    color: "#EA4335",
    time: "Hace 11 meses",
    stars: 5,
  },
  {
    text: "Muy bien atendido por Analia. Realmente se preocupa y atiende al cliente. La recomiendo.",
    name: "Daniel Bichi",
    initial: "D",
    color: "#34A853",
    time: "Hace 1 año",
    stars: 5,
  },
  {
    text: "La mejor inmobiliaria de Mar del Plata!!",
    name: "Marcelo Pili",
    initial: "M",
    color: "#FBBC05",
    time: "Hace 8 meses",
    stars: 5,
  },
  {
    text: "Analia la mejor, una grande.",
    name: "Maria Bohn",
    initial: "M",
    color: "#4285F4",
    time: "Hace 6 meses",
    stars: 5,
  },
  {
    text: "Excelente inmobiliaria.",
    name: "Anabela Vacotto",
    initial: "A",
    color: "#EA4335",
    time: "Hace 1 año",
    stars: 5,
  },
  {
    text: "Fue un gusto haber sido atendido por ella!!!",
    name: "Ernesto Ibarzabal",
    initial: "E",
    color: "#34A853",
    time: "Hace 2 años",
    stars: 5,
  },
];

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const ReviewsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 1 },
    },
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <>
      <div className="section-divider" />
      <section ref={ref} className="section-padding noise-overlay relative overflow-hidden" style={{ contain: "content" }}>
        {/* Background */}
        <img
          src="/images/waiting-room.jpg"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(24,22,30,0.93) 0%, rgba(24,22,30,0.97) 100%)",
            zIndex: 1,
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Google badge header */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
          >
            <GoogleLogo />
            <span className="font-display text-2xl text-foreground font-semibold">4.9</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
          </motion.div>

          <motion.p
            className="text-center font-body text-xs text-text-muted mb-10"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
          >
            Basado en 47 reseñas de Google
          </motion.p>

          <motion.h2
            className="font-display text-[clamp(32px,4vw,44px)] text-foreground mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >
            Reseñas en Google
          </motion.h2>

          {/* Carousel */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
          >
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex -ml-4">
                {reviews.map((review, i) => (
                  <div
                    key={i}
                    className="min-w-0 shrink-0 grow-0 basis-full md:basis-1/3 pl-4"
                  >
                    <div
                      className="p-6 h-full flex flex-col rounded-sm"
                      style={{
                        border: "1px solid rgba(255,255,255,0.06)",
                        backgroundColor: "#141218",
                      }}
                    >
                      {/* Header: avatar + name + time */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-body text-sm font-bold text-white shrink-0"
                          style={{ backgroundColor: review.color }}
                        >
                          {review.initial}
                        </div>
                        <div className="min-w-0">
                          <p className="font-body text-[13px] text-foreground font-medium truncate">
                            {review.name}
                          </p>
                          <p className="font-body text-[11px] text-text-muted">{review.time}</p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5 mb-3">
                        {Array.from({ length: review.stars }).map((_, j) => (
                          <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                        ))}
                      </div>

                      {/* Review text */}
                      <p className="font-body text-sm text-text-secondary leading-relaxed flex-1">
                        {review.text}
                      </p>

                      {/* Google attribution */}
                      <div className="flex items-center gap-1.5 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        <GoogleLogo />
                        <span className="font-body text-[10px] text-text-muted uppercase tracking-wider">
                          Google Review
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                backgroundColor: "rgba(20,18,24,0.9)",
                border: "1px solid rgba(196,154,60,0.2)",
                opacity: canScrollPrev ? 1 : 0.3,
              }}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4 text-primary" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                backgroundColor: "rgba(20,18,24,0.9)",
                border: "1px solid rgba(196,154,60,0.2)",
                opacity: canScrollNext ? 1 : 0.3,
              }}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4 text-primary" />
            </button>
          </motion.div>

          {/* Link to Google */}
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-text-muted hover:text-primary transition-colors"
            >
              Ver todas en Google <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ReviewsSection;
