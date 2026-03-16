import { forwardRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, Car, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { Propiedad } from "@/lib/types";
import { sanitizeBarrio } from "@/lib/utils";

function getAllImages(fotos: unknown): string[] {
  if (!fotos) return [];
  let arr = fotos;
  if (typeof arr === "string") {
    try { arr = JSON.parse(arr); } catch { return []; }
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .map((f) => (typeof f === "string" ? f : f && typeof f === "object" && "url" in f ? (f as { url: string }).url : null))
    .filter(Boolean) as string[];
}

interface Props {
  property: Propiedad;
  className?: string;
}

const PropertyCardRow = forwardRef<HTMLDivElement, Props>(({ property, className = "" }, ref) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const images = getAllImages(property.fotos);
  const showPlaceholder = images.length === 0 || imgError;
  const slug = property.pixel_slug || String(property.id);

  const priceDisplay =
    property.precio_texto ||
    (property.precio ? `${property.moneda || "USD"} ${property.precio.toLocaleString("es-AR")}` : "Consultar");

  const barrio = sanitizeBarrio(property.barrio);
  const locationText = [barrio, property.ciudad].filter(Boolean).join(", ") || "Mar del Plata";

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setImgLoaded(false); setImgError(false);
    setCurrentImg((c) => (c - 1 + images.length) % images.length);
  };
  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setImgLoaded(false); setImgError(false);
    setCurrentImg((c) => (c + 1) % images.length);
  };

  return (
    <div
      ref={ref}
      className={`group relative flex overflow-hidden transition-[box-shadow,border-color,opacity] duration-200 ${className}`}
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
    >
      <Link to={`/propiedad/${slug}`} className="flex w-full">
        {/* Image */}
        <div className="relative w-[260px] flex-shrink-0 overflow-hidden" style={{ backgroundColor: "hsl(var(--muted))" }}>
          {showPlaceholder ? (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-8 h-8 text-muted-foreground/40" />
            </div>
          ) : (
            <>
              <img
                src={images[currentImg]}
                alt={[property.tipo, property.dormitorios ? `${property.dormitorios} dorm.` : null, property.barrio, "Mar del Plata"].filter(Boolean).join(", ")}
                className={`w-full h-full object-cover transition-[opacity,transform] duration-200 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                loading="lazy"
                onError={() => setImgError(true)}
                onLoad={() => setImgLoaded(true)}
              />
              {images.length > 1 && (
                <>
                  <img key={`pre-next-${(currentImg + 1) % images.length}`} src={images[(currentImg + 1) % images.length]} aria-hidden alt="" className="hidden" loading="eager" decoding="async" />
                  <img key={`pre-prev-${(currentImg - 1 + images.length) % images.length}`} src={images[(currentImg - 1 + images.length) % images.length]} aria-hidden alt="" className="hidden" loading="eager" decoding="async" />
                </>
              )}
            </>
          )}

          {images.length > 1 && (
            <>
              <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
              <span className="absolute top-3 right-3 font-body text-[10px] px-2 py-0.5 bg-background/60 backdrop-blur-sm text-foreground z-10">
                {currentImg + 1}/{images.length}
              </span>
            </>
          )}

          {property.operacion && (
            <span
              className="absolute top-3 left-3 font-body text-[10px] uppercase tracking-wider px-3 py-1 z-10"
              style={
                property.operacion.toLowerCase() === "venta"
                  ? { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
                  : { backgroundColor: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }
              }
            >
              {property.operacion.toUpperCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            {property.tipo && (
              <p className="font-body text-[10px] uppercase tracking-wider text-text-muted mb-1">{property.tipo}</p>
            )}
            <h3 className="font-display text-lg text-foreground mb-1 line-clamp-1">{property.titulo || "Sin título"}</h3>
            <p className="flex items-center gap-1 font-body text-xs text-text-muted mb-2">
              <MapPin className="w-3 h-3" /> {locationText}
            </p>
            {property.descripcion && (
              <p className="font-body text-xs text-text-secondary line-clamp-2 mb-3">{property.descripcion}</p>
            )}
          </div>

          <div className="flex items-end justify-between">
            <p className="font-display text-[22px] text-primary leading-none">{priceDisplay}</p>
            <div className="flex items-center gap-4 font-body text-xs text-text-secondary">
              {(property.dormitorios ?? 0) > 0 && (
                <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {property.dormitorios}</span>
              )}
              {(property.banos ?? 0) > 0 && (
                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.banos}</span>
              )}
              {property.superficie_total && (
                <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {property.superficie_total} m²</span>
              )}
              {property.cochera && (
                <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" /></span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

PropertyCardRow.displayName = "PropertyCardRow";
export default PropertyCardRow;
