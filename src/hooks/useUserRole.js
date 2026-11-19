import { useUser } from "@clerk/clerk-react";
import { ROLES } from "@/config/constants";

/** Role of the signed-in user (stored in Clerk `unsafeMetadata.role`). */
export default function useUserRole() {
  const { user, isLoaded } = useUser();
  const role = user?.unsafeMetadata?.role;

  return {
    user,
    role,
    isLoaded,
    isCandidate: role === ROLES.CANDIDATE,
    isRecruiter: role === ROLES.RECRUITER,
  };
}
