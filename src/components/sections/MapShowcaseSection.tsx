import { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, useInView, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useAllMapProperties } from "@/hooks/useProperties";
import { EASE } from "@/lib/constants";
import type { Propiedad } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────
const MDP_CENTER: [number, number] = [-38.0055, -57.5426];

// ─── Icons ───────────────────────────────────────────────────────────────────
const MARKER_ICON = new L.DivIcon({
  html: `<div style="width:10px;height:10px;border-radius:50%;background:hsl(275,62%,38%);border:2px solid white;box-shadow:0 1px 5px rgba(80,0,130,0.45);"></div>`,
  className: "",
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const makeClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  const size = count >= 100 ? 38 : count >= 20 ? 32 : 26;
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:hsl(275,70%,22%);color:white;display:flex;align-items:center;justify-content:center;font-size:${size < 32 ? 10 : 11}px;font-weight:600;border:2px solid rgba(255,255,255,0.85);box-shadow:0 2px 8px rgba(80,0,130,0.35);">${count}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ─── Interaction toggler (child of MapContainer) ──────────────────────────────
const InteractionControl = ({ enabled }: { enabled: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (enabled) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
    }
  }, [enabled, map]);
  return null;
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView || value === 0) return;
    const ctrl = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setCount(Math.floor(v)),
    });
    return () => ctrl.stop();
  }, [inView, value]);

  return <span ref={ref}>{count}</span>;
}

