import { Briefcase, User } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import PageSkeleton from "@/components/shared/PageSkeleton";
import { ROLES, ROUTES } from "@/config/constants";
import useUserRole from "@/hooks/useUserRole";

const ROLE_OPTIONS = [
  {
    role: ROLES.CANDIDATE,
    icon: User,
    title: "I'm a candidate",
    description: "I want to find and apply for my next career opportunity with ease.",
  },
  {
    role: ROLES.RECRUITER,
    icon: Briefcase,
    title: "I'm a recruiter",
    description: "I want to post jobs and find the best talent for my growing team.",
  },
];

const homeRouteFor = (role) => (role === ROLES.RECRUITER ? ROUTES.POST_JOB : ROUTES.JOBS);

const Onboarding = () => {
  const { user, role, isLoaded } = useUserRole();
  const navigate = useNavigate();

  // Users who already chose a role skip onboarding.
  useEffect(() => {
    if (role) navigate(homeRouteFor(role));
  }, [role, navigate]);

  const handleRoleSelection = async (selectedRole) => {
    try {
      await user.update({ unsafeMetadata: { role: selectedRole } });
      navigate(homeRouteFor(selectedRole));
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  if (!isLoaded) return <PageSkeleton count={2} />;

  return (
    <div className="page-shell">
      <PageHeader
        title="Welcome"
        description="To get started, tell us how you'll be using the platform."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ROLE_OPTIONS.map(({ role: optionRole, icon: Icon, title, description }) => (
          <button
            key={optionRole}
            type="button"
            onClick={() => handleRoleSelection(optionRole)}
            className="surface group flex cursor-pointer flex-col items-start gap-4 p-5 text-left transition-colors duration-150 hover:border-border hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Icon className="size-4 text-foreground/70 transition-colors group-hover:text-foreground" />
            <span className="space-y-1">
              <span className="block text-sm font-medium text-foreground sm:text-base">{title}</span>
              <span className="block body-text">{description}</span>
            </span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        You can always change your preferences in your profile settings later.
      </p>
    </div>
  );
};

export default Onboarding;
