import React, { useState, useEffect } from "react";
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
import {
  ArrowLeft, Plus, X, Loader2,
  Lock, Info, MapPin, Ruler, Star, FileText, Image, Video,
} from "lucide-react";
import { Propiedad } from "@/lib/types";

type FormData = {
  // Básico
  operacion: string;
  tipo: string;
  titulo: string;
  precio: string;
  moneda: string;
  estado: string;
  estado_actual: string;
  destacada: boolean;
  no_publicar_precio: boolean;
  etiqueta: string;
  // Privado
  notas_privadas: string;
  // Ubicación
  direccion: string;
  barrio: string;
  ciudad: string;
  lat: string;
  lng: string;
  // Detalles
  ambientes: string;
  dormitorios: string;
  banos: string;
  toilets: string;
  superficie_total: string;
  superficie_cubierta: string;
  m2_descubiertos: string;
  m2_semicubiertos: string;
  antiguedad: string;
  cantidad_plantas: string;
  orientacion: string;
  luminosidad: string;
  expensas: string;
  // Booleanos extras
  cochera: boolean;
  cobertura_cochera: string;
  apto_credito: boolean;
  acepta_mascotas: boolean;
  a_estrenar: boolean;
  // Descripción
  descripcion: string;
  // Media
  fotos: string[];
  planos: string[];
  video_url: string;
  recorrido_360_proveedor: string;
  recorrido_360_codigo: string;
};

const EMPTY_FORM: FormData = {
  operacion: "", tipo: "", titulo: "", precio: "", moneda: "USD",
  estado: "Disponible", estado_actual: "", destacada: false, no_publicar_precio: false, etiqueta: "",
  notas_privadas: "",
  direccion: "", barrio: "", ciudad: "", lat: "", lng: "",
  ambientes: "", dormitorios: "", banos: "", toilets: "",
  superficie_total: "", superficie_cubierta: "", m2_descubiertos: "", m2_semicubiertos: "",
  antiguedad: "", cantidad_plantas: "", orientacion: "", luminosidad: "", expensas: "",
  cochera: false, cobertura_cochera: "", apto_credito: false, acepta_mascotas: false, a_estrenar: false,
  descripcion: "",
  fotos: [], planos: [], video_url: "", recorrido_360_proveedor: "", recorrido_360_codigo: "",
};

function propiedadToForm(p: Propiedad): FormData {
  const n = (v: number | null | undefined) => v != null ? String(v) : "";
  return {
    operacion: p.operacion ?? "", tipo: p.tipo ?? "", titulo: p.titulo ?? "",
    precio: n(p.precio), moneda: p.moneda ?? "USD",
    estado: p.estado ?? "Disponible", estado_actual: p.estado_actual ?? "",
    destacada: p.destacada ?? false, no_publicar_precio: p.no_publicar_precio ?? false,
    etiqueta: p.etiqueta ?? "", notas_privadas: p.notas_privadas ?? "",
    direccion: p.direccion ?? "", barrio: p.barrio ?? "", ciudad: p.ciudad ?? "",
    lat: n(p.lat), lng: n(p.lng),
    ambientes: n(p.ambientes), dormitorios: n(p.dormitorios), banos: n(p.banos), toilets: n(p.toilets),
    superficie_total: n(p.superficie_total), superficie_cubierta: n(p.superficie_cubierta),
    m2_descubiertos: n(p.m2_descubiertos), m2_semicubiertos: n(p.m2_semicubiertos),
    antiguedad: n(p.antiguedad), cantidad_plantas: n(p.cantidad_plantas),
    orientacion: p.orientacion ?? "", luminosidad: p.luminosidad ?? "",
    expensas: n(p.expensas),
    cochera: p.cochera ?? false, cobertura_cochera: p.cobertura_cochera ?? "",
    apto_credito: p.apto_credito ?? false, acepta_mascotas: p.acepta_mascotas ?? false,
    a_estrenar: p.a_estrenar ?? false,
    descripcion: p.descripcion ?? "",
    fotos: p.fotos ?? [], planos: p.planos ?? [],
    video_url: p.video_url ?? "", recorrido_360_proveedor: p.recorrido_360_proveedor ?? "",
    recorrido_360_codigo: p.recorrido_360_codigo ?? "",
  };
}

