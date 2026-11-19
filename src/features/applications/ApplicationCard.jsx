import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPLICATION_STATUSES } from "@/config/constants";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";
import { getResumeSignedUrl, updateApplicationStatus } from "./api";

const STATUS_BADGE_CLASSES = {
  applied: "text-muted-foreground",
  interviewing: "border-warning/40 text-warning",
  hired: "border-success/40 text-success",
  rejected: "border-destructive/40 text-destructive",
};

const detailChip =
  "rounded-sm border border-border/70 px-3 py-1.5 text-sm font-medium text-muted-foreground";

/**
 * One application row.
 * @param {object} props
 * @param {object} props.application Application row (with `job` when `isCandidate`).
 * @param {boolean} [props.isCandidate] Candidate view is read-only; recruiter view can change status.
 */
const ApplicationCard = ({ application, isCandidate = false }) => {
  const { fn: changeStatus, loading: updatingStatus } = useFetch(updateApplicationStatus);
  const {
    fn: fetchResumeUrl,
    loading: openingResume,
    error: resumeError,
  } = useFetch(getResumeSignedUrl);

  const handleOpenResume = async () => {
    // Open the tab synchronously (inside the click) so browsers don't block it as a popup,
    // then point it at the signed URL once Supabase has issued it.
    const tab = window.open("about:blank", "_blank");
    const url = await fetchResumeUrl(application.resume);

    if (url && tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      tab?.close();
    }
  };

  return (
    <Card className="border-0 bg-transparent p-3 shadow-none sm:p-5 lg:p-6">
      <div className="flex flex-col space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-sans text-lg font-[450] tracking-[-0.03em] text-foreground sm:text-2xl">
              {isCandidate ? application.job?.title : application.name}
            </h3>
            <p className="body-text">
              {isCandidate ? application.job?.company?.name : "Candidate"}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground"
            onClick={handleOpenResume}
            disabled={openingResume}
            aria-label="Open resume"
          >
            <Download />
          </Button>
        </div>

        {resumeError?.message && (
          <p role="alert" className="font-mono text-copy-13-mono text-destructive">
            &gt; error: {resumeError.message}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <span className={detailChip}>{application.experience} years experience</span>
          <span className={detailChip}>{application.education}</span>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground/60">
            Skills
          </p>
          <p className="body-text text-foreground">{application.skills}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <time className="text-xs text-muted-foreground sm:text-sm">
            {new Date(application.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>

          {isCandidate ? (
            <Badge
              variant="outline"
              className={cn("capitalize", STATUS_BADGE_CLASSES[application.status])}
            >
              {application.status}
            </Badge>
          ) : (
            <Select
              onValueChange={(status) => changeStatus(application.id, status)}
              defaultValue={application.status}
              disabled={updatingStatus}
            >
              <SelectTrigger size="sm" aria-label="Application status" className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STATUSES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ApplicationCard;
