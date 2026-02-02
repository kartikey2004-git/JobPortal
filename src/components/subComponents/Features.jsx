import { motion } from "framer-motion";
import features from "../../data/features.json";
import { FiSearch, FiSettings, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const icons = [FiSearch, FiUser, FiSettings];
const buttons = ["Browse jobs", "Track applications", "Set preferences"];

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
        <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          Designed for candidates
          <br /> professionals, and recruiters
        </h3>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A platform that simplifies hiring for everyone involved.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((card, i) => {
          const Icon = icons[i % icons.length];
          const btnText = buttons[i % buttons.length];

          return (
            <motion.article
              key={i}
              className="relative min-h-[280px] p-8 rounded-2xl border border-border bg-card text-card-foreground shadow-soft hover:shadow-soft-lg w-full max-w-[600px] mx-auto transition-all duration-200 ease-out-subtle"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                {card.content}
              </p>

              <Button
                variant="secondary"
                size="lg"
                className="absolute bottom-4 left-4"
              >
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
