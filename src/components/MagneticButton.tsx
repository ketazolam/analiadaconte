import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "filled" | "outline";
  className?: string;
  onClick?: () => void;
}

const MagneticButton = ({ children, variant = "filled", className = "", onClick }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(my, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    mx.set((clientX - (left + width / 2)) * 0.15);
    my.set((clientY - (top + height / 2)) * 0.15);
  };

  const reset = () => { mx.set(0); my.set(0); };

  const base = "font-body text-[13px] sm:text-[14px] uppercase tracking-[0.1em] px-6 sm:px-10 py-3 sm:py-4 rounded-sm transition-colors duration-300";
  const variants = {
    filled: "bg-primary text-primary-foreground hover:bg-gold-light",
    outline: "border md:border-2 border-white/70 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm",
  };

  return (
    <motion.button
      ref={ref}
      className={`${base} ${variants[variant]} ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;
