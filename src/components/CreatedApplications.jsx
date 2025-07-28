/* eslint-disable react-hooks/exhaustive-deps */
import { getApplications } from "@/api/apiApplications";
import useFetch from "@/hooks/UseFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
  }, []);

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {applications?.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          isCandidate={true}
        />
      ))}
    </div>
  );
};

export default CreatedApplications;