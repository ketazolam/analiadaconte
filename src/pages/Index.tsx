import { lazy, Suspense } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import Navigation from "@/components/sections/Navigation";
import HeroSection from "@/components/sections/HeroSection";

const ScrollProgress = lazy(() => import("@/components/ScrollProgress"));
const WhatsAppFAB = lazy(() => import("@/components/WhatsAppFAB"));
const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const MapShowcaseSection = lazy(() => import("@/components/sections/MapShowcaseSection"));
const FeaturedProperties = lazy(() => import("@/components/sections/FeaturedProperties"));
const SellProposal = lazy(() => import("@/components/sections/SellProposal"));
const AboutSection = lazy(() => import("@/components/sections/AboutSection"));
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
      <Suspense fallback={null}>
        <ScrollProgress />
      </Suspense>

      <Suspense fallback={null}>
        <WhatsAppFAB />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <Navigation />
      <main>
        <HeroSection />
        <Suspense fallback={null}>
          <MapShowcaseSection />
        </Suspense>
        <Suspense fallback={null}>
          <FeaturedProperties />
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
