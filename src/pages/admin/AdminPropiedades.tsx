import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProperties } from "@/hooks/useProperties";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Pencil,
  Eye,
  Trash2,
  MessageCircle,
  Copy,
  FileText,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Propiedad } from "@/lib/types";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { toast } from "sonner";

const ESTADOS_COLOR: Record<string, string> = {
  disponible: "bg-emerald-50 text-emerald-700",
  alquilado: "bg-sky-50 text-sky-700",
  vendido: "bg-gray-100 text-gray-500",
  reservado: "bg-amber-50 text-amber-700",
  activa: "bg-emerald-50 text-emerald-700",
  activo: "bg-emerald-50 text-emerald-700",
  inactiva: "bg-gray-100 text-gray-500",
  inactivo: "bg-gray-100 text-gray-500",
};

const OPERACION_COLOR: Record<string, string> = {
  venta: "bg-purple-50 text-purple-700",
  alquiler: "bg-sky-50 text-sky-700",
  "alquiler temporario": "bg-orange-50 text-orange-700",
};

const getEstadoColor = (estado: string) =>
  ESTADOS_COLOR[estado?.toLowerCase()] ?? "bg-gray-100 text-gray-500";

const getOperacionColor = (op: string) =>
  OPERACION_COLOR[op?.toLowerCase()] ?? "bg-purple-50 text-purple-700";

