import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CustomCursor from "@/components/CustomCursor";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AdminRoute } from "@/router/AdminRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Public pages
const Propiedades = lazy(() => import("./pages/Propiedades"));
const PropiedadDetalle = lazy(() => import("./pages/PropiedadDetalle"));
const Tasaciones = lazy(() => import("./pages/Tasaciones"));
const Mapa = lazy(() => import("./pages/Mapa"));
const Contacto = lazy(() => import("./pages/Contacto"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPropiedades = lazy(() => import("./pages/admin/AdminPropiedades"));
const AdminContactos = lazy(() => import("./pages/admin/AdminContactos"));
const AdminMensajes = lazy(() => import("./pages/admin/AdminMensajes"));
const AdminTareas = lazy(() => import("./pages/admin/AdminTareas"));
const AdminPublicaciones = lazy(() => import("./pages/admin/AdminPublicaciones"));
const AdminConfiguracion = lazy(() => import("./pages/admin/AdminConfiguracion"));
const AdminFormPropiedad = lazy(() => import("./pages/admin/AdminFormPropiedad"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <CustomCursor />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/propiedades" element={<Suspense fallback={null}><Propiedades /></Suspense>} />
            <Route path="/propiedad/:slug" element={<Suspense fallback={null}><PropiedadDetalle /></Suspense>} />
            <Route path="/tasaciones" element={<Suspense fallback={null}><Tasaciones /></Suspense>} />
            <Route path="/mapa" element={<Suspense fallback={null}><Mapa /></Suspense>} />
            <Route path="/contacto" element={<Suspense fallback={null}><Contacto /></Suspense>} />

            {/* Admin login */}
            <Route
              path="/admin/login"
              element={<Suspense fallback={null}><AdminLogin /></Suspense>}
            />

            {/* Admin protected routes */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Suspense fallback={<div className="flex h-full items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" /></div>}>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="propiedades" element={<AdminPropiedades />} />
                        <Route path="propiedades/nueva" element={<AdminFormPropiedad />} />
                        <Route path="propiedades/:id" element={<AdminFormPropiedad />} />
                        <Route path="contactos" element={<AdminContactos />} />
                        <Route path="mensajes" element={<AdminMensajes />} />
                        <Route path="tareas" element={<AdminTareas />} />
                        <Route path="publicaciones" element={<AdminPublicaciones />} />
                        <Route path="configuracion" element={<AdminConfiguracion />} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                      </Routes>
                    </Suspense>
                  </AdminLayout>
                </AdminRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
