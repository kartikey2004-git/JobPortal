/* eslint-disable react-hooks/exhaustive-deps */
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import ApplicationCard from "@/components/ApplicationCard";
import ApplyJobDrawer from "@/components/ApplyJob";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/UseFetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { BriefcaseIcon, DoorClosed, DoorOpen, MapPinIcon, Calendar, Users } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const JobPage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    },
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />;
  }

  return (
    <div className="max-w-5xl mx-auto pt-10 pb-20 px-4 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b pb-10">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Calendar size={14} />
            Posted on {new Date(job?.created_at).toLocaleDateString()}
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            {job?.title}
          </h1>
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon size={18} className="text-primary" />
              <span className="font-semibold text-foreground">{job?.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users size={18} className="text-primary" />
              <span className="font-semibold text-foreground">{job?.applications?.length} Applicants</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full animate-pulse ${job?.isOpen ? "bg-green-500" : "bg-red-500"}`} />
              <span className="font-semibold text-foreground capitalize">{job?.isOpen ? "Actively Hiring" : "Hiring Closed"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          {job?.company?.logo_url && (
            <div className="p-4 rounded-2xl bg-white  overflow-hidden h-24 w-24 flex items-center justify-center">
              <img
                src={job.company.logo_url}
                alt={job?.company?.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">About the Role</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {job?.description}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">What we're looking for</h2>
            <div className="rounded-xl border bg-muted/5 px-6 py-4">
              <MDEditor.Markdown
                source={job?.requirements}
                className="prose dark:prose-invert max-w-none bg-transparent"
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {job?.recruiter_id === user?.id ? (
              <div className="p-6 border rounded-2xl bg-card shadow-sm space-y-4">
                <h3 className="font-bold">Hiring Management</h3>
                <Select onValueChange={handleStatusChange} defaultValue={job?.isOpen ? "open" : "closed"}>
                  <SelectTrigger className={`w-full font-semibold ${job?.isOpen ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open for applications</SelectItem>
                    <SelectItem value="closed">Close hiring</SelectItem>
                  </SelectContent>
                </Select>
                {loadingHiringStatus && <BarLoader width={"100%"} color="hsl(var(--primary))" />}
              </div>
            ) : (
              <ApplyJobDrawer
                job={job}
                user={user}
                fetchJob={fnJob}
                applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
              />
            )}
          </div>
        </div>
      </div>

      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="space-y-6 pt-10 border-t">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            Received Applications
            <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {job?.applications.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {job?.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPage;

