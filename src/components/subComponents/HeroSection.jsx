import { motion } from "framer-motion";
import BlurText from "../uiComponents/BlurText";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import ShareButton from "@/components/ui/share-button";
import { Facebook, Link2, Linkedin, Twitter } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
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
  const isCandidate = userRole === "candidate";
  const isRecruiter = userRole === "recruiter";

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 items-center px-6 sm:px-8 lg:px-16">
      <motion.div
        className="space-y-6 max-w-2xl"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight"
          variants={fadeUp}
          custom={0.3}
        >
          Find your next role
          <br /> and get hired.
          <br />
        </motion.h2>

        <motion.p
          className="text-muted-foreground text-lg leading-relaxed"
          variants={fadeUp}
          custom={0.4}
        >
          <BlurText
            text="Browse verified opportunities, track applications, and manage your job search — all in one platform."
            delay={150}
            animateBy="words"
            direction="top"
            className="text-xl leading-relaxed"
          />
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 pt-4"
          variants={fadeUp}
          custom={0.5}
        >
          <div className="flex gap-4 justify-center">
            {isLoaded && userRole ? (
              isCandidate ? (
                <Link to="/jobs">
                  <Button variant="secondary" size="lg">
                    Browse jobs
                  </Button>
                </Link>
              ) : isRecruiter ? (
                <>
                  <Link to="/jobs">
                    <Button variant="secondary" size="lg">
                      Browse jobs
                    </Button>
                  </Link>

                  <Link to="/post-job">
                    <Button variant="secondary" size="lg">
                      Post job
                    </Button>
                  </Link>
                </>
              ) : null
            ) : (
              <>
                <Link to="/jobs">
                  <Button variant="secondary" size="lg">
                    Browse jobs
                  </Button>
                </Link>

                <Link to="/post-job">
                  <Button variant="secondary" size="lg">
                    Post job
                  </Button>
                </Link>
              </>
            )}
          </div>

          <ShareButton
            links={shareLinks}
            className="bg-muted/50 text-foreground text-base font-sans first:rounded-xl border border-border backdrop-blur hover:bg-muted transition duration-200 shadow-sm"
          >
            <Link size={15} />
            Share platform
          </ShareButton>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
