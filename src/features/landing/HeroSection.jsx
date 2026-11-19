import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/constants";
import useUserRole from "@/hooks/useUserRole";

const HeroSection = () => {
  const { role, isLoaded } = useUserRole();
  const hasRole = isLoaded && Boolean(role);

  return (
    <section id="hero" className="section-shell pt-16 pb-12 sm:pt-24 sm:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <p className="eyebrow mb-4">Platform for professionals</p>

        <h1 className="text-heading-32 sm:text-heading-48 font-[450] text-balance text-foreground tracking-[-0.05em] sm:tracking-[-0.06em] leading-[1.12]">
          Identify your next career milestone.
        </h1>

        <p className="mt-5 max-w-xl body-text text-foreground">
          Access verified career opportunities, track your progress in real-time, and manage your
          professional journey, all from one place.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link to={ROUTES.JOBS}>Browse jobs</Link>
          </Button>
          {!hasRole && (
            <Button asChild size="lg" variant="outline">
              <Link to={ROUTES.POST_JOB}>Post a job</Link>
            </Button>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
