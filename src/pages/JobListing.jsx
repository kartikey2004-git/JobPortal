import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AsyncList from "@/components/shared/AsyncList";
import PageHeader from "@/components/shared/PageHeader";
import PageSkeleton from "@/components/shared/PageSkeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_LOCATION_COUNTRY } from "@/config/constants";
import { getCompanies } from "@/features/companies/api";
import { getJobs } from "@/features/jobs/api";
import JobCard from "@/features/jobs/JobCard";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";

const LOCATIONS = State.getStatesOfCountry(JOB_LOCATION_COUNTRY);

const JobListing = () => {
  const { isLoaded } = useUser();
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const [location, setLocation] = useState("");
  const [companyId, setCompanyId] = useState("");

  const { fn: fetchJobs, data: jobs, loading, error } = useFetch(getJobs);
  const { fn: fetchCompanies, data: companies } = useFetch(getCompanies);

  const filters = { location, company_id: companyId, searchQuery };
  const hasFilters = Boolean(location || companyId || searchQuery);

  useEffect(() => {
    if (isLoaded) fetchCompanies();
  }, [isLoaded, fetchCompanies]);

  useEffect(() => {
    if (isLoaded) fetchJobs({ location, company_id: companyId, searchQuery });
  }, [isLoaded, fetchJobs, location, companyId, searchQuery]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(draft.trim());
  };

  const clearSearch = () => {
    setDraft("");
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const clearFilters = () => {
    setDraft("");
    setSearchQuery("");
    setCompanyId("");
    setLocation("");
  };

  if (!isLoaded) return <PageSkeleton />;

  return (
    <div className="page-shell">
      <PageHeader
        title="Jobs"
        description="Discover opportunities from top companies worldwide."
      />

      <form onSubmit={handleSearch} role="search" className="mb-4">
        <div
          className={cn(
            "relative flex items-center rounded-md border transition-colors duration-200",
            focused ? "border-foreground/30 bg-accent/30" : "border-border/50 bg-background",
          )}
        >
          <Search className="ml-3 size-4 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search jobs by title…"
            aria-label="Search jobs by title"
            className="h-auto flex-1 border-0 bg-transparent px-3 py-2.5 text-sm shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0 dark:bg-transparent"
          />
          {draft && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={clearSearch}
              aria-label="Clear search"
              className="mr-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      </form>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger size="sm" aria-label="Filter by location" className="w-44">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map(({ name }) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={companyId} onValueChange={setCompanyId}>
          <SelectTrigger size="sm" aria-label="Filter by company" className="w-44">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            {companies?.map(({ name, id }) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            type="button"
            variant="link"
            onClick={clearFilters}
            className="h-auto p-0 px-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}

        <p className="ml-auto font-mono text-xs text-muted-foreground">
          {jobs?.length ?? 0} job{jobs?.length === 1 ? "" : "s"}
        </p>
      </div>

      <AsyncList
        items={jobs}
        loading={loading}
        error={error}
        onRetry={() => fetchJobs(filters)}
        empty={
          <EmptyState
            icon={Search}
            title="No jobs matched your search"
            description="Try adjusting your filters or search terms."
            className="py-20"
            action={
              hasFilters && (
                <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                  Reset search
                </Button>
              )
            }
          />
        }
      >
        {jobs?.map((job) => (
          <JobCard key={job.id} job={job} savedinit={job.saved?.length > 0} />
        ))}
      </AsyncList>
    </div>
  );
};

export default JobListing;
