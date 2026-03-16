import { useQuery } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, ShoppingBag, Radio, Network, Instagram, CheckCircle, XCircle, ExternalLink } from "lucide-react";

const PORTALES = [
  {
    key: "web",
    label: "Web propia",
    icon: Globe,
    url: "https://analiadaconte.com.ar/propiedades",
    color: "text-sky-500",
    filter: (p: any) => true,
  },
  {
    key: "mercadolibre",
    label: "MercadoLibre",
    icon: ShoppingBag,
    url: "https://mercadolibre.com.ar",
    color: "text-amber-500",
    filter: null,
  },
  {
    key: "zonaprop",
    label: "Zonaprop",
    icon: Radio,
    url: "https://zonaprop.com.ar",
    color: "text-purple-500",
    filter: null,
  },
  {
    key: "red_publica",
    label: "Red Pública",
    icon: Network,
    url: null,
    color: "text-emerald-500",
    filter: null,
  },
  {
    key: "red_privada",
    label: "Red Privada",
    icon: Network,
    url: null,
    color: "text-gray-400",
    filter: null,
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/analiadaconte",
    color: "text-pink-500",
    filter: null,
  },
];

const STATS: Record<string, { count: number; active: boolean }> = {
  web: { count: 221, active: true },
  mercadolibre: { count: 44, active: true },
  zonaprop: { count: 130, active: true },
  red_publica: { count: 122, active: true },
  red_privada: { count: 0, active: false },
  instagram: { count: 0, active: false },
};

function useWebPropiedades() {
  return useQuery({
    queryKey: ["admin-pub-web"],
    queryFn: async () => {
      const [publicadas, noPublicadas] = await Promise.all([
        externalSupabase.from("propiedades").select("id", { count: "exact", head: true }).eq("estado", "Disponible"),
        externalSupabase.from("propiedades").select("id", { count: "exact", head: true }).neq("estado", "Disponible"),
      ]);
      return {
        publicadas: publicadas.count || 0,
        noPublicadas: noPublicadas.count || 0,
      };
    },
  });
}

export default function AdminPublicaciones() {
  const { data: webStats } = useWebPropiedades();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Publicaciones</h1>
        <p className="text-sm text-gray-400">Estado de publicación en portales inmobiliarios</p>
      </div>

      {/* Cards de portales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PORTALES.map((portal) => {
          const stats = STATS[portal.key];
          const Icon = portal.icon;

          return (
            <Card key={portal.key} className="bg-white border-gray-200 p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${portal.color}`} />
                  <span className="text-sm font-medium text-gray-700">{portal.label}</span>
                </div>
                {stats.active ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-300" />
                )}
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold text-gray-900">
                    {portal.key === "web" && webStats ? webStats.publicadas : stats.count}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">propiedades publicadas</p>
                </div>
                <Badge className={`text-[10px] border-0 ${stats.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                  {stats.active ? "activo" : "sin integración"}
                </Badge>
              </div>

              {portal.url && (
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 mt-3 text-xs text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Ver portal
                </a>
              )}
            </Card>
          );
        })}
      </div>

      {/* Resumen web */}
      {webStats && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Estado en web propia</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="bg-white border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{webStats.publicadas}</p>
                  <p className="text-xs text-gray-400">Publicadas (Disponibles)</p>
                </div>
              </div>
            </Card>
            <Card className="bg-white border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-500">{webStats.noPublicadas}</p>
                  <p className="text-xs text-gray-400">Vendidas / Alquiladas / Inactivas</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
