import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const reviews = [
  {
    text: "Analía nos ayudó a encontrar nuestra casa soñada en tiempo récord. Su conocimiento de Mar del Plata es incomparable. Profesional y cercana.",
    name: "María Laura González",
  },
  {
    text: "Vendimos nuestro departamento en menos de un mes gracias a su plan de marketing y las fotos con drone. Superó todas nuestras expectativas.",
    name: "Carlos Fernández",
  },
  {
    text: "Una experiencia impecable de principio a fin. Nos acompañó en cada paso de la compra, con total transparencia y dedicación.",
    name: "Valentina Ruiz",
  },
];

const ReviewsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      <div className="section-divider" />
      <section ref={ref} className="section-padding noise-overlay" style={{ backgroundColor: "#130E1E" }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="font-display text-[clamp(32px,4vw,44px)] text-foreground mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
          >
            Lo que dicen nuestros clientes
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                className="p-8"
                style={{
                  border: "1px solid rgba(107,33,168,0.2)",
                  backgroundColor: "#1A1228",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: i * 0.12 }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-body text-sm italic text-text-secondary leading-relaxed mb-6">
                  "{review.text}"
                </p>
                <p className="font-body text-[13px] text-foreground font-medium">{review.name}</p>
                <p
                  className="font-body text-[11px] mt-1"
                  style={{ color: "rgba(107,33,168,0.7)" }}
                >
                  Google Review
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewsSection;