function formToPayload(f: FormData) {
  const num = (v: string) => v ? Number(v) : null;
  return {
    operacion: f.operacion || null, tipo: f.tipo || null, titulo: f.titulo || null,
    precio: num(f.precio), moneda: f.moneda || null,
    estado: f.estado || null, estado_actual: f.estado_actual || null,
    destacada: f.destacada, no_publicar_precio: f.no_publicar_precio,
    etiqueta: f.etiqueta || null, notas_privadas: f.notas_privadas || null,
    direccion: f.direccion || null, barrio: f.barrio || null, ciudad: f.ciudad || null,
    lat: num(f.lat), lng: num(f.lng),
    ambientes: num(f.ambientes), dormitorios: num(f.dormitorios),
    banos: num(f.banos), toilets: num(f.toilets),
    superficie_total: num(f.superficie_total), superficie_cubierta: num(f.superficie_cubierta),
    m2_descubiertos: num(f.m2_descubiertos), m2_semicubiertos: num(f.m2_semicubiertos),
    antiguedad: num(f.antiguedad), cantidad_plantas: num(f.cantidad_plantas),
    orientacion: f.orientacion || null, luminosidad: f.luminosidad || null,
    expensas: num(f.expensas),
    cochera: f.cochera, cobertura_cochera: f.cobertura_cochera || null,
    apto_credito: f.apto_credito, acepta_mascotas: f.acepta_mascotas, a_estrenar: f.a_estrenar,
    descripcion: f.descripcion || null,
    fotos: f.fotos.filter(Boolean),
    planos: f.planos.filter(Boolean),
    video_url: f.video_url || null,
    recorrido_360_proveedor: f.recorrido_360_proveedor || null,
    recorrido_360_codigo: f.recorrido_360_codigo || null,
  };
}

const ic = "bg-white border-gray-200 text-gray-900 h-9 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400 rounded-lg";
const lc = "text-[13px] font-medium text-gray-600";

