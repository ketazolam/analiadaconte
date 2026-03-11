import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const CustomCursor = () => {
  const showRef = useRef(false);
  const opacity = useMotionValue(0);
  // Trail opacity is derived from main opacity so both hide/show together
  const trailOpacity = useTransform(opacity, (v) => v * 0.18);

  const cursorX = useSpring(0, { stiffness: 2000, damping: 60, mass: 0.2 });
  const cursorY = useSpring(0, { stiffness: 2000, damping: 60, mass: 0.2 });
  const trailX = useSpring(0, { stiffness: 300, damping: 35, mass: 0.5 });
  const trailY = useSpring(0, { stiffness: 300, damping: 35, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 4);
      cursorY.set(e.clientY - 4);
      trailX.set(e.clientX - 12);
      trailY.set(e.clientY - 12);
      if (!showRef.current) {
        showRef.current = true;
        opacity.set(1);
      }
    };

    const hide = () => opacity.set(0);
    const show = () => { if (showRef.current) opacity.set(1); };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
    };
  }, [cursorX, cursorY, trailX, trailY, opacity]);

  // Skip on touch devices and reduced motion
  if (typeof window !== "undefined") {
    if (!window.matchMedia("(pointer: fine)").matches) return null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  }

  return (
    <>
      {/* Trail — hidden until first mouse move */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999]"
        style={{
          x: trailX,
          y: trailY,
          opacity: trailOpacity,
          backgroundColor: "hsl(275, 55%, 54%)",
          willChange: "transform",
        }}
      />
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          opacity,
          backgroundColor: "hsl(275, 55%, 54%)",
          willChange: "transform",
        }}
      />
    </>
  );
};

export default CustomCursor;
