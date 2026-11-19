import { useUser } from "@clerk/clerk-react";
import { Briefcase } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import AsyncList from "@/components/shared/AsyncList";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/config/constants";
import useFetch from "@/hooks/useFetch";
import { getMyJobs } from "./api";
import JobCard from "./JobCard";

/** Recruiter dashboard: jobs the current user has posted. */
const MyPostedJobs = () => {
  const { user } = useUser();
  const { data: jobs, fn: fetchJobs, loading, error } = useFetch(getMyJobs);

  useEffect(() => {
    fetchJobs(user.id);
  }, [fetchJobs, user.id]);

  const refetch = () => fetchJobs(user.id);

  return (
    <AsyncList
      items={jobs}
      loading={loading}
      error={error}
      onRetry={refetch}
      empty={
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Start reaching out to talent by creating your first job posting."
          className="py-20"
          action={
            <Button asChild variant="outline" size="sm">
              <Link to={ROUTES.POST_JOB}>Post a job</Link>
            </Button>
          }
        />
      }
    >
      {jobs?.map((job) => (
        <JobCard key={job.id} job={job} isMyJob onJobSaved={refetch} />
      ))}
    </AsyncList>
  );
};

export default MyPostedJobs;
