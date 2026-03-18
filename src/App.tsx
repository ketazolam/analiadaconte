import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Public pages
const Propiedades = lazy(() => import("./pages/Propiedades"));
const PropiedadDetalle = lazy(() => import("./pages/PropiedadDetalle"));
const Tasaciones = lazy(() => import("./pages/Tasaciones"));
const Mapa = lazy(() => import("./pages/Mapa"));
const Contacto = lazy(() => import("./pages/Contacto"));

// CustomCursor — only for pointer: fine devices
const CustomCursor = lazy(() =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches
    ? import("@/components/CustomCursor")
    : Promise.resolve({ default: () => null })
);

// Admin shell — lazy so AdminAuthProvider.getSession() never runs for public visitors
const AdminShell = lazy(() => import("@/components/admin/AdminShell"));
const AdminRoute = lazy(() =>
  import("@/router/AdminRoute").then(m => ({ default: m.AdminRoute }))
);
const AdminLayout = lazy(() =>
  import("@/components/admin/AdminLayout").then(m => ({ default: m.AdminLayout }))
);

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
const AdminAprobarPropiedad = lazy(() => import("./pages/admin/AdminAprobarPropiedad"));

const queryClient = new QueryClient();

const AdminSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>
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

          {/* Admin routes — wrapped in lazy AdminShell so AdminAuthProvider only loads for /admin/* */}
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<AdminSpinner />}>
                <AdminShell>
                  <Routes>
                    <Route path="login" element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
                    <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route
                      path="*"
                      element={
                        <Suspense fallback={<AdminSpinner />}>
                          <AdminRoute>
                            <AdminLayout>
                              <Suspense fallback={<AdminSpinner />}>
                                <Routes>
                                  <Route path="dashboard" element={<AdminDashboard />} />
                                  <Route path="propiedades" element={<AdminPropiedades />} />
                                  <Route path="propiedades/nueva" element={<AdminFormPropiedad />} />
                                  <Route path="propiedades/:id/aprobar" element={<AdminAprobarPropiedad />} />
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
                        </Suspense>
                      }
                    />
                  </Routes>
                </AdminShell>
              </Suspense>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