export default function AdminPropiedades() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    operacion: "",
    tipo: "",
    estado: "",
    sort: "recientes" as const,
    searchText: "",
  });
  const [deleteTarget, setDeleteTarget] = useState<Propiedad | null>(null);
  const [editSheet, setEditSheet] = useState<Propiedad | null>(null);
  const navigate = useNavigate();

  const qc = useQueryClient();

  const { data, isLoading } = useProperties(
    {
      operacion: filters.operacion || undefined,
      tipos: filters.tipo ? [filters.tipo] : undefined,
      searchText: filters.searchText || undefined,
      sort: filters.sort,
    },
    page
  );

  const properties = data?.properties ?? [];
  const total = data?.total ?? 0;
  const PAGE_SIZE = 21;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const duplicarMutation = useMutation({
    mutationFn: async (p: Propiedad) => {
      const { id, pixel_slug, pixel_codigo, created_at, updated_at, last_scraped_at, url_original, ...rest } = p;
      const nuevo = { ...rest, titulo: `${p.titulo ?? "Propiedad"} (copia)`, estado: "Disponible" };
      const { error } = await externalSupabase.from("propiedades").insert(nuevo);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Propiedad duplicada");
      qc.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al duplicar"),
  });

  const { data: viewsData } = useQuery({
    queryKey: ["property-views-counts"],
    queryFn: async () => {
      const { data, error } = await externalSupabase
        .from("property_views")
        .select("propiedad_id");
      if (error) return {} as Record<number, number>;
      const counts: Record<number, number> = {};
      (data || []).forEach((r: any) => {
        counts[r.propiedad_id] = (counts[r.propiedad_id] || 0) + 1;
      });
      return counts;
    },
    staleTime: 60 * 1000,
  });

  const eliminarMutation = useMutation({
    mutationFn: async (p: Propiedad) => {
      const { error } = await externalSupabase.from("propiedades").delete().eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Propiedad eliminada");
      qc.invalidateQueries({ queryKey: ["properties"] });
      setDeleteTarget(null);
    },
    onError: (e: any) => toast.error(e.message ?? "Error al eliminar"),
  });

  const quickEditMutation = useMutation({
    mutationFn: async (p: Propiedad) => {
      const { error } = await externalSupabase.from("propiedades")
        .update({ estado: p.estado, precio: p.precio, destacada: p.destacada })
        .eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Propiedad actualizada");
      qc.invalidateQueries({ queryKey: ["properties"] });
      setEditSheet(null);
    },
    onError: (e: any) => toast.error(e.message ?? "Error al actualizar"),
  });

  const formatPrecio = (p: Propiedad) => {
    if (!p.precio) return "—";
    const moneda = p.moneda === "USD" ? "U$D" : "$";
    return `${moneda} ${p.precio.toLocaleString("es-AR")}`;
  };

  const generarPDF = (p: Propiedad) => {
    const moneda = p.moneda === "USD" ? "U$D" : "$";
    const precio = p.precio ? `${moneda} ${p.precio.toLocaleString("es-AR")}` : "A consultar";
    const detalles = [
      p.ambientes ? `${p.ambientes} amb.` : null,
      p.dormitorios ? `${p.dormitorios} dorm.` : null,
      p.banos ? `${p.banos} baños` : null,
      p.superficie_total ? `${p.superficie_total} m² tot.` : null,
      p.superficie_cubierta ? `${p.superficie_cubierta} m² cub.` : null,
    ].filter(Boolean).join(" · ");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;padding:40px;color:#1a1a1a;max-width:800px;margin:auto}
  h1{font-size:22px;color:#7c3aed;margin-bottom:4px}
  .sub{color:#666;font-size:13px;margin-bottom:20px}
  .precio{font-size:28px;font-weight:bold;color:#7c3aed;margin:12px 0}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:16px 0}
  .item{background:#f8f7fc;padding:8px 12px;border-radius:6px;font-size:12px}
  .item b{display:block;color:#666;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
  .desc{background:#f8f7fc;padding:16px;border-radius:8px;font-size:13px;line-height:1.7;white-space:pre-wrap;margin-top:16px}
  .foto{width:100%;max-height:300px;object-fit:cover;border-radius:8px;margin-bottom:16px}
  .footer{margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#999;text-align:center}
  @media print{button{display:none}}
</style></head><body>
${p.fotos?.[0] ? `<img src="${p.fotos[0]}" class="foto" />` : ""}
<h1>${p.titulo || "Propiedad"}</h1>
<div class="sub">${[p.tipo, p.operacion].filter(Boolean).join(" · ")} &nbsp;|&nbsp; ${p.direccion || ""}${p.barrio ? `, ${p.barrio}` : ""}${p.ciudad ? `, ${p.ciudad}` : ""}</div>
<div class="precio">${precio}</div>
<div class="grid">
  ${p.ambientes ? `<div class="item"><b>Ambientes</b>${p.ambientes}</div>` : ""}
  ${p.dormitorios ? `<div class="item"><b>Dormitorios</b>${p.dormitorios}</div>` : ""}
  ${p.banos ? `<div class="item"><b>Baños</b>${p.banos}</div>` : ""}
  ${p.toilets ? `<div class="item"><b>Toilets</b>${p.toilets}</div>` : ""}
  ${p.superficie_total ? `<div class="item"><b>Sup. total</b>${p.superficie_total} m²</div>` : ""}
  ${p.superficie_cubierta ? `<div class="item"><b>Sup. cubierta</b>${p.superficie_cubierta} m²</div>` : ""}
  ${(p as any).expensas ? `<div class="item"><b>Expensas</b>$${(p as any).expensas.toLocaleString("es-AR")}</div>` : ""}
  ${(p as any).antiguedad ? `<div class="item"><b>Antigüedad</b>${(p as any).antiguedad} años</div>` : ""}
  ${(p as any).orientacion ? `<div class="item"><b>Orientación</b>${(p as any).orientacion}</div>` : ""}
  ${(p as any).luminosidad ? `<div class="item"><b>Luminosidad</b>${(p as any).luminosidad}</div>` : ""}
  ${p.cochera ? `<div class="item"><b>Cochera</b>${(p as any).cobertura_cochera || "Sí"}</div>` : ""}
  ${p.apto_credito ? `<div class="item"><b>Apto crédito</b>Sí</div>` : ""}
  ${p.acepta_mascotas ? `<div class="item"><b>Mascotas</b>Sí</div>` : ""}
</div>
${p.descripcion ? `<div class="desc">${p.descripcion}</div>` : ""}
<div class="footer">Analía Daconte Propiedades · analiadacontepropiedades@gmail.com · 2233001242</div>
<script>window.onload=()=>window.print()</script>
</body></html>`;

    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  };

  const handleWA = (p: Propiedad) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola! Me interesa la propiedad: ${p.titulo} - ${p.direccion}`)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Propiedades</h1>
          <p className="text-sm text-gray-400">{total.toLocaleString("es-AR")} propiedades en total</p>
        </div>
        <Link to="/admin/propiedades/nueva">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-0 w-full sm:w-auto sm:min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Buscar por título, dirección, barrio..."
            value={filters.searchText}
            onChange={(e) => { setFilters(f => ({ ...f, searchText: e.target.value })); setPage(0); }}
            className="pl-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-9 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400 rounded-lg"
          />
        </div>

        <Select value={filters.operacion || "all"} onValueChange={(v) => { setFilters(f => ({ ...f, operacion: v === "all" ? "" : v })); setPage(0); }}>
          <SelectTrigger className="w-full sm:w-36 h-9 bg-white border-gray-200 text-gray-700 text-sm rounded-lg">
            <SelectValue placeholder="Operación" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
            <SelectItem value="all" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700 rounded-lg">Todas</SelectItem>
            <SelectItem value="Venta" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700 rounded-lg">Venta</SelectItem>
            <SelectItem value="Alquiler" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700 rounded-lg">Alquiler</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.tipo || "all"} onValueChange={(v) => { setFilters(f => ({ ...f, tipo: v === "all" ? "" : v })); setPage(0); }}>
          <SelectTrigger className="w-full sm:w-36 h-9 bg-white border-gray-200 text-gray-700 text-sm rounded-lg">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
            <SelectItem value="all" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700 rounded-lg">Todos</SelectItem>
            {["Departamento", "Casa", "PH", "Lote", "Local", "Oficina", "Chalet"].map(t => (
              <SelectItem key={t} value={t} className="text-gray-700 focus:bg-purple-50 focus:text-purple-700 rounded-lg">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sort} onValueChange={(v: any) => setFilters(f => ({ ...f, sort: v }))}>
          <SelectTrigger className="w-full sm:w-36 h-9 bg-white border-gray-200 text-gray-700 text-sm rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
            <SelectItem value="recientes" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700 rounded-lg">Más recientes</SelectItem>
            <SelectItem value="precio_asc" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700 rounded-lg">Precio ↑</SelectItem>
            <SelectItem value="precio_desc" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700 rounded-lg">Precio ↓</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent bg-gray-50/80">
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 w-16 pl-4">Foto</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Propiedad</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 w-28 hidden md:table-cell">Operación</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 w-28 hidden lg:table-cell">Precio</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 w-24 hidden md:table-cell">Estado</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 w-16 hidden lg:table-cell">Visitas</TableHead>
              <TableHead className="w-28 pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-b border-gray-50">
                  <TableCell className="pl-4"><div className="h-11 w-16 animate-pulse rounded-lg bg-gray-100" /></TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-52 animate-pulse rounded bg-gray-100" />
                      <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell"><div className="h-5 w-20 animate-pulse rounded-full bg-gray-100" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><div className="h-3.5 w-24 animate-pulse rounded bg-gray-100" /></TableCell>
                  <TableCell className="hidden md:table-cell"><div className="h-5 w-20 animate-pulse rounded-full bg-gray-100" /></TableCell>
                  <TableCell className="hidden lg:table-cell" />
                  <TableCell />
                </TableRow>
              ))
            ) : properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                      <Building2 className="h-7 w-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No se encontraron propiedades</p>
                    <p className="text-xs text-gray-400">Probá ajustando los filtros de búsqueda</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              properties.map((p) => (
                <TableRow key={p.id} className="border-b border-gray-50 hover:bg-purple-50/20 transition-colors duration-100 group">
                  <TableCell className="pl-4 py-3">
                    <div className="h-11 w-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {p.fotos?.[0] ? (
                        <img src={p.fotos[0]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                          <Building2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate max-w-xs leading-tight">{p.titulo || "Sin título"}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {[p.barrio, p.ciudad].filter(Boolean).join(", ") || p.direccion?.split(",")[0] || "—"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 hidden md:table-cell">
                    {p.operacion && (
                      <Badge className={`text-[10px] border-0 font-medium px-2 py-0.5 ${getOperacionColor(p.operacion)}`}>
                        {p.operacion}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 hidden lg:table-cell">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{formatPrecio(p)}</span>
                  </TableCell>
                  <TableCell className="py-3 hidden md:table-cell">
                    {p.estado && (
                      <Badge className={`text-[10px] border-0 font-medium px-2 py-0.5 ${getEstadoColor(p.estado)}`}>
                        {p.estado}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-400 font-medium">{(viewsData?.[p.id] ?? 0).toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="py-3 pr-4">
                    {/* Inline actions — visible on hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Edición rápida"
                        onClick={() => setEditSheet(p)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Duplicar"
                        onClick={() => duplicarMutation.mutate(p)}
                        disabled={duplicarMutation.isPending}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-lg rounded-xl w-44 p-1">
                          {p.pixel_slug && (
                            <DropdownMenuItem asChild className="text-gray-700 focus:text-gray-900 focus:bg-gray-50 rounded-lg cursor-pointer">
                              <a href={`/propiedad/${p.pixel_slug}`} target="_blank" rel="noreferrer">
                                <Eye className="mr-2 h-4 w-4" />Ver en web
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleWA(p)} className="text-gray-700 focus:text-gray-900 focus:bg-gray-50 rounded-lg cursor-pointer">
                            <MessageCircle className="mr-2 h-4 w-4" />WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => generarPDF(p)} className="text-gray-700 focus:text-gray-900 focus:bg-gray-50 rounded-lg cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />Exportar PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-100 my-1" />
                          <DropdownMenuItem onClick={() => setDeleteTarget(p)} className="text-red-500 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* AlertDialog Eliminar */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">¿Eliminar propiedad?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Esta acción no se puede deshacer. Se eliminará permanentemente la propiedad{" "}
              <span className="font-medium text-gray-700">"{deleteTarget?.titulo}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 text-gray-600 bg-white hover:bg-gray-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && eliminarMutation.mutate(deleteTarget)}
              disabled={eliminarMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {eliminarMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Edit Sheet */}
      <Sheet open={Boolean(editSheet)} onOpenChange={(o) => !o && setEditSheet(null)}>
        <SheetContent className="w-full sm:max-w-md bg-white border-gray-200">
          <SheetHeader className="pb-4 border-b border-gray-100">
            <SheetTitle className="text-base text-gray-800 truncate pr-6">{editSheet?.titulo ?? "Edición rápida"}</SheetTitle>
          </SheetHeader>
          <div className="py-5 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">Estado</Label>
              <Select
                value={editSheet?.estado ?? ""}
                onValueChange={v => setEditSheet(p => p ? { ...p, estado: v } : null)}
              >
                <SelectTrigger className="bg-white border-gray-200 text-gray-700 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                  {["Disponible", "Reservado", "Vendido", "Alquilado"].map(s => (
                    <SelectItem key={s} value={s} className="text-gray-700 focus:bg-purple-50 focus:text-purple-700 rounded-lg">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">Precio</Label>
              <div className="flex gap-2">
                <Select
                  value={editSheet?.moneda ?? "ARS"}
                  onValueChange={v => setEditSheet(p => p ? { ...p, moneda: v } : null)}
                >
                  <SelectTrigger className="w-20 bg-white border-gray-200 text-gray-700 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                    <SelectItem value="ARS" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700 rounded-lg">ARS</SelectItem>
                    <SelectItem value="USD" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700 rounded-lg">USD</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={editSheet?.precio ?? ""}
                  onChange={e => setEditSheet(p => p ? { ...p, precio: Number(e.target.value) || null } : null)}
                  className="flex-1 bg-white border-gray-200 text-gray-900 h-9 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400"
                  placeholder="Precio"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 py-1">
              <Checkbox
                id="destacada"
                checked={!!editSheet?.destacada}
                onCheckedChange={v => setEditSheet(p => p ? { ...p, destacada: !!v } : null)}
                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <Label htmlFor="destacada" className="text-sm text-gray-700 cursor-pointer">Propiedad destacada</Label>
            </div>
          </div>
          <SheetFooter className="gap-2 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              className="flex-1 border-gray-200 text-gray-600"
              onClick={() => navigate(`/admin/propiedades/${editSheet?.id}`)}
            >
              Editar completo →
            </Button>
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={() => editSheet && quickEditMutation.mutate(editSheet)}
              disabled={quickEditMutation.isPending}
            >
              {quickEditMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} de {total.toLocaleString("es-AR")}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-gray-700"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-gray-600">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-gray-700"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
