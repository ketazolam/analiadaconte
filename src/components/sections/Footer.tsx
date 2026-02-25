import { motion } from "framer-motion";
import { Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-primary/30 bg-background">
      <div className="max-w-6xl mx-auto section-padding pb-8">
        {/* Top */}
        <div className="flex flex-col items-center mb-16">
          <span className="font-display italic text-5xl text-foreground mb-2">AD</span>
          <p className="label-accent text-text-muted">
            Inversiones Inmobiliarias · Mar del Plata desde 1999
          </p>
        </div>

        {/* Columns */}
        <div className="grid md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
          <div>
            <h4 className="label-accent text-foreground mb-4">Propiedades</h4>
            <ul className="space-y-2">
              {["Venta", "Alquiler", "Emprendimientos", "Tasaciones"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-sm text-text-secondary hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-accent text-foreground mb-4">Empresa</h4>
            <ul className="space-y-2">
              {["Quién soy", "Trayectoria", "Servicios", "Prensa"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-sm text-text-secondary hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-accent text-foreground mb-4">Contacto</h4>
            <ul className="space-y-2 font-body text-sm text-text-secondary">
              <li>Mar del Plata, Buenos Aires</li>
              <li>+54 9 223 500-0000</li>
              <li>info@analiadaconte.com.ar</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-text-muted">
            Matrícula 2815 · © 2026 Analía Daconte Inversiones Inmobiliarias
          </p>
          <div className="flex items-center gap-4">
            <motion.a
              href="#"
              className="text-text-muted hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Instagram className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="https://wa.me/5492235000000"
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
