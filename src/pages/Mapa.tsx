import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
import { MessageCircle, MapPin, ImageOff } from "lucide-react";

/* Gold custom marker */
const goldIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.27 21.73 0 14 0z" fill="hsl(38,54%,50%)"/>
        <circle cx="14" cy="14" r="6" fill="hsl(38,54%,25%)"/>
      </svg>`
    ),
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -40],
});

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

const MDP_CENTER: [number, number] = [-38.0055, -57.5426];

const MapPopup = ({ property }: { property: Propiedad }) => {
  const img = getFirstImage(property.fotos);
  const price =
    property.precio_texto ||
    (property.precio
      ? `${property.moneda || "USD"} ${property.precio.toLocaleString("es-AR")}`
      : "Consultar");

  return (
    <div className="w-[220px] font-body">
      {img ? (
        <img src={img} alt="" className="w-full h-[120px] object-cover mb-2" loading="lazy" />
      ) : (
        <div className="w-full h-[120px] flex items-center justify-center mb-2" style={{ backgroundColor: "hsl(var(--muted))" }}>
          <ImageOff className="w-8 h-8 text-muted-foreground/40" />
        </div>
      )}
      <p className="font-display text-base text-primary leading-tight">{price}</p>
      <p className="text-xs text-foreground line-clamp-1 mt-1">{property.titulo || "Sin título"}</p>
      <p className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
        <MapPin className="w-3 h-3" />
        {property.barrio || "Mar del Plata"}
      </p>
      <a
        href={whatsappLink(`Hola Analía, me interesa: ${property.titulo} en ${property.barrio || "Mar del Plata"}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 mt-2 py-1.5 text-[10px] uppercase tracking-wider text-primary-foreground"
        style={{ backgroundColor: "hsl(var(--primary))" }}
      >
        <MessageCircle className="w-3 h-3" /> Consultar
      </a>
    </div>
  );
};

const Mapa = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<PropertyFilters>({
    operacion: searchParams.get("operacion") || undefined,
    sort: "recientes",
  });

  // Fetch all properties (large page to get coords)
  const { data } = useProperties(filters, 0);

  const markers = useMemo(() => {
    if (!data?.properties) return [];
    return data.properties.filter(
      (p) => p.lat != null && p.lng != null
    );
  }, [data]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <ScrollProgress />
      <CustomCursor />
      <Navigation />

      {/* Compact filter bar */}
      <div className="pt-[73px] z-40 relative">
        <PropertyFiltersBar
          filters={filters}
          onChange={(f) => setFilters(f)}
          total={data?.total}
          showMapLink={false}
        />
      </div>

      {/* Map */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={MDP_CENTER}
          zoom={13}
          className="w-full h-full"
          style={{ background: "hsl(var(--background))" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {markers.map((p) => (
            <Marker key={p.id} position={[p.lat!, p.lng!]} icon={goldIcon}>
              <Popup className="leaflet-popup-gold">
                <MapPopup property={p} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Marker count overlay */}
        <div
          className="absolute bottom-4 left-4 z-[1000] px-3 py-1.5 backdrop-blur-sm font-body text-xs text-foreground"
          style={{
            backgroundColor: "hsl(var(--bg-surface) / 0.85)",
            border: "1px solid hsl(var(--border))",
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
