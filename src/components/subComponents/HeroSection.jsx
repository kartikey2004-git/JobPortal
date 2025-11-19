import { motion } from "framer-motion";
import BlurText from "../uiComponents/BlurText";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import ShareButton from "@/components/ui/share-button";
import { Facebook, Link2, Linkedin, Twitter } from "lucide-react";

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
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 items-center px-6 sm:px-8 lg:px-16 text-white">
      <motion.div
        className="space-y-6 max-w-2xl"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.h2
          className="text-[36px] sm:text-[48px]  font-normal lg:text-[54px] leading-tight"
          variants={fadeUp}
          custom={0.3}
        >
          Find Your Dream Job
          <br /> and get hired.
          <br />
        </motion.h2>

        <motion.p
          className="text-white/70 text-base"
          variants={fadeUp}
          custom={0.4}
        >
          <BlurText
            text="Browse verified job listings, track your applications, and impress recruiters with a professional resume — all in one place."
            delay={150}
            animateBy="words"
            direction="top"
            className="text-xl mb-8 mt-4 text-gray-300"
          />
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 pt-4"
          variants={fadeUp}
          custom={0.5}
        >
          <div className="flex gap-4 justify-center">
            <Link to="/jobs">
              <Button variant="blue" size="lg">
                Find Jobs
              </Button>
            </Link>

            <Link to="/post-job">
              <Button variant="destructive" size="lg">
                Post a Job
              </Button>
            </Link>
          </div>

          <ShareButton
            links={shareLinks}
            className="bg-gray-950/10 text-white text-base font-sans first:rounded-xl border  border-gray-800 backdrop-blur hover:bg-gray-900/90 transition duration-200 shadow-md"
          >
            <Link size={15} />
            Share this Job Portal
          </ShareButton>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
