import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { whatsappLink } from "@/lib/constants";

const SCROLL_TRIGGERS = [0.4, 0.8];
const IDLE_DELAY = 30_000;
const COOLDOWN = 30_000;
const AUTO_CLOSE = 6_000;
const MAX_MANUAL_DISMISSALS = 2;

const TOOLTIP_MESSAGES = [
  { title: "¿Te ayudamos?", subtitle: "Chateá con Analía por WhatsApp" },
  { title: "¿Buscás propiedad?", subtitle: "Consultá disponibilidad ahora" },
  { title: "Consultá sin compromiso", subtitle: "Respondemos en minutos" },
];

const WA_LINK = whatsappLink("Hola Analía, estoy viendo tu web y me gustaría consultar");

const WhatsAppFAB = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const dismissCount = useRef(0);
  const lastShown = useRef(0);
  const triggeredScrollPoints = useRef(new Set<number>());
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout>>();
  const lastMove = useRef(0);

  const isPermanentlyDismissed = useCallback(
    () => dismissCount.current >= MAX_MANUAL_DISMISSALS,
    []
  );

  const canShow = useCallback(() => {
    if (isPermanentlyDismissed()) return false;
    return Date.now() - lastShown.current >= COOLDOWN;
  }, [isPermanentlyDismissed]);

  const showNextTooltip = useCallback(() => {
    if (!canShow()) return;
    setMessageIndex((prev) => (prev + 1) % TOOLTIP_MESSAGES.length);
    setShowTooltip(true);
    lastShown.current = Date.now();
  }, [canShow]);

  // Auto-close tooltip
  useEffect(() => {
    if (!showTooltip) return;
    autoCloseTimer.current = setTimeout(() => setShowTooltip(false), AUTO_CLOSE);
    return () => clearTimeout(autoCloseTimer.current);
  }, [showTooltip]);

  // Scroll triggers
  useEffect(() => {
    const onScroll = () => {
      const progress =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      SCROLL_TRIGGERS.forEach((threshold) => {
        if (
          progress >= threshold &&
          !triggeredScrollPoints.current.has(threshold)
        ) {
          triggeredScrollPoints.current.add(threshold);
          showNextTooltip();
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showNextTooltip]);

  // Idle trigger (throttled to 1s)
  const resetIdle = useCallback(() => {
    const now = Date.now();
    if (now - lastMove.current < 1000) return;
    lastMove.current = now;
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      showNextTooltip();
    }, IDLE_DELAY);
  }, [showNextTooltip]);

  useEffect(() => {
    if (isPermanentlyDismissed()) return;
    resetIdle();
    window.addEventListener("pointermove", resetIdle, { passive: true });
    window.addEventListener("touchstart", resetIdle, { passive: true });
    return () => {
      clearTimeout(idleTimer.current);
      window.removeEventListener("pointermove", resetIdle);
      window.removeEventListener("touchstart", resetIdle);
    };
  }, [resetIdle, isPermanentlyDismissed]);

  const handleDismiss = () => {
    setShowTooltip(false);
    dismissCount.current += 1;
    lastShown.current = Date.now();
  };

  const currentMsg = TOOLTIP_MESSAGES[messageIndex];

  return (
    <div
      className="fixed right-6 z-50 flex items-end gap-3"
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            role="complementary"
            aria-live="polite"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative mb-1 max-w-[200px]"
          >
            <div
              className="rounded-lg px-4 py-3 shadow-xl border"
              style={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--primary) / 0.25)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.5), 0 0 20px hsl(var(--primary) / 0.08)",
              }}
            >
              <button
                onClick={handleDismiss}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                style={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
                aria-label="Cerrar"
              >
                ✕
              </button>
              <p className="font-body text-[13px] text-foreground leading-snug">
                {currentMsg.title}
              </p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 leading-snug">
                {currentMsg.subtitle}
              </p>
            </div>
            {/* Arrow pointing right toward the button */}
            <div
              className="absolute top-1/2 -right-[6px] -translate-y-1/2 w-3 h-3 rotate-45"
              style={{
                backgroundColor: "hsl(var(--card))",
                borderRight: "1px solid hsl(var(--primary) / 0.25)",
                borderBottom: "1px solid hsl(var(--primary) / 0.25)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative w-14 h-14 rounded-full bg-whatsapp flex items-center justify-center shadow-lg shadow-whatsapp/25 flex-shrink-0"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {/* Pulse ring — always mounted, visibility via CSS */}
        <div
          className="absolute inset-0 rounded-full border-2 border-whatsapp pointer-events-none"
          style={{
            animation: "whatsapp-pulse 2s ease-out infinite 1s",
            opacity: showTooltip ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        />
      </motion.a>
    </div>
  );
};

export default WhatsAppFAB;
