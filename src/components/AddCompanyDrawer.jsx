/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useFetch from "@/hooks/UseFetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";
import { Building2, Plus, Upload } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Please upload a valid PNG or JPEG image" },
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
      reset();
    }
  }, [loadingAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" type="button" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Register New Company
            </DrawerTitle>
          </DrawerHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Company Name</label>
                <Input placeholder="e.g. Acme Corp" {...register("name")} className="h-11" />
                {errors.name && <p className="text-sm text-destructive font-medium">{errors.name.message}</p>}
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold">Company Logo</label>
                <div className="relative group cursor-pointer border-2 border-dashed rounded-xl p-8 transition-colors hover:bg-muted/50 border-muted">
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    {...register("logo")}
                  />
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">Click to upload or drag and drop</span>
                    <span className="text-xs">PNG, JPG (max. 2MB)</span>
                  </div>
                </div>
                {errors.logo && <p className="text-sm text-destructive font-medium">{errors.logo.message}</p>}
              </div>
            </div>

            {errorAddCompany?.message && (
              <p className="text-sm text-destructive font-medium text-center">{errorAddCompany?.message}</p>
            )}

            {loadingAddCompany && <BarLoader width={"100%"} color="hsl(var(--primary))" />}

            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button variant="outline" type="button" className="flex-1 h-11">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" className="flex-1 h-11" disabled={loadingAddCompany}>
                Add Company
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;