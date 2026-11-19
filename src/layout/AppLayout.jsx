import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Navbar } from "./Navbar";

/**
 * Site chrome. The 3xl column and the gutter wrapper mirror the reference
 * design: the gutter lives on a wrapper (not <body>) so dialogs that lock
 * scroll don't overwrite it.
 */
const AppLayout = () => (
  <div className="px-3">
    <Navbar />
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col overflow-x-hidden">
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  </div>
);

export default AppLayout;
