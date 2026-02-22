import CreatedApplications from "@/components/CreatedApplications";
import CreatedJobs from "@/components/CreatedJobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />;
  }

  const isCandidate = user?.unsafeMetadata?.role === "candidate";

  return (
    <div className="space-y-10 pt-10 pb-20">
      <div className="flex flex-col gap-4 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {isCandidate ? "My Applications" : "My Job Listings"}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {isCandidate
            ? "Track and manage all your job applications in one place."
            : "Manage your active job postings and review incoming talent."}
        </p>
      </div>

      <div className="pt-4">
        {isCandidate ? <CreatedApplications /> : <CreatedJobs />}
      </div>
    </div>
  );
};

export default MyJobs;

