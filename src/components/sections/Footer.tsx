import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Facebook, MapPin, Phone, Mail, Award } from "lucide-react";
import { PHONE, EMAIL, ADDRESS_FULL, INSTAGRAM_URL, WHATSAPP_URL, FACEBOOK_URL, whatsappLink } from "@/lib/constants";

const quickLinks = [
  { label: "Inicio", to: "/" },
  { label: "Venta", to: "/propiedades?operacion=venta" },
  { label: "Alquiler", to: "/propiedades?operacion=alquiler" },
  { label: "Vender", to: "/vender" },
  { label: "Mapa", to: "/mapa" },
];

const socials = [
  { icon: Instagram, href: INSTAGRAM_URL, label: "Instagram" },
  { icon: Facebook, href: FACEBOOK_URL, label: "Facebook" },
  { icon: MessageCircle, href: WHATSAPP_URL, label: "WhatsApp" },
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-5">
    {children}
    <span className="block mt-2 h-px w-8 bg-primary/40" />
  </h4>
);

const Footer = () => {
  return (
    <footer id="contacto" style={{ backgroundColor: "#080709" }}>
      <div className="h-px w-full" style={{ background: "rgba(196,154,60,0.2)" }} />

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-8">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14 text-center md:text-left">
          {/* Col 1 — Brand */}
          <div className="flex flex-col items-center md:items-start">
            <span className="font-display italic text-5xl text-primary mb-1">AD</span>
            <span className="label-accent text-muted-foreground mb-4">Inversiones Inmobiliarias</span>
            <p className="font-body text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              Más de 25 años como Martillera y Corredora Pública en la ciudad de Mar&nbsp;del&nbsp;Plata y alrededores.
            </p>
            <a
              href={whatsappLink("Hola Analía, quiero más información.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs uppercase tracking-[0.1em] px-6 py-3 border border-primary text-primary rounded-sm hover:bg-primary/10 transition-colors w-full md:w-auto text-center"
            >
              Contáctenos
            </a>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <SectionTitle>Links Rápidos</SectionTitle>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="font-body text-sm hover:text-primary transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div className="flex flex-col items-center md:items-start">
            <SectionTitle>Contacto</SectionTitle>
            <ul className="space-y-3 font-body text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{ADDRESS_FULL}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                  {PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${EMAIL}`} className="hover:text-primary transition-colors">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary shrink-0" />
                <span>Matrícula 2815</span>
              </li>
            </ul>
          </div>

          {/* Col 4 — Social */}
          <div className="flex flex-col items-center md:items-start">
            <SectionTitle>Síguenos</SectionTitle>
            <div className="flex items-center gap-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <s.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 text-center" style={{ borderTop: "1px solid rgba(196,154,60,0.15)" }}>
          <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026 Analía Daconte Inversiones Inmobiliarias. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
