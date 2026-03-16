import { useState } from "react";
import { Link } from "react-router-dom";
import { useProperties } from "@/hooks/useProperties";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  PlusCircle,
  Search,
  MoreHorizontal,
  Pencil,
  Eye,
  Trash2,
  MessageCircle,
  Copy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Propiedad } from "@/lib/types";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { toast } from "sonner";

const ESTADOS_COLOR: Record<string, string> = {
  Disponible: "bg-emerald-50 text-emerald-700",
  Alquilado: "bg-sky-50 text-sky-700",
  Vendido: "bg-gray-100 text-gray-500",
  Reservado: "bg-amber-50 text-amber-700",
};

const OPERACION_COLOR: Record<string, string> = {
  Venta: "bg-purple-50 text-purple-700",
  Alquiler: "bg-sky-50 text-sky-700",
  "Alquiler Temporario": "bg-orange-50 text-orange-700",
};

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

  const qc = useQueryClient();

  const { data, isLoading } = useProperties(
    {
      operacion: filters.operacion || undefined,
      tipo: filters.tipo || undefined,
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

  const formatPrecio = (p: Propiedad) => {
    if (!p.precio) return "—";
    const moneda = p.moneda === "USD" ? "U$D" : "$";
    return `${moneda} ${p.precio.toLocaleString("es-AR")}`;
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
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Buscar por título, dirección, barrio..."
            value={filters.searchText}
            onChange={(e) => { setFilters(f => ({ ...f, searchText: e.target.value })); setPage(0); }}
            className="pl-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-9 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400"
          />
        </div>

        <Select value={filters.operacion || "all"} onValueChange={(v) => { setFilters(f => ({ ...f, operacion: v === "all" ? "" : v })); setPage(0); }}>
          <SelectTrigger className="w-36 h-9 bg-white border-gray-200 text-gray-700 text-sm">
            <SelectValue placeholder="Operación" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-md">
            <SelectItem value="all" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Todas</SelectItem>
            <SelectItem value="Venta" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Venta</SelectItem>
            <SelectItem value="Alquiler" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Alquiler</SelectItem>
            <SelectItem value="Alquiler Temporario" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Temporario</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.tipo || "all"} onValueChange={(v) => { setFilters(f => ({ ...f, tipo: v === "all" ? "" : v })); setPage(0); }}>
          <SelectTrigger className="w-36 h-9 bg-white border-gray-200 text-gray-700 text-sm">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-md">
            <SelectItem value="all" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Todos</SelectItem>
            {["Departamento", "Casa", "PH", "Lote", "Local", "Oficina", "Chalet"].map(t => (
              <SelectItem key={t} value={t} className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sort} onValueChange={(v: any) => setFilters(f => ({ ...f, sort: v }))}>
          <SelectTrigger className="w-36 h-9 bg-white border-gray-200 text-gray-700 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-md">
            <SelectItem value="recientes" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Más recientes</SelectItem>
            <SelectItem value="precio_asc" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Precio ↑</SelectItem>
            <SelectItem value="precio_desc" className="text-gray-700 focus:bg-purple-50 focus:text-purple-700">Precio ↓</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent bg-gray-50">
              <TableHead className="text-gray-500 text-xs w-16">Foto</TableHead>
              <TableHead className="text-gray-500 text-xs">Propiedad</TableHead>
              <TableHead className="text-gray-500 text-xs w-24">Tipo</TableHead>
              <TableHead className="text-gray-500 text-xs w-24">Operación</TableHead>
              <TableHead className="text-gray-500 text-xs w-28">Precio</TableHead>
              <TableHead className="text-gray-500 text-xs w-24">Estado</TableHead>
              <TableHead className="text-gray-500 text-xs w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i} className="border-b border-gray-100">
                  <TableCell><div className="h-10 w-14 animate-pulse rounded bg-gray-100" /></TableCell>
                  <TableCell><div className="h-4 w-48 animate-pulse rounded bg-gray-100" /></TableCell>
                  <TableCell><div className="h-4 w-20 animate-pulse rounded bg-gray-100" /></TableCell>
                  <TableCell><div className="h-4 w-16 animate-pulse rounded bg-gray-100" /></TableCell>
                  <TableCell><div className="h-4 w-24 animate-pulse rounded bg-gray-100" /></TableCell>
                  <TableCell><div className="h-5 w-20 animate-pulse rounded bg-gray-100" /></TableCell>
                  <TableCell />
                </TableRow>
              ))
            ) : properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-12">
                  No se encontraron propiedades
                </TableCell>
              </TableRow>
            ) : (
              properties.map((p) => (
                <TableRow key={p.id} className="border-b border-gray-100 hover:bg-gray-50 group">
                  <TableCell>
                    <div className="h-10 w-14 rounded overflow-hidden bg-gray-100">
                      {p.fotos?.[0] ? (
                        <img src={p.fotos[0]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-300 text-xs">—</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 truncate max-w-xs">{p.titulo || "Sin título"}</p>
                      <p className="text-xs text-gray-400 truncate">{p.direccion} · {p.barrio}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500">{p.tipo || "—"}</span>
                  </TableCell>
                  <TableCell>
                    {p.operacion && (
                      <Badge className={`text-[10px] border-0 ${OPERACION_COLOR[p.operacion] ?? "bg-gray-100 text-gray-500"}`}>
                        {p.operacion}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700 whitespace-nowrap">{formatPrecio(p)}</span>
                  </TableCell>
                  <TableCell>
                    {p.estado && (
                      <Badge className={`text-[10px] border-0 ${ESTADOS_COLOR[p.estado] ?? "bg-gray-100 text-gray-500"}`}>
                        {p.estado}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-md w-44">
                        <DropdownMenuItem asChild className="text-gray-700 focus:text-gray-900 focus:bg-purple-50 cursor-pointer">
                          <Link to={`/admin/propiedades/${p.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />Editar
                          </Link>
                        </DropdownMenuItem>
                        {p.pixel_slug && (
                          <DropdownMenuItem asChild className="text-gray-700 focus:text-gray-900 focus:bg-purple-50 cursor-pointer">
                            <a href={`/propiedad/${p.pixel_slug}`} target="_blank" rel="noreferrer">
                              <Eye className="mr-2 h-4 w-4" />Ver en web
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleWA(p)}
                          className="text-gray-700 focus:text-gray-900 focus:bg-purple-50 cursor-pointer"
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => duplicarMutation.mutate(p)}
                          disabled={duplicarMutation.isPending}
                          className="text-gray-700 focus:text-gray-900 focus:bg-purple-50 cursor-pointer"
                        >
                          <Copy className="mr-2 h-4 w-4" />Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-100" />
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(p)}
                          className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
