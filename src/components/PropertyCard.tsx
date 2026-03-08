import { MapPin, Bed, Bath, Maximize, Car, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/constants";
import type { Propiedad } from "@/lib/types";

interface PropertyCardProps {
  property: Propiedad;
  className?: string;
}

const PropertyCard = ({ property, className = "" }: PropertyCardProps) => {
  const firstImage = property.fotos?.[0] || "/placeholder.svg";
  const priceDisplay = property.precio_texto || 
    (property.precio ? `${property.moneda || "USD"} ${property.precio.toLocaleString("es-AR")}` : "Consultar");

  return (
    <div
      className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${className}`}
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      {/* Image */}
      <div className="relative h-[240px] overflow-hidden">
        <img
          src={firstImage}
          alt={property.titulo || "Propiedad"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 60%)" }}
        />

        {/* Badge */}
        {property.operacion && (
          <span
            className="absolute top-4 left-4 font-body text-[10px] uppercase tracking-wider px-3 py-1"
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
        <div className="absolute bottom-3 left-4">
          <p className="font-display text-[26px] text-primary leading-none">{priceDisplay}</p>
        </div>

        {/* Surface overlay */}
        {property.superficie_total && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1 font-body text-xs text-foreground/80">
            <Maximize className="w-3 h-3" />
            {property.superficie_total} m²
          </div>
        )}
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
          {[property.barrio, property.ciudad].filter(Boolean).join(", ") || "Mar del Plata"}
        </p>

        {/* Features row */}
        <div className="flex items-center gap-4 font-body text-xs text-text-secondary mb-4">
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
          {property.superficie_cubierta && (
            <span>{property.superficie_cubierta} m² cub.</span>
          )}
          {property.cochera && (
            <span className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* WhatsApp CTA */}
        <a
          href={whatsappLink(`Hola Analía, me interesa la propiedad: ${property.titulo} en ${property.barrio || "Mar del Plata"}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full font-body text-xs uppercase tracking-wider py-3 text-primary-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: "hsl(var(--primary))" }}
        >
          <MessageCircle className="w-3.5 h-3.5" /> Consultar
        </a>
      </div>
    </div>
  );
};

export default PropertyCard;
