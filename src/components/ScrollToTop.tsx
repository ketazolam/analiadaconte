import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? scrollY / docHeight : 0;
    setVisible(pct > 0.5 && scrollY > 300);
  }, []);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          aria-label="Volver arriba"
          className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
          style={{
            backgroundColor: "hsl(var(--bg-surface) / 0.8)",
            border: "1px solid hsl(var(--primary) / 0.3)",
          }}
        >
          <ChevronUp className="w-5 h-5 text-primary" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