// ─── Mini popup content ────────────────────────────────────────────────────────
function PropPopup({ prop }: { prop: Propiedad }) {
  const navigate = useNavigate();
  const slug = prop.pixel_slug || String(prop.id);
  const price =
    prop.precio_texto ||
    (prop.precio
      ? `${prop.moneda || "USD"} ${prop.precio.toLocaleString("es-AR")}`
      : "Consultar");

  return (
    <div
      style={{ padding: "14px 16px", minWidth: 190, cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/propiedad/${slug}`);
      }}
    >
      {prop.tipo && (
        <p style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
          {prop.tipo}
        </p>
      )}
      <p style={{ fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.35, marginBottom: 6 }}>
        {prop.titulo || "Propiedad"}
      </p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "hsl(275, 62%, 38%)" }}>{price}</p>
      <p style={{ fontSize: 11, color: "hsl(275, 62%, 38%)", marginTop: 8, textDecoration: "underline" }}>
        Ver detalle →
      </p>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
const MapShowcaseSection = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const navigate = useNavigate();
  const [mapHovered, setMapHovered] = useState(false);

  const { data } = useAllMapProperties({});
  const properties = (data ?? []).filter((p) => p.lat && p.lng);
  const total = data?.length ?? 0;
  const ventaCount = (data ?? []).filter((p) => p.operacion?.toLowerCase() === "venta").length;
  const alquilerCount = (data ?? []).filter((p) => p.operacion?.toLowerCase() === "alquiler").length;

  const stats = [
    { value: total, label: "disponibles", accent: true, onClick: undefined as (() => void) | undefined },
    { value: ventaCount, label: "en venta", accent: false, onClick: () => navigate("/propiedades?operacion=venta") },
    { value: alquilerCount, label: "en alquiler", accent: false, onClick: () => navigate("/propiedades?operacion=alquiler") },
  ];

  return (
    <>
      <div className="section-divider" />
      <section
        ref={sectionRef}
        className="grid grid-cols-1 md:grid-cols-[420px_1fr] lg:grid-cols-[480px_1fr]"
        style={{ minHeight: 520 }}
      >
        {/* ── LEFT PANEL ── */}
        <motion.div
          className="flex flex-col justify-center relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, hsl(275, 72%, 13%) 0%, hsl(275, 65%, 22%) 100%)",
            padding: "clamp(48px, 6vw, 80px) clamp(32px, 5vw, 56px)",
          }}
          initial={{ opacity: 0, x: -28 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Decorative radial glow */}
          <div
            style={{
              position: "absolute",
              bottom: -140,
              right: -140,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(160,80,240,0.16) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          {/* Top left subtle noise dot */}
          <div
            style={{
              position: "absolute",
              top: 32,
              left: 32,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "hsl(275,80%,70%)",
              opacity: 0.5,
            }}
          />

          <motion.p
            className="label-eyebrow"
            style={{ color: "hsl(275, 80%, 72%)", marginBottom: 14 }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
          >
            Explorá Mar del Plata
          </motion.p>

          <motion.h2
            className="font-display"
            style={{
              fontSize: "clamp(30px, 3.2vw, 46px)",
              lineHeight: 1.05,
              color: "white",
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
          >
            Todas las propiedades,
            <br />
            en el mapa
          </motion.h2>

          <motion.p
            className="font-body"
            style={{
              color: "rgba(255,255,255,0.50)",
              fontSize: 15,
              lineHeight: 1.7,
              maxWidth: 340,
              marginBottom: 44,
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          >
            Buscá por zona o barrio con filtros en tiempo real. Visualizá cada propiedad exactamente donde está.
          </motion.p>

          {/* Stats row */}
          <motion.div
            style={{ display: "flex", alignItems: "flex-start", marginBottom: 44 }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.28, duration: 0.6, ease: EASE }}
          >
            {stats.map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "stretch" }}>
                {i > 0 && (
                  <div
                    style={{
                      width: 1,
                      background: "rgba(255,255,255,0.08)",
                      margin: "0 22px",
                      minHeight: 48,
                      alignSelf: "stretch",
                    }}
                  />
                )}
                <div
                  onClick={s.onClick}
                  style={{ cursor: s.onClick ? "pointer" : "default" }}
                >
                  <div
                    className="font-display"
                    style={{
                      fontSize: s.accent ? "clamp(32px,3vw,44px)" : "clamp(20px,2vw,28px)",
                      fontWeight: 700,
                      color: s.accent ? "hsl(275, 80%, 74%)" : "white",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <Counter value={s.value} />
                  </div>
                  <p
                    className="font-body"
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: s.onClick ? "hsl(275, 70%, 65%)" : "rgba(255,255,255,0.32)",
                      marginTop: 7,
                    }}
                  >
                    {s.label}
                    {s.onClick && " →"}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.button
            onClick={() => navigate("/mapa")}
            className="font-body"
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 26px",
              background: "hsl(275, 62%, 38%)",
              border: "1px solid hsl(275, 62%, 52%)",
              borderRadius: 2,
              color: "white",
              fontSize: 12,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.36, duration: 0.6, ease: EASE }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MapPin className="w-4 h-4" style={{ opacity: 0.8 }} />
            Abrir mapa completo
          </motion.button>
        </motion.div>

        {/* ── RIGHT PANEL: LIVE MAP ── */}
        <motion.div
          className="relative"
          style={{ minHeight: 400 }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
          onMouseEnter={() => setMapHovered(true)}
          onMouseLeave={() => setMapHovered(false)}
        >
          {/* Overlay: clickable when not hovering, fades out on hover */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "rgba(10, 3, 20, 0.18)",
            }}
            animate={{
              opacity: mapHovered ? 0 : 1,
              pointerEvents: mapHovered ? "none" : "auto",
            } as any}
            transition={{ duration: 0.3 }}
            onClick={() => navigate("/mapa")}
          >
            <motion.div
              className="font-body"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                background: "rgba(10, 3, 20, 0.62)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 2,
                color: "white",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
              animate={{ y: mapHovered ? -4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <MapPin style={{ width: 13, height: 13, opacity: 0.8 }} />
              Explorar propiedades
            </motion.div>
          </motion.div>

          {/* Leaflet CSS overrides scoped to showcase */}
          <style>{`
            .showcase-map .leaflet-container {
              cursor: ${mapHovered ? "grab" : "default"} !important;
            }
            .showcase-map .leaflet-drag-target {
              cursor: grabbing !important;
            }
            .showcase-map .leaflet-interactive {
              cursor: pointer !important;
            }
            .showcase-map .leaflet-popup-content-wrapper {
              border-radius: 8px !important;
              box-shadow: 0 4px 24px rgba(0,0,0,0.16) !important;
              padding: 0 !important;
              overflow: hidden;
              border: 1px solid #ede9f6;
            }
            .showcase-map .leaflet-popup-content { margin: 0 !important; }
            .showcase-map .leaflet-popup-tip-container { display: none; }
            .showcase-map .leaflet-popup-close-button {
              color: #bbb !important;
              font-size: 16px !important;
              top: 4px !important;
              right: 8px !important;
            }
            .showcase-map .leaflet-control-zoom { display: none; }
          `}</style>

          <div className="showcase-map" style={{ position: "absolute", inset: 0 }}>
            <MapContainer
              center={MDP_CENTER}
              zoom={13}
              style={{ width: "100%", height: "100%" }}
              zoomControl={false}
              scrollWheelZoom={false}
              dragging={false}
              touchZoom={false}
              doubleClickZoom={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                maxZoom={19}
              />
              <InteractionControl enabled={mapHovered} />
              <MarkerClusterGroup
                iconCreateFunction={makeClusterIcon}
                showCoverageOnHover={false}
                spiderfyOnMaxZoom={true}
                maxClusterRadius={50}
              >
                {properties.map((prop) => (
                  <Marker
                    key={prop.id}
                    position={[prop.lat!, prop.lng!]}
                    icon={MARKER_ICON}
                  >
                    <Popup closeButton autoPan={false}>
                      <PropPopup prop={prop} />
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>
        </motion.div>
      </section>
      <div className="section-divider" />
    </>
  );
};

export default MapShowcaseSection;
