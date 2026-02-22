/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import useFetch from "@/hooks/UseFetch";
import { updateApplicationStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    },
  );

  const handleStatusChangeChange = (status) => {
    fnHiringStatus(status);
  };

  return (
    <Card className="flex flex-col border bg-card transition-all duration-200 shadow-sm">
      {loadingHiringStatus && <BarLoader width={"100%"} color="hsl(var(--primary))" />}
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold tracking-tight">
              {isCandidate
                ? application?.job?.title
                : application?.name}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {isCandidate ? application?.job?.company?.name : "Candidate Profile"}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={handleDownload}
          >
            <Download size={16} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 flex-1 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <BriefcaseBusiness size={16} className="text-primary" />
            <span className="font-medium text-foreground">{application?.experience} Years Exp.</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <School size={16} className="text-primary" />
            <span className="font-medium text-foreground line-clamp-1">{application?.education}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Boxes size={14} />
            Key Skills
          </div>
          <p className="text-sm text-foreground font-medium leading-relaxed">
            {application?.skills}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col border-t bg-muted/20 px-6 py-4 gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Calendar size={14} />
          {new Date(application?.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>

        {isCandidate ? (
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize bg-primary/10 text-primary">
            {application?.status}
          </div>
        ) : (
          <Select
            onValueChange={handleStatusChangeChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="h-8 w-full sm:w-[140px] text-xs font-semibold">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;

