import { useUser } from "@clerk/clerk-react";
import { FileText } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import AsyncList from "@/components/shared/AsyncList";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/config/constants";
import useFetch from "@/hooks/useFetch";
import { getApplications } from "./api";
import ApplicationCard from "./ApplicationCard";

/** Candidate dashboard: applications the current user has submitted. */
const MyApplications = () => {
  const { user } = useUser();
  const { data: applications, fn: fetchApplications, loading, error } = useFetch(getApplications);

  useEffect(() => {
    fetchApplications(user.id);
  }, [fetchApplications, user.id]);

  return (
    <AsyncList
      items={applications}
      loading={loading}
      error={error}
      onRetry={() => fetchApplications(user.id)}
      empty={
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="You haven't applied to any jobs yet. Start by exploring available positions."
          className="py-20"
          action={
            <Button asChild variant="outline" size="sm">
              <Link to={ROUTES.JOBS}>Explore jobs</Link>
            </Button>
          }
        />
      }
    >
      {applications?.map((application) => (
        <ApplicationCard key={application.id} application={application} isCandidate />
      ))}
    </AsyncList>
  );
};

export default MyApplications;
