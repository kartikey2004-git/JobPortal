/* eslint-disable react-hooks/exhaustive-deps */
import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/AddCompanyDrawer";
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
import useFetch from "@/hooks/UseFetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";
import { Briefcase, MapPin, Building2, ListTodo, FileText } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  description: z.string().min(1, { message: "Job description is required" }),
  location: z.string().min(1, { message: "Please select a location" }),
  company_id: z.string().min(1, { message: "Please select or add a company" }),
  requirements: z.string().min(1, { message: "Job requirements are required" }),
});

const PostJob = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const {
    loading: loadingCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
    error: errorCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20 px-4 space-y-10">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight">Create a New Job Opening</h1>
        <p className="text-muted-foreground text-lg">
          Provide detailed information to attract the most qualified candidates for your team.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-card border rounded-2xl p-6 md:p-10 shadow-sm"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <Briefcase size={14} />
              Basic Information
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Ex: Senior Frontend Engineer"
                {...register("title")}
                className={`h-12 text-lg font-medium bg-background ${errors.title ? "border-destructive" : ""}`}
              />
              {errors.title && <p className="text-sm text-destructive font-medium">{errors.title.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <FileText size={14} />
              Job Overview
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Describe the role, team, and day-to-day responsibilities..."
                {...register("description")}
                className={`min-h-[120px] bg-background text-base ${errors.description ? "border-destructive" : ""}`}
              />
              {errors.description && <p className="text-sm text-destructive font-medium">{errors.description.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <MapPin size={14} />
                Location
              </div>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`h-11 bg-background ${errors.location ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Select work location" />
                    </SelectTrigger>
                    <SelectContent>
                      {State.getStatesOfCountry("IN").map(({ name }) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && <p className="text-sm text-destructive font-medium">{errors.location.message}</p>}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <Building2 size={14} />
                Company
              </div>
              <div className="flex gap-2">
                <Controller
                  name="company_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={`h-11 flex-1 bg-background ${errors.company_id ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies?.map(({ name, id }) => (
                          <SelectItem key={id} value={id.toString()}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <AddCompanyDrawer fetchCompanies={fnCompanies} />
              </div>
              {errors.company_id && <p className="text-sm text-destructive font-medium">{errors.company_id.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <ListTodo size={14} />
              Detailed Requirements (Markdown)
            </div>
            <div className={`rounded-md border bg-white overflow-hidden ${errors.requirements ? "border-destructive" : ""}`} data-color-mode="light">
              <Controller
                name="requirements"
                control={control}
                render={({ field }) => (
                  <MDEditor
                    value={field.value}
                    onChange={field.onChange}
                    preview="edit"
                    height={300}
                    className="border-none bg-white md-editor-white"
                  />
                )}
              />
            </div>
            {errors.requirements && <p className="text-sm text-destructive font-medium">{errors.requirements.message}</p>}
          </div>
        </div>

        <div className="pt-6 border-t space-y-4">
          {errorCreateJob?.message && (
            <p className="text-sm text-destructive font-bold text-center">{errorCreateJob?.message}</p>
          )}
          {loadingCreateJob && <BarLoader width={"100%"} color="hsl(var(--primary))" />}

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/10 transition-all hover:scale-[1.01]"
            disabled={loadingCreateJob}
          >
            {loadingCreateJob ? "Creating Position..." : "Post Job Opening"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
