import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  Search,
  Eye,
  MessageCircle,
  Edit,
  Download,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

type Contacto = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  estado: string;
  origen: string;
  propiedad_id: string | null;
  notas: string;
  created_at: string;
};

type TabValue = "todos" | "consulta" | "interesado" | "deshabilitado";

const ORIGEN_COLORS: Record<string, string> = {
  zonaprop: "bg-purple-50 text-purple-700",
  mercadolibre: "bg-amber-50 text-amber-700",
  web: "bg-sky-50 text-sky-700",
  whatsapp: "bg-emerald-50 text-emerald-700",
  manual: "bg-gray-100 text-gray-500",
};

const ESTADO_COLORS: Record<string, string> = {
  consulta: "bg-sky-50 text-sky-700",
  interesado: "bg-emerald-50 text-emerald-700",
  deshabilitado: "bg-gray-100 text-gray-400",
};

const PAGE_SIZE = 15;

function useContactos(tab: TabValue, page: number, search: { email: string; nombre: string; apellido: string; origen: string }) {
  return useQuery({
    queryKey: ["admin-contactos", tab, page, search],
    queryFn: async () => {
      let q = externalSupabase
        .from("contactos")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (tab !== "todos") q = q.eq("estado", tab);
      if (search.email) q = q.ilike("email", `%${search.email}%`);
      if (search.nombre) q = q.ilike("nombre", `%${search.nombre}%`);
      if (search.apellido) q = q.ilike("apellido", `%${search.apellido}%`);
      if (search.origen && search.origen !== "all") q = q.eq("origen", search.origen);

      const from = page * PAGE_SIZE;
      q = q.range(from, from + PAGE_SIZE - 1);

      const { data, error, count } = await q;
      if (error) throw error;
      return { contactos: (data as Contacto[]) || [], total: count || 0 };
    },
    staleTime: 30 * 1000,
  });
}

function useContactosCounts() {
  return useQuery({
    queryKey: ["admin-contactos-counts"],
    queryFn: async () => {
      const [todos, consulta, interesado, deshabilitado] = await Promise.all([
        externalSupabase.from("contactos").select("id", { count: "exact", head: true }),
        externalSupabase.from("contactos").select("id", { count: "exact", head: true }).eq("estado", "consulta"),
        externalSupabase.from("contactos").select("id", { count: "exact", head: true }).eq("estado", "interesado"),
        externalSupabase.from("contactos").select("id", { count: "exact", head: true }).eq("estado", "deshabilitado"),
      ]);
      return {
        todos: todos.count || 0,
        consulta: consulta.count || 0,
        interesado: interesado.count || 0,
        deshabilitado: deshabilitado.count || 0,
      };
    },
    staleTime: 60 * 1000,
  });
}

