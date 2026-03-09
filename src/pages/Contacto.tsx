import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, MapPin, Instagram, Facebook, ExternalLink } from "lucide-react";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import ScrollToTop from "@/components/ScrollToTop";
import {
  PHONE, EMAIL, ADDRESS_FULL, GOOGLE_MAPS_URL,
  INSTAGRAM_URL, FACEBOOK_URL, WHATSAPP_URL,
  whatsappLink, EASE,
} from "@/lib/constants";

const WHATSAPP_MSG = "Hola Analía! Me comunico desde la web, quería consultarte algo.";

const ContactRow = ({
  icon: Icon,
  label,
  value,
  href,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  delay: number;
}) => (
  <motion.div
    className="flex items-start gap-4 py-5"
    style={{ borderBottom: "1px solid hsl(var(--border))" }}
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, ease: EASE, delay }}
  >
    <div
      className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
      style={{ background: "hsl(var(--gold-dim))", border: "1px solid hsl(var(--primary)/0.2)" }}
    >
      <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
    </div>
    <div className="min-w-0">
      <p className="font-body text-[10px] uppercase tracking-widest text-text-muted mb-0.5">{label}</p>
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="font-body text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
        >
          {value}
          {href.startsWith("http") && <ExternalLink className="w-3 h-3 opacity-40" />}
        </a>
      ) : (
        <p className="font-body text-sm text-foreground">{value}</p>
      )}
    </div>
  </motion.div>
);

const Contacto = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <div
        className="pt-28 pb-10 px-6 md:px-12 lg:px-20 noise-overlay"
        style={{ backgroundColor: "hsl(var(--bg-secondary))" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.p
            className="label-eyebrow text-primary mb-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            Contacto
          </motion.p>
          <motion.h1
            className="font-display text-[clamp(36px,5vw,56px)] text-foreground leading-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
          >
            Hablemos
          </motion.h1>
          <motion.p
            className="font-body text-sm text-text-secondary mt-3 max-w-md"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          >
            Respondemos por WhatsApp en menos de 2 horas.
          </motion.p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-14">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

          {/* Left — contact details */}
          <div>
            <ContactRow
              icon={MessageCircle}
              label="WhatsApp"
              value={`+54 ${PHONE}`}
              href={whatsappLink(WHATSAPP_MSG)}
              delay={0.15}
            />
            <ContactRow
              icon={Phone}
              label="Teléfono"
              value={PHONE}
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              delay={0.2}
            />
            <ContactRow
              icon={Mail}
              label="Email"
              value={EMAIL}
              href={`mailto:${EMAIL}`}
              delay={0.25}
            />
            <ContactRow
              icon={MapPin}
              label="Dirección"
              value={ADDRESS_FULL}
              href={GOOGLE_MAPS_URL}
              delay={0.3}
            />
            <ContactRow
              icon={Instagram}
              label="Instagram"
              value="@analiadaconte"
              href={INSTAGRAM_URL}
              delay={0.35}
            />
            <ContactRow
              icon={Facebook}
              label="Facebook"
              value="Analía Daconte Inversiones"
              href={FACEBOOK_URL}
              delay={0.4}
            />
          </div>

          {/* Right — WhatsApp CTA + hours */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          >
            {/* WhatsApp card */}
            <div
              className="p-8 flex flex-col items-start gap-5"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            >
              <div>
                <p className="font-display text-2xl text-foreground mb-2">¿Querés tasar o consultar?</p>
                <p className="font-body text-sm text-text-secondary">
                  Escribinos directamente por WhatsApp. Analía te atiende personalmente.
                </p>
              </div>
              <a
                href={whatsappLink(WHATSAPP_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-body text-sm uppercase tracking-wider px-6 py-3 transition-colors"
                style={{ backgroundColor: "hsl(var(--whatsapp))", color: "#fff" }}
              >
                <MessageCircle className="w-4 h-4" />
                Abrir WhatsApp
              </a>
            </div>

            {/* Horarios */}
            <div
              className="p-6"
              style={{ background: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border))" }}
            >
              <p className="font-body text-[10px] uppercase tracking-widest text-text-muted mb-4">Horarios de atención</p>
              <div className="space-y-2 font-body text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>Lunes a viernes</span>
                  <span className="text-foreground">9:00 – 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados</span>
                  <span className="text-foreground">9:00 – 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span>WhatsApp</span>
                  <span className="text-primary">Siempre</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <WhatsAppFAB />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Contacto;
