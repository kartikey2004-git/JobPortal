import { RESUME_LINK_SECONDS, STORAGE_BUCKETS } from "@/config/constants";
import { buildUploadName, getPublicFileUrl, unwrap } from "@/lib/supabase";

/** Uploads the resume, then creates the application pointing at it. */
export async function applyToJob(supabase, applicationData) {
  const fileName = buildUploadName("resume", applicationData.candidate_id);

  unwrap(
    await supabase.storage
      .from(STORAGE_BUCKETS.RESUMES)
      .upload(fileName, applicationData.resume),
    "Error uploading resume",
  );

  return unwrap(
    await supabase
      .from("applications")
      .insert([
        {
          ...applicationData,
          resume: getPublicFileUrl(STORAGE_BUCKETS.RESUMES, fileName),
        },
      ])
      .select("*, job:jobs(title),company:companies(name)"),
    "Error submitting application",
  );
}

export async function updateApplicationStatus(supabase, applicationId, status) {
  const data = unwrap(
    await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId)
      .select(),
    "Error updating application",
  );

  if (data.length === 0) throw new Error("Error updating application: not found");
  return data;
}

export async function getApplications(supabase, candidateId) {
  return unwrap(
    await supabase
      .from("applications")
      .select("*,job:jobs(title,company:companies(name))")
      .eq("candidate_id", candidateId),
    "Error fetching applications",
  );
}

/** Object name inside the resumes bucket, taken from the URL stored on the application. */
const resumeObjectName = (resume) =>
  decodeURIComponent(resume.split(`/${STORAGE_BUCKETS.RESUMES}/`).pop());

/**
 * The resumes bucket is private, so files are opened through short-lived signed URLs.
 * Supabase only signs them for the uploader and the recruiter of the job (storage policy).
 */
export async function getResumeSignedUrl(supabase, resume) {
  const data = unwrap(
    await supabase.storage
      .from(STORAGE_BUCKETS.RESUMES)
      .createSignedUrl(resumeObjectName(resume), RESUME_LINK_SECONDS),
    "Error opening resume",
  );
  return data.signedUrl;
}
