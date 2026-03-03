import { motion } from "framer-motion";
import { Instagram, MessageCircle } from "lucide-react";
import { PHONE, EMAIL, ADDRESS, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/constants";

const Footer = () => {
  return (
    <footer id="contacto" style={{ backgroundColor: "#080709" }}>
      {/* Top gold border */}
      <div
        className="h-px w-full"
        style={{ background: "rgba(196,154,60,0.2)" }}
      />
      <div className="max-w-6xl mx-auto section-padding pb-8">
        {/* Top */}
        <div className="flex flex-col items-center mb-16">
          <span className="font-display italic text-5xl text-primary mb-2">AD</span>
          <p className="label-accent" style={{ color: "rgba(255,255,255,0.4)" }}>
            Inversiones Inmobiliarias · Mar del Plata desde 1999
          </p>
        </div>

        {/* Columns */}
        <div className="grid md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
          <div>
            <h4 className="label-accent mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Propiedades</h4>
            <ul className="space-y-2">
              {["Venta", "Alquiler", "Emprendimientos", "Tasaciones"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-sm hover:text-primary transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-accent mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Empresa</h4>
            <ul className="space-y-2">
              {["Quién soy", "Trayectoria", "Servicios", "Prensa"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-sm hover:text-primary transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-accent mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Contacto</h4>
            <ul className="space-y-2 font-body text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              <li>{ADDRESS}</li>
              <li>{PHONE}</li>
              <li>{EMAIL}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Matrícula 2815 · © 2026 Analía Daconte Inversiones Inmobiliarias
          </p>
          <div className="flex items-center gap-4">
            <motion.a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Instagram className="w-4 h-4" />
            </motion.a>
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <MessageCircle className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
