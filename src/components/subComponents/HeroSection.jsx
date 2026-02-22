import { motion } from "framer-motion";
import BlurText from "../uiComponents/BlurText";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import ShareButton from "@/components/ui/share-button";
import { Facebook, Link2, Linkedin, Twitter, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
};

const shareLinks = [
  {
    icon: Twitter,
    onClick: () => window.open("https://twitter.com/share"),
    label: "Share on Twitter",
  },
  {
    icon: Facebook,
    onClick: () => window.open("https://facebook.com/share"),
    label: "Share on Facebook",
  },
  {
    icon: Linkedin,
    onClick: () => window.open("https://linkedin.com/share"),
    label: "Share on LinkedIn",
  },
  {
    icon: Link2,
    onClick: () => navigator.clipboard.writeText(window.location.href),
    label: "Copy link",
  },
];

const HeroSection = () => {
  const { user, isLoaded } = useUser();
  const userRole = user?.unsafeMetadata?.role;

  return (
    <section className="flex flex-col items-center text-center pt-0 pb-24 lg:pb-32 overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="mb-4"
      >
        <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-muted/50 backdrop-blur-sm">
          Platform for professionals
        </span>
      </motion.div>

      <motion.div
        className="space-y-8 max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] text-foreground">
          Identify your next <br />
          <span className="text-foreground">career milestone.</span>
        </h1>

        <div className="max-w-2xl mx-auto">
          <BlurText
            text="Access verified career opportunities, track your progress in real-time, and manage your professional journey—all from a centralized command center."
            delay={50}
            animateBy="words"
            direction="top"
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
          />
        </div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          variants={fadeUp}
          custom={3}
        >
          {isLoaded && userRole ? (
            <Link to="/jobs">
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-medium transition-all hover:translate-y-[-2px]">
                Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/jobs">
                <Button size="lg" className="rounded-full px-8 h-12 text-base font-medium transition-all hover:translate-y-[-2px]">
                  Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/post-job" className="hidden sm:block">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-medium">
                  Post a Job
                </Button>
              </Link>
            </>
          )}

          <ShareButton
            links={shareLinks}
            className="rounded-full px-6 h-12 text-sm font-medium border border-border bg-background/50 backdrop-blur hover:bg-muted transition-all shadow-sm"
          >
            <Link2 className="h-4 w-4 mr-2" />
            Share Platform
          </ShareButton>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

