import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import GoogleLogo from "@/components/GoogleLogo";
import { EASE, GOOGLE_MAPS_URL } from "@/lib/constants";

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

import { forwardRef } from "react";

const ReviewsSection = forwardRef<HTMLElement>(function ReviewsSection(_, forwardedRef) {
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

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    let timer: ReturnType<typeof setInterval>;
    const play = () => {
      timer = setInterval(() => emblaApi.scrollNext(), 5000);
    };
    const stop = () => clearInterval(timer);

    play();
    const root = emblaApi.rootNode();
    root.addEventListener("pointerenter", stop);
    root.addEventListener("pointerleave", play);

    return () => {
      stop();
      root.removeEventListener("pointerenter", stop);
      root.removeEventListener("pointerleave", play);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
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
            transition={{ duration: 0.7, ease: EASE }}
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
            transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
          >
            Basado en 47 reseñas de Google
          </motion.p>

          <motion.h2
            className="font-display text-[clamp(32px,4vw,44px)] text-foreground mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            Reseñas en Google
          </motion.h2>

          {/* Carousel */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
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
                        <GoogleLogo className="w-4 h-4" />
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
              href={GOOGLE_MAPS_URL}
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
});

export default ReviewsSection;
