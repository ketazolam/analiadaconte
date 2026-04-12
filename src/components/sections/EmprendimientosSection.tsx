import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Building2, ArrowRight, ImageOff } from "lucide-react";
import { useEmprendimientos } from "@/hooks/useProperties";
import { EASE } from "@/lib/constants";
import type { Propiedad } from "@/lib/types";

// ─── Image helper ──────────────────────────────────────────────────────────────
function getAllImages(fotos: unknown): string[] {
  if (!fotos) return [];
  let arr = fotos;
  if (typeof arr === "string") { try { arr = JSON.parse(arr); } catch { return []; } }
  if (!Array.isArray(arr)) return [];
  return arr
    .map((f) => typeof f === "string" ? f : (f && typeof f === "object" && "url" in f ? (f as { url: string }).url : null))
    .filter(Boolean) as string[];
}

// ─── Status badge ──────────────────────────────────────────────────────────────
function getStatusLabel(prop: Propiedad): string {
  const e = (prop.etiqueta || "").toLowerCase();
  if (e.includes("pozo")) return prop.etiqueta!;
  if (e.includes("construc")) return prop.etiqueta!;
  if (e.includes("estrenar") || prop.a_estrenar) return "A estrenar";
  if (prop.etiqueta) return prop.etiqueta;
  return "En pozo";
}

// ─── Individual card ───────────────────────────────────────────────────────────
const EmpCard = ({ prop, index, inView }: { prop: Propiedad; index: number; inView: boolean }) => {
  const slug = prop.pixel_slug || String(prop.id);
  const images = getAllImages(prop.fotos);
  const hasImage = images.length > 0;
  const priceDisplay =
    prop.precio_texto ||
    (prop.precio
      ? `${prop.moneda || "USD"} ${prop.precio.toLocaleString("es-AR")}`
      : "Consultar");
  const statusLabel = getStatusLabel(prop);
  const barrio = (prop.barrio || prop.ciudad || "Mar del Plata")
    .replace(/^(BARRIO\s+)/i, "")
    .replace(/^(B°\s+)/i, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: EASE, delay: 0.08 + index * 0.11 }}
      className="relative"
    >
      <Link
        to={`/propiedad/${slug}`}
        className="group block relative overflow-hidden"
        style={{ aspectRatio: "3/4" }}
      >
        {/* Image */}
        {hasImage ? (
          <img
            src={images[0]}
            alt={prop.titulo || "Emprendimiento"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "hsl(265 25% 12%)" }}
          >
            <ImageOff className="w-12 h-12 opacity-15" style={{ color: "hsl(275 70% 65%)" }} />
          </div>
        )}

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
          style={{
            background:
              "linear-gradient(to top, rgba(6,2,16,0.96) 0%, rgba(6,2,16,0.50) 45%, rgba(6,2,16,0.12) 100%)",
          }}
        />

        {/* Top edge gradient for badge legibility */}
        <div
          className="absolute inset-x-0 top-0 h-20 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(6,2,16,0.55), transparent)" }}
        />

        {/* Status badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className="font-body text-[10px] uppercase tracking-[0.14em] px-3 py-1.5 inline-block"
            style={{ background: "hsl(275 62% 36%)", color: "rgba(255,255,255,0.92)" }}
          >
            {statusLabel}
          </span>
        </div>

        {/* Building icon badge top-right */}
        <div className="absolute top-4 right-4 z-10 opacity-60 group-hover:opacity-90 transition-opacity">
          <Building2 className="w-4 h-4" style={{ color: "hsl(275 70% 70%)" }} />
        </div>

        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <p
            className="font-body text-[10px] uppercase tracking-[0.14em] mb-2"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            Edificio · {barrio}
          </p>
          <h3
            className="font-display leading-tight text-white mb-1.5 line-clamp-2 transition-colors duration-300 group-hover:text-purple-200"
            style={{ fontSize: "clamp(16px, 1.8vw, 20px)", letterSpacing: "-0.01em" }}
          >
            {prop.titulo || "Sin título"}
          </h3>
          {prop.direccion && (
            <p
              className="font-body text-[11px] mb-3 line-clamp-1"
              style={{ color: "rgba(255,255,255,0.32)" }}
            >
              {prop.direccion}
            </p>
          )}
          <div className="flex items-end justify-between">
            <div>
              {!prop.precio_texto && prop.precio && (
                <p className="font-body text-[9px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
                  Desde
                </p>
              )}
              <span
                className="font-display text-base leading-none"
                style={{ color: "hsl(275 80% 74%)" }}
              >
                {priceDisplay}
              </span>
            </div>
            <span
              className="font-body text-[11px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
              style={{ color: "hsl(275 70% 70%)" }}
            >
              Ver →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ─── Section ───────────────────────────────────────────────────────────────────
const EmprendimientosSection = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  const navigate = useNavigate();

  const { data: emprendimientos } = useEmprendimientos(6);

  // Don't render if no emprendimientos exist
  if (!emprendimientos || emprendimientos.length === 0) return null;

  const gridCols =
    emprendimientos.length === 1
      ? "grid-cols-1 max-w-xs mx-auto"
      : emprendimientos.length === 2
      ? "grid-cols-2 max-w-2xl mx-auto"
      : "grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className="section-divider" />
      <section
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{ background: "hsl(265 18% 5%)" }}
      >
        {/* Radial purple glow top */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 70% 45% at 50% -5%, hsl(275 62% 22% / 0.45), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Subtle grid texture */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(180,130,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(180,130,255,0.025) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            pointerEvents: "none",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
            <div>
              <motion.p
                className="label-eyebrow mb-4"
                style={{ color: "hsl(275 70% 64%)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
              >
                Inversión en desarrollo
              </motion.p>
              <motion.h2
                className="font-display text-white"
                style={{
                  fontSize: "clamp(28px, 3.8vw, 52px)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.02em",
                }}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
              >
                Emprendimientos
                <br />
                <span style={{ color: "hsl(275 70% 70%)" }}>en Mar del Plata</span>
              </motion.h2>
              <motion.p
                className="font-body mt-4"
                style={{ color: "rgba(255,255,255,0.38)", fontSize: 14, lineHeight: 1.7, maxWidth: 400 }}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
              >
                Edificios en pozo y en construcción. Invertí antes de que el precio suba.
              </motion.p>
            </div>

            <motion.button
              onClick={() => navigate("/propiedades?tipo=Emprendimiento")}
              className="font-body self-start md:self-auto flex items-center gap-2 shrink-0 transition-colors duration-300"
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "12px 24px",
                border: "1px solid hsl(275 55% 38%)",
                color: "hsl(275 70% 66%)",
              }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
              whileHover={{ borderColor: "hsl(275 62% 55%)", color: "hsl(275 80% 78%)" }}
              whileTap={{ scale: 0.98 }}
            >
              Ver todos
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Cards grid */}
          <div className={`grid gap-4 md:gap-5 ${gridCols}`}>
            {emprendimientos.map((emp, i) => (
              <EmpCard key={emp.id} prop={emp} index={i} inView={inView} />
            ))}
          </div>
        </div>
      </section>
      <div className="section-divider" />
    </>
  );
};

export default EmprendimientosSection;
