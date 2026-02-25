import Navigation from "@/components/sections/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import DualPathSection from "@/components/sections/DualPathSection";
import StatsBar from "@/components/sections/StatsBar";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import SellProposal from "@/components/sections/SellProposal";
import AboutSection from "@/components/sections/AboutSection";
import SellersSection from "@/components/sections/SellersSection";
import ClosedDeals from "@/components/sections/ClosedDeals";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ValuationTool from "@/components/sections/ValuationTool";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const Index = () => {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <WhatsAppFAB />
      <Navigation />
      <main>
        <HeroSection />
        <DualPathSection />
        <StatsBar />
        <FeaturedProperties />
        <SellProposal />
        <AboutSection />
        <SellersSection />
        <ClosedDeals />
        <ReviewsSection />
        <ValuationTool />
      </main>
      <Footer />
    </>
  );
};

export default Index;
