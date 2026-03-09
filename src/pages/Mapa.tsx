import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import Navigation from "@/components/sections/Navigation";
import PropertyFiltersBar from "@/components/PropertyFilters";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import { useAllMapProperties } from "@/hooks/useProperties";
import { whatsappLink } from "@/lib/constants";
import type { PropertyFilters } from "@/lib/types";
import type { Propiedad } from "@/lib/types";
import { ImageOff, Heart, Send } from "lucide-react";

// ─── SVG marker builder ───────────────────────────────────────────────────────
const SHADOW_FILTER = `
  <defs>
    <filter id="sh" x="0" y="0" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="bg"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dx="2" dy="4"/>
      <feGaussianBlur stdDeviation="5"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.26 0"/>
      <feBlend mode="normal" in2="bg" result="shadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="shadow" result="shape"/>
    </filter>
  </defs>`;

// Black circle base (centered at 25,23 r≈15 in 54x54 viewBox)
const CIRCLE = `<circle cx="25" cy="23" r="15" fill="black" stroke="white" stroke-width="2"/>`;

// White icons per property type
const ICONS: Record<string, string> = {
  // House
  casa: `<path d="M25 12l-12 10v11h8v-7h8v7h8V22L25 12z" fill="white"/>`,
  ph: `<path d="M25 12l-12 10v11h8v-7h8v7h8V22L25 12z" fill="white"/>`,
  // Building / apartment
  departamento: `<rect x="16" y="14" width="18" height="20" rx="1" fill="white"/>
    <rect x="18" y="17" width="4" height="4" fill="black" opacity="0.25"/>
    <rect x="24" y="17" width="4" height="4" fill="black" opacity="0.25"/>
    <rect x="18" y="23" width="4" height="4" fill="black" opacity="0.25"/>
    <rect x="24" y="23" width="4" height="4" fill="black" opacity="0.25"/>
    <rect x="21" y="29" width="8" height="5" fill="black" opacity="0.2"/>`,
  // Plot / terrain
  terreno: `<polygon points="25,11 34,31 16,31" fill="none" stroke="white" stroke-width="2"/>
    <line x1="25" y1="31" x2="25" y2="36" stroke="white" stroke-width="2"/>`,
  lote: `<polygon points="25,11 34,31 16,31" fill="none" stroke="white" stroke-width="2"/>
    <line x1="25" y1="31" x2="25" y2="36" stroke="white" stroke-width="2"/>`,
  // Commercial
  local: `<rect x="14" y="17" width="22" height="16" rx="1" fill="white"/>
    <rect x="19" y="24" width="12" height="9" fill="black" opacity="0.2"/>
    <path d="M14 17 Q25 10 36 17" fill="none" stroke="white" stroke-width="2"/>`,
  oficina: `<rect x="14" y="17" width="22" height="16" rx="1" fill="white"/>
    <rect x="19" y="24" width="12" height="9" fill="black" opacity="0.2"/>
    <path d="M14 17 Q25 10 36 17" fill="none" stroke="white" stroke-width="2"/>`,
  // Default
  default: `<path d="M25 12l-12 10v11h8v-7h8v7h8V22L25 12z" fill="white"/>`,
};

