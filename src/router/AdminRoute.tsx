import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f0f12]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  // Permitir acceso a cualquier usuario autenticado mientras se configura el rol admin
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
