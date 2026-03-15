import { useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, useInView } from "framer-motion";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAllMapProperties } from "@/hooks/useProperties";
import MagneticButton from "@/components/MagneticButton";
import { EASE } from "@/lib/constants";

const MDP_CENTER: [number, number] = [-38.0055, -57.5426];
const BG = "hsl(270 55% 12%)";

const MapPreviewSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const navigate = useNavigate();
  const { data } = useAllMapProperties({});

  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `<div style="width:10px;height:10px;border-radius:50%;background:hsl(275,62%,38%);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      }),
    []
  );

  const count = data?.length ?? 0;

  return (
    <>
      <div className="section-divider" />
      <section
        ref={ref}
        className="section-lazy relative overflow-hidden"
        style={{ backgroundColor: BG, contain: "content" }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left — text */}
          <motion.div
            className="flex flex-col justify-center px-8 md:px-12 lg:px-20 py-14 md:w-[40%] shrink-0 relative z-10"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p
              className="label-eyebrow mb-6"
              style={{ color: "rgba(200,160,255,0.80)" }}
            >
              Mapa de propiedades
            </p>

            <h2
              className="font-display leading-[1.05] mb-5"
              style={{ fontSize: "clamp(36px,4.5vw,52px)", color: "white" }}
            >
              Encontrá tu
              <br />
              <span className="italic" style={{ color: "rgba(240,230,255,0.95)" }}>
                propiedad
              </span>
              <br />
              donde querés
            </h2>

            <p
              className="font-body text-[15px] leading-relaxed mb-8 max-w-xs"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Todas las propiedades geolocalizadas en Mar del Plata. Explorá por zona, tipo y precio.
            </p>

            {count > 0 && (
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 font-body text-sm w-fit"
                style={{
                  border: "1px solid rgba(160,80,220,0.35)",
                  backgroundColor: "rgba(160,80,220,0.12)",
                  color: "hsl(275,62%,75%)",
                }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
              >
                <MapPin className="w-3.5 h-3.5" />
                {count} propiedades activas
              </motion.div>
            )}

            <MagneticButton
              variant="filled"
              className="text-[14px] py-4 px-10 w-fit"
              onClick={() => navigate("/mapa")}
            >
              Abrir mapa interactivo →
            </MagneticButton>
          </motion.div>

          {/* Right — map */}
          <motion.div
            className="relative flex-1 h-[300px] md:h-[520px] group cursor-pointer"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            onClick={() => navigate("/mapa")}
            style={{ border: "1px solid rgba(160,80,220,0.20)" }}
          >
            {inView && (
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
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <MarkerClusterGroup
                  chunkedLoading
                  maxClusterRadius={50}
                  iconCreateFunction={(cluster: any) =>
                    L.divIcon({
                      className: "",
                      html: `<div style="width:28px;height:28px;border-radius:50%;background:hsl(275,62%,38%);color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)">${cluster.getChildCount()}</div>`,
                      iconSize: [28, 28] as L.PointExpression,
                      iconAnchor: [14, 14] as L.PointExpression,
                    })
                  }
                >
                  {data?.map((p) =>
                    p.lat && p.lng ? (
                      <Marker
                        key={p.id}
                        position={[p.lat, p.lng]}
                        icon={markerIcon}
                      />
                    ) : null
                  )}
                </MarkerClusterGroup>
              </MapContainer>
            )}

            {/* Left fade — fusiona con el panel de texto */}
            <div
              className="absolute inset-y-0 left-0 w-20 pointer-events-none z-[400]"
              style={{ background: `linear-gradient(to right, ${BG} 0%, transparent 100%)` }}
            />

            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[400]"
              style={{ background: "rgba(10,3,20,0.45)" }}
            >
              <span
                className="font-body text-sm uppercase tracking-[0.12em] px-6 py-3"
                style={{
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.30)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Explorar mapa completo →
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default MapPreviewSection;
