import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Only show on devices with fine pointer
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6);
      cursorY.set(e.clientY - 6);
      if (!isVisible) setIsVisible(true);
    };

    const hide = () => setIsVisible(false);
    const show = () => setIsVisible(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-3 h-3 rounded-full border border-primary pointer-events-none z-[9999] mix-blend-difference"
      style={{ x: cursorX, y: cursorY, opacity: isVisible ? 1 : 0 }}
    />
  );
};

export default CustomCursor;
