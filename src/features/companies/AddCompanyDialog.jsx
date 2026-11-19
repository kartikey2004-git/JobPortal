import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { LOGO_MIME_TYPES, MAX_LOGO_BYTES } from "@/config/constants";
import useFetch from "@/hooks/useFetch";
import { addNewCompany } from "./api";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine((files) => files?.[0] && LOGO_MIME_TYPES.includes(files[0].type), {
      message: "Please upload a valid PNG or JPEG image",
    })
    .refine((files) => !files?.[0] || files[0].size <= MAX_LOGO_BYTES, {
      message: "The logo must be 2 MB or smaller",
    }),
});

/**
 * Dialog with a form to register a new company.
 * @param {object} props
 * @param {() => void} props.fetchCompanies Refetches the company list after a company is added.
 */
const AddCompanyDialog = ({ fetchCompanies }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const { fn: addCompany, loading, error } = useFetch(addNewCompany);

  // The dialog is portaled out of the DOM but not out of the React tree, so its
  // submit event would otherwise bubble into a parent form (e.g. PostJob).
  const submit = (event) => {
    event.stopPropagation();
    return handleSubmit(onSubmit)(event);
  };

  const onSubmit = async (data) => {
    const result = await addCompany({ name: data.name, logo: data.logo[0] });
    if (result) {
      fetchCompanies();
      reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          <Plus />
          Add company
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-5">
        <DialogHeader>
          <DialogTitle className="font-sans font-medium">Register a company</DialogTitle>
          <DialogDescription>
            Add a company so it can be selected when posting jobs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <FormField label="Company name" htmlFor="company-name" error={errors.name?.message}>
            <Input
              id="company-name"
              placeholder="e.g. Acme Corp"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </FormField>

          <FormField label="Company logo" htmlFor="company-logo" error={errors.logo?.message}>
            <Input
              id="company-logo"
              type="file"
              accept="image/png, image/jpeg"
              aria-invalid={Boolean(errors.logo)}
              {...register("logo")}
            />
            <p className="text-xs text-muted-foreground">PNG or JPG, up to 2 MB.</p>
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
              {loading ? "Adding..." : "Add company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyDialog;
