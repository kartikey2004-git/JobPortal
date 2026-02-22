/* eslint-disable react-hooks/exhaustive-deps */
import { getApplications } from "@/api/apiApplications";
import useFetch from "@/hooks/UseFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";
import { FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

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
    return <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications?.length > 0 ? (
        applications?.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-3xl bg-muted/5">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6 text-muted-foreground">
            <FileText size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3">No applications yet</h3>
          <p className="text-muted-foreground max-w-sm mb-8 text-lg">
            You haven't applied to any jobs yet. Start your journey by exploring available positions.
          </p>
          <Link to="/jobs">
            <Button size="lg" className="rounded-full px-8">
              Explore Jobs
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CreatedApplications;

