import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const reviews = [
  {
    text: "Analía nos ayudó a encontrar nuestra casa soñada en tiempo récord. Su conocimiento de Mar del Plata es incomparable. Profesional y cercana.",
    name: "María Laura González",
    initials: "MG",
  },
  {
    text: "Vendimos nuestro departamento en menos de un mes gracias a su plan de marketing y las fotos con drone. Superó todas nuestras expectativas.",
    name: "Carlos Fernández",
    initials: "CF",
  },
  {
    text: "Una experiencia impecable de principio a fin. Nos acompañó en cada paso de la compra, con total transparencia y dedicación.",
    name: "Valentina Ruiz",
    initials: "VR",
  },
];

const ReviewsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      <div className="section-divider" />
      <section ref={ref} className="section-padding noise-overlay relative overflow-hidden" style={{ contain: "content" }}>
        {/* Lazy background image */}
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
            background: "linear-gradient(to bottom, rgba(24,22,30,0.92) 0%, rgba(24,22,30,0.96) 100%)",
            zIndex: 1,
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Google rating badge */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="font-display text-lg text-primary">4.9</span>
            <span className="font-body text-xs text-text-muted">basado en 47 reseñas</span>
          </motion.div>

          <motion.h2
            className="font-display text-[clamp(32px,4vw,44px)] text-foreground mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >
            Lo que dicen nuestros clientes
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                className="p-8"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  backgroundColor: "#141218",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.12 }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-body text-sm italic text-text-secondary leading-relaxed mb-6">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-body text-xs font-bold"
                    style={{ backgroundColor: "rgba(196,154,60,0.15)", color: "hsl(38,54%,50%)" }}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-body text-[13px] text-foreground font-medium">{review.name}</p>
                    <p className="font-body text-[11px] text-text-muted">Google Review</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Link to Google */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <a
              href="#"
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
