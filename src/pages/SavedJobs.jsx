/* eslint-disable react-hooks/exhaustive-deps */
import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import useFetch from "@/hooks/UseFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />;
  }

  return (
    <div className="space-y-10 pt-10 pb-20">
      <div className="flex flex-col gap-4 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your Saved Jobs</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Keep track of positions you're interested in. Review them here and apply when you're ready.
        </p>
      </div>

      {loadingSavedJobs ? (
        <div className="py-20 flex justify-center">
          <BarLoader width={200} color="hsl(var(--primary))" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs?.length ? (
            savedJobs.map((saved) => (
              <JobCard
                key={saved.id}
                job={saved?.job}
                savedinit={true}
                onJobSaved={fnSavedJobs}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-3xl bg-muted/5">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6 text-muted-foreground">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">No saved jobs yet</h3>
              <p className="text-muted-foreground max-w-sm mb-8 text-lg">
                When you find a job you like, click the heart icon to save it for later.
              </p>
              <Link to="/jobs">
                <Button size="lg" className="rounded-full px-8">
                  Discover Opportunities
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;

