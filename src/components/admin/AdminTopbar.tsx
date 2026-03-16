import { useState, useEffect } from "react";
import { Menu, LogOut, User, Bell, ChevronRight, Search, LayoutDashboard, Building2, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";

const breadcrumbMap: Record<string, string[]> = {
  "/admin/dashboard": ["Dashboard"],
  "/admin/propiedades": ["Propiedades"],
  "/admin/propiedades/nueva": ["Propiedades", "Nueva propiedad"],
  "/admin/contactos": ["Contactos"],
  "/admin/mensajes": ["Mensajes"],
  "/admin/tareas": ["Tareas"],
  "/admin/publicaciones": ["Publicaciones"],
  "/admin/configuracion": ["Configuración"],
};

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const editMatch = location.pathname.match(/^\/admin\/propiedades\/(\d+)$/);
  const crumbs = breadcrumbMap[location.pathname]
    ?? (editMatch ? ["Propiedades", "Editar propiedad"] : ["Admin"]);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const { count } = await externalSupabase
        .from("mensajes")
        .select("id", { count: "exact", head: true })
        .eq("leido", false);
      return count ?? 0;
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const displayName = user?.email?.split("@")[0] ?? "Admin";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 gap-4">
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm min-w-0" aria-label="Breadcrumb">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1 min-w-0">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />}
              <span className={i === crumbs.length - 1
                ? "font-semibold text-gray-800 truncate"
                : "text-gray-400 truncate"
              }>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Center: search */}
      <button
        onClick={() => setCmdOpen(true)}
        className="hidden sm:flex items-center gap-2 text-sm text-gray-400 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-xs">Buscar...</span>
        <kbd className="hidden md:inline-flex text-[10px] bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-400">⌘K</kbd>
      </button>

      {/* Right: actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notification bell */}
        <Link to="/admin/mensajes" className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[9px] font-bold text-white leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* Separator */}
        <div className="h-5 w-px bg-gray-200" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-2 h-8"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-600">
                {initials}
              </div>
              <span className="hidden text-[13px] font-medium sm:block capitalize">
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 bg-white border-gray-200 shadow-lg rounded-xl p-1">
            <DropdownMenuLabel className="px-3 py-2">
              <p className="text-sm font-semibold text-gray-800 capitalize">{displayName}</p>
              <p className="text-[11px] text-gray-400 font-normal mt-0.5">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem className="text-gray-700 focus:text-gray-900 focus:bg-gray-50 rounded-lg px-3 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-500 focus:text-red-600 focus:bg-red-50 rounded-lg px-3 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
      <CommandInput placeholder="Buscar propiedades, contactos, páginas..." />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        <CommandGroup heading="Navegación">
          <CommandItem onSelect={() => { navigate("/admin/dashboard"); setCmdOpen(false); }}>
            <LayoutDashboard className="mr-2 h-4 w-4" />Dashboard
          </CommandItem>
          <CommandItem onSelect={() => { navigate("/admin/propiedades"); setCmdOpen(false); }}>
            <Building2 className="mr-2 h-4 w-4" />Propiedades
          </CommandItem>
          <CommandItem onSelect={() => { navigate("/admin/contactos"); setCmdOpen(false); }}>
            <Users className="mr-2 h-4 w-4" />Contactos
          </CommandItem>
          <CommandItem onSelect={() => { navigate("/admin/mensajes"); setCmdOpen(false); }}>
            <Mail className="mr-2 h-4 w-4" />Mensajes
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
