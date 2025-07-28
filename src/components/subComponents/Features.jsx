import { motion } from "framer-motion";
import features from "../../data/features.json";
import { FiSearch, FiSettings, FiUser } from "react-icons/fi";
import { Button } from "../ui/button";

const icons = [FiSearch, FiUser, FiSettings];
const buttons = ["Browse Jobs", "Track Applications", "Set Preferences"];

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

const Features = () => {
  return (
    <section className="mx-auto px-6 py-24 lg:px-20 w-full bg-opacity-90">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-semibold  tracking-tight mb-4">
          Built for Candidates, Professionals, and Recruiters
        </h3>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
          JobConnect helps job seekers find the right roles and teams hire
          faster — whether you’re starting out, growing your career, or building
          one.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((card, i) => {
          const Icon = icons[i % icons.length];
          const btnText = buttons[i % buttons.length];

          return (
            <motion.article
              key={i}
              className="relative min-h-[260px] p-6 rounded-2xl border border-purple-500/10 text-white shadow-lg bg-gray-950/30 hover:shadow-2xl w-full max-w-[600px] mx-auto transition-all"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <h3 className="text-2xl font-medium mb-3">{card.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {card.content}
              </p>

              <Button className="absolute bottom-4 left-4  mt-2 inline-block text-sm px-4 py-2 rounded-md transition">
                {btnText}
              </Button>

              <span className="absolute bottom-4 right-4 text-2xl">
                <Icon />
              </span>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
