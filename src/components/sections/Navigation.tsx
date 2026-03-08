import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { EASE } from "@/lib/constants";

const navLinks = [
  { label: "Propiedades", href: "/propiedades" },
  { label: "Tasación", href: "/tasaciones" },
  { label: "Quiénes somos", target: "about" },
  { label: "Contacto", target: "contacto" },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const rafRef = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

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
    } else if (link.target) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => smoothScrollTo(link.target!), 300);
      } else {
        smoothScrollTo(link.target);
      }
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 transition-colors duration-500 ${
          scrolled ? "backdrop-blur-xl" : ""
        }`}
        style={scrolled
          ? { backgroundColor: "rgba(12,11,15,0.92)", borderBottom: "1px solid rgba(255,255,255,0.06)" }
          : { background: "linear-gradient(to bottom, rgba(12,11,15,0.6) 0%, transparent 100%)" }
        }
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {/* Logo */}
        <a href="#" className="flex flex-col items-start relative">
          <span className="font-display italic text-2xl text-foreground leading-none">AD</span>
          <div className="w-full h-[1px] mt-0.5" style={{ background: "linear-gradient(90deg, hsl(274,69%,40%), transparent)" }} />
          <span className="label-accent text-text-secondary mt-0.5" style={{ fontSize: 9 }}>
            Analía Daconte
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link)}
              className="font-body text-[12px] uppercase tracking-[2px] text-text-secondary hover:text-primary transition-colors duration-300 bg-transparent border-none cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-foreground"
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
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
            style={{ backgroundColor: "#0C0B0F" }}
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
                  className="font-display text-3xl text-foreground pl-4 bg-transparent border-none cursor-pointer"
                  style={{ borderLeft: "2px solid rgba(196,154,60,0.4)" }}
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
