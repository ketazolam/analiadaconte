import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ImageOff, MapPin, Bed, Maximize2, List, Map as MapIcon,
  SlidersHorizontal, Crosshair, Maximize, Eye, EyeOff,
} from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/sections/Navigation";
import PropertyFiltersBar from "@/components/PropertyFilters";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import { useAllMapProperties } from "@/hooks/useProperties";
import type { PropertyFilters } from "@/lib/types";
import type { Propiedad } from "@/lib/types";
import { sanitizeBarrio } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────
const MDP_CENTER: [number, number] = [-38.0055, -57.5426];
const ACCENT = "#096DD9";
const NAV_HEIGHT = 73;

// ─── SVG Markers ─────────────────────────────────────────────────────────────
const SHADOW = `<filter id="sh" x="-30%" y="-30%" width="160%" height="160%">
  <feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.28)"/>
</filter>`;

const ICONS: Record<string, string> = {
  casa: `<path d="M25 12l-12 9.5v12h8v-7h8v7h8V21.5L25 12z" fill="white"/>`,
  ph: `<path d="M25 12l-12 9.5v12h8v-7h8v7h8V21.5L25 12z" fill="white"/>`,
  departamento: `<rect x="17" y="14" width="16" height="19" rx="1" fill="white"/>
    <rect x="19" y="17" width="4" height="4" fill="${ACCENT}" opacity="0.5"/>
    <rect x="25" y="17" width="4" height="4" fill="${ACCENT}" opacity="0.5"/>
    <rect x="19" y="23" width="4" height="4" fill="${ACCENT}" opacity="0.5"/>
    <rect x="25" y="23" width="4" height="4" fill="${ACCENT}" opacity="0.5"/>
    <rect x="22" y="28" width="6" height="5" fill="${ACCENT}" opacity="0.3"/>`,
  terreno: `<polygon points="25,12 35,30 15,30" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="25" y1="30" x2="25" y2="35" stroke="white" stroke-width="2"/>`,
  lote: `<polygon points="25,12 35,30 15,30" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="25" y1="30" x2="25" y2="35" stroke="white" stroke-width="2"/>`,
  local: `<rect x="15" y="18" width="20" height="14" rx="1" fill="white"/>
    <rect x="20" y="25" width="10" height="7" fill="${ACCENT}" opacity="0.3"/>
    <path d="M15 18 Q25 10 35 18" fill="none" stroke="white" stroke-width="2"/>`,
  oficina: `<rect x="15" y="18" width="20" height="14" rx="1" fill="white"/>
    <rect x="20" y="25" width="10" height="7" fill="${ACCENT}" opacity="0.3"/>
    <path d="M15 18 Q25 10 35 18" fill="none" stroke="white" stroke-width="2"/>`,
};

