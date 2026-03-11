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

      {/* Hero header */}
      <div className="relative pt-32 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden noise-overlay">
        <img
          src="/images/waiting-room.jpg"
          alt=""
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(5,2,10,0.92) 0%, rgba(5,2,10,0.72) 55%, rgba(5,2,10,0.35) 100%)",
            zIndex: 1,
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.p
            className="label-eyebrow mb-5"
            style={{ color: "rgba(200,160,255,0.85)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Para propietarios
          </motion.p>

          <motion.h1
            className="font-display text-[clamp(40px,5vw,68px)] leading-[1.0] mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            <span style={{ color: "white" }}>¿Cuánto vale</span>
            <br />
            <span className="italic" style={{ color: "rgba(240,230,255,0.96)" }}>
              tu propiedad?
            </span>
          </motion.h1>

          <motion.p
            className="font-body text-base max-w-md"
            style={{ color: "rgba(255,255,255,0.80)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          >
            Completá el formulario y recibí una tasación profesional de tu propiedad en Mar del Plata.
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