function FormSection({
  icon: Icon,
  title,
  subtitle,
  iconBg = "bg-purple-100",
  iconColor = "text-purple-600",
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  iconBg?: string;
  iconColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="bg-gray-50/80 border-b border-gray-100 px-5 py-3.5 flex items-center gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800 leading-tight">{title}</h2>
          {subtitle && <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function FotoList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [newUrl, setNewUrl] = useState("");
  const add = () => { if (!newUrl.trim()) return; onChange([...items, newUrl.trim()]); setNewUrl(""); };
  return (
    <div className="space-y-2">
      {items.map((url, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input value={url} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }} className={`${ic} flex-1 text-xs`} />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-red-500" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Input placeholder={placeholder ?? "https://..."} value={newUrl} onChange={e => setNewUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} className={`${ic} flex-1 text-xs`} />
        <Button type="button" variant="outline" size="icon" className="h-8 w-8 border-gray-200 text-gray-500 hover:text-purple-600" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function AdminFormPropiedad() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  const { data: editData, isLoading: loadingEdit } = useQuery({
    queryKey: ["propiedad-edit", id],
    queryFn: async () => {
      const { data, error } = await externalSupabase.from("propiedades").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Propiedad;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (editData) setForm(propiedadToForm(editData));
  }, [editData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = formToPayload(form);
      if (isEdit) {
        const { error } = await externalSupabase.from("propiedades").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await externalSupabase.from("propiedades").insert(payload).select("id").single();
        if (error) throw error;
        return data as { id: number };
      }
    },
    onSuccess: (result) => {
      toast.success(isEdit ? "Propiedad actualizada" : "Propiedad creada");
      qc.invalidateQueries({ queryKey: ["properties"] });
      if (isEdit) {
        navigate("/admin/propiedades");
      } else {
        navigate(`/admin/propiedades/${(result as { id: number }).id}/aprobar`);
      }
    },
    onError: (e: any) => toast.error(e.message ?? "Error al guardar"),
  });

  const set = (field: keyof FormData, value: any) => setForm(f => ({ ...f, [field]: value }));

  if (isEdit && loadingEdit) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-purple-500" /></div>;
  }

  return (
    <div className="max-w-3xl pb-24">
      <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => navigate("/admin/propiedades")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{isEdit ? "Editar propiedad" : "Nueva propiedad"}</h1>
          <p className="text-xs text-gray-400">{isEdit ? `ID: ${id}` : "Completá los datos y guardá"}</p>
        </div>
      </div>

      {/* Notas privadas */}
      <FormSection icon={Lock} title="Notas privadas" subtitle="Solo visible en el panel de administración" iconBg="bg-amber-100" iconColor="text-amber-600">
        <Textarea value={form.notas_privadas} onChange={e => set("notas_privadas", e.target.value)} rows={2} placeholder="Observaciones internas, datos del propietario, comisión acordada..." className="bg-white border-gray-200 text-gray-900 text-sm resize-none focus-visible:ring-purple-500/30 focus-visible:border-purple-400 rounded-lg" />
      </FormSection>

      {/* Básico */}
      <FormSection icon={Info} title="Información básica">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className={lc}>Operación</Label>
            <Select value={form.operacion || "none"} onValueChange={v => set("operacion", v === "none" ? "" : v)}>
              <SelectTrigger className={`${ic} h-9`}><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                <SelectItem value="none" className="text-gray-400">—</SelectItem>
                {["Venta","Alquiler","Alquiler Temporario"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className={lc}>Tipo</Label>
            <Select value={form.tipo || "none"} onValueChange={v => set("tipo", v === "none" ? "" : v)}>
              <SelectTrigger className={`${ic} h-9`}><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                <SelectItem value="none" className="text-gray-400">—</SelectItem>
                {["Departamento","Casa","PH","Lote","Local","Oficina","Chalet","Duplex","Quinta"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1">
            <Label className={lc}>Título</Label>
            <Input value={form.titulo} onChange={e => set("titulo", e.target.value)} className={ic} />
          </div>
          <div className="space-y-1">
            <Label className={lc}>Precio</Label>
            <Input type="number" value={form.precio} onChange={e => set("precio", e.target.value)} className={ic} disabled={form.no_publicar_precio} />
          </div>
          <div className="space-y-1">
            <Label className={lc}>Moneda</Label>
            <Select value={form.moneda} onValueChange={v => set("moneda", v)}>
              <SelectTrigger className={`${ic} h-9`}><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="ARS">ARS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className={lc}>Estado</Label>
            <Select value={form.estado} onValueChange={v => set("estado", v)}>
              <SelectTrigger className={`${ic} h-9`}><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                {["Disponible","Reservado","Vendido","Alquilado"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className={lc}>Estado actual</Label>
            <Select value={form.estado_actual || "none"} onValueChange={v => set("estado_actual", v === "none" ? "" : v)}>
              <SelectTrigger className={`${ic} h-9`}><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                <SelectItem value="none" className="text-gray-400">—</SelectItem>
                {["En Venta","Para Venta","En Alquiler","Para Alquiler","Alquilado","Vendido"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className={lc}>Etiqueta</Label>
            <Select value={form.etiqueta || "none"} onValueChange={v => set("etiqueta", v === "none" ? "" : v)}>
              <SelectTrigger className={`${ic} h-9`}><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                <SelectItem value="none" className="text-gray-400">—</SelectItem>
                {["Espectacular","Oportunidad","Financiado","A estrenar","En pozo","Exclusiva"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className={lc}>Expensas</Label>
            <Input type="number" value={form.expensas} onChange={e => set("expensas", e.target.value)} placeholder="$ 0" className={ic} />
          </div>
          <div className="col-span-2 flex flex-wrap gap-4 pt-1">
            {[
              { field: "destacada", label: "Destacada" },
              { field: "no_publicar_precio", label: "No publicar precio" },
              { field: "a_estrenar", label: "A estrenar" },
            ].map(({ field, label }) => (
              <div key={field} className="flex items-center gap-2">
                <Checkbox id={field} checked={form[field as keyof FormData] as boolean} onCheckedChange={v => set(field as keyof FormData, Boolean(v))} className="border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" />
                <Label htmlFor={field} className={lc}>{label}</Label>
              </div>
            ))}
          </div>
        </div>
      </FormSection>

      {/* Ubicación */}
      <FormSection icon={MapPin} title="Ubicación">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1">
            <Label className={lc}>Dirección</Label>
            <Input value={form.direccion} onChange={e => set("direccion", e.target.value)} className={ic} />
          </div>
          <div className="space-y-1">
            <Label className={lc}>Barrio</Label>
            <Input value={form.barrio} onChange={e => set("barrio", e.target.value)} className={ic} />
          </div>
          <div className="space-y-1">
            <Label className={lc}>Ciudad</Label>
            <Input value={form.ciudad} onChange={e => set("ciudad", e.target.value)} className={ic} />
          </div>
          <div className="space-y-1">
            <Label className={lc}>Latitud</Label>
            <Input type="number" step="any" value={form.lat} onChange={e => set("lat", e.target.value)} className={ic} />
          </div>
          <div className="space-y-1">
            <Label className={lc}>Longitud</Label>
            <Input type="number" step="any" value={form.lng} onChange={e => set("lng", e.target.value)} className={ic} />
          </div>
        </div>
      </FormSection>

      {/* Detalles */}
      <FormSection icon={Ruler} title="Detalles" subtitle="Superficies, habitaciones, características">
        <div className="grid grid-cols-3 gap-3">
          {([
            ["ambientes","Ambientes"],["dormitorios","Dormitorios"],["banos","Baños"],
            ["toilets","Toilets"],["superficie_total","Sup. total m²"],["superficie_cubierta","Sup. cubierta m²"],
            ["m2_descubiertos","Sup. descubierta m²"],["m2_semicubiertos","Sup. semicubierta m²"],
            ["antiguedad","Antigüedad (años)"],["cantidad_plantas","Plantas"],
          ] as [keyof FormData, string][]).map(([field, label]) => (
            <div key={field} className="space-y-1">
              <Label className={lc}>{label}</Label>
              <Input type="number" value={form[field] as string} onChange={e => set(field, e.target.value)} className={ic} />
            </div>
          ))}
          <div className="space-y-1">
            <Label className={lc}>Orientación</Label>
            <Select value={form.orientacion || "none"} onValueChange={v => set("orientacion", v === "none" ? "" : v)}>
              <SelectTrigger className={`${ic} h-9`}><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                <SelectItem value="none" className="text-gray-400">—</SelectItem>
                {["Norte","Sur","Este","Oeste","Noreste","Noroeste","Sureste","Suroeste"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className={lc}>Luminosidad</Label>
            <Select value={form.luminosidad || "none"} onValueChange={v => set("luminosidad", v === "none" ? "" : v)}>
              <SelectTrigger className={`${ic} h-9`}><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-md">
                <SelectItem value="none" className="text-gray-400">—</SelectItem>
                {["Muy luminoso","Luminoso","Normal","Oscuro"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      {/* Extras */}
      <FormSection icon={Star} title="Extras" iconBg="bg-emerald-100" iconColor="text-emerald-600">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-wrap gap-4 col-span-2">
            {([["cochera","Cochera"],["apto_credito","Apto crédito"],["acepta_mascotas","Acepta mascotas"]] as [keyof FormData, string][]).map(([field, label]) => (
              <div key={field} className="flex items-center gap-2">
                <Checkbox id={field} checked={form[field] as boolean} onCheckedChange={v => set(field, Boolean(v))} className="border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" />
                <Label htmlFor={field} className={lc}>{label}</Label>
              </div>
            ))}
          </div>
          {form.cochera && (
            <div className="space-y-1">
              <Label className={lc}>Cobertura cochera</Label>
              <Select value={form.cobertura_cochera || "none"} onValueChange={v => set("cobertura_cochera", v === "none" ? "" : v)}>
                <SelectTrigger className={`${ic} h-9`}><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-md">
                  <SelectItem value="none" className="text-gray-400">—</SelectItem>
                  {["Cubierta","Descubierta","Semicubierta"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </FormSection>

      {/* Descripción */}
      <FormSection icon={FileText} title="Descripción pública" iconBg="bg-blue-100" iconColor="text-blue-600">
        <Textarea value={form.descripcion} onChange={e => set("descripcion", e.target.value)} rows={6} className="bg-white border-gray-200 text-gray-900 text-sm resize-none focus-visible:ring-purple-500/30 focus-visible:border-purple-400 rounded-lg" />
        <p className="text-[11px] text-gray-400 text-right">{form.descripcion.length} caracteres</p>
      </FormSection>

      {/* Fotos */}
      <FormSection icon={Image} title="Fotos" subtitle={`${form.fotos.length} imágenes agregadas`} iconBg="bg-purple-100" iconColor="text-purple-600">
        <FotoList items={form.fotos} onChange={v => set("fotos", v)} />
      </FormSection>

      {/* Planos */}
      <FormSection icon={FileText} title="Planos" subtitle={`${form.planos.length} planos agregados`} iconBg="bg-gray-100" iconColor="text-gray-600">
        <FotoList items={form.planos} onChange={v => set("planos", v)} placeholder="URL de imagen de plano..." />
      </FormSection>

      {/* Video y 360 */}
      <FormSection icon={Video} title="Video y Recorrido 360°" iconBg="bg-rose-100" iconColor="text-rose-600">
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1">
            <Label className={lc}>Video (YouTube / Vimeo URL)</Label>
            <Input value={form.video_url} onChange={e => set("video_url", e.target.value)} placeholder="https://youtube.com/watch?v=..." className={ic} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className={lc}>Proveedor 360°</Label>
              <Select value={form.recorrido_360_proveedor || "none"} onValueChange={v => set("recorrido_360_proveedor", v === "none" ? "" : v)}>
                <SelectTrigger className={`${ic} h-9`}><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-md">
                  <SelectItem value="none" className="text-gray-400">—</SelectItem>
                  {["Matterport","Kuula","360° Tours","Otro"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className={lc}>Código / URL 360°</Label>
              <Input value={form.recorrido_360_codigo} onChange={e => set("recorrido_360_codigo", e.target.value)} placeholder="Código embed o URL..." className={ic} />
            </div>
          </div>
        </div>
      </FormSection>

      </div>{/* end space-y-5 */}

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 flex items-center justify-end gap-3" style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.06)" }}>
        <p className="text-xs text-gray-400 mr-auto hidden sm:block">
          {isEdit ? `Editando propiedad #${id}` : "Nueva propiedad"}
        </p>
        <Button variant="outline" onClick={() => navigate("/admin/propiedades")} className="border-gray-200 text-gray-600 hover:text-gray-900 bg-white rounded-lg h-9">
          Cancelar
        </Button>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-purple-600 hover:bg-purple-700 rounded-lg h-9">
          {saveMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : isEdit ? "Guardar cambios" : "Crear propiedad"}
        </Button>
      </div>
    </div>
  );
}
