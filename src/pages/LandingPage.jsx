import AudienceRows from "@/features/landing/AudienceRows";
import Faqs from "@/features/landing/Faqs";
import Features from "@/features/landing/Features";
import HeroSection from "@/features/landing/HeroSection";

const LandingPage = () => (
  <div className="min-w-0 bg-background text-foreground">
    <HeroSection />
    <AudienceRows />
    <Features />
    <Faqs />
  </div>
);

export default LandingPage;
