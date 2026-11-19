import { useUser } from "@clerk/clerk-react";
import { Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { UnderlineLink } from "@/components/shared/UnderlineLink";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/config/constants";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";
import { deleteJob, toggleSavedJob } from "./api";

/**
 * One row of a job list.
 * @param {object} props
 * @param {object} props.job Job row including `company`.
 * @param {boolean} [props.isMyJob] Recruiter view: shows delete instead of save.
 * @param {boolean} [props.savedinit] Whether the job starts out saved.
 * @param {() => void} [props.onJobSaved] Called after a save/unsave/delete succeeds.
 */
const JobCard = ({ job, isMyJob = false, savedinit = false, onJobSaved = () => {} }) => {
  const { user } = useUser();
  const [saved, setSaved] = useState(savedinit);

  const { fn: runToggleSaved, loading: savingJob } = useFetch(toggleSavedJob);
  const { fn: runDeleteJob, loading: deletingJob } = useFetch(deleteJob);

  const href = ROUTES.JOB(job.id);

  const handleToggleSaved = async () => {
    const result = await runToggleSaved({
      alreadySaved: saved,
      user_id: user.id,
      job_id: job.id,
    });
    if (result) {
      setSaved(result.length > 0);
      onJobSaved();
    }
  };

  const handleDelete = async () => {
    if (await runDeleteJob(job.id)) onJobSaved();
  };

  return (
    <Card
      className={cn(
        "interactive-row border-0 bg-transparent p-3 shadow-none sm:p-5 lg:p-6",
        deletingJob && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex flex-col space-y-2">
        <h3 className="font-sans text-lg font-[450] tracking-[-0.03em] text-foreground sm:text-2xl">
          <Link to={href} className="transition-colors">
            {job.title}
          </Link>
        </h3>

        <p className="body-text line-clamp-2">{job.description}</p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 text-xs text-muted-foreground sm:text-sm">
            <span className="truncate">{job.company?.name}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {isMyJob ? (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={handleDelete}
                disabled={deletingJob}
                aria-label={`Delete ${job.title}`}
              >
                <Trash2 />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(saved ? "text-destructive" : "text-muted-foreground")}
                onClick={handleToggleSaved}
                disabled={savingJob}
                aria-pressed={saved}
                aria-label={saved ? "Remove from saved jobs" : "Save job"}
              >
                <Heart className={cn(saved && "fill-current")} />
              </Button>
            )}

            <Button
              asChild
              variant="link"
              className="h-auto p-0 pl-2 text-xs no-underline hover:no-underline sm:text-sm"
            >
              <UnderlineLink to={href}>View details</UnderlineLink>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
