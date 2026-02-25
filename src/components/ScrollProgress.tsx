import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[100]"
      style={{
        scaleX,
        background: "linear-gradient(90deg, hsl(274,69%,40%), hsl(38,54%,50%), hsl(42,76%,66%))",
      }}
    />
  );
};

export default ScrollProgress;
