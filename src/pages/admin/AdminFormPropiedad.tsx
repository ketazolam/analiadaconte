import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react";
import { Propiedad } from "@/lib/types";

type FormData = {
  operacion: string;
  tipo: string;
  titulo: string;
  precio: string;
  moneda: string;
  estado: string;
  destacada: boolean;
  direccion: string;
  barrio: string;
  ciudad: string;
  lat: string;
  lng: string;
  ambientes: string;
  dormitorios: string;
  banos: string;
  toilets: string;
  superficie_total: string;
  superficie_cubierta: string;
  cochera: boolean;
  apto_credito: boolean;
  acepta_mascotas: boolean;
  descripcion: string;
  fotos: string[];
};

const EMPTY_FORM: FormData = {
  operacion: "",
  tipo: "",
  titulo: "",
  precio: "",
  moneda: "USD",
  estado: "Disponible",
  destacada: false,
  direccion: "",
  barrio: "",
  ciudad: "",
  lat: "",
  lng: "",
  ambientes: "",
  dormitorios: "",
  banos: "",
  toilets: "",
  superficie_total: "",
  superficie_cubierta: "",
  cochera: false,
  apto_credito: false,
  acepta_mascotas: false,
  descripcion: "",
  fotos: [],
};

function propiedadToForm(p: Propiedad): FormData {
  return {
    operacion: p.operacion ?? "",
    tipo: p.tipo ?? "",
    titulo: p.titulo ?? "",
    precio: p.precio != null ? String(p.precio) : "",
    moneda: p.moneda ?? "USD",
    estado: p.estado ?? "Disponible",
    destacada: p.destacada ?? false,
    direccion: p.direccion ?? "",
    barrio: p.barrio ?? "",
    ciudad: p.ciudad ?? "",
    lat: p.lat != null ? String(p.lat) : "",
    lng: p.lng != null ? String(p.lng) : "",
    ambientes: p.ambientes != null ? String(p.ambientes) : "",
    dormitorios: p.dormitorios != null ? String(p.dormitorios) : "",
    banos: p.banos != null ? String(p.banos) : "",
    toilets: p.toilets != null ? String(p.toilets) : "",
    superficie_total: p.superficie_total != null ? String(p.superficie_total) : "",
    superficie_cubierta: p.superficie_cubierta != null ? String(p.superficie_cubierta) : "",
    cochera: p.cochera ?? false,
    apto_credito: p.apto_credito ?? false,
    acepta_mascotas: p.acepta_mascotas ?? false,
    descripcion: p.descripcion ?? "",
    fotos: p.fotos ?? [],
  };
}

function formToPayload(f: FormData) {
  return {
    operacion: f.operacion || null,
    tipo: f.tipo || null,
    titulo: f.titulo || null,
    precio: f.precio ? Number(f.precio) : null,
    moneda: f.moneda || null,
    estado: f.estado || null,
    destacada: f.destacada,
    direccion: f.direccion || null,
    barrio: f.barrio || null,
    ciudad: f.ciudad || null,
    lat: f.lat ? Number(f.lat) : null,
    lng: f.lng ? Number(f.lng) : null,
    ambientes: f.ambientes ? Number(f.ambientes) : null,
    dormitorios: f.dormitorios ? Number(f.dormitorios) : null,
    banos: f.banos ? Number(f.banos) : null,
    toilets: f.toilets ? Number(f.toilets) : null,
    superficie_total: f.superficie_total ? Number(f.superficie_total) : null,
    superficie_cubierta: f.superficie_cubierta ? Number(f.superficie_cubierta) : null,
    cochera: f.cochera,
    apto_credito: f.apto_credito,
    acepta_mascotas: f.acepta_mascotas,
    descripcion: f.descripcion || null,
    fotos: f.fotos.filter(Boolean),
  };
}

const inputCls = "bg-white border-gray-200 text-gray-900 h-9 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400";
const labelCls = "text-xs text-gray-500";
const sectionCls = "rounded-lg border border-gray-200 bg-white p-4 space-y-3";

