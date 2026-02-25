import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";

const navLinks = [
  { label: "Propiedades", href: "#propiedades" },
  { label: "Vendedores", href: "#vendedores" },
  { label: "Quiénes somos", href: "#about" },
  { label: "Contacto", href: "#contacto" },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 transition-colors duration-500 ${
          scrolled ? "backdrop-blur-xl" : "bg-transparent"
        }`}
        style={scrolled ? { backgroundColor: "rgba(12,11,15,0.92)", borderBottom: "1px solid rgba(255,255,255,0.06)" } : undefined}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
            <a
              key={link.label}
              href={link.href}
              className="font-body text-[12px] uppercase tracking-[2px] text-text-secondary hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/5492235000000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 font-body text-[11px] uppercase tracking-[1.5px] px-4 py-2 rounded-sm transition-colors text-primary hover:bg-primary hover:text-primary-foreground"
            style={{ border: "1px solid rgba(196,154,60,0.5)" }}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
          <button
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen(true)}
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
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="font-display text-3xl text-foreground pl-4"
                  style={{ borderLeft: "2px solid rgba(196,154,60,0.4)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
