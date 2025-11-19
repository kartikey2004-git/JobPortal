/* eslint-disable react/prop-types */
import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
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
  onJobSaved = () => {},
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

  // there is change possible here

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobSaved();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob.length > 0);
  }, [savedJob]);

  return (
    <Card className="flex flex-col p-4 sm:p-6 gap-4">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader>
        <CardTitle className="flex justify-between  text-lg sm:text-xl">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {job?.company?.logo_url && (
            <img
              src={job.company.logo_url}
              className="h-10 sm:h-7 object-contain"
              alt="Company Logo"
            />
          )}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} />
            <span className="text-sm sm:text-base">{job.location}</span>
          </div>
        </div>
        <hr />
        <p className="text-sm sm:text-base">
          {job.description.substring(0, job.description.indexOf("."))}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-4 sm:gap-2 w-full justify-between">
        <Link to={`/job/${job.id}`} className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto">
            More Details
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleSavedJobs}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} stroke="red" fill="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
