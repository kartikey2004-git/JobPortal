import { Search, Settings, User } from "lucide-react";
import features from "./data/features.json";

// Icon for each entry in data/features.json, matched by position.
const FEATURE_ICONS = [Search, User, Settings];

const Features = () => (
  <section className="py-12 sm:py-14 lg:py-16">
    <div className="section-shell">
      <div className="mb-4 sm:mb-8">
        <h2 className="font-sans heading-lg">Designed for everyone involved</h2>
        <p className="mt-2 body-text">
          A platform that simplifies hiring for candidates, professionals, and recruiters.
        </p>
      </div>

      <div className="divide-y divide-border/50 border-y border-border/50">
        {features.map((feature, index) => {
          const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];

          return (
            <div key={feature.title} className="group relative flex items-start gap-3 px-1 py-4 sm:gap-4 sm:px-2">
              <span className="absolute inset-y-0 left-0 w-px origin-bottom scale-y-0 bg-foreground transition-transform duration-300 group-hover:scale-y-100" />
              <span className="flex size-9 shrink-0 items-center justify-center text-foreground/70 transition-colors duration-300 group-hover:text-foreground sm:size-10">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground sm:text-base">
                  {feature.title}
                </span>
                <span className="block body-text sm:text-base">{feature.content}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Features;
