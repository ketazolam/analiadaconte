import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Mail,
  MailOpen,
  MessageCircle,
  Building2,
  User,
  Globe,
  ChevronRight,
} from "lucide-react";

type Mensaje = {
  id: string;
  contacto_id: string | null;
  propiedad_id: string | null;
  asunto: string;
  cuerpo: string;
  leido: boolean;
  origen: string;
  created_at: string;
  contactos?: { nombre: string; apellido: string; email: string; telefono: string } | null;
  propiedades?: { titulo: string; pixel_slug: string } | null;
};

const ORIGEN_COLORS: Record<string, string> = {
  zonaprop: "bg-purple-50 text-purple-700",
  mercadolibre: "bg-amber-50 text-amber-700",
  web: "bg-sky-50 text-sky-700",
  whatsapp: "bg-emerald-50 text-emerald-700",
};

function useMensajes() {
  return useQuery({
    queryKey: ["admin-mensajes"],
    queryFn: async () => {
      const { data, error } = await externalSupabase
        .from("mensajes")
        .select("*, contactos(nombre, apellido, email, telefono), propiedades(titulo, pixel_slug)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data as Mensaje[]) || [];
    },
    staleTime: 30 * 1000,
  });
}

export default function AdminMensajes() {
  const { data: mensajes = [], isLoading } = useMensajes();
  const [selected, setSelected] = useState<Mensaje | null>(null);
  const qc = useQueryClient();

  const marcarLeido = useMutation({
    mutationFn: async (id: string) => {
      await externalSupabase.from("mensajes").update({ leido: true }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-mensajes"] }),
  });

  const noLeidos = mensajes.filter(m => !m.leido).length;

  return (
    <div className="max-w-7xl">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-900">Mensajes</h1>
        {noLeidos > 0 && (
          <Badge className="bg-amber-50 text-amber-700 border-0">
            {noLeidos} sin leer
          </Badge>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Lista */}
        <div className="lg:col-span-2 space-y-1">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100" />
            ))
          ) : mensajes.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No hay mensajes
            </div>
          ) : (
            mensajes.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelected(m);
                  if (!m.leido) marcarLeido.mutate(m.id);
                }}
                className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
                  selected?.id === m.id
                    ? "border-purple-200 bg-purple-50"
                    : m.leido
                    ? "border-gray-100 bg-white hover:border-gray-200"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  {m.leido ? (
                    <MailOpen className="h-3.5 w-3.5 mt-0.5 text-gray-300 shrink-0" />
                  ) : (
                    <Mail className="h-3.5 w-3.5 mt-0.5 text-purple-500 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 justify-between">
                      <span className={`text-xs font-medium truncate ${m.leido ? "text-gray-500" : "text-gray-800"}`}>
                        {m.contactos ? `${m.contactos.nombre} ${m.contactos.apellido}` : "Desconocido"}
                      </span>
                      <span className="text-[10px] text-gray-300 shrink-0">
                        {format(new Date(m.created_at), "dd/MM", { locale: es })}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${m.leido ? "text-gray-400" : "text-gray-500"}`}>
                      {m.asunto || m.cuerpo?.slice(0, 60)}
                    </p>
                    {m.origen && (
                      <Badge className={`mt-1 text-[10px] border-0 px-1 py-0 ${ORIGEN_COLORS[m.origen] ?? "bg-gray-100 text-gray-400"}`}>
                        {m.origen}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detalle */}
        <div className="lg:col-span-3">
          {selected ? (
            <Card className="bg-white border-gray-200 p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-medium text-gray-900">{selected.asunto || "Sin asunto"}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {format(new Date(selected.created_at), "dd 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
                  </p>
                </div>
                {selected.origen && (
                  <Badge className={`text-[10px] border-0 shrink-0 ${ORIGEN_COLORS[selected.origen] ?? "bg-gray-100 text-gray-400"}`}>
                    <Globe className="h-2.5 w-2.5 mr-1" />
                    {selected.origen}
                  </Badge>
                )}
              </div>

              {/* Contacto vinculado */}
              {selected.contactos && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-sm text-purple-600">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      {selected.contactos.nombre} {selected.contactos.apellido}
                    </p>
                    <p className="text-xs text-gray-400">{selected.contactos.email} · {selected.contactos.telefono}</p>
                  </div>
                </div>
              )}

              {/* Propiedad vinculada */}
              {selected.propiedades && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500 flex-1 truncate">{selected.propiedades.titulo}</span>
                  {selected.propiedades.pixel_slug && (
                    <a
                      href={`/propiedad/${selected.propiedades.pixel_slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-500 hover:text-purple-600"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Cuerpo */}
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed min-h-32">
                {selected.cuerpo || "Sin contenido"}
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                {selected.contactos?.telefono && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-sm"
                    onClick={() => window.open(`https://wa.me/${selected.contactos!.telefono.replace(/\D/g, "")}`, "_blank")}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Responder por WhatsApp
                  </Button>
                )}
                {selected.contactos?.email && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-200 text-gray-600 hover:text-gray-900 bg-white"
                    onClick={() => window.open(`mailto:${selected.contactos!.email}?subject=Re: ${selected.asunto || "Tu consulta"}`, "_blank")}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="bg-white border-gray-200 flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <MailOpen className="h-8 w-8 text-gray-200 mx-auto" />
                <p className="text-sm text-gray-300">Seleccioná un mensaje</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
