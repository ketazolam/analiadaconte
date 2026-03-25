import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { EASE } from "@/lib/constants";

const navLinks = [
  { label: "Propiedades", href: "/propiedades" },
  { label: "Mapa", href: "/mapa" },
  { label: "Tasación", href: "/tasaciones" },
  { label: "Contacto", href: "/contacto" },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const rafRef = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const isScrolled = window.scrollY > 100;
        setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleNav = (link: typeof navLinks[0]) => {
    setMenuOpen(false);
    if (link.href) {
      navigate(link.href);
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[1300] flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 transition-colors duration-500 ${
          (scrolled || !isHome) ? "backdrop-blur-xl" : ""
        }`}
        style={
          scrolled
            ? { backgroundColor: "rgba(252,252,252,0.95)", borderBottom: "1px solid rgba(100,30,160,0.10)" }
            : isHome
              ? { background: "linear-gradient(to bottom, rgba(60,15,100,0.30) 0%, transparent 100%)" }
              : { backgroundColor: "rgba(252,252,252,0.95)", borderBottom: "1px solid rgba(100,30,160,0.08)" }
        }
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {/* Logo */}
        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center relative">
          <img
            src="/images/logo-ad.png"
            alt="Analía Daconte Inversiones Inmobiliarias"
            className="h-7 w-auto object-contain"
            style={{
              filter: (scrolled || !isHome) ? "none" : "brightness(0) invert(1)",
            }}
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link)}
              className="font-body text-[12px] uppercase tracking-[2px] transition-colors duration-300 bg-transparent border-none cursor-pointer"
              style={{ color: (scrolled || !isHome) ? "hsl(270 8% 38%)" : "rgba(255,255,255,0.80)" }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            style={{ color: (scrolled || !isHome) ? "hsl(270 15% 10%)" : "white" }}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú de navegación"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[1350] flex flex-col items-center justify-center"
            style={{ backgroundColor: "#fcfcfc" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="absolute top-5 right-6 text-foreground"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú de navegación"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  className="font-display text-3xl pl-4 bg-transparent border-none cursor-pointer"
                  style={{ color: "hsl(240 10% 12%)", borderLeft: "2px solid rgba(100,30,160,0.5)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  onClick={() => handleNav(link)}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
