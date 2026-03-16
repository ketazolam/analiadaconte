import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Mail, MailOpen, MessageCircle, Building2, User, Globe,
  Star, ChevronRight, Search, CheckSquare, Square, Send,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type Mensaje = {
  id: string;
  contacto_id: string | null;
  propiedad_id: string | null;
  asunto: string;
  cuerpo: string;
  leido: boolean;
  respondido: boolean;
  destacado: boolean;
  origen: string;
  created_at: string;
  contactos?: { nombre: string; apellido: string; email: string; telefono: string } | null;
  propiedades?: { titulo: string; pixel_slug: string } | null;
};

type TabValue = "todos" | "no_leido" | "interesado" | "no_respondido" | "respondido" | "destacado";

const ORIGEN_COLORS: Record<string, string> = {
  zonaprop: "bg-purple-50 text-purple-700",
  mercadolibre: "bg-amber-50 text-amber-700",
  web: "bg-sky-50 text-sky-700",
  whatsapp: "bg-emerald-50 text-emerald-700",
};

const PAGE_SIZE = 40;

function useMensajes(tab: TabValue, search: string) {
  return useQuery({
    queryKey: ["admin-mensajes", tab, search],
    queryFn: async () => {
      let q = externalSupabase
        .from("mensajes")
        .select("*, contactos(nombre, apellido, email, telefono), propiedades(titulo, pixel_slug)", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);

      if (tab === "no_leido") q = q.eq("leido", false);
      else if (tab === "no_respondido") q = q.eq("respondido", false).eq("leido", true);
      else if (tab === "respondido") q = q.eq("respondido", true);
      else if (tab === "destacado") q = q.eq("destacado", true);

      if (search) {
        q = q.or(`asunto.ilike.%${search}%,cuerpo.ilike.%${search}%`);
      }

      const { data, error, count } = await q;
      if (error) throw error;
      return { mensajes: (data as Mensaje[]) || [], total: count || 0 };
    },
    staleTime: 20 * 1000,
  });
}

function useCounts() {
  return useQuery({
    queryKey: ["admin-mensajes-counts"],
    queryFn: async () => {
      const [todos, noLeido, noRespondido, respondido, destacado] = await Promise.all([
        externalSupabase.from("mensajes").select("id", { count: "exact", head: true }),
        externalSupabase.from("mensajes").select("id", { count: "exact", head: true }).eq("leido", false),
        externalSupabase.from("mensajes").select("id", { count: "exact", head: true }).eq("respondido", false).eq("leido", true),
        externalSupabase.from("mensajes").select("id", { count: "exact", head: true }).eq("respondido", true),
        externalSupabase.from("mensajes").select("id", { count: "exact", head: true }).eq("destacado", true),
      ]);
      return {
        todos: todos.count || 0,
        no_leido: noLeido.count || 0,
        no_respondido: noRespondido.count || 0,
        respondido: respondido.count || 0,
        destacado: destacado.count || 0,
      };
    },
    staleTime: 30 * 1000,
  });
}

