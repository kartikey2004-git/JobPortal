import { createBrowserRouter } from "react-router-dom";
import PageSkeleton from "@/components/shared/PageSkeleton";
import { ROUTES } from "@/config/constants";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import AppLayout from "@/layout/AppLayout";
import LandingPage from "@/pages/LandingPage";

/**
 * Route that loads its page on demand and requires sign-in + a chosen role.
 * Splitting by route keeps heavy dependencies (e.g. the markdown editor) out
 * of the landing page bundle.
 */
const protectedRoute = (path, loadPage) => ({
  path,
  lazy: async () => {
    const { default: Page } = await loadPage();
    return {
      Component: () => (
        <ProtectedRoute>
          <Page />
        </ProtectedRoute>
      ),
    };
  },
});

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    HydrateFallback: PageSkeleton,
    children: [
      { path: ROUTES.HOME, element: <LandingPage /> },
      protectedRoute(ROUTES.ONBOARDING, () => import("@/pages/Onboarding")),
      protectedRoute(ROUTES.JOBS, () => import("@/pages/JobListing")),
      protectedRoute(ROUTES.JOB(":id"), () => import("@/pages/Job")),
      protectedRoute(ROUTES.POST_JOB, () => import("@/pages/PostJob")),
      protectedRoute(ROUTES.SAVED_JOBS, () => import("@/pages/SavedJobs")),
      protectedRoute(ROUTES.MY_JOBS, () => import("@/pages/MyJobs")),
    ],
  },
]);
