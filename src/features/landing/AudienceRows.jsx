import { Briefcase, User } from "lucide-react";

const AUDIENCES = [
  {
    icon: User,
    title: "For candidates",
    description:
      "Browse verified opportunities, submit applications, and track your professional progress, all within a unified dashboard.",
  },
  {
    icon: Briefcase,
    title: "For recruiters",
    description:
      "Streamline your hiring process. Post openings, manage talent pipelines, and connect with the industry's most qualified candidates.",
  },
];

const AudienceRows = () => (
  <section className="py-12 sm:py-14 lg:py-16">
    <div className="section-shell">
      <div className="divide-y divide-border/50 border-y border-border/50">
        {AUDIENCES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="group relative flex items-start gap-3 px-1 py-4 sm:gap-4 sm:px-2">
            <span className="absolute inset-y-0 left-0 w-px origin-bottom scale-y-0 bg-foreground transition-transform duration-300 group-hover:scale-y-100" />
            <span className="flex size-9 shrink-0 items-center justify-center text-foreground/70 transition-colors duration-300 group-hover:text-foreground sm:size-10">
              <Icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground sm:text-base">{title}</span>
              <span className="block body-text sm:text-base">{description}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AudienceRows;
