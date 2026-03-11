import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { EASE } from "@/lib/constants";

const NewsletterSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    // Simulate — replace with real endpoint later
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section
      ref={ref}
      className="section-lazy noise-overlay relative py-20 md:py-28 px-6 md:px-12 lg:px-20"
      style={{ backgroundColor: "hsl(275 62% 38%)" }}
    >
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.p
          className="label-eyebrow mb-4" style={{ color: "rgba(255,255,255,0.7)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          No te pierdas nada
        </motion.p>

        <motion.h2
          className="font-display text-[clamp(32px,4vw,48px)] leading-tight mb-4" style={{ color: "white" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        >
          Recibí oportunidades{" "}
          <span className="italic" style={{ color: "rgba(220,180,255,1)" }}>antes que nadie</span>
        </motion.h2>

        <motion.p
          className="font-body text-sm mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.75)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        >
          Suscribite y te avisamos cuando publiquemos propiedades nuevas en las zonas que te interesan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
        >
          {submitted ? (
            <div className="flex items-center justify-center gap-2 py-4">
              <CheckCircle className="w-5 h-5" style={{ color: "rgba(220,180,255,1)" }} />
              <span className="font-body text-sm" style={{ color: "white" }}>¡Listo! Te avisaremos de nuevas oportunidades.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-0 max-w-lg mx-auto overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.45)", borderRadius: "2px" }}>
              <input
                type="email"
                required
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 font-body text-sm px-5 py-3.5 focus:outline-none border-none text-white placeholder:text-white/50"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3.5 font-body text-[13px] uppercase tracking-[0.1em] transition-colors disabled:opacity-50 shrink-0"
                style={{ backgroundColor: "white", color: "hsl(275,62%,38%)" }}
              >
                <Send className="w-4 h-4" />
                {loading ? "Enviando..." : "Suscribirme"}
              </button>
            </form>
          )}
        </motion.div>

        <motion.p
          className="font-body text-[11px] mt-4" style={{ color: "rgba(255,255,255,0.5)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Sin spam. Solo oportunidades reales.
        </motion.p>
      </div>
    </section>
  );
};

export default NewsletterSection;
