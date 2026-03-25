// Centralizar datos de contacto — cambiar aquí actualiza toda la web
export const SITE_URL = "https://analiadaconte.lovable.app";
export const WHATSAPP_NUMBER = "542235382577";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const PHONE = "223 300-1242";
export const EMAIL = "analiadacontepropiedades@gmail.com";
export const INSTAGRAM_URL = "https://www.instagram.com/analiadaconte";
export const ADDRESS = "Mar del Plata, Buenos Aires";
export const ADDRESS_FULL = "Ortega y Gasset 658 / Av. Constitución 4920, Mar del Plata, Buenos Aires";
export const FACEBOOK_URL = "https://www.facebook.com/analiadaconte";

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Analia+Daconte+Inversiones+Inmobiliarias/@-37.9661192,-57.5554955,17z/data=!3m1!4b1!4m6!3m5!1s0x9584d97a632a135b:0x615a919b8924802a!8m2!3d-37.9661235!4d-57.5529206!16s%2Fg%2F1tkmnqyg?entry=ttu";

/** Shared cubic-bezier used across all Framer Motion transitions */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const whatsappLink = (message?: string) =>
  message
    ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
    : WHATSAPP_URL;
