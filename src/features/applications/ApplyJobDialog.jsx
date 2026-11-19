import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import FormField from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DEFAULT_APPLICATION_STATUS,
  EDUCATION_LEVELS,
  MAX_RESUME_BYTES,
  RESUME_MIME_TYPES,
} from "@/config/constants";
import useFetch from "@/hooks/useFetch";
import { applyToJob } from "./api";

const schema = z.object({
  experience: z
    .number({ invalid_type_error: "Please enter your years of experience" })
    .int()
    .min(0, { message: "Please enter a valid number of years of experience" }),
  skills: z.string().min(1, { message: "Please list your relevant skills" }),
  education: z.enum(EDUCATION_LEVELS, {
    message: "Please select your highest level of education completed",
  }),
  resume: z
    .any()
    .refine((files) => files?.[0] && RESUME_MIME_TYPES.includes(files[0].type), {
      message: "Please upload a PDF or Word document",
    })
    .refine((files) => !files?.[0] || files[0].size <= MAX_RESUME_BYTES, {
      message: "The resume must be 5 MB or smaller",
    }),
});

/**
 * Dialog with the job application form.
 * @param {object} props
 * @param {object} props.job Job being applied to (with `company`).
 * @param {object} props.user Clerk user.
 * @param {boolean} [props.applied] Whether the user already applied (disables the trigger).
 * @param {() => void} props.fetchJob Refetches the job after a successful application.
 */
const ApplyJobDialog = ({ job, user, applied = false, fetchJob }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const { fn: submitApplication, loading, error } = useFetch(applyToJob);

  const onSubmit = async (data) => {
    const result = await submitApplication({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: DEFAULT_APPLICATION_STATUS,
      resume: data.resume[0],
    });

    if (result) {
      fetchJob();
      reset();
      setOpen(false);
    }
  };

  const triggerLabel = job.isOpen ? (applied ? "Applied" : "Apply now") : "Closed";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={job.isOpen && !applied ? "default" : "secondary"}
          disabled={!job.isOpen || applied}
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] gap-5 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-sans font-medium">Apply for {job.title}</DialogTitle>
          <DialogDescription>
            Applying at <span className="font-medium text-foreground">{job.company?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Experience (years)"
              htmlFor="experience"
              error={errors.experience?.message}
            >
              <Input
                id="experience"
                type="number"
                placeholder="e.g. 2"
                aria-invalid={Boolean(errors.experience)}
                {...register("experience", { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Key skills" htmlFor="skills" error={errors.skills?.message}>
              <Input
                id="skills"
                placeholder="React, CSS, etc."
                aria-invalid={Boolean(errors.skills)}
                {...register("skills")}
              />
            </FormField>
          </div>

          <FormField label="Education level" error={errors.education?.message}>
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  aria-label="Education level"
                  className="flex flex-col gap-3 sm:flex-row sm:gap-6"
                >
                  {EDUCATION_LEVELS.map((level) => (
                    <div key={level} className="flex items-center gap-2">
                      <RadioGroupItem value={level} id={level} />
                      <Label htmlFor={level} className="cursor-pointer font-normal">
                        {level}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </FormField>

          <FormField label="Resume (PDF/DOCX)" htmlFor="resume" error={errors.resume?.message}>
            <Input
              id="resume"
              type="file"
              accept=".pdf, .doc, .docx"
              aria-invalid={Boolean(errors.resume)}
              {...register("resume")}
            />
          </FormField>

          {error?.message && (
            <p role="alert" className="font-mono text-copy-13-mono text-destructive">
              &gt; error: {error.message}
            </p>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobDialog;
