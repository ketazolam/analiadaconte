import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Instagram,
  Facebook,
  Link2,
  Youtube,
  Shield,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

type Config = {
  id?: string;
  nombre: string;
  email: string;
  telefono: string;
  instagram: string;
  facebook: string;
  logo_url: string;
};

const EMPTY_CONFIG: Config = {
  nombre: "Analía Daconte Propiedades",
  email: "analiadacontepropiedades@gmail.com",
  telefono: "223 300-1242",
  instagram: "https://www.instagram.com/analiadaconte",
  facebook: "https://www.facebook.com/analiadaconte",
  logo_url: "",
};

function useConfig() {
  return useQuery({
    queryKey: ["admin-config"],
    queryFn: async () => {
      const { data } = await externalSupabase
        .from("config_inmobiliaria")
        .select("*")
        .maybeSingle();
      return (data as Config) || EMPTY_CONFIG;
    },
  });
}

function PerfilTab() {
  const { data: config } = useConfig();
  const qc = useQueryClient();
  const [form, setForm] = useState<Config>(EMPTY_CONFIG);

  useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: async (c: Config) => {
      if (c.id) {
        await externalSupabase.from("config_inmobiliaria").update(c).eq("id", c.id);
      } else {
        await externalSupabase.from("config_inmobiliaria").insert(c);
      }
    },
    onSuccess: () => {
      toast.success("Configuración guardada");
      qc.invalidateQueries({ queryKey: ["admin-config"] });
    },
    onError: () => toast.error("Error al guardar"),
  });

  return (
    <div className="space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-3">
        {[
          { field: "nombre", label: "Nombre de la inmobiliaria" },
          { field: "email", label: "Email de contacto" },
          { field: "telefono", label: "Teléfono" },
          { field: "logo_url", label: "URL del logo" },
        ].map(({ field, label }) => (
          <div key={field} className="space-y-1">
            <Label className="text-xs text-gray-500">{label}</Label>
            <Input
              value={(form as any)[field]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              className="bg-white border-gray-200 text-gray-900 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400"
            />
          </div>
        ))}
      </div>

      <div className="pt-2">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Redes sociales</p>
        {[
          { field: "instagram", label: "Instagram", icon: Instagram },
          { field: "facebook", label: "Facebook", icon: Facebook },
        ].map(({ field, label, icon: Icon }) => (
          <div key={field} className="flex items-center gap-2 mb-2">
            <Icon className="h-4 w-4 text-gray-400 shrink-0" />
            <div className="flex-1">
              <Input
                value={(form as any)[field]}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                placeholder={`URL de ${label}`}
                className="bg-white border-gray-200 text-gray-900 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400"
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={() => saveMutation.mutate(form)}
        disabled={saveMutation.isPending}
        className="bg-purple-600 hover:bg-purple-700"
      >
        {saveMutation.isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  );
}

function IntegracionesTab() {
  const portales = [
    { nombre: "Web propia", estado: "activo", count: 221, color: "emerald" },
    { nombre: "MercadoLibre", estado: "activo", count: 44, color: "amber" },
    { nombre: "Zonaprop", estado: "activo", count: 130, color: "purple" },
    { nombre: "Red Pública", estado: "activo", count: 122, color: "sky" },
    { nombre: "Red Privada", estado: "inactivo", count: 0, color: "white" },
    { nombre: "Instagram", estado: "inactivo", count: 0, color: "pink" },
  ];

  return (
    <div className="space-y-3 max-w-lg">
      <p className="text-xs text-gray-400">Estado de publicación por portal</p>
      {portales.map(p => (
        <Card key={p.nombre} className="bg-white border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link2 className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-700">{p.nombre}</p>
                <p className="text-xs text-gray-400">{p.count} propiedades publicadas</p>
              </div>
            </div>
            <Badge className={`text-[10px] border-0 ${p.estado === "activo" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
              {p.estado === "activo" ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : null}
              {p.estado}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SeguridadTab() {
  const [pass, setPass] = useState({ actual: "", nueva: "", confirmar: "" });
  const [loading, setLoading] = useState(false);

  const handleChangePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.nueva !== pass.confirmar) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    const { error } = await externalSupabase.auth.updateUser({ password: pass.nueva });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Contraseña actualizada");
      setPass({ actual: "", nueva: "", confirmar: "" });
    }
  };

  return (
    <div className="space-y-4 max-w-sm">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-4 w-4 text-purple-500" />
        <p className="text-sm text-gray-600">Cambiar contraseña</p>
      </div>
      <form onSubmit={handleChangePass} className="space-y-3">
        {[
          { field: "nueva", label: "Nueva contraseña" },
          { field: "confirmar", label: "Confirmar contraseña" },
        ].map(({ field, label }) => (
          <div key={field} className="space-y-1">
            <Label className="text-xs text-gray-500">{label}</Label>
            <Input
              type="password"
              value={(pass as any)[field]}
              onChange={e => setPass(p => ({ ...p, [field]: e.target.value }))}
              className="bg-white border-gray-200 text-gray-900 h-8 text-sm focus-visible:ring-purple-500/30 focus-visible:border-purple-400"
            />
          </div>
        ))}
        <Button type="submit" disabled={loading || !pass.nueva} className="bg-purple-600 hover:bg-purple-700">
          {loading ? "Actualizando..." : "Cambiar contraseña"}
        </Button>
      </form>
    </div>
  );
}

export default function AdminConfiguracion() {
  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-400">Gestión de la inmobiliaria e integraciones</p>
      </div>

      <Tabs defaultValue="perfil">
        <TabsList className="bg-gray-50 border border-gray-200">
          {[
            { value: "perfil", label: "Perfil" },
            { value: "integraciones", label: "Integraciones" },
            { value: "seguridad", label: "Seguridad" },
          ].map(t => (
            <TabsTrigger key={t.value} value={t.value} className="text-xs data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="perfil" className="mt-4">
          <PerfilTab />
        </TabsContent>
        <TabsContent value="integraciones" className="mt-4">
          <IntegracionesTab />
        </TabsContent>
        <TabsContent value="seguridad" className="mt-4">
          <SeguridadTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
