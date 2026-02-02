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
import { BriefcaseIcon, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const JobPage = () => {
  const { isLoaded, user } = useUser();
  console.log(user);

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
    return <BarLoader className="mb-4" width={"100%"} color="#000000" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5 p-4 sm:p-6">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="pb-3 text-2xl sm:text-4xl md:text-4xl font-semibold">
          {job?.title}
        </h1>
        <img
          src={job?.company?.logo_url}
          alt={job?.title}
          className="h-12 md:h-12 w-auto object-contain"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="flex gap-2 items-center">
          <MapPinIcon />
          <span>{job?.location}</span>
        </div>

        <div className="flex gap-2 items-center">
          <BriefcaseIcon />
          <span>{job?.applications?.length} applicants</span>
        </div>

        <div className="flex gap-2 items-center">
          {job?.isOpen ? (
            <>
              <DoorOpen />
              <span>Open</span>
            </>
          ) : (
            <>
              <DoorClosed />
              <span>Closed</span>
            </>
          )}
        </div>
      </div>

      {/* Hiring Status */}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#000000" />}

      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}
          >
            <SelectValue
              placeholder={`Hiring status ${job?.isOpen ? "(Open)" : "(Closed)"}`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
        About the job
      </h2>
      <p className="text-sm sm:text-lg">{job?.description}</p>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={job?.requirements}
        className="bg-transparent text-sm sm:text-lg"
      />

      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}

      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Applications
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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
