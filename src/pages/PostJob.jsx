import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import FormField from "@/components/shared/FormField";
import PageHeader from "@/components/shared/PageHeader";
import PageSkeleton from "@/components/shared/PageSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { JOB_LOCATION_COUNTRY, ROUTES } from "@/config/constants";
import { getCompanies } from "@/features/companies/api";
import AddCompanyDialog from "@/features/companies/AddCompanyDialog";
import { addNewJob } from "@/features/jobs/api";
import useFetch from "@/hooks/useFetch";
import useUserRole from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";

const LOCATIONS = State.getStatesOfCountry(JOB_LOCATION_COUNTRY);

const schema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  description: z.string().min(1, { message: "Job description is required" }),
  location: z.string().min(1, { message: "Please select a location" }),
  company_id: z.string().min(1, { message: "Please select or add a company" }),
  requirements: z.string().min(1, { message: "Job requirements are required" }),
});

const PostJob = () => {
  const { user, isLoaded, isRecruiter } = useUserRole();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const { fn: fetchCompanies, data: companies, error: companiesError } = useFetch(getCompanies);
  const { fn: createJob, loading: creatingJob, error: createJobError } = useFetch(addNewJob);

  useEffect(() => {
    if (isLoaded) fetchCompanies();
  }, [isLoaded, fetchCompanies]);

  const onSubmit = async (data) => {
    const created = await createJob({ ...data, recruiter_id: user.id, isOpen: true });
    if (created?.length > 0) navigate(ROUTES.JOBS);
  };

  if (!isLoaded || (!companies && !companiesError)) return <PageSkeleton count={2} />;

  if (!isRecruiter) return <Navigate to={ROUTES.JOBS} />;

  return (
    <div className="page-shell">
      <PageHeader
        title="Post a job"
        description="Provide detailed information to attract the most qualified candidates."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField label="Job title" htmlFor="title" error={errors.title?.message}>
          <Input
            id="title"
            placeholder="e.g. Senior Frontend Engineer"
            aria-invalid={Boolean(errors.title)}
            {...register("title")}
          />
        </FormField>

        <FormField label="Overview" htmlFor="description" error={errors.description?.message}>
          <Textarea
            id="description"
            className="min-h-32"
            placeholder="Describe the role, team, and day-to-day responsibilities…"
            aria-invalid={Boolean(errors.description)}
            {...register("description")}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField label="Location" htmlFor="location" error={errors.location?.message}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="location"
                    className="w-full"
                    aria-invalid={Boolean(errors.location)}
                  >
                    <SelectValue placeholder="Select work location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField label="Company" htmlFor="company" error={errors.company_id?.message}>
            <div className="flex gap-2">
              <Controller
                name="company_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="company"
                      className="min-w-0 flex-1"
                      aria-invalid={Boolean(errors.company_id)}
                    >
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies?.map(({ name, id }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <AddCompanyDialog fetchCompanies={fetchCompanies} />
            </div>
          </FormField>
        </div>

        <FormField label="Requirements (Markdown)" error={errors.requirements?.message}>
          <div
            data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
            className={cn(
              "overflow-hidden rounded-md border border-border",
              errors.requirements && "border-destructive",
            )}
          >
            <Controller
              name="requirements"
              control={control}
              render={({ field }) => (
                <MDEditor
                  value={field.value}
                  onChange={field.onChange}
                  preview="edit"
                  height={300}
                />
              )}
            />
          </div>
        </FormField>

        <div className="space-y-3 border-t border-border/60 pt-6">
          {createJobError?.message && (
            <p role="alert" className="font-mono text-copy-13-mono text-destructive">
              &gt; error: {createJobError.message}
            </p>
          )}
          <Button type="submit" size="lg" disabled={creatingJob}>
            {creatingJob ? "Creating…" : "Post job"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
