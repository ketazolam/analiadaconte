import { motion } from "framer-motion";
import { Instagram, MessageCircle } from "lucide-react";
import { PHONE, EMAIL, ADDRESS, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/constants";
import { smoothScrollTo } from "@/lib/smoothScroll";

const footerLinks = {
  propiedades: [
    { label: "Venta", target: "propiedades" },
    { label: "Alquiler", target: "propiedades" },
    { label: "Emprendimientos", target: "propiedades" },
    { label: "Tasaciones", target: "tasacion" },
  ],
  empresa: [
    { label: "Quién soy", target: "about" },
    { label: "Trayectoria", target: "about" },
    { label: "Servicios", target: "vendedores" },
    { label: "Reseñas", target: "contacto" },
  ],
};

const Footer = () => {
  return (
    <footer id="contacto" className="section-lazy" style={{ backgroundColor: "#080709" }}>
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
              {footerLinks.propiedades.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => smoothScrollTo(item.target)}
                    className="font-body text-sm hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-accent mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => smoothScrollTo(item.target)}
                    className="font-body text-sm hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {item.label}
                  </button>
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
