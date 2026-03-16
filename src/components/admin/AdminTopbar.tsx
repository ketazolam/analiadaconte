import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const breadcrumbMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/propiedades": "Propiedades",
  "/admin/propiedades/nueva": "Nueva propiedad",
  "/admin/contactos": "Contactos",
  "/admin/mensajes": "Mensajes",
  "/admin/tareas": "Tareas",
  "/admin/publicaciones": "Publicaciones",
  "/admin/configuracion": "Configuración",
};

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const editMatch = location.pathname.match(/^\/admin\/propiedades\/(\d+)$/);
  const crumb = breadcrumbMap[location.pathname] ?? (editMatch ? "Editar propiedad" : "Admin");

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white shadow-sm px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-700 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-gray-600">{crumb}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs text-purple-600">
              {user?.email?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <span className="hidden text-xs sm:block">{user?.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-md">
          <DropdownMenuItem className="text-gray-700 focus:text-gray-900 focus:bg-purple-50">
            <User className="mr-2 h-4 w-4" />
            {user?.email}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-100" />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