function makeSVG(tipo: string | null, selected = false): string {
  const key = (tipo || "").toLowerCase().trim();
  const icon = ICONS[key] || ICONS.casa;
  const fill = selected ? ACCENT : "#111";
  const scale = selected ? 1.15 : 1;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${54 * scale}" height="${54 * scale}" viewBox="0 0 54 54" fill="none">
    <defs>${SHADOW}</defs>
    <g filter="url(#sh)">
      <circle cx="25" cy="23" r="15" fill="${fill}" stroke="white" stroke-width="2"/>
      ${icon}
    </g>
  </svg>`;
}

function createPropertyIcon(tipo: string | null, selected = false): L.Icon {
  const size: [number, number] = selected ? [63, 63] : [55, 55];
  return new L.Icon({
    iconUrl: "data:image/svg+xml," + encodeURIComponent(makeSVG(tipo, selected)),
    iconSize: size,
    iconAnchor: [size[0] / 2 - 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2 - 4],
  });
}

// ─── Cluster Icon ─────────────────────────────────────────────────────────────
const createClusterIcon = (cluster: L.MarkerCluster) => {
  const count = cluster.getChildCount();
  const size = count >= 100 ? 40 : count >= 20 ? 35 : 30;
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-size:${size < 35 ? 11 : 12}px;font-weight:500;border:2.5px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.3);transition:transform .15s;">${count}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ─── Map helpers (must be children of MapContainer) ───────────────────────────
const FlyTo = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), 15), { animate: true, duration: 0.6 });
    }
  }, [position, map]);
  return null;
};

const FitBoundsHelper = ({
  markers,
  trigger,
}: {
  markers: Propiedad[];
  trigger: number;
}) => {
  const map = useMap();
  const prevTrigger = useRef(0);
  useEffect(() => {
    if (trigger === 0 || trigger === prevTrigger.current) return;
    prevTrigger.current = trigger;
    const valid = markers.filter((p) => p.lat && p.lng);
    if (valid.length === 0) return;
    const bounds = L.latLngBounds(valid.map((p) => [p.lat!, p.lng!] as [number, number]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16, animate: true });
  }, [trigger, markers, map]);
  return null;
};

const MapBoundsWatcher = ({
  onBoundsChange,
}: {
  onBoundsChange: (b: L.LatLngBounds) => void;
}) => {
  const map = useMap();
  useEffect(() => {
    const update = () => onBoundsChange(map.getBounds());
    map.on("moveend", update);
    map.on("zoomend", update);
    // Fire immediately after mount so we have initial bounds
    update();
    return () => {
      map.off("moveend", update);
      map.off("zoomend", update);
    };
  }, [map, onBoundsChange]);
  return null;
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

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", overflow: "hidden" }}>
    <div className="skeleton-shimmer" style={{ width: 140, height: 105, flexShrink: 0 }} />
    <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="skeleton-shimmer" style={{ height: 9, width: "38%", borderRadius: 2 }} />
      <div className="skeleton-shimmer" style={{ height: 12, width: "82%", borderRadius: 2 }} />
      <div className="skeleton-shimmer" style={{ height: 10, width: "55%", borderRadius: 2 }} />
      <div className="skeleton-shimmer" style={{ height: 12, width: "32%", borderRadius: 2, marginTop: "auto" }} />
    </div>
  </div>
);

// ─── Sidebar property card ────────────────────────────────────────────────────
interface SidebarCardProps {
  property: Propiedad;
  selected: boolean;
  onSelect: () => void;
}

const SidebarCard = ({ property, selected, onSelect }: SidebarCardProps) => {
  const navigate = useNavigate();
  const img = getFirstImage(property.fotos);
  const slug = property.pixel_slug || String(property.id);
  const price =
    property.precio_texto ||
    (property.precio
      ? `${property.moneda || "U$D"} ${property.precio.toLocaleString("es-AR")}`
      : "Consultar");
  const location =
    [sanitizeBarrio(property.barrio), property.ciudad].filter(Boolean).join(", ") ||
    "Mar del Plata";
  const tipo = (property.tipo || "").toUpperCase();

  return (
    <div
      onClick={onSelect}
      className="map-sidebar-card flex overflow-hidden cursor-pointer transition-all duration-200"
      style={{
        borderBottom: "1px solid #f0f0f0",
        background: selected ? "#f0f6ff" : "#fff",
        borderLeft: selected ? `3px solid ${ACCENT}` : "3px solid transparent",
      }}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0" style={{ width: 140, height: 105 }}>
        {img ? (
          <img
            src={img}
            alt=""
            style={{ width: 140, height: 105, objectFit: "cover", display: "block" }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: 140,
              height: 105,
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageOff style={{ width: 20, height: 20, color: "#ccc" }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div>
          {tipo && (
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: ACCENT,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 4,
              }}
            >
              {tipo}
            </p>
          )}
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#111",
              lineHeight: 1.3,
              marginBottom: 4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {property.titulo || "Sin título"}
          </p>
          <p style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 3 }}>
            <MapPin style={{ width: 10, height: 10 }} />
            {location}
          </p>
        </div>
        <div className="flex items-end justify-between mt-2">
          <p style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>{price}</p>
          <div className="flex items-center gap-2" style={{ fontSize: 11, color: "#888" }}>
            {(property.dormitorios ?? 0) > 0 && (
              <span className="flex items-center gap-0.5">
                <Bed style={{ width: 11, height: 11 }} />
                {property.dormitorios}
              </span>
            )}
            {property.superficie_total && (
              <span className="flex items-center gap-0.5">
                <Maximize2 style={{ width: 11, height: 11 }} />
                {property.superficie_total}m²
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ver ficha */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/propiedad/${slug}`);
        }}
        style={{
          alignSelf: "center",
          marginRight: 10,
          padding: "5px 10px",
          fontSize: 10,
          fontWeight: 600,
          color: ACCENT,
          background: "#e8f0fe",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Ver →
      </button>
    </div>
  );
};

