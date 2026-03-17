import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";
import { Propiedad } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft, CheckCircle2, Pencil, Loader2,
  MapPin, Bed, Bath, Maximize, Home, DoorOpen, Car, CreditCard, PawPrint,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/* Draggable marker sub-component */
function DraggableMarker({
  position,
  onDragEnd,
}: {
  position: [number, number];
  onDragEnd: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const m = markerRef.current;
    if (m) {
      m.setLatLng(position);
    }
  }, [position]);

  return (
    <Marker
      position={position}
      icon={markerIcon}
      draggable
      ref={markerRef}
      eventHandlers={{
        dragend: () => {
          const m = markerRef.current;
          if (m) {
            const ll = m.getLatLng();
            onDragEnd(ll.lat, ll.lng);
          }
        },
      }}
    />
  );
}

/* Click-to-move handler */
function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const MDQ_CENTER: [number, number] = [-38.0055, -57.5426];

function SummaryItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}

function SummaryBadge({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
      <Icon className="h-3.5 w-3.5 text-purple-500" />
      {label}
    </span>
  );
}

export default function AdminAprobarPropiedad() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: property, isLoading } = useQuery({
    queryKey: ["propiedad-aprobar", id],
    queryFn: async () => {
      const { data, error } = await externalSupabase
        .from("propiedades")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Propiedad;
    },
    enabled: Boolean(id),
  });

  const hasCoords = Boolean(property?.lat && property?.lng);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (property?.lat && property?.lng) {
      setMarkerPos([Number(property.lat), Number(property.lng)]);
    }
  }, [property?.lat, property?.lng]);

  const handleMoveMarker = (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    setDirty(true);
  };

  const saveCoordsAndApprove = useMutation({
    mutationFn: async () => {
      if (dirty && markerPos) {
        const { error } = await externalSupabase
          .from("propiedades")
          .update({ lat: markerPos[0], lng: markerPos[1] })
          .eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Propiedad aprobada correctamente");
      qc.invalidateQueries({ queryKey: ["properties"] });
      navigate("/admin/propiedades");
    },
    onError: (e: any) => toast.error(e.message ?? "Error al aprobar"),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Propiedad no encontrada</p>
      </div>
    );
  }

  const priceDisplay = property.precio_texto || (property.precio ? `${property.moneda || "USD"} ${property.precio.toLocaleString("es-AR")}` : "Consultar");
  const location = [property.barrio, property.ciudad].filter(Boolean).join(", ") || "Mar del Plata";
  const center: [number, number] = markerPos || (hasCoords ? [Number(property.lat), Number(property.lng)] : MDQ_CENTER);

  return (
    <div className="max-w-3xl pb-24">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => navigate("/admin/propiedades")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Aprobar propiedad</h1>
            <p className="text-xs text-gray-400">Revisá los datos antes de confirmar</p>
          </div>
        </div>

        {/* Summary card */}
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="bg-gray-50/80 border-b border-gray-100 px-5 py-3.5 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100">
              <CheckCircle2 className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800 leading-tight">Resumen de la propiedad</h2>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">Verificá que todo esté correcto</p>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Title + Price */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 leading-snug">{property.titulo || "Sin título"}</h3>
              <p className="text-xl font-bold text-purple-600 mt-1">{priceDisplay}</p>
            </div>

            {/* Badges: operacion + tipo + estado */}
            <div className="flex flex-wrap gap-2">
              {property.operacion && (
                <span className="text-xs font-medium text-white bg-purple-600 px-2.5 py-1 rounded-full">{property.operacion}</span>
              )}
              {property.tipo && (
                <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">{property.tipo}</span>
              )}
              {property.estado && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{property.estado}</span>
              )}
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p>{property.direccion || "Sin dirección"}</p>
                <p className="text-gray-400 text-xs">{location}</p>
              </div>
            </div>

            {/* Features badges */}
            <div className="flex flex-wrap gap-2">
              {(property.dormitorios ?? 0) > 0 && <SummaryBadge icon={Bed} label={`${property.dormitorios} dorm.`} />}
              {(property.ambientes ?? 0) > 0 && <SummaryBadge icon={DoorOpen} label={`${property.ambientes} amb.`} />}
              {(property.banos ?? 0) > 0 && <SummaryBadge icon={Bath} label={`${property.banos} baño${property.banos! > 1 ? "s" : ""}`} />}
              {property.superficie_total && <SummaryBadge icon={Maximize} label={`${property.superficie_total} m² tot.`} />}
              {property.superficie_cubierta && <SummaryBadge icon={Home} label={`${property.superficie_cubierta} m² cub.`} />}
              {property.cochera && <SummaryBadge icon={Car} label="Cochera" />}
              {property.apto_credito && <SummaryBadge icon={CreditCard} label="Apto crédito" />}
              {property.acepta_mascotas && <SummaryBadge icon={PawPrint} label="Mascotas" />}
            </div>

            {/* Description preview */}
            {property.descripcion && (
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Descripción</p>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{property.descripcion}</p>
              </div>
            )}
          </div>
        </div>

        {/* Map card */}
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="bg-gray-50/80 border-b border-gray-100 px-5 py-3.5 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800 leading-tight">Ubicación en el mapa</h2>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
                Arrastrá el marcador o hacé click en el mapa para corregir la ubicación sin cambiar la dirección
              </p>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {!hasCoords && !markerPos && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
                Esta propiedad no tiene coordenadas. Hacé click en el mapa para ubicarla.
              </div>
            )}

            <div className="h-[380px] rounded-lg overflow-hidden border border-gray-200">
              <MapContainer
                center={center}
                zoom={hasCoords ? 15 : 13}
                scrollWheelZoom
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <ClickHandler onClick={handleMoveMarker} />
                {markerPos && (
                  <DraggableMarker position={markerPos} onDragEnd={handleMoveMarker} />
                )}
              </MapContainer>
            </div>

            {/* Coords display */}
            {markerPos && (
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Lat: <strong className="text-gray-700">{markerPos[0].toFixed(6)}</strong></span>
                <span>Lng: <strong className="text-gray-700">{markerPos[1].toFixed(6)}</strong></span>
                {dirty && (
                  <span className="text-amber-600 font-medium ml-auto">Ubicación modificada</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 flex items-center justify-end gap-3"
        style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.06)" }}
      >
        <p className="text-xs text-gray-400 mr-auto hidden sm:block">
          Propiedad #{id} &mdash; {property.titulo}
        </p>
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/propiedades/${id}`)}
          className="border-gray-200 text-gray-600 hover:text-gray-900 bg-white rounded-lg h-9 gap-2"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Button>
        <Button
          onClick={() => saveCoordsAndApprove.mutate()}
          disabled={saveCoordsAndApprove.isPending}
          className="bg-emerald-600 hover:bg-emerald-700 rounded-lg h-9 gap-2"
        >
          {saveCoordsAndApprove.isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Aprobando...</>
          ) : (
            <><CheckCircle2 className="h-4 w-4" />Aprobar</>
          )}
        </Button>
      </div>
    </div>
  );
}
