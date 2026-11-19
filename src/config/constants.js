/** Single source of truth for domain constants shared across features. */

export const THEME_STORAGE_KEY = "theme";

export const ROLES = Object.freeze({
  CANDIDATE: "candidate",
  RECRUITER: "recruiter",
});

export const APPLICATION_STATUSES = Object.freeze([
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
]);

export const DEFAULT_APPLICATION_STATUS = "applied";

export const EDUCATION_LEVELS = Object.freeze([
  "Intermediate",
  "Graduate",
  "Post Graduate",
]);

export const RESUME_MIME_TYPES = Object.freeze([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const LOGO_MIME_TYPES = Object.freeze(["image/png", "image/jpeg"]);

/** Must match the file_size_limit of the Supabase buckets (see supabase/migrations). */
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

/** Lifetime of a signed resume link. */
export const RESUME_LINK_SECONDS = 60;

/** Country whose states populate the job location pickers. */
export const JOB_LOCATION_COUNTRY = "IN";

export const STORAGE_BUCKETS = Object.freeze({
  RESUMES: "resumes",
  COMPANY_LOGOS: "company-logo",
});

export const ROUTES = Object.freeze({
  HOME: "/",
  ONBOARDING: "/onboarding",
  JOBS: "/jobs",
  JOB: (id) => `/job/${id}`,
  POST_JOB: "/post-job",
  SAVED_JOBS: "/saved-jobs",
  MY_JOBS: "/my-jobs",
});

/** Query param that opens the sign-in overlay. */
export const SIGN_IN_PARAM = "sign-in";
