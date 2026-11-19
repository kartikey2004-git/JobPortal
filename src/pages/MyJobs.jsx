import PageHeader from "@/components/shared/PageHeader";
import PageSkeleton from "@/components/shared/PageSkeleton";
import MyApplications from "@/features/applications/MyApplications";
import MyPostedJobs from "@/features/jobs/MyPostedJobs";
import useUserRole from "@/hooks/useUserRole";

const MyJobs = () => {
  const { isLoaded, isCandidate } = useUserRole();

  if (!isLoaded) return <PageSkeleton />;

  return (
    <div className="page-shell">
      <PageHeader
        title={isCandidate ? "Applications" : "Listings"}
        description={
          isCandidate
            ? "Track and manage all your job applications in one place."
            : "Manage your active job postings and review incoming talent."
        }
      />
      {isCandidate ? <MyApplications /> : <MyPostedJobs />}
    </div>
  );
};

export default MyJobs;
