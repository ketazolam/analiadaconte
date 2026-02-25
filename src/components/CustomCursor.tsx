import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useSpring(0, { stiffness: 2000, damping: 60, mass: 0.2 });
  const cursorY = useSpring(0, { stiffness: 2000, damping: 60, mass: 0.2 });
  const trailX = useSpring(0, { stiffness: 400, damping: 40, mass: 0.5 });
  const trailY = useSpring(0, { stiffness: 400, damping: 40, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 4);
      cursorY.set(e.clientY - 4);
      trailX.set(e.clientX - 12);
      trailY.set(e.clientY - 12);
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
  }, [cursorX, cursorY, trailX, trailY, isVisible]);

  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return null;

  return (
    <>
      {/* Trail circle */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999]"
        style={{
          x: trailX,
          y: trailY,
          opacity: isVisible ? 0.2 : 0,
          backgroundColor: "hsl(263, 70%, 58%)",
        }}
      />
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isVisible ? 1 : 0,
          backgroundColor: "hsl(263, 70%, 58%)",
        }}
      />
    </>
  );
};

export default CustomCursor;
