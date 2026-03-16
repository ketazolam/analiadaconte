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
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const navSections = [
  {
    label: "Gestión",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
      { label: "Propiedades", icon: Building2, href: "/admin/propiedades" },
      { label: "Contactos", icon: Users, href: "/admin/contactos" },
    ],
  },
  {
    label: "Comunicación",
    items: [
      { label: "Mensajes", icon: Mail, href: "/admin/mensajes" },
      { label: "Tareas", icon: CheckSquare, href: "/admin/tareas" },
      { label: "Publicaciones", icon: Globe, href: "/admin/publicaciones" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { label: "Configuración", icon: Settings, href: "/admin/configuracion" },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const location = useLocation();
  const { user } = useAdminAuth();

  const sidebarContent = (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-full flex-col">
        {/* Branding header */}
        <div className={cn(
          "flex h-14 items-center border-b border-gray-100/80 transition-all duration-200",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white text-sm font-bold shadow-sm">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-gray-800 truncate leading-tight">Analía Daconte</p>
                <p className="text-[10px] text-gray-400 leading-tight">Propiedades</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white text-sm font-bold shadow-sm">
              AD
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => onCollapse(!collapsed)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1">
        <nav className="px-2 py-3">
          {navSections.map((section) => (
            <div key={section.label} className="mb-1">
              {!collapsed && (
                <p className="nav-section-label">{section.label}</p>
              )}
              {collapsed && <div className="mt-3 border-t border-gray-100" />}
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => {
                  const active = location.pathname.startsWith(item.href);
                  const linkEl = (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        collapsed ? "justify-center px-2" : "",
                        active
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-500 hover:bg-gray-100/70 hover:text-gray-700"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-purple-600" : "text-gray-400")} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  return linkEl;
                })}
              </div>
            </div>
          ))}
        </nav>
        </ScrollArea>

        {/* Collapse toggle when collapsed */}
        {collapsed && (
          <div className="flex justify-center pb-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => onCollapse(!collapsed)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* User footer */}
        <div className="border-t border-gray-100/80 p-2">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-semibold">
                {user?.email?.charAt(0).toUpperCase() ?? "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-gray-500 truncate">
                  {user?.email ?? "admin@analiadaconte.com.ar"}
                </p>
              </div>
              <Link
                to="/"
                target="_blank"
                className="text-gray-300 hover:text-gray-500 transition-colors"
                title="Ver sitio"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  target="_blank"
                  className="flex justify-center p-2 text-gray-300 hover:text-gray-500 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Ver sitio</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-gray-100 transition-all duration-200",
          collapsed ? "w-14" : "w-60"
        )}
        style={{ boxShadow: "var(--shadow-sidebar)" }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white border-r border-gray-100 shadow-xl">
            <div className="absolute right-3 top-3 z-10">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:bg-gray-100 rounded-lg" onClick={onMobileClose}>
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
