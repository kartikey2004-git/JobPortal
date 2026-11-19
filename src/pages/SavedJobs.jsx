import { useUser } from "@clerk/clerk-react";
import { Heart } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import AsyncList from "@/components/shared/AsyncList";
import PageHeader from "@/components/shared/PageHeader";
import PageSkeleton from "@/components/shared/PageSkeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/config/constants";
import { getSavedJobs } from "@/features/jobs/api";
import JobCard from "@/features/jobs/JobCard";
import useFetch from "@/hooks/useFetch";

const SavedJobs = () => {
  const { isLoaded } = useUser();
  const { data: savedJobs, fn: fetchSavedJobs, loading, error } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) fetchSavedJobs();
  }, [isLoaded, fetchSavedJobs]);

  if (!isLoaded) return <PageSkeleton />;

  return (
    <div className="page-shell">
      <PageHeader
        title="Saved jobs"
        description="Keep track of positions you're interested in and apply when you're ready."
      />

      <AsyncList
        items={savedJobs}
        loading={loading}
        error={error}
        onRetry={fetchSavedJobs}
        empty={
          <EmptyState
            icon={Heart}
            title="No saved jobs yet"
            description="When you find a job you like, tap the heart to save it for later."
            className="py-20"
            action={
              <Button asChild variant="outline" size="sm">
                <Link to={ROUTES.JOBS}>Discover jobs</Link>
              </Button>
            }
          />
        }
      >
        {savedJobs?.map((saved) => (
          <JobCard key={saved.id} job={saved.job} savedinit onJobSaved={fetchSavedJobs} />
        ))}
      </AsyncList>
    </div>
  );
};

export default SavedJobs;
