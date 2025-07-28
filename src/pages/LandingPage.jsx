import Companies from "@/components/subComponents/Companies";
import Faqs from "@/components/subComponents/Faqs";
import Features from "@/components/subComponents/Features";
import HeroSection from "@/components/subComponents/HeroSection";
import Users from "@/components/subComponents/Users";

const LandingPage = () => {
  return (
    <main className="flex flex-col flex-1 py-10 sm:py-20 text-white mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-24">
        {/* Hero Section */}
        <section id="hero">
          <HeroSection />
        </section>

        <section>
          <Companies />
        </section>

        <section>
          <Users />
        </section>

        <section>
          <Features />
        </section>

        <section>
          <Faqs />
        </section>
      </div>
    </main>
  );
};

export default LandingPage;