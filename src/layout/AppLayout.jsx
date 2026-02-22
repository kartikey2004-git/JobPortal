import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <Link to="/" className="text-xl font-bold tracking-tight">
            JobConnect
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Connecting the best talent with the most innovative companies.
          </p>
        </div>
        <div className="flex gap-8 text-sm font-medium">
          <Link to="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
          <Link to="/post-job" className="hover:text-primary transition-colors">Post a Job</Link>
          <Link to="/my-jobs" className="hover:text-primary transition-colors">Dashboard</Link>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} JobConnect Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(120,119,198,0.03),transparent)]"></div>

      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
