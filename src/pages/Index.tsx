import { lazy, Suspense } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import Navigation from "@/components/sections/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import ScrollToTop from "@/components/ScrollToTop";

const FeaturedProperties = lazy(() => import("@/components/sections/FeaturedProperties"));
const StatsBar = lazy(() => import("@/components/sections/StatsBar"));
const SellProposal = lazy(() => import("@/components/sections/SellProposal"));
const AboutSection = lazy(() => import("@/components/sections/AboutSection"));
const MapPreviewSection = lazy(() => import("@/components/sections/MapPreviewSection"));
const ReviewsSection = lazy(() => import("@/components/sections/ReviewsSection"));
const NewsletterSection = lazy(() => import("@/components/sections/NewsletterSection"));
const Footer = lazy(() => import("@/components/sections/Footer"));

const Index = () => {
  usePageMeta({
    title: "Inmobiliaria en Mar del Plata",
    description: "28 años de trayectoria en el mercado inmobiliario de Mar del Plata. Compra, venta y tasación de propiedades con asesoramiento personalizado.",
  });

  return (
    <>
      <ScrollProgress />

      <WhatsAppFAB />
      <ScrollToTop />
      <Navigation />
      <main>
        <HeroSection />
        <Suspense fallback={null}>
          <FeaturedProperties />
        </Suspense>
        <Suspense fallback={null}>
          <StatsBar />
        </Suspense>
        <Suspense fallback={null}>
          <MapPreviewSection />
        </Suspense>
        <Suspense fallback={null}>
          <SellProposal />
        </Suspense>
        <Suspense fallback={null}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={null}>
          <ReviewsSection />
        </Suspense>
        <Suspense fallback={null}>
          <NewsletterSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
};

export default Index;
