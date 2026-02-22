/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { User, Briefcase } from "lucide-react";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    await user
      .update({
        unsafeMetadata: { role },
      })
      .then(() => {
        navigate(role === "recruiter" ? "/post-job" : "/jobs");
      })
      .catch((err) => {
        console.error("Error updating role:", err);
      });
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(
        user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs",
      );
    }
  }, [user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />;
  }

  return (
    <div className="flex flex-col items-center pt-16 md:pt-32 px-4 pb-20">
      <div className="w-full max-w-2xl bg-card border rounded-3xl p-8 md:p-12 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
            Welcome to JobConnect
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            To get started, please tell us how you'll be using the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            variant="outline"
            className="h-auto flex-col items-start p-8 text-left hover:border-primary hover:bg-primary/[0.02] transition-all rounded-2xl gap-6 border-2 group"
            onClick={() => handleRoleSelection("candidate")}
          >
            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <User className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold">I'm a Candidate</div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-normal">
                I want to find and apply for my next career opportunity with ease.
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col items-start p-8 text-left hover:border-primary hover:bg-primary/[0.02] transition-all rounded-2xl gap-6 border-2 group"
            onClick={() => handleRoleSelection("recruiter")}
          >
            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Briefcase className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold">I'm a Recruiter</div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-normal">
                I want to post jobs and find the best talent for my growing team.
              </p>
            </div>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            You can always change your preferences in your profile settings later.
          </p>
        </div>
      </div>
    </div>
  );

};

export default Onboarding;

