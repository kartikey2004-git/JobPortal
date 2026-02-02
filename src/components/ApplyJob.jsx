/* eslint-disable react/prop-types */
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/UseFetch";
import { applyToJob } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Please enter a valid number of years of experience" })
    .int(),

  skills: z.string().min(1, { message: "Please list your relevant skills" }),

  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Please select your highest level of education completed",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Please upload a PDF or Word document" },
    ),
});

const ApplyJobDrawer = ({ job, user, applied = false, fetchJob }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    })
      .then((res) => {
        console.log(res);
        fetchJob();
        reset();
      })
      .catch((error) => {
        console.log("Application failed:", error);
      });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "default" : "secondary"}
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="font-normal">
            Submit application for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please complete the form below</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <Input
            type="number"
            placeholder="Experience in years"
            className="flex-1"
            {...register("experience", {
              valueAsNumber: true,
            })}
          />
          {errors.experience && (
            <p className="text-destructive text-sm">
              {errors.experience.message}
            </p>
          )}

          <Input
            type="text"
            placeholder="Skills (comma-separated)"
            className="flex-1"
            {...register("skills")}
          />

          {errors.skills && (
            <p className="text-destructive text-sm">{errors.skills.message}</p>
          )}

          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label htmlFor="intermediate" className="font-normal">
                    Intermediate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="graduate" />
                  <Label className="font-normal" htmlFor="graduate">
                    Graduate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="post-graduate" />
                  <Label className="font-normal" htmlFor="post-graduate">
                    Post Graduate
                  </Label>
                </div>
              </RadioGroup>
            )}
          />

          {errors.education && (
            <p className="text-destructive text-sm">
              {errors.education.message}
            </p>
          )}

          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-muted-foreground"
            {...register("resume")}
          />

          {errors.resume && (
            <p className="text-destructive text-sm">{errors.resume.message}</p>
          )}

          {errorApply?.message && (
            <p className="text-destructive text-sm">{errorApply?.message}</p>
          )}

          {loadingApply && <BarLoader width={"100%"} color="#000000" />}

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="font-normal"
          >
            Submit application
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="font-normal" variant="outline">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
