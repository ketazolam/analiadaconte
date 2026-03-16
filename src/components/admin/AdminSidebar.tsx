import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  Mail,
  CheckSquare,
  Globe,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Propiedades", icon: Building2, href: "/admin/propiedades" },
  { label: "Contactos", icon: Users, href: "/admin/contactos" },
  { label: "Mensajes", icon: Mail, href: "/admin/mensajes" },
  { label: "Tareas", icon: CheckSquare, href: "/admin/tareas" },
  { label: "Publicaciones", icon: Globe, href: "/admin/publicaciones" },
  { label: "Configuración", icon: Settings, href: "/admin/configuracion" },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
        {!collapsed && (
          <span className="text-sm font-semibold tracking-widest text-gray-600 uppercase">
            Admin Panel
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-7 w-7 text-gray-400 hover:text-gray-700"
          onClick={() => onCollapse(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2 pt-3">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-purple-50 text-purple-700 border-l-2 border-purple-500"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-purple-500" : "")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 p-3">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Globe className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && <span>Ver sitio</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-gray-100 transition-all duration-200",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-60 bg-white border-r border-gray-100">
            <div className="absolute right-3 top-3">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400" onClick={onMobileClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
