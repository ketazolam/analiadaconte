import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const useReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ParticleField = () => {
  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();
  const count = isMobile ? 8 : 15;

  const particles = useMemo(() => {
    if (prefersReduced) return [];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.8 + Math.random() * 0.4,
      duration: 20 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
  }, [count, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ contain: "strict" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0.12,
            backgroundColor: "hsl(38, 54%, 50%)",
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;
