import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import MagneticButton from "../MagneticButton";
import { EASE as ease } from "@/lib/constants";

const FloatingInput = ({ label, type = "text" }: { label: string; type?: string }) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="relative">
      <motion.label
        className="absolute left-0 font-body text-sm text-text-muted pointer-events-none origin-left"
        animate={{
          y: focused || value ? -20 : 0,
          scale: focused || value ? 0.8 : 1,
          color: focused ? "hsl(38,54%,50%)" : undefined,
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
      <input
        type={type}
        className="w-full bg-transparent outline-none font-body text-sm text-foreground py-2 transition-colors"
        style={{
          borderBottom: focused ? "1px solid hsl(38,54%,50%)" : "1px solid rgba(255,255,255,0.06)",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
};

const ValuationCTA = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      <div className="section-divider" />
      <section id="contacto" ref={ref} className="noise-overlay">
        <div className="grid md:grid-cols-2">
          {/* Left */}
          <motion.div
            className="section-padding relative z-10"
            style={{ backgroundColor: "#111015" }}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <p className="label-eyebrow text-primary mb-4">Tasación gratuita</p>
            <h2 className="font-display text-[clamp(32px,4vw,44px)] text-foreground leading-tight mb-4">
              Conocé el valor de tu propiedad
            </h2>
            <p className="font-body text-sm text-text-secondary max-w-md">
              Completá el formulario y nos pondremos en contacto para coordinar 
              una tasación sin cargo ni compromiso.
            </p>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            className="section-padding relative z-10"
            style={{ backgroundColor: "#0C0B0F" }}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <select
                  className="w-full bg-transparent outline-none font-body text-sm text-text-muted py-2 appearance-none focus:text-foreground"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <option value="">Tipo de propiedad</option>
                  <option value="casa">Casa / Chalet</option>
                  <option value="depto">Departamento</option>
                  <option value="ph">PH</option>
                  <option value="lote">Lote / Terreno</option>
                  <option value="local">Local comercial</option>
                </select>
              </div>
              <FloatingInput label="Zona / Barrio" />
              <FloatingInput label="Superficie aproximada (m²)" type="number" />
              <FloatingInput label="Tu nombre" />
              <FloatingInput label="WhatsApp" type="tel" />
              <div className="pt-2">
                <MagneticButton variant="filled" className="w-full">
                  Quiero mi tasación
                </MagneticButton>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ValuationCTA;
