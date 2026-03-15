import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Facebook, MapPin, Phone, Mail, Award } from "lucide-react";
import { PHONE, EMAIL, ADDRESS_FULL, INSTAGRAM_URL, WHATSAPP_URL, FACEBOOK_URL, whatsappLink } from "@/lib/constants";

const quickLinks = [
  { label: "Inicio", to: "/" },
  { label: "Venta", to: "/propiedades?operacion=venta" },
  { label: "Alquiler", to: "/propiedades?operacion=alquiler" },
  { label: "Tasaciones", to: "/tasaciones" },
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
    <footer id="contacto" style={{ backgroundColor: "hsl(270 55% 12%)" }}>
      <div className="h-px w-full" style={{ background: "rgba(160,80,220,0.25)" }} />

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pt-12 md:pt-16 pb-8">
        {/* Mobile-first optimized layout */}
        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-12 mb-12 md:mb-14">
          
          {/* Col 1 — Brand (Mobile: Full width, prominent) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src="/images/logo-ad.png"
              alt="Analía Daconte Inversiones Inmobiliarias"
              className="h-10 w-auto object-contain mb-4"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <p className="font-body text-sm leading-relaxed mb-6 max-w-xs md:max-w-none" style={{ color: "rgba(255,255,255,0.5)" }}>
              Más de 28 años como Martillera y Corredora Pública en la ciudad de Mar&nbsp;del&nbsp;Plata y alrededores.
            </p>
            <a
              href={whatsappLink("Hola Analía, quiero más información.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs uppercase tracking-[0.1em] px-8 py-4 md:px-6 md:py-3 border border-primary text-primary rounded-sm hover:bg-primary/10 transition-colors w-full max-w-xs md:w-auto md:max-w-none text-center touch-manipulation"
            >
              Contáctenos
            </a>
          </div>

          {/* Mobile: 2-column grid for links and contact */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            {/* Col 2 — Quick Links */}
            <div className="flex flex-col">
              <SectionTitle>Links</SectionTitle>
              <ul className="space-y-3">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="font-body text-sm hover:text-primary transition-colors block py-1 touch-manipulation"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Contact (Simplified for mobile) */}
            <div className="flex flex-col">
              <SectionTitle>Contacto</SectionTitle>
              <ul className="space-y-3 font-body text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                <li className="md:flex md:items-start md:gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5 hidden md:block" />
                  <span className="text-xs leading-relaxed md:text-sm">{ADDRESS_FULL}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a 
                    href={`tel:${PHONE.replace(/\s/g, "")}`} 
                    className="hover:text-primary transition-colors text-sm touch-manipulation"
                  >
                    {PHONE}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <a 
                    href={`mailto:${EMAIL}`} 
                    className="hover:text-primary transition-colors text-[11px] md:text-sm touch-manipulation break-all"
                  >
                    {EMAIL}
                  </a>
                </li>
                <li className="flex items-center gap-2 md:hidden">
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm">Mat. 2815</span>
                </li>
                <li className="hidden md:flex md:items-center md:gap-2">
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <span>Matrícula 2815</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 4 — Social (Mobile: Centered, larger touch targets) */}
          <div className="flex flex-col items-center md:items-start pt-4 md:pt-0">
            <SectionTitle>Síguenos</SectionTitle>
            <div className="flex items-center gap-6 md:gap-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-muted-foreground hover:text-primary transition-colors p-2 md:p-0 -m-2 md:m-0 touch-manipulation"
                >
                  <s.icon className="w-7 h-7 md:w-6 md:h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 text-center" style={{ borderTop: "1px solid rgba(160,80,220,0.25)" }}>
          <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
            © 2026 Analía Daconte Inversiones Inmobiliarias. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
