import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES, SIGN_IN_PARAM } from "@/config/constants";

/**
 * Guards a route behind authentication and role selection:
 * signed-out visitors are sent to the sign-in overlay, and signed-in users
 * who have not yet chosen a role are sent to onboarding.
 */
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const { pathname } = useLocation();

  if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
    return <Navigate to={`${ROUTES.HOME}?${SIGN_IN_PARAM}=true`} />;
  }

  const needsOnboarding =
    user !== undefined && !user.unsafeMetadata?.role && pathname !== ROUTES.ONBOARDING;
  if (needsOnboarding) return <Navigate to={ROUTES.ONBOARDING} />;

  return children;
};

export default ProtectedRoute;
