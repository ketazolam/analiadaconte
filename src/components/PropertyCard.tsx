import { forwardRef, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, Car, ChevronLeft, ChevronRight, ImageOff, Heart } from "lucide-react";
import type { Propiedad } from "@/lib/types";
import { sanitizeBarrio } from "@/lib/utils";

interface PropertyCardProps {
  property: Propiedad;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

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

const PropertyCard = forwardRef<HTMLDivElement, PropertyCardProps>(
  ({ property, className = "", isFavorite = false, onToggleFavorite }, ref) => {
    const [imgError, setImgError] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [currentImg, setCurrentImg] = useState(0);

    const images = getAllImages(property.fotos);
    const showPlaceholder = images.length === 0 || imgError;
    const slug = property.pixel_slug || String(property.id);

    const barrio = sanitizeBarrio(property.barrio);

    // Touch swipe for mobile
    const touchStartX = useRef(0);
    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: React.TouchEvent) => {
      if (images.length <= 1) return;
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        e.preventDefault();
        setImgLoaded(false); setImgError(false);
        if (diff > 0) setCurrentImg((c) => (c + 1) % images.length);
        else setCurrentImg((c) => (c - 1 + images.length) % images.length);
      }
    };

    const priceDisplay =
      property.precio_texto ||
      (property.precio
        ? `${property.moneda || "USD"} ${property.precio.toLocaleString("es-AR")}`
        : "Consultar");

    const handleImgError = useCallback(() => setImgError(true), []);
    const handleImgLoad = useCallback(() => setImgLoaded(true), []);

    const prevImg = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setImgLoaded(false);
      setImgError(false);
      setCurrentImg((c) => (c - 1 + images.length) % images.length);
    };
    const nextImg = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setImgLoaded(false);
      setImgError(false);
      setCurrentImg((c) => (c + 1) % images.length);
    };

    const handleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleFavorite?.(property.id);
    };

    return (
      <div
        ref={ref}
        className={`group relative overflow-hidden transition-[box-shadow,border-color,opacity] duration-200 ${className}`}
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <Link to={`/propiedad/${slug}`} className="block">
          {/* Image */}
          <div className="relative h-[240px] overflow-hidden" style={{ backgroundColor: "hsl(var(--muted))" }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {showPlaceholder ? (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff className="w-10 h-10 text-muted-foreground/40" />
              </div>
            ) : (
              <>
                <img
                  src={images[currentImg]}
                  alt={[property.tipo, property.dormitorios ? `${property.dormitorios} dorm.` : null, property.barrio, "Mar del Plata"].filter(Boolean).join(", ")}
                  className={`w-full h-full object-cover transition-[opacity,transform] duration-200 group-hover:scale-105 ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={240}
                  onError={handleImgError}
                  onLoad={handleImgLoad}
                />
                {/* Precargar anterior y siguiente para navegación instantánea */}
                {images.length > 1 && (
                  <>
                    <img key={`pre-next-${(currentImg + 1) % images.length}`} src={images[(currentImg + 1) % images.length]} aria-hidden alt="" className="hidden" loading="eager" decoding="async" />
                    <img key={`pre-prev-${(currentImg - 1 + images.length) % images.length}`} src={images[(currentImg - 1 + images.length) % images.length]} aria-hidden alt="" className="hidden" loading="eager" decoding="async" />
                  </>
                )}
              </>
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(252,252,252,0.22) 0%, rgba(252,252,252,0.04) 35%, transparent 50%)" }}
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
                {/* Photo count */}
                <span className="absolute bottom-3 right-4 font-body text-[10px] px-2 py-0.5 bg-background/60 backdrop-blur-sm text-foreground z-10">
                  {currentImg + 1}/{images.length}
                </span>
              </>
            )}

            {/* Favorite button */}
            {onToggleFavorite && (
              <button
                onClick={handleFavorite}
                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: isFavorite ? "hsl(var(--primary))" : "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(8px)",
                }}
                aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${isFavorite ? "text-primary-foreground fill-primary-foreground" : "text-white"}`}
                />
              </button>
            )}

            {/* Badge */}
            {property.operacion && (
              <span
                className="absolute top-4 left-4 font-body text-[10px] uppercase tracking-wider px-3 py-1 z-10"
                style={
                  property.operacion.toLowerCase() === "venta"
                    ? { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
                    : { backgroundColor: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }
                }
              >
                {property.operacion.toUpperCase()}
              </span>
            )}

            {/* Price overlay */}
            <div className="absolute bottom-3 left-4 z-10">
              <span
                className="font-display text-[clamp(15px,3.5vw,20px)] leading-none px-3 py-1.5 inline-block"
                style={{ backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
              >
                {priceDisplay}
              </span>
            </div>

          </div>

          {/* Content */}
          <div className="p-5">
            {property.tipo && (
              <p className="font-body text-[10px] uppercase tracking-wider text-text-muted mb-1">{property.tipo}</p>
            )}
            <h3 className="font-display text-lg text-foreground mb-1 line-clamp-1">
              {property.titulo || "Sin título"}
            </h3>
            <p className="flex items-center gap-1 font-body text-xs text-text-muted mb-3">
              <MapPin className="w-3 h-3" />
              {[barrio, property.ciudad].filter(Boolean).join(", ") || "Mar del Plata"}
            </p>

            {/* Features row */}
            <div className="flex items-center gap-4 font-body text-xs text-text-secondary">
              {(property.dormitorios ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5" /> {property.dormitorios}
                </span>
              )}
              {(property.banos ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5" /> {property.banos}
                </span>
              )}
              {property.superficie_total && (
                <span className="flex items-center gap-1">
                  <Maximize className="w-3.5 h-3.5" /> {property.superficie_total} m²
                </span>
              )}
              {!property.superficie_total && property.superficie_cubierta && (
                <span>{property.superficie_cubierta} m² cub.</span>
              )}
              {property.cochera && (
                <span className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
