import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

const stats = [
  { value: 200, prefix: "+", suffix: "", label: "Propiedades vendidas" },
  { value: 25, prefix: "", suffix: "", label: "Años de trayectoria" },
  { value: 15, prefix: "", suffix: "K", label: "Seguidores en Instagram" },
  { value: 98, prefix: "", suffix: "%", label: "Clientes satisfechos" },
];

const Counter = ({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setCount(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-[clamp(48px,5vw,64px)] text-primary leading-none" style={{ textShadow: "0 0 30px rgba(196,154,60,0.3)" }}>
      {`${prefix}${count}${suffix}`}
    </span>
  );
};

const StatsBar = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative noise-overlay"
      style={{
        backgroundColor: "#18161E",
        borderTop: "1px solid rgba(196,154,60,0.15)",
        borderBottom: "1px solid rgba(196,154,60,0.15)",
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-px bg-primary z-10"
        initial={{ width: "0%" }}
        animate={inView ? { width: "100%" } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto relative z-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center py-16 px-4"
            style={i < stats.length - 1 ? { borderRight: "1px solid rgba(255,255,255,0.08)" } : undefined}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Counter {...stat} />
            <span className="label-accent mt-3 text-text-muted">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
