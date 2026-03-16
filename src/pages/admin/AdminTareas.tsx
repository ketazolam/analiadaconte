import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
import {
  PlusCircle,
  CheckSquare,
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Tarea = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: "pendiente" | "en_progreso" | "completada";
  prioridad: "baja" | "normal" | "alta";
  propiedad_id: string | null;
  contacto_id: string | null;
  fecha_vencimiento: string | null;
  created_at: string;
};

const PRIORIDAD_COLORS: Record<string, string> = {
  alta: "bg-red-50 text-red-700",
  normal: "bg-blue-50 text-blue-700",
  baja: "bg-gray-100 text-gray-500",
};

const ESTADO_ICONS: Record<string, React.ElementType> = {
  pendiente: Circle,
  en_progreso: Clock,
  completada: CheckCircle2,
};

const KANBAN_COLS = [
  { key: "pendiente", label: "Pendiente", color: "border-gray-200" },
  { key: "en_progreso", label: "En Progreso", color: "border-blue-200" },
  { key: "completada", label: "Completada", color: "border-emerald-200" },
];

const EMPTY_TAREA = {
  titulo: "",
  descripcion: "",
  estado: "pendiente" as const,
  prioridad: "normal" as const,
  fecha_vencimiento: "",
};

function useTareas() {
  return useQuery({
    queryKey: ["admin-tareas"],
    queryFn: async () => {
      const { data, error } = await externalSupabase
        .from("tareas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as Tarea[]) || [];
    },
    staleTime: 30 * 1000,
  });
}

export default function AdminTareas() {
  const [view, setView] = useState<"lista" | "kanban">("lista");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTarea, setNewTarea] = useState(EMPTY_TAREA);

  const { data: tareas = [], isLoading } = useTareas();
  const qc = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (t: typeof EMPTY_TAREA) => {
      const { error } = await externalSupabase.from("tareas").insert({
        ...t,
        fecha_vencimiento: t.fecha_vencimiento || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tarea creada");
      qc.invalidateQueries({ queryKey: ["admin-tareas"] });
      setDialogOpen(false);
      setNewTarea(EMPTY_TAREA);
    },
    onError: () => toast.error("Error al crear tarea"),
  });

  const updateEstado = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: string }) => {
      await externalSupabase.from("tareas").update({ estado }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tareas"] }),
  });

  const filtradas = filtroEstado === "todos"
    ? tareas
    : tareas.filter(t => t.estado === filtroEstado);

  const pendientes = tareas.filter(t => t.estado === "pendiente").length;
  const enProgreso = tareas.filter(t => t.estado === "en_progreso").length;
  const completadas = tareas.filter(t => t.estado === "completada").length;

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Tareas</h1>
          <p className="text-sm text-gray-400">
            {pendientes} pendientes · {enProgreso} en progreso · {completadas} completadas
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md border border-gray-200 overflow-hidden">
            <button
              onClick={() => setView("lista")}
              className={`px-3 py-1.5 text-xs transition-colors ${view === "lista" ? "bg-purple-50 text-purple-700" : "text-gray-400 hover:text-gray-700"}`}
            >
              Lista
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 text-xs transition-colors ${view === "kanban" ? "bg-purple-50 text-purple-700" : "text-gray-400 hover:text-gray-700"}`}
            >
              Kanban
            </button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 h-8">
                <PlusCircle className="mr-2 h-3.5 w-3.5" />Nueva
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-900">
              <DialogHeader>
                <DialogTitle>Nueva tarea</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Título *</Label>
                  <Input value={newTarea.titulo} onChange={e => setNewTarea(t => ({ ...t, titulo: e.target.value }))} className="bg-white border-gray-200 text-gray-900 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Descripción</Label>
                  <Textarea value={newTarea.descripcion} onChange={e => setNewTarea(t => ({ ...t, descripcion: e.target.value }))} className="bg-white border-gray-200 text-gray-900 text-sm resize-none focus-visible:ring-purple-500/30 focus-visible:border-purple-400" rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Estado</Label>
                    <Select value={newTarea.estado} onValueChange={v => setNewTarea(t => ({ ...t, estado: v as any }))}>
                      <SelectTrigger className="bg-white border-gray-200 text-gray-700 h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-md">
                        <SelectItem value="pendiente" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Pendiente</SelectItem>
                        <SelectItem value="en_progreso" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">En progreso</SelectItem>
                        <SelectItem value="completada" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Completada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Prioridad</Label>
                    <Select value={newTarea.prioridad} onValueChange={v => setNewTarea(t => ({ ...t, prioridad: v as any }))}>
                      <SelectTrigger className="bg-white border-gray-200 text-gray-700 h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-md">
                        <SelectItem value="baja" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Baja</SelectItem>
                        <SelectItem value="normal" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Normal</SelectItem>
                        <SelectItem value="alta" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Fecha vencimiento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal h-8 text-sm bg-white border-gray-200 text-gray-900 hover:bg-gray-50">
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-gray-400" />
                        {newTarea.fecha_vencimiento
                          ? format(new Date(newTarea.fecha_vencimiento), "d 'de' MMM yyyy", { locale: es })
                          : <span className="text-gray-400">Sin fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newTarea.fecha_vencimiento ? new Date(newTarea.fecha_vencimiento) : undefined}
                        onSelect={(date) => setNewTarea(t => ({ ...t, fecha_vencimiento: date ? date.toISOString().split("T")[0] : "" }))}
                        locale={es}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button
                onClick={() => createMutation.mutate(newTarea)}
                disabled={!newTarea.titulo || createMutation.isPending}
                className="mt-2 bg-purple-600 hover:bg-purple-700"
              >
                {createMutation.isPending ? "Guardando..." : "Crear tarea"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Vista Lista */}
      {view === "lista" && (
        <>
          <div className="flex gap-2">
            {["todos", "pendiente", "en_progreso", "completada"].map(e => (
              <button
                key={e}
                onClick={() => setFiltroEstado(e)}
                className={`px-3 py-1.5 rounded text-xs transition-colors ${filtroEstado === e ? "bg-purple-50 text-purple-700" : "text-gray-400 hover:text-gray-700"}`}
              >
                {e === "todos" ? "Todos" : e === "en_progreso" ? "En progreso" : e.charAt(0).toUpperCase() + e.slice(1)}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
              ))
            ) : filtradas.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                No hay tareas
              </div>
            ) : (
              filtradas.map(t => <TareaRow key={t.id} tarea={t} onUpdateEstado={(e) => updateEstado.mutate({ id: t.id, estado: e })} />)
            )}
          </div>
        </>
      )}

      {/* Vista Kanban */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {KANBAN_COLS.map(col => {
            const colTareas = tareas.filter(t => t.estado === col.key);
            return (
              <div key={col.key} className={`rounded-lg border ${col.color} bg-gray-50 p-3 space-y-2`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">{col.label}</span>
                  <Badge className="text-[10px] bg-gray-100 text-gray-500 border-0 px-1.5 h-4">
                    {colTareas.length}
                  </Badge>
                </div>
                {colTareas.map(t => (
                  <Card key={t.id} className="bg-white border-gray-200 p-3 cursor-pointer hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 font-medium">{t.titulo}</p>
                        {t.descripcion && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{t.descripcion}</p>
                        )}
                      </div>
                      <Badge className={`text-[10px] border-0 shrink-0 ${PRIORIDAD_COLORS[t.prioridad]}`}>
                        {t.prioridad}
                      </Badge>
                    </div>
                    {t.fecha_vencimiento && (
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                        <CalendarIcon className="h-3 w-3" />
                        {format(new Date(t.fecha_vencimiento), "dd/MM/yyyy")}
                      </div>
                    )}
                  </Card>
                ))}
                {colTareas.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-300">Sin tareas</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TareaRow({ tarea: t, onUpdateEstado }: { tarea: Tarea; onUpdateEstado: (e: string) => void }) {
  const Icon = ESTADO_ICONS[t.estado] ?? Circle;
  const vencida = t.fecha_vencimiento && new Date(t.fecha_vencimiento) < new Date() && t.estado !== "completada";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-gray-300 transition-colors group">
      <button onClick={() => onUpdateEstado(t.estado === "completada" ? "pendiente" : t.estado === "pendiente" ? "en_progreso" : "completada")}>
        <Icon className={`h-4 w-4 ${t.estado === "completada" ? "text-emerald-500" : t.estado === "en_progreso" ? "text-blue-500" : "text-gray-300"}`} />
      </button>
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${t.estado === "completada" ? "line-through text-gray-400" : "text-gray-800"}`}>
          {t.titulo}
        </span>
        {t.descripcion && (
          <p className="text-xs text-gray-400 truncate">{t.descripcion}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge className={`text-[10px] border-0 ${PRIORIDAD_COLORS[t.prioridad]}`}>
          {t.prioridad}
        </Badge>
        {t.fecha_vencimiento && (
          <div className={`flex items-center gap-1 text-[10px] ${vencida ? "text-red-500" : "text-gray-400"}`}>
            {vencida && <AlertCircle className="h-3 w-3" />}
            <CalendarIcon className="h-3 w-3" />
            {format(new Date(t.fecha_vencimiento), "dd/MM")}
          </div>
        )}
      </div>
    </div>
  );
}
