import { useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAllMapProperties } from "@/hooks/useProperties";
import { EASE } from "@/lib/constants";

const MDP_CENTER: [number, number] = [-38.0055, -57.5426];

const MapPreviewSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const navigate = useNavigate();
  const { data } = useAllMapProperties({});

  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `<div style="width:9px;height:9px;border-radius:50%;background:hsl(275,62%,42%);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.45)"></div>`,
        iconSize: [9, 9],
        iconAnchor: [4, 4],
      }),
    []
  );

  const count = data?.length ?? 0;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: "280px" }}
    >
      {/* Map — rellena toda la sección */}
      {inView && (
        <div className="absolute inset-0 z-[1]">
          <MapContainer
            center={MDP_CENTER}
            zoom={13}
            scrollWheelZoom={false}
            zoomControl={false}
            attributionControl={false}
            dragging={false}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
            />
            <MarkerClusterGroup
              chunkedLoading
              maxClusterRadius={50}
              iconCreateFunction={(cluster: any) =>
                L.divIcon({
                  className: "",
                  html: `<div style="width:26px;height:26px;border-radius:50%;background:hsl(275,62%,38%);color:white;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.30)">${cluster.getChildCount()}</div>`,
                  iconSize: [26, 26] as L.PointExpression,
                  iconAnchor: [13, 13] as L.PointExpression,
                })
              }
            >
              {data?.map((p) =>
                p.lat && p.lng ? (
                  <Marker key={p.id} position={[p.lat, p.lng]} icon={markerIcon} />
                ) : null
              )}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      )}

      {/* Gradient izquierdo — panel de texto */}
      <div
        className="absolute inset-0 z-[400] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(16,4,32,0.97) 0%, rgba(16,4,32,0.90) 20%, rgba(16,4,32,0.60) 42%, rgba(16,4,32,0.18) 62%, transparent 78%)",
        }}
      />

      {/* Texto sobreimpreso */}
      <motion.div
        className="absolute inset-0 z-[500] flex items-center px-8 md:px-20 pointer-events-none"
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div>
          <p
            className="label-eyebrow mb-3"
            style={{ color: "rgba(190,145,255,0.80)" }}
          >
            Mapa de propiedades
          </p>
          <p
            className="font-display leading-[1.1] mb-5"
            style={{ fontSize: "clamp(24px,3.2vw,36px)", color: "white" }}
          >
            {count > 0 ? `${count} propiedades` : "Propiedades"}
            <br />
            <span className="italic" style={{ color: "rgba(220,185,255,0.92)" }}>
              en Mar del Plata
            </span>
          </p>
          <button
            className="pointer-events-auto font-body text-[12px] uppercase tracking-[0.14em] flex items-center gap-2 transition-opacity hover:opacity-70"
            style={{ color: "rgba(200,165,255,0.90)" }}
            onClick={() => navigate("/mapa")}
          >
            Explorar en el mapa →
          </button>
        </div>
      </motion.div>

      {/* Click zone sobre el mapa visible → /mapa */}
      <div
        className="absolute inset-y-0 z-[450] cursor-pointer"
        style={{ left: "45%", right: 0 }}
        onClick={() => navigate("/mapa")}
      />
    </section>
  );
};

export default MapPreviewSection;
