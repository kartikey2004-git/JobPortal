import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
       <main className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
