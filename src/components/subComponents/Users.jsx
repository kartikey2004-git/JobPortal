import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { User, Briefcase } from "lucide-react";

const Users = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="group border bg-card transition-all hover:bg-muted/50">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">For Candidates</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground leading-relaxed">
          Browse verified opportunities, submit applications, and track your professional progress—all within a unified, intuitive dashboard.
        </CardContent>
      </Card>

      <Card className="group border bg-card transition-all hover:bg-muted/50">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Briefcase className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">For Recruiters</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground leading-relaxed">
          Streamline your hiring process. Post openings, manage talent pipelines, and connect with the industry's most qualified candidates.
        </CardContent>
      </Card>
    </section>
  );
};

export default Users;

