import CreatedApplications from "@/components/CreatedApplications";
import CreatedJobs from "@/components/CreatedJobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#000000" />;
  }

  return (
    <div>
      <h1 className="text-4xl text-center pb-8 mt-16">
        {user?.unsafeMetadata?.role === "candidate"
          ? "My Applications"
          : "My Jobs"}
      </h1>

      {user?.unsafeMetadata?.role === "candidate" ? (
        <div className="mt-8">
          <CreatedApplications />
        </div>
      ) : (
        <div className="mt-8">
          <CreatedJobs />
        </div>
      )}
    </div>
  );
};

export default MyJobs;
