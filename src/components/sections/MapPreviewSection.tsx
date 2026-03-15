import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAllMapProperties } from "@/hooks/useProperties";
import { sanitizeBarrio } from "@/lib/utils";
import { EASE } from "@/lib/constants";

// ─── Colores únicos por zona (oscuros, consistentes con la paleta del sitio) ──
const ZONE_HUES = [265, 185, 155, 210, 290, 240];
function zoneColor(index: number) {
  const h = ZONE_HUES[index] ?? 250;
  return `hsl(${h}, 38%, 11%)`;
}
function zoneBorder(index: number) {
  const h = ZONE_HUES[index] ?? 250;
  return `hsl(${h}, 50%, 30%)`;
}

// ─── Card de zona ─────────────────────────────────────────────────────────────
interface ZonaCardProps {
  zona: string;
  count: number;
  colorIndex: number;
  index: number;
  inView: boolean;
  snapAlign?: boolean;
}

const ZonaCard = ({ zona, count, colorIndex, index, inView, snapAlign }: ZonaCardProps) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: 0.15 + index * 0.08 }}
      style={{
        width: 252,
        minWidth: 252,
        height: 340,
        background: zoneColor(colorIndex),
        border: `1px solid rgba(255,255,255,0.07)`,
        borderLeft: `3px solid ${hovered ? zoneBorder(colorIndex) : "rgba(255,255,255,0.06)"}`,
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        scrollSnapAlign: snapAlign ? "start" : undefined,
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 24px 48px rgba(80,10,140,0.30), 0 4px 16px rgba(0,0,0,0.40)"
          : "0 4px 16px rgba(0,0,0,0.30)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/propiedades?barrio=${encodeURIComponent(zona)}`)}
    >
      {/* Número decorativo de fondo */}
      <div
        className="font-display"
        style={{
          fontSize: "clamp(72px, 8vw, 96px)",
          fontWeight: 200,
          lineHeight: 1,
          color: "rgba(255,255,255,0.07)",
          position: "absolute",
          top: 12,
          right: 14,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "-0.03em",
        }}
      >
        {count}
      </div>

      {/* Contenido */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "22px 20px 22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* Conteo visible */}
        <p
          className="font-body"
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.38)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 8,
          }}
        >
          {count} {count === 1 ? "propiedad" : "propiedades"}
        </p>

        {/* Nombre de zona */}
        <p
          className="font-display italic"
          style={{
            fontSize: "clamp(22px, 2.4vw, 27px)",
            color: "rgba(255,255,255,0.95)",
            lineHeight: 1.15,
            marginBottom: 18,
          }}
        >
          {zona}
        </p>

        {/* Separador */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.10)",
            marginBottom: 16,
            transition: "background 0.2s",
          }}
        />

        {/* Pills de operación */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {(["venta", "alquiler"] as const).map((op) => (
            <button
              key={op}
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  `/propiedades?barrio=${encodeURIComponent(zona)}&operacion=${op}`
                );
              }}
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                padding: "5px 11px",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 99,
                background: "transparent",
                color: "rgba(255,255,255,0.60)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.95)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.60)";
              }}
            >
              {op}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div
          className="font-body"
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: hovered
              ? "hsl(var(--primary))"
              : "rgba(255,255,255,0.35)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "color 0.2s",
          }}
        >
          Ver propiedades{" "}
          <span
            style={{
              display: "inline-block",
              transform: hovered ? "translateX(4px)" : "translateX(0)",
              transition: "transform 0.2s ease",
            }}
          >
            →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    style={{
      width: 252,
      minWidth: 252,
      height: 340,
      background: "hsl(265, 38%, 11%)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 2,
      flexShrink: 0,
      animation: "pulse 1.6s ease-in-out infinite",
    }}
  />
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const MapPreviewSection = () => {
  const ref = useRef(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const navigate = useNavigate();

  const { data, isLoading } = useAllMapProperties({});

  // Top 6 zonas por número de propiedades
  const zonas = useMemo(() => {
    if (!data) return [];
    const counts: Record<string, number> = {};
    data.forEach((p) => {
      const z = sanitizeBarrio(p.barrio) || "Otras zonas";
      counts[z] = (counts[z] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [data]);

  return (
    <>
      <div className="section-divider" />
      <section
        ref={ref}
        className="noise-overlay relative overflow-hidden"
        style={{ background: "hsl(var(--background))" }}
      >
        <div className="section-padding">

          {/* ── Header ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p
                className="label-eyebrow mb-3"
                style={{ color: "rgba(200,160,255,0.70)" }}
              >
                Explorar
              </p>
              <h2
                className="font-display italic gold-gradient-text leading-none"
                style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 300 }}
              >
                por zona
              </h2>
            </motion.div>

            {/* Hint de drag en desktop */}
            <motion.p
              className="font-body hidden sm:block"
              style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", letterSpacing: "0.08em" }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
            >
              ← arrastrá para explorar →
            </motion.p>

            {/* Hint de swipe en mobile */}
            <motion.p
              className="font-body sm:hidden"
              style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", letterSpacing: "0.08em" }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
            >
              deslizá →
            </motion.p>
          </div>

          {/* ── Track de cards — desktop drag / mobile scroll ── */}

          {/* Mobile: CSS scroll snap */}
          <div
            className="sm:hidden"
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollSnapType: "x mandatory",
              display: "flex",
              gap: 12,
              paddingLeft: 24,
              paddingRight: 24,
              paddingBottom: 8,
              scrollbarWidth: "none",
            }}
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : zonas.map(([zona, count], i) => (
                  <ZonaCard
                    key={zona}
                    zona={zona}
                    count={count}
                    colorIndex={i}
                    index={i}
                    inView={inView}
                    snapAlign
                  />
                ))}
          </div>

          {/* Desktop: framer-motion drag */}
          <div
            className="hidden sm:block"
            ref={trackRef}
            style={{ overflow: "hidden", paddingLeft: "max(24px, calc((100vw - 1280px) / 2 + 48px))" }}
          >
            <motion.div
              drag="x"
              dragConstraints={trackRef}
              dragElastic={0.05}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
              style={{
                display: "flex",
                gap: 14,
                width: "max-content",
                paddingBottom: 12,
                paddingRight: 80,
                cursor: "grab",
              }}
              whileDrag={{ cursor: "grabbing" }}
            >
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : zonas.map(([zona, count], i) => (
                    <ZonaCard
                      key={zona}
                      zona={zona}
                      count={count}
                      colorIndex={i}
                      index={i}
                      inView={inView}
                    />
                  ))}
            </motion.div>
          </div>

          {/* ── CTAs ── */}
          <motion.div
            className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-10 flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
          >
            <button
              onClick={() => navigate("/mapa")}
              className="font-body text-[11px] uppercase tracking-[0.16em] px-8 py-3.5 w-full sm:w-auto transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.20)",
                color: "rgba(255,255,255,0.80)",
                background: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              Ver mapa completo
            </button>
            <button
              onClick={() => navigate("/propiedades")}
              className="font-body text-[11px] uppercase tracking-[0.16em] px-8 py-3.5 w-full sm:w-auto transition-all duration-200"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)";
              }}
            >
              Todas las propiedades
            </button>
          </motion.div>

        </div>
      </section>
      <div className="section-divider" />
    </>
  );
};

export default MapPreviewSection;
