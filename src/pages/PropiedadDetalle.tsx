import { useParams, Link } from "react-router-dom";
import { useState, useCallback, useEffect, useRef } from "react";
import { externalSupabase } from "@/lib/externalSupabase";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bed, Bath, Maximize, Car, PawPrint, CreditCard,
  MapPin, MessageCircle, Share2, ChevronLeft, ChevronRight, ImageOff, X,
  Home, DoorOpen,
} from "lucide-react";
import ScrollProgress from "@/components/ScrollProgress";
import Navigation from "@/components/sections/Navigation";
import PropertyCard from "@/components/PropertyCard";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/sections/Footer";
import { useProperty } from "@/hooks/useProperty";
import { useProperties } from "@/hooks/useProperties";
import { sanitizeBarrio } from "@/lib/utils";
import { whatsappLink, EASE, SITE_URL } from "@/lib/constants";
import { usePageMeta } from "@/hooks/usePageMeta";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ── helpers ── */
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

const goldIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/* ── Gallery with keyboard + touch ── */
function Gallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStartX = useRef(0);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape" && lightbox) setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, lightbox]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (images.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next(); else prev();
    }
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[520px] flex items-center justify-center" style={{ backgroundColor: "hsl(var(--muted))" }}>
        <ImageOff className="w-16 h-16 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <div
        className="relative w-full h-[400px] md:h-[520px] overflow-hidden group"
        style={{ backgroundColor: "hsl(var(--muted))" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[current]}
          alt={`${title} - ${current + 1}`}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-500"
          onClick={() => setLightbox(true)}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 30%)" }} />

        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/60 backdrop-blur-sm md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/60 backdrop-blur-sm md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 right-4 font-body text-xs px-3 py-1.5 bg-background/70 backdrop-blur-sm text-foreground">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-3 px-6 md:px-0 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-20 h-14 overflow-hidden transition-all ${
                i === current ? "ring-2 ring-primary opacity-100" : "opacity-50 hover:opacity-80"
              }`}
            >
              <img src={img} alt={`${title} - foto ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-background/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="absolute top-6 right-6 text-foreground" onClick={() => setLightbox(false)}>
            <X className="w-6 h-6" />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-card/60 backdrop-blur-sm">
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-card/60 backdrop-blur-sm">
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>
            </>
          )}
          <img
            src={images[current]}
            alt={`${title} - ${current + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-sm text-foreground/70">
            {current + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Feature Pill ── */
function FeaturePill({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 p-4" style={{ backgroundColor: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border))" }}>
      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
      <div>
        <p className="font-body text-[10px] uppercase tracking-wider text-text-muted">{label}</p>
        <p className="font-body font-semibold text-base text-foreground">{value}</p>
      </div>
    </div>
  );
}

/* ── Page ── */
const PropiedadDetalle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: property, isLoading, isError } = useProperty(slug);

  const images = property ? getAllImages(property.fotos) : [];
  const firstPhoto = images[0];

  usePageMeta({
    title: property
      ? `${property.titulo} en ${property.barrio || property.ciudad || "Mar del Plata"}`
      : "Propiedad",
    description:
      property?.descripcion?.slice(0, 155) ||
      `${property?.tipo || "Propiedad"} en ${property?.barrio || "Mar del Plata"}.${property?.dormitorios ? ` ${property.dormitorios} dormitorios.` : ""} Consultá con Analía Daconte.`,
    image: firstPhoto || undefined,
  });

  // JSON-LD: RealEstateListing
  useEffect(() => {
    if (!property) return;
    const imgs = getAllImages(property.fotos);
    const ld = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: property.titulo || "Propiedad",
      description: property.descripcion || `${property.tipo} en ${property.barrio || "Mar del Plata"}`,
      url: window.location.href,
      image: imgs.slice(0, 5),
      address: {
        "@type": "PostalAddress",
        streetAddress: property.direccion || undefined,
        addressLocality: property.ciudad || "Mar del Plata",
        addressRegion: "Buenos Aires",
        addressCountry: "AR",
      },
      ...(property.superficie_total && {
        floorSize: {
          "@type": "QuantitativeValue",
          value: property.superficie_total,
          unitCode: "MTK",
        },
      }),
      ...(property.dormitorios && { numberOfRooms: property.dormitorios }),
      ...(property.precio && {
        offers: {
          "@type": "Offer",
          price: property.precio,
          priceCurrency: property.moneda === "ARS" ? "ARS" : "USD",
          availability: "https://schema.org/InStock",
        },
      }),
      agent: {
        "@type": "RealEstateAgent",
        name: "Analía Daconte",
        url: "https://analiadaconte.lovable.app",
      },
    };
    let script = document.getElementById("property-ld") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "property-ld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ld);
    return () => { document.getElementById("property-ld")?.remove(); };
  }, [property]);

  // JSON-LD: BreadcrumbList
  useEffect(() => {
    if (!property) return;
    const ld = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Propiedades", item: `${SITE_URL}/propiedades` },
        { "@type": "ListItem", position: 3, name: property.titulo || "Propiedad" },
      ],
    };
    let script = document.getElementById("breadcrumb-ld") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "breadcrumb-ld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ld);
    return () => { document.getElementById("breadcrumb-ld")?.remove(); };
  }, [property]);

  // Registrar visita (silencioso, sin bloquear render)
  useEffect(() => {
    if (!property?.id) return;
    externalSupabase
      .from("property_views")
      .insert({ propiedad_id: property.id, path: window.location.pathname })
      .then(() => {});
  }, [property?.id]);

  const priceDisplay = property?.precio_texto || (property?.precio ? `${property.moneda || "USD"} ${property.precio.toLocaleString("es-AR")}` : "Consultar");
  const barrio = sanitizeBarrio(property?.barrio);
  const location = property ? [barrio, property.ciudad].filter(Boolean).join(", ") || "Mar del Plata" : "";

  // Similar properties
  const similarFilters = property ? {
    operacion: property.operacion || undefined,
    tipo: property.tipo || undefined,
    sort: "recientes" as const,
  } : { sort: "recientes" as const };
  const { data: similarData } = useProperties(similarFilters, 0);
  const similarProperties = (similarData?.properties || []).filter((p) => p.id !== property?.id).slice(0, 3);

  const [consultaNombre, setConsultaNombre] = useState("");
  const [consultaMensaje, setConsultaMensaje] = useState("");

  const handleConsultar = () => {
    const nombreTexto = consultaNombre.trim() || "un interesado";
    const mensajeTexto = consultaMensaje.trim()
      ? `\n\n${consultaMensaje.trim()}`
      : "";
    const msg = `Hola Analía, soy ${nombreTexto}.\nMe interesa la propiedad: ${property?.titulo} (${priceDisplay}) en ${location}.${mensajeTexto}`;
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: property?.titulo || "Propiedad", url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copiado al portapapeles");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />

      <Navigation />

      {isLoading ? (
        <div className="pt-24 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20">
          <div className="h-[520px] animate-pulse" style={{ backgroundColor: "hsl(var(--card))" }} />
        </div>
      ) : isError || !property ? (
        <div className="pt-24 text-center py-40">
          <p className="font-display text-2xl text-foreground mb-2">Propiedad no encontrada</p>
          <Link to="/propiedades" className="font-body text-sm text-primary hover:text-gold-light transition-colors">
            ← Volver al catálogo
          </Link>
        </div>
      ) : (
        <>
          {/* Back link */}
          <div className="pt-24 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <Link
              to="/propiedades"
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-text-secondary hover:text-primary transition-colors py-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al catálogo
            </Link>
          </div>

          {/* Gallery */}
          <div className="max-w-7xl mx-auto px-0 md:px-12 lg:px-20">
            <Gallery images={images} title={property.titulo || "Propiedad"} />
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main col */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {property.operacion && (
                      <span className="font-body text-[10px] uppercase tracking-wider px-3 py-1" style={{ backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
                        {property.operacion}
                      </span>
                    )}
                    {property.tipo && (
                      <span className="font-body text-[10px] uppercase tracking-wider px-3 py-1" style={{ backgroundColor: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                        {property.tipo}
                      </span>
                    )}
                    {property.apto_credito && (
                      <span className="font-body text-[10px] uppercase tracking-wider px-3 py-1 text-green-400" style={{ backgroundColor: "hsla(142,70%,49%,0.1)", border: "1px solid hsla(142,70%,49%,0.2)" }}>
                        Apto crédito
                      </span>
                    )}
                  </div>

                  <h1 className="font-display text-[clamp(28px,4vw,44px)] text-foreground leading-tight mb-2">
                    {property.titulo || "Sin título"}
                  </h1>

                  <p className="flex items-center gap-1.5 font-body text-sm text-text-secondary">
                    <MapPin className="w-4 h-4" /> {location}
                    {property.direccion && ` · ${property.direccion}`}
                  </p>
                </motion.div>

                {/* Price */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}>
                  <p className="font-display text-[clamp(32px,5vw,48px)] gold-gradient-text leading-none">{priceDisplay}</p>
                </motion.div>

                {/* Features grid */}
                <motion.div className="grid grid-cols-2 sm:grid-cols-3 gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}>
                  {(property.dormitorios ?? 0) > 0 && <FeaturePill icon={Bed} label="Dormitorios" value={property.dormitorios!} />}
                  {(property.ambientes ?? 0) > 0 && <FeaturePill icon={DoorOpen} label="Ambientes" value={property.ambientes!} />}
                  {(property.banos ?? 0) > 0 && <FeaturePill icon={Bath} label="Baños" value={property.banos!} />}
                  {property.superficie_total && <FeaturePill icon={Maximize} label="Sup. total" value={`${property.superficie_total} m²`} />}
                  {property.superficie_cubierta && <FeaturePill icon={Home} label="Sup. cubierta" value={`${property.superficie_cubierta} m²`} />}
                  {property.cochera && <FeaturePill icon={Car} label="Cochera" value="Sí" />}
                  {property.acepta_mascotas && <FeaturePill icon={PawPrint} label="Mascotas" value="Sí" />}
                  {property.apto_credito && <FeaturePill icon={CreditCard} label="Apto crédito" value="Sí" />}
                </motion.div>

                {/* Description */}
                {property.descripcion && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}>
                    <h2 className="font-display text-2xl text-foreground mb-4">Descripción</h2>
                    <div className="font-body text-sm text-text-secondary leading-relaxed whitespace-pre-line">{property.descripcion}</div>
                  </motion.div>
                )}

                {/* Map */}
                {property.lat && property.lng && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}>
                    <h2 className="font-display text-2xl text-foreground mb-4">Ubicación</h2>
                    <div className="h-[300px] overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
                      <MapContainer center={[Number(property.lat), Number(property.lng)]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                        <TileLayer attribution='&copy; <a href="https://carto.com/">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        <Marker position={[Number(property.lat), Number(property.lng)]} icon={goldIcon}>
                          <Popup><span style={{ color: "#333" }}>{property.titulo}</span></Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <motion.aside className="lg:col-span-1 space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}>
                <div className="lg:sticky lg:top-28 space-y-4">
                  {/* Mini form consulta WhatsApp */}
                  <div
                    className="p-5 space-y-4"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(160,80,220,0.15)",
                    }}
                  >
                    <p className="font-body text-[10px] uppercase tracking-wider text-text-muted">Consultá sobre esta propiedad</p>

                    {/* Propiedad seleccionada (solo visual) */}
                    <div
                      className="p-3 space-y-0.5"
                      style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid hsl(var(--border))" }}
                    >
                      <p className="font-body text-xs text-foreground leading-snug line-clamp-2">{property.titulo}</p>
                      <p className="font-body text-xs text-primary font-medium">{priceDisplay}</p>
                      {location && (
                        <p className="font-body text-[11px] text-text-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />{location}
                        </p>
                      )}
                    </div>

                    {/* Campo nombre */}
                    <input
                      type="text"
                      value={consultaNombre}
                      onChange={(e) => setConsultaNombre(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full font-body text-sm text-foreground placeholder:text-text-muted px-3 py-2.5 outline-none focus:border-primary/50 transition-colors"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />

                    {/* Campo mensaje */}
                    <textarea
                      value={consultaMensaje}
                      onChange={(e) => setConsultaMensaje(e.target.value)}
                      placeholder="¿Qué querés saber sobre esta propiedad?"
                      rows={3}
                      className="w-full font-body text-sm text-foreground placeholder:text-text-muted px-3 py-2.5 outline-none focus:border-primary/50 transition-colors resize-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />

                    {/* Botón enviar */}
                    <button
                      onClick={handleConsultar}
                      className="flex items-center justify-center gap-3 w-full font-body text-sm uppercase tracking-wider py-4 transition-all hover:brightness-110 active:scale-[0.98]"
                      style={{ backgroundColor: "hsl(var(--whatsapp))", color: "hsl(var(--primary-foreground))" }}
                    >
                      <MessageCircle className="w-4 h-4" /> Enviar consulta
                    </button>
                  </div>

                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-3 w-full font-body text-xs uppercase tracking-wider py-3 text-foreground transition-colors hover:text-primary"
                    style={{ border: "1px solid hsl(var(--border))" }}
                  >
                    <Share2 className="w-3.5 h-3.5" /> Compartir propiedad
                  </button>

                  <div className="p-5 space-y-3" style={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                    <p className="font-body text-[10px] uppercase tracking-wider text-text-muted">Código</p>
                    <p className="font-body text-sm text-foreground">{property.pixel_codigo || slug}</p>
                    {property.estado && (
                      <>
                        <p className="font-body text-[10px] uppercase tracking-wider text-text-muted mt-3">Estado</p>
                        <p className="font-body text-sm text-foreground">{property.estado}</p>
                      </>
                    )}
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>

          {/* Similar properties */}
          {similarProperties.length > 0 && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-16">
              <h2 className="font-display text-2xl text-foreground mb-6">Propiedades similares</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <WhatsAppFAB />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default PropiedadDetalle;
