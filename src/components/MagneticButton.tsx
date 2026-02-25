import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "filled" | "outline";
  className?: string;
  onClick?: () => void;
}

const MagneticButton = ({ children, variant = "filled", className = "", onClick }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.15;
    const y = (clientY - (top + height / 2)) * 0.15;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const base = "font-body text-[14px] uppercase tracking-[0.1em] px-10 py-4 rounded-sm transition-colors duration-300";
  const variants = {
    filled: "bg-primary text-primary-foreground hover:bg-gold-light",
    outline: "border border-primary text-primary hover:bg-primary/10",
  };

  return (
    <motion.button
      ref={ref}
      className={`${base} ${variants[variant]} ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;
