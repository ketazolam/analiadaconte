import { lazy, Suspense } from "react";
import Navigation from "@/components/sections/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const DualPathSection = lazy(() => import("@/components/sections/DualPathSection"));
const StatsBar = lazy(() => import("@/components/sections/StatsBar"));
const FeaturedProperties = lazy(() => import("@/components/sections/FeaturedProperties"));
const SellProposal = lazy(() => import("@/components/sections/SellProposal"));
const AboutSection = lazy(() => import("@/components/sections/AboutSection"));
const ClosedDeals = lazy(() => import("@/components/sections/ClosedDeals"));
const ReviewsSection = lazy(() => import("@/components/sections/ReviewsSection"));
const ValuationTool = lazy(() => import("@/components/sections/ValuationTool"));
const Footer = lazy(() => import("@/components/sections/Footer"));

const Index = () => {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <WhatsAppFAB />
      <Navigation />
      <main>
        <HeroSection />
        <Suspense fallback={null}>
          <DualPathSection />
          <StatsBar />
          <FeaturedProperties />
          <SellProposal />
          <AboutSection />
          <ClosedDeals />
          <ReviewsSection />
          <ValuationTool />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
};

export default Index;
