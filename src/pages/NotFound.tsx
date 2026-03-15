import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";

const NotFound = () => {
  const location = useLocation();

  usePageMeta({
    title: "Página no encontrada",
    description: "La página que buscás no existe. Explorá nuestras propiedades en Mar del Plata.",
  });

  useEffect(() => {
    console.error("404: Ruta no encontrada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-6">
        <p className="font-body text-xs uppercase tracking-widest text-text-muted mb-4">Error 404</p>
        <h1 className="font-display text-[clamp(40px,6vw,72px)] text-foreground leading-tight mb-4">
          Página no encontrada
        </h1>
        <p className="font-body text-base text-text-secondary max-w-sm mx-auto mb-8">
          La dirección que ingresaste no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="font-body text-sm uppercase tracking-wider px-8 py-3 bg-primary text-primary-foreground hover:brightness-110 transition-all"
          >
            Ir al inicio
          </Link>
          <Link
            to="/propiedades"
            className="font-body text-sm uppercase tracking-wider px-8 py-3 text-primary"
            style={{ border: "1px solid hsl(var(--primary))" }}
          >
            Ver propiedades
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
