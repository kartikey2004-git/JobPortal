/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

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
        user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs"
      );
    }
  }, [user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-16 md:mt-32 px-4 sm:px-8 lg:px-16">
      <h2 className="gradient-title font-semibold text-4xl tracking-tighter text-center">
        I am a...
      </h2>

      <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-3/4 lg:w-1/2">
        <Button
          variant="blue"
          className="h-24 sm:h-36 text-lg sm:text-2xl"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-24 sm:h-36 text-lg sm:text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;