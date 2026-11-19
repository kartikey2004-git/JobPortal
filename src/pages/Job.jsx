import { useUser } from "@clerk/clerk-react";
import { SearchX } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import MarkdownContent from "@/components/shared/MarkdownContent";
import PageSkeleton from "@/components/shared/PageSkeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplicationCard from "@/features/applications/ApplicationCard";
import ApplyJobDialog from "@/features/applications/ApplyJobDialog";
import { getSingleJob, updateHiringStatus } from "@/features/jobs/api";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";

const metaChip =
  "inline-flex items-center gap-2 rounded-sm border border-border/70 px-3 py-1.5 text-sm font-medium text-muted-foreground";

const JobPage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const { fn: fetchJob, data: job, error: jobError } = useFetch(getSingleJob);
  const { fn: changeHiringStatus, loading: updatingStatus } = useFetch(updateHiringStatus);

  useEffect(() => {
    if (isLoaded) fetchJob(id);
  }, [isLoaded, fetchJob, id]);

  const handleStatusChange = async (value) => {
    if (await changeHiringStatus(id, value === "open")) fetchJob(id);
  };

  if (!isLoaded || (!job && !jobError)) return <PageSkeleton count={2} />;

  if (!job) {
    return (
      <div className="page-shell">
        <EmptyState
          icon={SearchX}
          title="Job not found"
          description="This job may have been removed, or the link is incorrect."
          className="py-20"
        />
      </div>
    );
  }

  const isOwner = job.recruiter_id === user.id;
  const applications = job.applications ?? [];

  return (
    <div className="page-shell">
      <header className="mb-12">
        <h1 className="heading-lg">{job.title}</h1>
        <p className="mt-2 body-text">
          Posted {new Date(job.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {job.company && (
            <span className={metaChip}>
              {job.company.name}
            </span>
          )}
          <span className={metaChip}>{job.location}</span>
          {/* Candidates can only see their own application (RLS), so only the owner gets a total. */}
          {isOwner && (
            <span className={metaChip}>
              {applications.length} applicant{applications.length === 1 ? "" : "s"}
            </span>
          )}
          <span className={metaChip}>
            <span
              aria-hidden="true"
              className={cn("size-1.5 rounded-full", job.isOpen ? "bg-success" : "bg-destructive")}
            />
            {job.isOpen ? "Actively hiring" : "Hiring closed"}
          </span>
        </div>

        <div className="mt-6">
          {isOwner ? (
            <Select
              onValueChange={handleStatusChange}
              defaultValue={job.isOpen ? "open" : "closed"}
              disabled={updatingStatus}
            >
              <SelectTrigger aria-label="Hiring status" className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open for applications</SelectItem>
                <SelectItem value="closed">Close hiring</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <ApplyJobDialog
              job={job}
              user={user}
              fetchJob={() => fetchJob(id)}
              applied={applications.some((application) => application.candidate_id === user.id)}
            />
          )}
        </div>
      </header>

      <section className="border-t border-border/60 py-10">
        <p className="eyebrow mb-3">About the role</p>
        <p className="body-text max-w-xl text-foreground">{job.description}</p>
      </section>

      <section className="border-t border-border/60 py-10">
        <p className="eyebrow mb-3">What we&apos;re looking for</p>
        <div className=" p-4 sm:p-6">
          <MarkdownContent source={job.requirements} />
        </div>
      </section>

      {isOwner && applications.length > 0 && (
        <section className="border-t border-border/60 pt-10">
          <p className="eyebrow mb-3">Applications · {applications.length}</p>
          <div className="-ml-3 space-y-4 md:-ml-5">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default JobPage;
