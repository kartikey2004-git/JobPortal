/* eslint-disable react-hooks/exhaustive-deps */
import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/UseFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";
import { Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    data: createdJobs,
    fn: fnCreatedJobs,
    loading: loadingCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedJobs();
  }, []);

  if (loadingCreatedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {createdJobs?.length ? (
        createdJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onJobSaved={fnCreatedJobs}
            isMyJob={true}
          />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-3xl bg-muted/5">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6 text-muted-foreground">
            <Briefcase size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">No jobs posted yet</h3>
          <p className="text-muted-foreground max-w-sm mb-8 text-lg">
            Start reaching out to talent by creating your first job posting today.
          </p>
          <Link to="/post-job">
            <Button size="lg" className="rounded-full px-8">
              Post a New Job
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;