export default function AdminFormPropiedad() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [newFotoUrl, setNewFotoUrl] = useState("");

  const { data: propiedad, isLoading: loadingEdit } = useQuery({
    queryKey: ["propiedad-edit", id],
    queryFn: async () => {
      const { data, error } = await externalSupabase
        .from("propiedades")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Propiedad;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (propiedad) setForm(propiedadToForm(propiedad));
  }, [propiedad]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = formToPayload(form);
      if (isEdit) {
        const { error } = await externalSupabase
          .from("propiedades")
          .update(payload)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await externalSupabase
          .from("propiedades")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? "Propiedad actualizada" : "Propiedad creada");
      qc.invalidateQueries({ queryKey: ["properties"] });
      navigate("/admin/propiedades");
    },
    onError: (e: any) => toast.error(e.message ?? "Error al guardar"),
  });

  const set = (field: keyof FormData, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const addFoto = () => {
    const url = newFotoUrl.trim();
    if (!url) return;
    setForm((f) => ({ ...f, fotos: [...f.fotos, url] }));
    setNewFotoUrl("");
  };

  const removeFoto = (i: number) =>
    setForm((f) => ({ ...f, fotos: f.fotos.filter((_, idx) => idx !== i) }));

  if (isEdit && loadingEdit) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-700"
          onClick={() => navigate("/admin/propiedades")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Editar propiedad" : "Nueva propiedad"}
          </h1>
          <p className="text-xs text-gray-400">
            {isEdit ? `ID: ${id}` : "Completá los datos y guardá"}
          </p>
        </div>
      </div>

      {/* Básico */}
      <div className={sectionCls}>
        <h2 className="text-sm font-medium text-gray-700">Información básica</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className={labelCls}>Operación</Label>
            <Select value={form.operacion || "none"} onValueChange={(v) => set("operacion", v === "none" ? "" : v)}>
              <SelectTrigger className={`${inputCls} h-9`}>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                <SelectItem value="none" className="text-gray-400">—</SelectItem>
                <SelectItem value="Venta">Venta</SelectItem>
                <SelectItem value="Alquiler">Alquiler</SelectItem>
                <SelectItem value="Alquiler Temporario">Alquiler Temporario</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className={labelCls}>Tipo</Label>
            <Select value={form.tipo || "none"} onValueChange={(v) => set("tipo", v === "none" ? "" : v)}>
              <SelectTrigger className={`${inputCls} h-9`}>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                <SelectItem value="none" className="text-gray-400">—</SelectItem>
                {["Departamento", "Casa", "PH", "Lote", "Local", "Oficina", "Chalet"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={labelCls}>Título</Label>
            <Input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1">
            <Label className={labelCls}>Precio</Label>
            <Input type="number" value={form.precio} onChange={(e) => set("precio", e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1">
            <Label className={labelCls}>Moneda</Label>
            <Select value={form.moneda} onValueChange={(v) => set("moneda", v)}>
              <SelectTrigger className={`${inputCls} h-9`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="ARS">ARS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className={labelCls}>Estado</Label>
            <Select value={form.estado} onValueChange={(v) => set("estado", v)}>
              <SelectTrigger className={`${inputCls} h-9`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                <SelectItem value="Disponible">Disponible</SelectItem>
                <SelectItem value="Reservado">Reservado</SelectItem>
                <SelectItem value="Vendido">Vendido</SelectItem>
                <SelectItem value="Alquilado">Alquilado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-5">
            <Checkbox
              id="destacada"
              checked={form.destacada}
              onCheckedChange={(v) => set("destacada", Boolean(v))}
              className="border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <Label htmlFor="destacada" className={labelCls}>Destacada</Label>
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className={sectionCls}>
        <h2 className="text-sm font-medium text-gray-700">Ubicación</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1">
            <Label className={labelCls}>Dirección</Label>
            <Input value={form.direccion} onChange={(e) => set("direccion", e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1">
            <Label className={labelCls}>Barrio</Label>
            <Input value={form.barrio} onChange={(e) => set("barrio", e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1">
            <Label className={labelCls}>Ciudad</Label>
            <Input value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1">
            <Label className={labelCls}>Latitud</Label>
            <Input type="number" step="any" value={form.lat} onChange={(e) => set("lat", e.target.value)} className={inputCls} />
          </div>
          <div className="space-y-1">
            <Label className={labelCls}>Longitud</Label>
            <Input type="number" step="any" value={form.lng} onChange={(e) => set("lng", e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Detalles */}
      <div className={sectionCls}>
        <h2 className="text-sm font-medium text-gray-700">Detalles</h2>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { field: "ambientes", label: "Ambientes" },
              { field: "dormitorios", label: "Dormitorios" },
              { field: "banos", label: "Baños" },
              { field: "toilets", label: "Toilets" },
              { field: "superficie_total", label: "Sup. total (m²)" },
              { field: "superficie_cubierta", label: "Sup. cubierta (m²)" },
            ] as { field: keyof FormData; label: string }[]
          ).map(({ field, label }) => (
            <div key={field} className="space-y-1">
              <Label className={labelCls}>{label}</Label>
              <Input
                type="number"
                value={form[field] as string}
                onChange={(e) => set(field, e.target.value)}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Extras */}
      <div className={sectionCls}>
        <h2 className="text-sm font-medium text-gray-700">Extras</h2>
        <div className="flex gap-6 flex-wrap">
          {(
            [
              { field: "cochera", label: "Cochera" },
              { field: "apto_credito", label: "Apto crédito" },
              { field: "acepta_mascotas", label: "Acepta mascotas" },
            ] as { field: keyof FormData; label: string }[]
          ).map(({ field, label }) => (
            <div key={field} className="flex items-center gap-2">
              <Checkbox
                id={field}
                checked={form[field] as boolean}
                onCheckedChange={(v) => set(field, Boolean(v))}
                className="border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <Label htmlFor={field} className={labelCls}>{label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <div className={sectionCls}>
        <h2 className="text-sm font-medium text-gray-700">Descripción</h2>
        <Textarea
          value={form.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          rows={5}
          className="bg-white border-gray-200 text-gray-900 text-sm resize-none focus-visible:ring-purple-500/30 focus-visible:border-purple-400"
        />
      </div>

      {/* Fotos */}
      <div className={sectionCls}>
        <h2 className="text-sm font-medium text-gray-700">Fotos (URLs)</h2>
        <div className="space-y-2">
          {form.fotos.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={url}
                onChange={(e) => {
                  const next = [...form.fotos];
                  next[i] = e.target.value;
                  setForm((f) => ({ ...f, fotos: next }));
                }}
                className={`${inputCls} flex-1 text-xs`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-300 hover:text-red-500"
                onClick={() => removeFoto(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              placeholder="https://..."
              value={newFotoUrl}
              onChange={(e) => setNewFotoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFoto()}
              className={`${inputCls} flex-1 text-xs`}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-200 text-gray-500 hover:text-purple-600 hover:border-purple-400"
              onClick={addFoto}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/propiedades")}
          className="border-gray-200 text-gray-600 hover:text-gray-900 bg-white"
        >
          Cancelar
        </Button>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : isEdit ? "Guardar cambios" : "Crear propiedad"}
        </Button>
      </div>
    </div>
  );
}
