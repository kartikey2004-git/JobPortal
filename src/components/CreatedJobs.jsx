/* eslint-disable react-hooks/exhaustive-deps */
import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/UseFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    data: createdJobs,
    fn: fnCreatedJobs,
    loading: loadingCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedJobs();
  }, []);

  if (loadingCreatedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <>
      {loadingCreatedJobs === false && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  onJobSaved={fnCreatedJobs}
                  isMyJob={true}
                />
              );
            })
          ) : (
            <div>No Jobs found</div>
          )}
        </div>
      )}
    </>
  );
};

export default CreatedJobs;