export default function AdminContactos() {
  const [tab, setTab] = useState<TabValue>("todos");
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState({ email: "", nombre: "", apellido: "", origen: "" });
  const [searchInput, setSearchInput] = useState({ email: "", nombre: "", apellido: "", origen: "" });
  const [newContacto, setNewContacto] = useState({ nombre: "", apellido: "", email: "", telefono: "", estado: "consulta", origen: "manual", notas: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useContactos(tab, page, search);
  const { data: counts } = useContactosCounts();
  const qc = useQueryClient();

  const contactos = data?.contactos ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const createMutation = useMutation({
    mutationFn: async (c: typeof newContacto) => {
      const { error } = await externalSupabase.from("contactos").insert(c);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Contacto creado");
      qc.invalidateQueries({ queryKey: ["admin-contactos"] });
      qc.invalidateQueries({ queryKey: ["admin-contactos-counts"] });
      setDialogOpen(false);
      setNewContacto({ nombre: "", apellido: "", email: "", telefono: "", estado: "consulta", origen: "manual", notas: "" });
    },
    onError: () => toast.error("Error al crear contacto"),
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(0);
  };

  const handleReset = () => {
    setSearchInput({ email: "", nombre: "", apellido: "", origen: "" });
    setSearch({ email: "", nombre: "", apellido: "", origen: "" });
    setPage(0);
  };

  const exportCSV = () => {
    if (!contactos.length) return;
    const headers = ["Nombre", "Apellido", "Email", "Teléfono", "Estado", "Origen", "Fecha"];
    const rows = contactos.map(c => [c.nombre, c.apellido, c.email, c.telefono, c.estado, c.origen, new Date(c.created_at).toLocaleDateString("es-AR")]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contactos-${tab}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Contactos</h1>
          <p className="text-sm text-gray-400">{(counts?.todos ?? 0).toLocaleString("es-AR")} contactos en total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="border-gray-200 text-gray-600 hover:text-gray-900 bg-white h-8">
            <Download className="mr-2 h-3.5 w-3.5" />Excel
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 h-8">
                <PlusCircle className="mr-2 h-3.5 w-3.5" />Crear
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-900">
              <DialogHeader>
                <DialogTitle>Nuevo contacto</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Nombre</Label>
                  <Input value={newContacto.nombre} onChange={e => setNewContacto(c => ({ ...c, nombre: e.target.value }))} className="bg-white border-gray-200 text-gray-900 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Apellido</Label>
                  <Input value={newContacto.apellido} onChange={e => setNewContacto(c => ({ ...c, apellido: e.target.value }))} className="bg-white border-gray-200 text-gray-900 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Email</Label>
                  <Input type="email" value={newContacto.email} onChange={e => setNewContacto(c => ({ ...c, email: e.target.value }))} className="bg-white border-gray-200 text-gray-900 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Teléfono</Label>
                  <Input value={newContacto.telefono} onChange={e => setNewContacto(c => ({ ...c, telefono: e.target.value }))} className="bg-white border-gray-200 text-gray-900 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Estado</Label>
                  <Select value={newContacto.estado} onValueChange={v => setNewContacto(c => ({ ...c, estado: v }))}>
                    <SelectTrigger className="bg-white border-gray-200 text-gray-700 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-md">
                      <SelectItem value="consulta" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Consulta</SelectItem>
                      <SelectItem value="interesado" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Interesado</SelectItem>
                      <SelectItem value="deshabilitado" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Origen</Label>
                  <Select value={newContacto.origen} onValueChange={v => setNewContacto(c => ({ ...c, origen: v }))}>
                    <SelectTrigger className="bg-white border-gray-200 text-gray-700 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-md">
                      <SelectItem value="manual" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Manual</SelectItem>
                      <SelectItem value="web" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Web</SelectItem>
                      <SelectItem value="zonaprop" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">ZonaProp</SelectItem>
                      <SelectItem value="mercadolibre" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">MercadoLibre</SelectItem>
                      <SelectItem value="whatsapp" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs text-gray-500">Notas</Label>
                  <Textarea value={newContacto.notas} onChange={e => setNewContacto(c => ({ ...c, notas: e.target.value }))} className="bg-white border-gray-200 text-gray-900 text-sm resize-none focus-visible:ring-purple-500/30 focus-visible:border-purple-400" rows={2} />
                </div>
              </div>
              <Button
                onClick={() => createMutation.mutate(newContacto)}
                disabled={createMutation.isPending}
                className="mt-2 bg-purple-600 hover:bg-purple-700"
              >
                {createMutation.isPending ? "Guardando..." : "Crear contacto"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => { setTab(v as TabValue); setPage(0); }}>
        <TabsList className="bg-gray-50 border border-gray-200">
          {[
            { value: "todos", label: "Todos", count: counts?.todos },
            { value: "consulta", label: "Consulta", count: counts?.consulta },
            { value: "interesado", label: "Interesado", count: counts?.interesado },
            { value: "deshabilitado", label: "Deshabilitados", count: counts?.deshabilitado },
          ].map(t => (
            <TabsTrigger key={t.value} value={t.value} className="text-xs data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              {t.label}
              {t.count !== undefined && (
                <Badge className="ml-1.5 text-[10px] bg-gray-100 text-gray-500 border-0 px-1 py-0 h-4">
                  {t.count.toLocaleString("es-AR")}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Email"
          value={searchInput.email}
          onChange={e => setSearchInput(s => ({ ...s, email: e.target.value }))}
          className="w-40 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400"
        />
        <Input
          placeholder="Nombre"
          value={searchInput.nombre}
          onChange={e => setSearchInput(s => ({ ...s, nombre: e.target.value }))}
          className="w-32 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400"
        />
        <Input
          placeholder="Apellido"
          value={searchInput.apellido}
          onChange={e => setSearchInput(s => ({ ...s, apellido: e.target.value }))}
          className="w-32 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400"
        />
        <Select value={searchInput.origen || "all"} onValueChange={v => setSearchInput(s => ({ ...s, origen: v === "all" ? "" : v }))}>
          <SelectTrigger className="w-36 h-8 bg-white border-gray-200 text-gray-700 text-sm">
            <SelectValue placeholder="Origen" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-md">
            <SelectItem value="all" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Todos los orígenes</SelectItem>
            <SelectItem value="zonaprop" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">ZonaProp</SelectItem>
            <SelectItem value="mercadolibre" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">MercadoLibre</SelectItem>
            <SelectItem value="web" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Web</SelectItem>
            <SelectItem value="whatsapp" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">WhatsApp</SelectItem>
            <SelectItem value="manual" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Manual</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={handleSearch} className="h-8 bg-purple-600 hover:bg-purple-700">
          <Search className="h-3.5 w-3.5 mr-1" />Buscar
        </Button>
        <Button size="sm" variant="ghost" onClick={handleReset} className="h-8 text-gray-400 hover:text-gray-700">
          Resetear
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100" />
          ))
        ) : contactos.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            No se encontraron contactos
          </div>
        ) : (
          contactos.map((c) => <ContactoCard key={c.id} contacto={c} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} de {total.toLocaleString("es-AR")} contactos
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-gray-600">{page + 1} / {totalPages}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactoCard({ contacto: c }: { contacto: Contacto }) {
  const qc = useQueryClient();
  const nombre = [c.nombre, c.apellido].filter(Boolean).join(" ") || "Sin nombre";
  const inicial = nombre.charAt(0).toUpperCase();
  const origenColor = ORIGEN_COLORS[c.origen?.toLowerCase()] ?? "bg-gray-100 text-gray-500";
  const estadoColor = ESTADO_COLORS[c.estado] ?? "bg-gray-100 text-gray-500";

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<Contacto>(c);

  const editMutation = useMutation({
    mutationFn: async (data: Partial<Contacto>) => {
      const { error } = await externalSupabase
        .from("contactos")
        .update(data)
        .eq("id", c.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Contacto actualizado");
      qc.invalidateQueries({ queryKey: ["admin-contactos"] });
      qc.invalidateQueries({ queryKey: ["admin-contactos-counts"] });
      setEditOpen(false);
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const inputCls = "bg-white border-gray-200 text-gray-900 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-gray-300 transition-colors group">
      {/* Avatar */}
      <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-600 shrink-0">
        {inicial}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-800 font-medium">{nombre}</span>
            <Badge className={`text-[10px] border-0 px-1.5 py-0 ${estadoColor}`}>
              {c.estado?.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 min-w-0">
          {c.email && (
            <span className="flex items-center gap-1 truncate">
              <Mail className="h-3 w-3 shrink-0" />{c.email}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {c.telefono && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Phone className="h-3 w-3" />{c.telefono}
            </span>
          )}
          {c.origen && (
            <Badge className={`text-[10px] border-0 px-1.5 py-0 flex items-center gap-1 ${origenColor}`}>
              <Globe className="h-2.5 w-2.5" />
              {c.origen}
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {c.telefono && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-300 hover:text-emerald-600"
            onClick={() => window.open(`https://wa.me/${c.telefono.replace(/\D/g, "")}`, "_blank")}
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </Button>
        )}
        <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (o) setEditData(c); }}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-700">
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-md">
            <DialogHeader>
              <DialogTitle>Editar contacto</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Nombre</Label>
                <Input value={editData.nombre} onChange={e => setEditData(d => ({ ...d, nombre: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Apellido</Label>
                <Input value={editData.apellido} onChange={e => setEditData(d => ({ ...d, apellido: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Email</Label>
                <Input type="email" value={editData.email} onChange={e => setEditData(d => ({ ...d, email: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Teléfono</Label>
                <Input value={editData.telefono} onChange={e => setEditData(d => ({ ...d, telefono: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Estado</Label>
                <Select value={editData.estado} onValueChange={v => setEditData(d => ({ ...d, estado: v }))}>
                  <SelectTrigger className={`${inputCls} h-8`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-md">
                    <SelectItem value="consulta">Consulta</SelectItem>
                    <SelectItem value="interesado">Interesado</SelectItem>
                    <SelectItem value="deshabilitado">Deshabilitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Origen</Label>
                <Select value={editData.origen} onValueChange={v => setEditData(d => ({ ...d, origen: v }))}>
                  <SelectTrigger className={`${inputCls} h-8`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-md">
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="zonaprop">ZonaProp</SelectItem>
                    <SelectItem value="mercadolibre">MercadoLibre</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs text-gray-500">Notas</Label>
                <Textarea value={editData.notas} onChange={e => setEditData(d => ({ ...d, notas: e.target.value }))} className="bg-white border-gray-200 text-gray-900 text-sm resize-none focus-visible:ring-purple-500/30 focus-visible:border-purple-400" rows={3} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setEditOpen(false)} className="border-gray-200 text-gray-600 bg-white">
                Cancelar
              </Button>
              <Button
                onClick={() => editMutation.mutate(editData)}
                disabled={editMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {editMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
