import { motion } from "framer-motion";
import ScrollProgress from "@/components/ScrollProgress";
import Navigation from "@/components/sections/Navigation";
import ValuationTool from "@/components/sections/ValuationTool";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/sections/Footer";
import { EASE } from "@/lib/constants";

const Tasaciones = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />

      <Navigation />

      {/* Header */}
      <div
        className="pt-24 pb-8 px-6 md:px-12 lg:px-20 noise-overlay"
        style={{ backgroundColor: "hsl(var(--bg-secondary))" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="font-display text-[clamp(36px,5vw,56px)] text-foreground leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Tasación{" "}
            <span className="italic gold-gradient-text">gratuita</span>
          </motion.h1>
          <motion.p
            className="font-body text-sm text-text-secondary mt-3 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            Completá el formulario y recibí una tasación profesional sin cargo
            de tu propiedad en Mar del Plata.
          </motion.p>
        </div>
      </div>

      {/* Valuation wizard */}
      <ValuationTool />

      <WhatsAppFAB />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Tasaciones;
