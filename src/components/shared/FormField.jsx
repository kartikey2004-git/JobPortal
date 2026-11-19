import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Labelled form control with an optional validation message.
 * Pass `htmlFor` matching the control's `id` so the label is associated.
 */
const FormField = ({ label, icon: Icon, htmlFor, error, className, children }) => (
  <div className={cn("space-y-2", className)}>
    <Label htmlFor={htmlFor}>
      {Icon && <Icon className="size-3.5 text-muted-foreground" />}
      {label}
    </Label>
    {children}
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

export default FormField;
