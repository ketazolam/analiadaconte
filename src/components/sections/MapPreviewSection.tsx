import { useMemo, useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAllMapProperties } from "@/hooks/useProperties";
import { EASE } from "@/lib/constants";

// ─── Counter animado (mismo patrón que StatsBar) ──────────────────────────────
function Counter({ value, size = "lg" }: { value: number; size?: "lg" | "md" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setCount(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  const fontSize =
    size === "lg"
      ? "clamp(36px, 5vw, 56px)"
      : "clamp(24px, 3vw, 36px)";

  return (
    <span
      ref={ref}
      className="font-display"
      style={{
        fontSize,
        fontWeight: size === "lg" ? 200 : 300,
        color: size === "lg" ? "hsl(var(--primary))" : "rgba(255,255,255,0.95)",
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}
    >
      {count}
    </span>
  );
}

// ─── Divisor vertical ─────────────────────────────────────────────────────────
const Divider = () => (
  <div
    className="hidden md:block"
    style={{
      width: 1,
      height: "60%",
      background: "rgba(255,255,255,0.08)",
      alignSelf: "center",
      flexShrink: 0,
    }}
  />
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const MapPreviewSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const navigate = useNavigate();

  const { data } = useAllMapProperties({});

  const total = data?.length ?? 0;

  const ventaCount = useMemo(
    () => data?.filter((p) => p.operacion?.toLowerCase() === "venta").length ?? 0,
    [data]
  );

  const alquilerCount = useMemo(
    () => data?.filter((p) => p.operacion?.toLowerCase() === "alquiler").length ?? 0,
    [data]
  );

  return (
    <>
      <div className="section-divider" />
      <section
        ref={ref}
        className="noise-overlay relative"
        style={{ background: "hsl(270 25% 5%)" }}
      >
        <motion.div
          className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20"
          style={{
            paddingTop: "clamp(32px, 4vw, 48px)",
            paddingBottom: "clamp(32px, 4vw, 48px)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(16px, 3vw, 40px)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >

          {/* ── Mobile layout ─────────────────────────────────────────── */}
          <div className="md:hidden w-full flex flex-col items-center gap-5">
            {/* Total */}
            <div className="flex flex-col items-center gap-1">
              <Counter value={total} size="lg" />
              <p
                className="font-body"
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.40)",
                }}
              >
                propiedades disponibles
              </p>
            </div>

            {/* Pills venta / alquiler */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "en venta", count: ventaCount, op: "venta" },
                { label: "en alquiler", count: alquilerCount, op: "alquiler" },
              ].map(({ label, count, op }) => (
                <button
                  key={op}
                  onClick={() => navigate(`/propiedades?operacion=${op}`)}
                  className="font-body"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 16px",
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "transparent",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.80)",
                    fontSize: 13,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  <span
                    className="font-display"
                    style={{ fontWeight: 300, fontSize: 18, color: "rgba(255,255,255,0.95)" }}
                  >
                    {count}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.50)", fontSize: 11 }}>{label}</span>
                  <span style={{ color: "hsl(var(--primary))", fontSize: 13 }}>→</span>
                </button>
              ))}
            </div>

            {/* Botón mapa */}
            <button
              onClick={() => navigate("/mapa")}
              className="font-body"
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                padding: "8px 24px",
                border: "1px solid rgba(255,255,255,0.20)",
                background: "transparent",
                color: "rgba(255,255,255,0.70)",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              Ver mapa completo →
            </button>
          </div>

          {/* ── Desktop layout — 4 columnas ───────────────────────────── */}
          <div
            className="hidden md:flex w-full items-center"
            style={{ gap: "clamp(24px, 3vw, 48px)" }}
          >
            {/* Col 1: Total */}
            <div style={{ flexShrink: 0 }}>
              <Counter value={total} size="lg" />
              <p
                className="font-body mt-1.5"
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.38)",
                  whiteSpace: "nowrap",
                }}
              >
                propiedades disponibles
              </p>
            </div>

            <Divider />

            {/* Col 2: Venta */}
            <div style={{ flexShrink: 0 }}>
              <Counter value={ventaCount} size="md" />
              <p
                className="font-body mt-1"
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  color: "rgba(255,255,255,0.38)",
                  marginBottom: 6,
                }}
              >
                en venta
              </p>
              <button
                onClick={() => navigate("/propiedades?operacion=venta")}
                className="font-body"
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  color: "hsl(var(--primary))",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Ver →
              </button>
            </div>

            <Divider />

            {/* Col 3: Alquiler */}
            <div style={{ flexShrink: 0 }}>
              <Counter value={alquilerCount} size="md" />
              <p
                className="font-body mt-1"
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  color: "rgba(255,255,255,0.38)",
                  marginBottom: 6,
                }}
              >
                en alquiler
              </p>
              <button
                onClick={() => navigate("/propiedades?operacion=alquiler")}
                className="font-body"
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  color: "hsl(var(--primary))",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Ver →
              </button>
            </div>

            <Divider />

            {/* Col 4: CTA mapa — alineado a la derecha */}
            <div style={{ marginLeft: "auto", flexShrink: 0 }}>
              <button
                onClick={() => navigate("/mapa")}
                className="font-body"
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  padding: "10px 22px",
                  border: "1px solid rgba(255,255,255,0.20)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.70)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                Ver mapa →
              </button>
            </div>
          </div>

        </motion.div>
      </section>
      <div className="section-divider" />
    </>
  );
};

export default MapPreviewSection;