// ─── Map popup ────────────────────────────────────────────────────────────────
const MapPopup = ({ property }: { property: Propiedad }) => {
  const navigate = useNavigate();
  const img = getFirstImage(property.fotos);
  const slug = property.pixel_slug || String(property.id);
  const price =
    property.precio_texto ||
    (property.precio
      ? `${property.moneda || "U$D"} ${property.precio.toLocaleString("es-AR")}`
      : "Consultar");

  return (
    <div
      style={{ display: "flex", gap: 12, padding: "10px 12px", width: 300, cursor: "pointer" }}
      onClick={() => navigate(`/propiedad/${slug}`)}
    >
      {img && (
        <img
          src={img}
          alt=""
          style={{ width: 80, height: 62, objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
          loading="lazy"
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: ACCENT,
            textTransform: "uppercase",
            marginBottom: 3,
          }}
        >
          {(property.tipo || "Propiedad").toUpperCase()}
        </p>
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#222",
            lineHeight: 1.35,
            marginBottom: 5,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
          }}
        >
          {property.titulo || sanitizeBarrio(property.barrio) || "Sin título"}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>{price}</p>
          <div
            style={{
              display: "flex",
              gap: 8,
              fontSize: 10,
              color: "#888",
              alignItems: "center",
            }}
          >
            {(property.dormitorios ?? 0) > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Bed style={{ width: 10, height: 10 }} />
                {property.dormitorios}
              </span>
            )}
            {property.superficie_total && (
              <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Maximize2 style={{ width: 10, height: 10 }} />
                {property.superficie_total}m²
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Map overlay button style ──────────────────────────────────────────────────
const mapBtnStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  color: "#333",
  transition: "background .15s",
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Mapa = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<PropertyFilters>({
    operacion: searchParams.get("operacion") || undefined,
    tipo: searchParams.get("tipo") || undefined,
    dormitorios: searchParams.get("dormitorios")
      ? Number(searchParams.get("dormitorios"))
      : undefined,
    precioMin: searchParams.get("precioMin")
      ? Number(searchParams.get("precioMin"))
      : undefined,
    precioMax: searchParams.get("precioMax")
      ? Number(searchParams.get("precioMax"))
      : undefined,
    sort: "recientes",
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [showFilters, setShowFilters] = useState(false);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [filterByBounds, setFilterByBounds] = useState(false);
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState(0);

  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data: mapProperties, isLoading } = useAllMapProperties(filters);
  const markers = useMemo(() => mapProperties || [], [mapProperties]);

  // Sidebar list: optionally filtered by current map viewport
  const visibleMarkers = useMemo(() => {
    if (!filterByBounds || !mapBounds) return markers;
    return markers.filter(
      (p) => p.lat && p.lng && mapBounds.contains([p.lat, p.lng] as L.LatLngExpression)
    );
  }, [markers, mapBounds, filterByBounds]);

  // Sync filters → URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.operacion) params.operacion = filters.operacion;
    if (filters.tipo) params.tipo = filters.tipo;
    if (filters.dormitorios) params.dormitorios = String(filters.dormitorios);
    if (filters.precioMin) params.precioMin = String(filters.precioMin);
    if (filters.precioMax) params.precioMax = String(filters.precioMax);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Reset flyTarget so same marker can be clicked again
  useEffect(() => {
    if (flyTarget) {
      const t = setTimeout(() => setFlyTarget(null), 800);
      return () => clearTimeout(t);
    }
  }, [flyTarget]);

  const handleMarkerClick = useCallback(
    (p: Propiedad) => {
      setSelectedId(p.id);
      if (p.lat && p.lng) setFlyTarget([p.lat, p.lng]);
      const el = cardRefs.current.get(p.id);
      if (el && sidebarRef.current) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },
    []
  );

  const handleCardSelect = useCallback((p: Propiedad) => {
    setSelectedId(p.id);
    if (p.lat && p.lng) setFlyTarget([p.lat, p.lng]);
  }, []);

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setFlyTarget([pos.coords.latitude, pos.coords.longitude]),
      () => {} // silently ignore errors
    );
  };

  const handleFitAll = () => {
    setFitBoundsTrigger((n) => n + 1);
  };

  const handleBoundsChange = useCallback((bounds: L.LatLngBounds) => {
    setMapBounds(bounds);
  }, []);

  const sidebarCount = filterByBounds
    ? `${visibleMarkers.length} de ${markers.length} propiedades`
    : `${markers.length} propiedades`;

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <CustomCursor />

      {/* Global CSS overrides */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e6e6e6 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 10px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18) !important;
          padding: 0 !important;
          overflow: hidden;
          border: 1px solid #e8e8e8;
        }
        .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .leaflet-popup-tip-container { display: none; }
        .leaflet-popup-close-button {
          color: #aaa !important; font-size: 16px !important;
          top: 4px !important; right: 6px !important; z-index: 10;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15) !important;
        }
        .leaflet-control-zoom a {
          border-radius: 4px !important;
          color: #333 !important;
          font-size: 16px !important;
        }
        .leaflet-marker-icon:hover { transform: scale(1.08) !important; transition: transform .15s; }
        .map-sidebar-card:hover { background: #f7f9ff !important; }
        .map-overlay-btn:hover { background: #f5f5f5 !important; }
      `}</style>

      {/* Navigation */}
      <Navigation />

      {/* Filter bar — desktop only */}
      <div className="hidden md:block" style={{ paddingTop: NAV_HEIGHT }}>
        <PropertyFiltersBar
          filters={filters}
          onChange={setFilters}
          total={markers.length}
          showMapLink={false}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR ── */}
        <div
          className={`flex flex-col bg-white border-r border-gray-100 ${
            mobileView === "list" ? "flex" : "hidden md:flex"
          }`}
          style={{ width: "100%", maxWidth: 420, minWidth: 320, height: "100%" }}
        >
          {/* Sidebar header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ background: "#fff", borderBottom: "1px solid #eee", flexShrink: 0 }}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>
                {isLoading ? "Cargando..." : sidebarCount}
              </span>
              {/* Bounds filter toggle */}
              <button
                onClick={() => setFilterByBounds((v) => !v)}
                title={filterByBounds ? "Mostrando solo vista actual" : "Ver solo los visibles en el mapa"}
                className="map-overlay-btn hidden md:flex items-center gap-1"
                style={{
                  padding: "3px 8px",
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 99,
                  border: `1px solid ${filterByBounds ? ACCENT : "#ddd"}`,
                  background: filterByBounds ? "#e8f0fe" : "#f5f5f5",
                  color: filterByBounds ? ACCENT : "#888",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all .15s",
                }}
              >
                {filterByBounds ? (
                  <Eye style={{ width: 10, height: 10 }} />
                ) : (
                  <EyeOff style={{ width: 10, height: 10 }} />
                )}
                {filterByBounds ? "En vista" : "Todos"}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "#f0f0f0", color: "#333" }}
              >
                <SlidersHorizontal style={{ width: 12, height: 12 }} /> Filtros
              </button>
              <button
                onClick={() => setMobileView("map")}
                className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: ACCENT, color: "#fff" }}
              >
                <MapIcon style={{ width: 12, height: 12 }} /> Mapa
              </button>
            </div>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="md:hidden border-b">
              <PropertyFiltersBar
                filters={filters}
                onChange={setFilters}
                total={markers.length}
                showMapLink={false}
              />
            </div>
          )}

          {/* Card list */}
          <div
            ref={sidebarRef}
            className="flex-1 overflow-y-auto"
            style={{ overscrollBehavior: "contain" }}
          >
            {isLoading ? (
              // Skeleton loading
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : visibleMarkers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <MapPin style={{ width: 32, height: 32, marginBottom: 8, opacity: 0.3 }} />
                <p style={{ fontSize: 13 }}>
                  {filterByBounds ? "Sin propiedades en esta zona" : "Sin propiedades"}
                </p>
                {filterByBounds && (
                  <button
                    onClick={() => setFilterByBounds(false)}
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: ACCENT,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Ver todas
                  </button>
                )}
              </div>
            ) : (
              visibleMarkers.map((p) => (
                <div
                  key={p.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(p.id, el);
                    else cardRefs.current.delete(p.id);
                  }}
                >
                  <SidebarCard
                    property={p}
                    selected={selectedId === p.id}
                    onSelect={() => handleCardSelect(p)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── MAP ── */}
        <div
          className={`flex-1 relative ${
            mobileView === "map" ? "flex" : "hidden md:flex"
          } flex-col`}
          style={{ minWidth: 0 }}
        >
          {/* Mobile top bar */}
          <div
            className="md:hidden flex items-center justify-between px-3 py-2 border-b bg-white"
            style={{ flexShrink: 0 }}
          >
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "#f0f0f0", color: "#333" }}
            >
              <SlidersHorizontal style={{ width: 12, height: 12 }} /> Filtros
            </button>
            <span style={{ fontSize: 12, color: "#888" }}>{markers.length} propiedades</span>
            <button
              onClick={() => setMobileView("list")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "#111", color: "#fff" }}
            >
              <List style={{ width: 12, height: 12 }} /> Listado
            </button>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="md:hidden border-b bg-white">
              <PropertyFiltersBar
                filters={filters}
                onChange={setFilters}
                total={markers.length}
                showMapLink={false}
              />
            </div>
          )}

          {/* Map */}
          <MapContainer
            center={MDP_CENTER}
            zoom={13}
            style={{ flex: 1, width: "100%", height: "100%" }}
            zoomControl={true}
            preferCanvas={true}
            scrollWheelZoom={true}
            touchZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              maxZoom={19}
            />

            <FlyTo position={flyTarget} />
            <FitBoundsHelper markers={markers} trigger={fitBoundsTrigger} />
            <MapBoundsWatcher onBoundsChange={handleBoundsChange} />

            <MarkerClusterGroup
              iconCreateFunction={createClusterIcon}
              showCoverageOnHover={false}
              spiderfyOnMaxZoom={true}
              disableClusteringAtZoom={17}
              maxClusterRadius={60}
              animate={true}
              animateAddingMarkers={false}
            >
              {markers.map((p) =>
                p.lat && p.lng ? (
                  <Marker
                    key={p.id}
                    position={[p.lat, p.lng]}
                    icon={createPropertyIcon(p.tipo, selectedId === p.id)}
                    eventHandlers={{ click: () => handleMarkerClick(p) }}
                  >
                    <Popup>
                      <MapPopup property={p} />
                    </Popup>
                  </Marker>
                ) : null
              )}
            </MarkerClusterGroup>
          </MapContainer>

          {/* Map overlay controls */}
          <div
            style={{
              position: "absolute",
              bottom: 90,
              right: 12,
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <button
              onClick={handleGeolocate}
              title="Mi ubicación"
              className="map-overlay-btn"
              style={mapBtnStyle}
            >
              <Crosshair style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={handleFitAll}
              title="Ver todas las propiedades"
              className="map-overlay-btn"
              style={mapBtnStyle}
            >
              <Maximize style={{ width: 16, height: 16 }} />
            </button>
          </div>

          <WhatsAppFAB />
        </div>
      </div>
    </div>
  );
};

export default Mapa;
