import { useQuery } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Mail,
  CheckSquare,
  ArrowUpRight,
  Globe,
  ShoppingBag,
  Radio,
  Network,
  Instagram,
  Edit,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";

function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [propiedades, contactos, mensajes, tareas] = await Promise.all([
        externalSupabase.from("propiedades").select("id, operacion, estado", { count: "exact" }),
        externalSupabase.from("contactos").select("id, estado, created_at", { count: "exact" }),
        externalSupabase.from("mensajes").select("id, leido", { count: "exact" }),
        externalSupabase.from("tareas").select("id, estado", { count: "exact" }),
      ]);

      const propData = propiedades.data || [];
      const contData = contactos.data || [];
      const msgData = mensajes.data || [];
      const tskData = tareas.data || [];

      const enVenta = propData.filter((p: any) => p.operacion === "Venta").length;
      const enAlquiler = propData.filter((p: any) => p.operacion === "Alquiler").length;

      const hace7 = new Date();
      hace7.setDate(hace7.getDate() - 7);
      const contactosNuevos = contData.filter((c: any) => new Date(c.created_at) > hace7).length;

      const noLeidos = msgData.filter((m: any) => !m.leido).length;
      const pendientes = tskData.filter((t: any) => t.estado === "pendiente").length;

      return {
        totalPropiedades: propiedades.count || 0,
        enVenta,
        enAlquiler,
        totalContactos: contactos.count || 0,
        contactosNuevos,
        mensajesSinLeer: noLeidos,
        tareasPendientes: pendientes,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

function useRecentActivity() {
  return useQuery({
    queryKey: ["admin-actividad"],
    queryFn: async () => {
      const { data } = await externalSupabase
        .from("actividad")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(15);
      return data || [];
    },
    staleTime: 60 * 1000,
  });
}

function generateChartData() {
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, "dd MMM", { locale: es }),
      visitas: Math.floor(Math.random() * 1200) + 300,
    };
  });
}

const chartData = generateChartData();