function buildMarkerSVG(tipo: string | null): string {
  const key = (tipo || "").toLowerCase().trim();
  const icon = ICONS[key] || ICONS.default;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
    <g filter="url(#sh)">${CIRCLE}${icon}</g>${SHADOW_FILTER}
  </svg>`;
}

function createPropertyIcon(tipo: string | null): L.Icon {
  return new L.Icon({
    iconUrl: "data:image/svg+xml," + encodeURIComponent(buildMarkerSVG(tipo)),
    iconSize: [55, 55],
    iconAnchor: [22.5, 27],
    popupAnchor: [0, -28],
  });
}

// ─── Cluster icon ─────────────────────────────────────────────────────────────
const createClusterIcon = (cluster: L.MarkerCluster) => {
  const count = cluster.getChildCount();
  const size = count >= 100 ? 38 : count >= 20 ? 34 : 30;
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:#000;color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:12px;font-weight:500;
      border:2px solid #fff;
      box-shadow:rgba(0,0,0,0.35) 2px 4px 10px;
    ">${count}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getFirstImage(fotos: unknown): string | null {
  if (!fotos) return null;
  let arr = fotos;
  if (typeof arr === "string") {
    try { arr = JSON.parse(arr); } catch { return null; }
  }
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const first = arr[0];
  if (typeof first === "string") return first;
  if (first && typeof first === "object" && "url" in first) return (first as { url: string }).url;
  return null;
}

// ─── Popup ────────────────────────────────────────────────────────────────────
const ACCENT = "#096DD9";

const MapPopup = ({ property }: { property: Propiedad }) => {
  const img = getFirstImage(property.fotos);
  const price =
    property.precio_texto ||
    (property.precio
      ? `${property.superficie_total ? property.superficie_total + " m² | " : ""}${property.moneda || "U$D"} ${property.precio.toLocaleString("es-AR")}`
      : "Consultar");
  const address = property.direccion || property.titulo || "Sin dirección";
  const tipo = (property.tipo || "Propiedad").toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "row", padding: "8px", width: "380px", minHeight: "96px", gap: "0px" }}>
      {/* Imagen */}
      <div style={{ width: "120px", minWidth: "120px", height: "90px", marginRight: "16px", flexShrink: 0 }}>
        {img ? (
          <img
            src={img}
            alt=""
            style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "4px", display: "block" }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: "120px", height: "90px", borderRadius: "4px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageOff style={{ width: "20px", height: "20px", color: "#bbb" }} />
          </div>
        )}
      </div>

      {/* Data */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "36px" }}>
        <small style={{ fontSize: "10px", fontWeight: 700, color: ACCENT, textTransform: "uppercase", marginBottom: "6px", display: "block" }}>
          {tipo}
        </small>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "rgba(0,0,0,0.85)", margin: "0 0 6px 0", lineHeight: 1.35 }}>
          {address}
        </p>
        <p style={{ fontSize: "13px", fontWeight: 500, color: ACCENT, margin: 0 }}>
          {price}
        </p>
      </div>

      {/* Botones derecha */}
      <div style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "8px" }}>
        <a
          href={whatsappLink(`Hola Analía, me interesa: ${property.titulo} en ${property.barrio || "Mar del Plata"}`)}
          target="_blank"
          rel="noopener noreferrer"
          title="Consultar por WhatsApp"
        >
          <Send style={{ width: "16px", height: "16px", color: ACCENT }} />
        </a>
        <Heart style={{ width: "16px", height: "16px", color: ACCENT, cursor: "pointer" }} />
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const MDP_CENTER: [number, number] = [-38.0055, -57.5426];

const Mapa = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<PropertyFilters>({
    operacion: searchParams.get("operacion") || undefined,
    sort: "recientes",
  });

  const { data: mapProperties } = useAllMapProperties(filters);
  const markers = useMemo(() => mapProperties || [], [mapProperties]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <ScrollProgress />
      <CustomCursor />
      <Navigation />

      {/* Popup CSS overrides */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #fff;
          border-radius: 12px !important;
          box-shadow: rgba(0,0,0,0.4) 0px 3px 14px 0px !important;
          padding: 0 !important;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip {
          background: #fff;
        }
        .leaflet-popup-close-button {
          color: #888 !important;
          font-size: 18px !important;
          padding: 4px 8px !important;
          z-index: 10;
        }
      `}</style>

      {/* Filter bar */}
      <div className="pt-[73px] z-40 relative">
        <PropertyFiltersBar
          filters={filters}
          onChange={(f) => setFilters(f)}
          total={markers.length}
          showMapLink={false}
        />
      </div>

      {/* Map */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={MDP_CENTER}
          zoom={13}
          className="w-full h-full"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <MarkerClusterGroup
            iconCreateFunction={createClusterIcon}
            showCoverageOnHover={false}
            spiderfyOnMaxZoom={true}
            disableClusteringAtZoom={17}
            maxClusterRadius={60}
          >
            {markers.map((p) => (
              p.lat && p.lng ? (
                <Marker
                  key={p.id}
                  position={[p.lat, p.lng]}
                  icon={createPropertyIcon(p.tipo)}
                >
                  <Popup>
                    <MapPopup property={p} />
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {/* Counter badge */}
        <div
          className="absolute bottom-4 left-4 z-[1000] px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            color: "#333",
            backdropFilter: "blur(4px)",
          }}
        >
          {markers.length} propiedad{markers.length !== 1 ? "es" : ""} en el mapa
        </div>
      </div>

      <WhatsAppFAB />
    </div>
  );
};

export default Mapa;
