/* eslint-disable react/prop-types */
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
import { Upload, Briefcase, GraduationCap, Code2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FileUser } from 'lucide-react';

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
          file[0].type === "application/msword" ||
          file[0].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
      { message: "Please upload a PDF or Word document" },
    ),
});

const ApplyJobDrawer = ({ job, user, applied = false, fetchJob }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const selectedFile = watch("resume");

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
      .then(() => {
        fetchJob();
        reset();
      })
      .catch((error) => {
        console.log("Application failed:", error);
      });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="default"
          variant={job?.isOpen && !applied ? "default" : "secondary"}
          disabled={!job?.isOpen || applied}
          className="h-8 px-4 text-xs sm:h-10 sm:px-6 sm:text-sm font-semibold shadow-sm transition-all"
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply Now") : "Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] sm:max-h-[85vh]">
        <div className="mx-auto w-full max-w-lg px-6 overflow-y-auto no-scrollbar">
          <DrawerHeader className="px-0 text-left pt-6 pb-4">
            <DrawerTitle className="text-xl font-bold tracking-tight">
              Apply for {job?.title}
            </DrawerTitle>
            <DrawerDescription className="text-sm">
              Applying at <span className="font-semibold text-foreground">{job?.company?.name}</span>
            </DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-semibold">Experience (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="e.g. 2"
                  className="h-11"
                  {...register("experience", { valueAsNumber: true })}
                />
                {errors.experience && (
                  <p className="text-destructive text-xs font-medium mt-1">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-semibold">Key Skills</Label>
                <Input
                  id="skills"
                  type="text"
                  placeholder="React, CSS, etc."
                  className="h-11"
                  {...register("skills")}
                />
                {errors.skills && (
                  <p className="text-destructive text-xs font-medium mt-1">
                    {errors.skills.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Education Level</Label>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-6"
                  >
                    {["Intermediate", "Graduate", "Post Graduate"].map((level) => (
                      <div key={level} className="flex items-center space-x-3">
                        <RadioGroupItem value={level} id={level} className="h-5 w-5 border-2" />
                        <Label htmlFor={level} className="text-sm font-medium cursor-pointer">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.education && (
                <p className="text-destructive text-xs font-medium mt-1">
                  {errors.education.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume" className="text-sm font-semibold">Resume (PDF/DOCX)</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf, .doc, .docx"
                className="file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold h-auto py-2"
                {...register("resume")}
              />
              {errors.resume && (
                <p className="text-destructive text-xs font-medium mt-1">
                  {errors.resume.message}
                </p>
              )}
            </div>

            {errorApply?.message && (
              <p className="text-destructive text-sm font-bold text-center bg-destructive/10 p-3 rounded-lg">
                {errorApply?.message}
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1 h-12 text-sm font-semibold">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                className="flex-[2] h-12 text-sm font-bold"
                disabled={loadingApply}
              >
                {loadingApply ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
