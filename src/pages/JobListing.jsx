/* eslint-disable react-hooks/exhaustive-deps */
import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/UseFetch";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Search, X, MapPin, Building2, SlidersHorizontal } from "lucide-react";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  const { fn: fnCompanies, data: companies } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query !== searchQuery) setSearchQuery(query || "");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />;
  }

  return (
    <div className="space-y-10 pt-10 pb-20">
      <div className="flex flex-col gap-4 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Find your next breakthrough
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Discover opportunities from top companies worldwide. Use the filters below to narrow down your search.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <form
          onSubmit={handleSearch}
          className="relative flex w-full max-w-3xl items-center"
        >
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by job title, company, or keywords..."
            name="search-query"
            defaultValue={searchQuery}
            className="h-14 pl-12 pr-4 text-lg border-2 focus-visible:ring-primary/20 transition-all rounded-xl"
          />
          <Button type="submit" className="absolute right-2 h-10 px-6 rounded-lg font-medium">
            Search
          </Button>
        </form>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 border-y py-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground pr-4 lg:border-r">
            <SlidersHorizontal size={16} />
            Filters
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex flex-1 gap-4 w-full">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-10 lg:w-[240px] bg-background">
                <MapPin className="h-4 w-4 mr-2 opacity-50" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {State.getStatesOfCountry("IN").map(({ name }) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={company_id} onValueChange={setCompany_id}>
              <SelectTrigger className="h-10 lg:w-[240px] bg-background">
                <Building2 className="h-4 w-4 mr-2 opacity-50" />
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                {companies?.map(({ name, id }) => (
                  <SelectItem key={id} value={id}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(location || company_id || searchQuery) && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="h-10 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            )}
          </div>

          <div className="text-sm font-medium text-muted-foreground lg:ml-auto">
            {jobs?.length || 0} jobs found
          </div>
        </div>
      </div>

      {loadingJobs ? (
        <div className="py-20 flex justify-center">
          <BarLoader width={200} color="hsl(var(--primary))" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.length ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedinit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl bg-muted/5">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No jobs matched your search</h3>
              <p className="text-muted-foreground max-w-sm">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <Button variant="outline" className="mt-6" onClick={clearFilters}>
                Reset Search
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;