export default function AdminMensajes() {
  const [tab, setTab] = useState<TabValue>("todos");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState<Mensaje | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const qc = useQueryClient();

  const { data, isLoading } = useMensajes(tab, search);
  const { data: counts } = useCounts();
  const mensajes = data?.mensajes ?? [];

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-mensajes"] });
    qc.invalidateQueries({ queryKey: ["admin-mensajes-counts"] });
  };

  const marcarLeido = useMutation({
    mutationFn: async (ids: string[]) => {
      await externalSupabase.from("mensajes").update({ leido: true }).in("id", ids);
    },
    onSuccess: invalidate,
  });

  const marcarRespondido = useMutation({
    mutationFn: async (id: string) => {
      await externalSupabase.from("mensajes").update({ respondido: true, leido: true }).eq("id", id);
    },
    onSuccess: () => { invalidate(); toast.success("Marcado como respondido"); },
  });

  const toggleDestacado = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => {
      await externalSupabase.from("mensajes").update({ destacado: val }).eq("id", id);
    },
    onSuccess: invalidate,
  });

  const marcarLeidoMasivo = () => {
    if (!checked.size) return;
    marcarLeido.mutate(Array.from(checked));
    setChecked(new Set());
    toast.success(`${checked.size} mensajes marcados como leídos`);
  };

  const selectMensaje = (m: Mensaje) => {
    setSelected(m);
    if (!m.leido) marcarLeido.mutate([m.id]);
  };

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const TABS: { value: TabValue; label: string; countKey: keyof typeof counts }[] = [
    { value: "todos", label: "Todos", countKey: "todos" },
    { value: "no_leido", label: "Sin leer", countKey: "no_leido" },
    { value: "no_respondido", label: "No respondido", countKey: "no_respondido" },
    { value: "respondido", label: "Respondido", countKey: "respondido" },
    { value: "destacado", label: "Destacados", countKey: "destacado" },
  ];

  return (
    <div className="max-w-7xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Mensajes</h1>
          <p className="text-sm text-gray-400">{(counts?.todos ?? 0).toLocaleString("es-AR")} conversaciones en total</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={v => { setTab(v as TabValue); setSelected(null); }}>
        <TabsList className="bg-gray-50 border border-gray-100 rounded-xl p-0.5">
          {TABS.map(t => (
            <TabsTrigger key={t.value} value={t.value} className="text-xs data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              {t.label}
              {counts && (counts as any)[t.countKey] > 0 && (
                <Badge className={`ml-1.5 text-[10px] border-0 px-1 py-0 h-4 ${t.value === "no_leido" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"}`}>
                  {(counts as any)[t.countKey]}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search + actions masivas */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Buscar por asunto o contenido..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && setSearch(searchInput)}
            className="pl-9 bg-white border-gray-200 text-gray-900 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400"
          />
        </div>
        <Button size="sm" onClick={() => setSearch(searchInput)} className="h-8 bg-purple-600 hover:bg-purple-700">
          <Search className="h-3.5 w-3.5 mr-1" />Buscar
        </Button>
        {search && (
          <Button size="sm" variant="ghost" onClick={() => { setSearch(""); setSearchInput(""); }} className="h-8 text-gray-400 hover:text-gray-700">
            Limpiar
          </Button>
        )}
        {checked.size > 0 && (
          <Button size="sm" variant="outline" onClick={marcarLeidoMasivo} className="h-8 border-gray-200 text-gray-600 bg-white ml-2">
            <CheckSquare className="h-3.5 w-3.5 mr-1" />
            Marcar {checked.size} como leído
          </Button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Lista */}
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          {/* Cabecera tabla */}
          <div className="grid grid-cols-[24px_1fr_80px] items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider">
            <span />
            <span>Contacto / Asunto</span>
            <span className="text-right">Fecha</span>
          </div>

          <ScrollArea className="max-h-[calc(100vh-320px)]">
          <div className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse bg-gray-50 m-2 rounded" />
              ))
            ) : mensajes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                  <Mail className="h-6 w-6 text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">No hay mensajes</p>
                  <p className="text-xs text-gray-400 mt-0.5">Los mensajes del sitio aparecerán acá</p>
                </div>
              </div>
            ) : (
              mensajes.map(m => {
                const nombre = m.contactos ? `${m.contactos.nombre} ${m.contactos.apellido}`.trim() : "Desconocido";
                return (
                  <button
                    key={m.id}
                    onClick={() => selectMensaje(m)}
                    className={`w-full text-left px-3 py-2.5 transition-colors hover:bg-gray-50 ${selected?.id === m.id ? "bg-purple-50" : ""}`}
                  >
                    <div className="grid grid-cols-[24px_1fr_80px] items-start gap-2">
                      <div className="flex flex-col items-center gap-1 pt-0.5">
                        <button
                          onClick={e => { e.stopPropagation(); toggleCheck(m.id); }}
                          className="text-gray-300 hover:text-purple-500"
                        >
                          {checked.has(m.id) ? <CheckSquare className="h-3.5 w-3.5 text-purple-500" /> : <Square className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); toggleDestacado.mutate({ id: m.id, val: !m.destacado }); }}
                          className={m.destacado ? "text-amber-400" : "text-gray-200 hover:text-amber-300"}
                        >
                          <Star className="h-3 w-3" fill={m.destacado ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {!m.leido && <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />}
                          <span className={`text-xs truncate ${!m.leido ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                            {nombre}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 truncate">{m.asunto || m.cuerpo?.slice(0, 60)}</p>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {m.origen && (
                            <Badge className={`text-[9px] border-0 px-1 py-0 ${ORIGEN_COLORS[m.origen] ?? "bg-gray-100 text-gray-400"}`}>
                              {m.origen}
                            </Badge>
                          )}
                          {m.respondido && <Badge className="text-[9px] border-0 px-1 py-0 bg-emerald-50 text-emerald-600">Respondido</Badge>}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-300 text-right pt-0.5 shrink-0">
                        {format(new Date(m.created_at), "dd/MM HH:mm", { locale: es })}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
          </ScrollArea>
        </div>

        {/* Detalle */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">{selected.asunto || "Sin asunto"}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {format(new Date(selected.created_at), "dd 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {selected.origen && (
                    <Badge className={`text-[10px] border-0 ${ORIGEN_COLORS[selected.origen] ?? "bg-gray-100 text-gray-400"}`}>
                      <Globe className="h-2.5 w-2.5 mr-1" />{selected.origen}
                    </Badge>
                  )}
                  <button
                    onClick={() => toggleDestacado.mutate({ id: selected.id, val: !selected.destacado })}
                    className={`p-1 rounded ${selected.destacado ? "text-amber-400" : "text-gray-300 hover:text-amber-300"}`}
                  >
                    <Star className="h-4 w-4" fill={selected.destacado ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Contacto vinculado */}
              {selected.contactos && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-sm text-purple-600 shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {selected.contactos.nombre} {selected.contactos.apellido}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{selected.contactos.email} · {selected.contactos.telefono}</p>
                  </div>
                </div>
              )}

              {/* Propiedad vinculada */}
              {selected.propiedades && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50">
                  <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-600 flex-1 truncate">{selected.propiedades.titulo}</span>
                  {selected.propiedades.pixel_slug && (
                    <a href={`/propiedad/${selected.propiedades.pixel_slug}`} target="_blank" rel="noreferrer" className="text-purple-500 hover:text-purple-600">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Cuerpo */}
              <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed min-h-36 max-h-64 overflow-y-auto">
                {selected.cuerpo || "Sin contenido"}
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selected.contactos?.telefono && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      window.open(`https://wa.me/${selected.contactos!.telefono.replace(/\D/g, "")}`, "_blank");
                      marcarRespondido.mutate(selected.id);
                    }}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />WhatsApp
                  </Button>
                )}
                {selected.contactos?.email && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-200 text-gray-600 hover:text-gray-900 bg-white"
                    onClick={() => {
                      window.open(`mailto:${selected.contactos!.email}?subject=Re: ${selected.asunto || "Tu consulta"}`, "_blank");
                      marcarRespondido.mutate(selected.id);
                    }}
                  >
                    <Send className="mr-2 h-4 w-4" />Email
                  </Button>
                )}
                {!selected.respondido && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-200 text-gray-600 bg-white"
                    onClick={() => marcarRespondido.mutate(selected.id)}
                  >
                    <Mail className="mr-2 h-4 w-4" />Marcar respondido
                  </Button>
                )}
                {!selected.leido && (
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-700" onClick={() => marcarLeido.mutate([selected.id])}>
                    <MailOpen className="mr-2 h-4 w-4" />Marcar leído
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-white flex items-center justify-center h-64" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                  <MailOpen className="h-7 w-7 text-gray-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Seleccioná un mensaje</p>
                  <p className="text-xs text-gray-300 mt-0.5">El contenido aparecerá acá</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
