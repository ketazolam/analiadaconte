import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Propiedades = lazy(() => import("./pages/Propiedades"));
const PropiedadDetalle = lazy(() => import("./pages/PropiedadDetalle"));
const Tasaciones = lazy(() => import("./pages/Tasaciones"));
const Mapa = lazy(() => import("./pages/Mapa"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/propiedades" element={<Suspense fallback={null}><Propiedades /></Suspense>} />
          <Route path="/tasaciones" element={<Suspense fallback={null}><Tasaciones /></Suspense>} />
          <Route path="/mapa" element={<Suspense fallback={null}><Mapa /></Suspense>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
