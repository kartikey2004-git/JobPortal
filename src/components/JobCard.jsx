/* eslint-disable react/prop-types */
import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/UseFetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  isMyJob = false,
  savedinit = false,
  onJobSaved = () => { },
}) => {
  const [saved, setSaved] = useState(savedinit);

  const {
    fn: fnSavedJob,
    data: savedJob,
    loading: loadingSavedJob,
  } = useFetch(saveJob, {
    alreadySaved: saved,
  });

  const { user } = useUser();

  const handleSavedJobs = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobSaved();
  };

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobSaved();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob.length > 0);
  }, [savedJob]);

  return (
    <Card className="flex flex-col border bg-card transition-all duration-200">
      {loadingDeleteJob && (
        <BarLoader className="w-full" color="hsl(var(--primary))" />
      )}
      <CardHeader className="pb-3 px-6 pt-6">
        <CardTitle className="flex justify-between items-start gap-2">
          <span className="text-xl font-bold tracking-tight">{job.title}</span>
          {isMyJob && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive transition-colors h-8 w-8"
              onClick={handleDeleteJob}
            >
              <Trash2Icon size={16} />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {job?.company?.logo_url && (
              <div className="h-8 w-8 rounded p-1 flex items-center justify-center overflow-hidden">
                <img
                  src={job.company.logo_url}
                  className="max-h-full max-w-full object-contain"
                  alt={job.company.name}
                />
              </div>
            )}
            <span className="text-sm font-medium text-muted-foreground">
              {job?.company?.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPinIcon size={14} />
            <span className="text-xs font-medium">{job.location}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </CardContent>

      <CardFooter className="flex gap-3 p-6 pt-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="outline" className="w-full justify-between hover:bg-primary hover:text-primary-foreground transition-all">
            View details
            <ExternalLink size={14} className="ml-2 opacity-50" />
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="ghost"
            size="icon"
            className={`border transition-all ${saved ? "bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200 dark:border-red-900" : "text-muted-foreground"}`}
            onClick={handleSavedJobs}
            disabled={loadingSavedJob}
          >
            <Heart size={18} className={saved ? "fill-current" : ""} />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;

