// Centralizar datos de contacto — cambiar aquí actualiza toda la web
export const WHATSAPP_NUMBER = "5492235000000";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const PHONE = "+54 9 223 500-0000";
export const EMAIL = "info@analiadaconte.com.ar";
export const INSTAGRAM_URL = "https://www.instagram.com/analiadaconte";
export const ADDRESS = "Mar del Plata, Buenos Aires";

export const whatsappLink = (message?: string) =>
  message
    ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
    : WHATSAPP_URL;
