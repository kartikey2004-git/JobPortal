/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { BriefcaseBusinessIcon, Users } from "lucide-react";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // Handle role selection and update user metadata
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

  // Navigate to respective page based on role
  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(
        user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs",
      );
    }
  }, [user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#000000" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16 -mt-20">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
            Welcome to
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {" "}
              JobConnect
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Choose your journey
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            I am a...
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative">
            <Button
              className="relative h-24 w-full text-sm font-medium bg-background border border-primary/20 hover:border-primary/40 shadow-md  transition-all duration-300 hover:scale-[1.01] rounded-xl flex flex-col gap-2"
              variant="outline"
              onClick={() => handleRoleSelection("candidate")}
            >
              <Users className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div className="text-base font-semibold">Candidate</div>
                <div className="text-xs text-muted-foreground">
                  Find your dream job
                </div>
              </div>
            </Button>
          </div>

          <div className="group relative">
            <Button
              className="relative h-24 w-full text-sm font-medium bg-background border border-secondary/20 hover:border-secondary/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-xl flex flex-col gap-2"
              variant="outline"
              onClick={() => handleRoleSelection("recruiter")}
            >
              <BriefcaseBusinessIcon className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div className="text-base font-semibold">Recruiter</div>
                <div className="text-xs text-muted-foreground">
                  Post job opportunities
                </div>
              </div>
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Join thousands of professionals already using JobConnect
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