const portales = [
  { label: "Web propia", icon: Globe, count: null, active: true },
  { label: "MercadoLibre", icon: ShoppingBag, count: 44, active: true },
  { label: "Zonaprop", icon: Radio, count: 130, active: true },
  { label: "Red Pública", icon: Network, count: 122, active: true },
  { label: "Red Privada", icon: Network, count: 0, active: false },
  { label: "Instagram", icon: Instagram, count: 0, active: false },
];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();
  const { data: actividad } = useRecentActivity();

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400">Panel de administración — Analía Daconte Propiedades</p>
        </div>
        <Link to="/admin/propiedades/nueva">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva propiedad
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPICard
          label="Propiedades"
          value={stats?.totalPropiedades ?? 0}
          sub={`${stats?.enVenta ?? 0} venta · ${stats?.enAlquiler ?? 0} alquiler`}
          icon={Building2}
          href="/admin/propiedades"
          loading={isLoading}
          accent="purple"
        />
        <KPICard
          label="Contactos"
          value={stats?.totalContactos ?? 0}
          sub={`+${stats?.contactosNuevos ?? 0} esta semana`}
          icon={Users}
          href="/admin/contactos"
          loading={isLoading}
          accent="blue"
        />
        <KPICard
          label="Sin leer"
          value={stats?.mensajesSinLeer ?? 0}
          sub="Mensajes nuevos"
          icon={Mail}
          href="/admin/mensajes"
          loading={isLoading}
          alert={stats?.mensajesSinLeer > 0}
          accent="amber"
        />
        <KPICard
          label="Tareas"
          value={stats?.tareasPendientes ?? 0}
          sub="Pendientes"
          icon={CheckSquare}
          href="/admin/tareas"
          loading={isLoading}
          accent="green"
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2 bg-white border-gray-100 p-4 rounded-xl" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Visitas</p>
              <p className="text-2xl font-semibold text-gray-900">24.952</p>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-600">+47% vs mes anterior</span>
              </div>
            </div>
            <div className="flex gap-1">
              {["7d", "30d", "90d"].map((t) => (
                <button
                  key={t}
                  className="px-2 py-1 text-xs rounded text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="visitasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                labelStyle={{ color: "#6b7280" }}
                itemStyle={{ color: "#7c3aed" }}
              />
              <Area
                type="monotone"
                dataKey="visitas"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#visitasGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity */}
        <Card className="bg-white border-gray-100 p-4 rounded-xl" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Actividad reciente</p>
          {actividad && actividad.length > 0 ? (
            <div className="space-y-2.5 overflow-y-auto max-h-52">
              {actividad.map((act: any) => (
                <div key={act.id} className="flex items-start gap-2">
                  {act.tipo === "creó" ? (
                    <PlusCircle className="h-3.5 w-3.5 mt-0.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Edit className="h-3.5 w-3.5 mt-0.5 text-blue-500 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-gray-700 truncate">
                      <span className="text-gray-400">{act.tipo} </span>
                      {act.descripcion}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {format(new Date(act.created_at), "dd/MM HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {[
                { tipo: "actualizó", desc: "Chalet 3 amb con parque en Los Pinares", time: "Hace 22h" },
                { tipo: "creó", desc: "Duplex 3 Amb en lo mejor de Constitución", time: "Hace 1 día" },
                { tipo: "actualizó", desc: "Depto 1 amb al frente sin expensas", time: "Hace 1 día" },
                { tipo: "actualizó", desc: "PH 2 amb en planta baja con patio", time: "Hace 2 días" },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-2">
                  {act.tipo === "creó" ? (
                    <PlusCircle className="h-3.5 w-3.5 mt-0.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Edit className="h-3.5 w-3.5 mt-0.5 text-blue-500 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-gray-700 truncate">
                      <span className="text-gray-400">{act.tipo} </span>
                      {act.desc}
                    </p>
                    <p className="text-[10px] text-gray-400">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Portales */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Publicaciones por portal</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {portales.map((p) => (
            <Card key={p.label} className="bg-white border-gray-100 p-3 rounded-xl hover:shadow-md transition-all duration-150" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center gap-2 mb-2">
                <p.icon className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-600 truncate">{p.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">
                  {p.count ?? "—"}
                </span>
                <Badge
                  className={
                    p.active
                      ? "text-[10px] bg-emerald-50 text-emerald-700 border-0 px-1.5 py-0"
                      : "text-[10px] bg-gray-100 text-gray-500 border-0 px-1.5 py-0"
                  }
                >
                  {p.active ? "activo" : "inactivo"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: number;
  sub: string;
  icon: React.ElementType;
  href: string;
  loading?: boolean;
  alert?: boolean;
  accent?: "purple" | "blue" | "amber" | "green";
}

const accentConfig = {
  purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-t-purple-500", number: "text-gray-900" },
  blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   border: "border-t-blue-500",   number: "text-gray-900" },
  amber:  { bg: "bg-amber-50",  icon: "text-amber-600",  border: "border-t-amber-500",  number: "text-amber-600" },
  green:  { bg: "bg-emerald-50",icon: "text-emerald-600",border: "border-t-emerald-500",number: "text-gray-900" },
};

function KPICard({ label, value, sub, icon: Icon, href, loading, alert, accent = "purple" }: KPICardProps) {
  const cfg = alert ? accentConfig.amber : accentConfig[accent];
  return (
    <Link to={href}>
      <Card className={`bg-white border-gray-100 border-t-4 ${cfg.border} p-4 hover:shadow-md transition-all duration-150 group cursor-pointer rounded-xl`}
        style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-start justify-between">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${cfg.bg}`}>
            <Icon className={`h-4.5 w-4.5 ${cfg.icon}`} style={{ width: 18, height: 18 }} />
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 text-gray-200 group-hover:text-gray-400 transition-colors mt-0.5" />
        </div>
        {loading ? (
          <div className="mt-3 h-7 w-16 animate-pulse bg-gray-100 rounded-lg" />
        ) : (
          <p className={`mt-3 text-2xl font-semibold ${cfg.number}`}>
            {value.toLocaleString("es-AR")}
          </p>
        )}
        <p className="mt-0.5 text-xs font-semibold text-gray-600">{label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
      </Card>
    </Link>
  );
}
