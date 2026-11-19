import { unwrap } from "@/lib/supabase";

const COMPANY_FIELDS = "company:companies(name,logo_url)";

/** @param {{ location?: string, company_id?: string, searchQuery?: string }} filters */
export async function getJobs(supabase, { location, company_id, searchQuery } = {}) {
  let query = supabase
    .from("jobs")
    .select(`*,${COMPANY_FIELDS},saved: saved_jobs(id)`);

  if (location) query = query.eq("location", location);
  if (company_id) query = query.eq("company_id", company_id);
  if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);

  return unwrap(await query, "Error fetching jobs");
}

export async function getSingleJob(supabase, jobId) {
  return unwrap(
    await supabase
      .from("jobs")
      .select(`*,${COMPANY_FIELDS},applications:applications(*)`)
      .eq("id", jobId)
      .single(),
    "Error fetching job",
  );
}

export async function addNewJob(supabase, jobData) {
  return unwrap(
    await supabase.from("jobs").insert([jobData]).select(),
    "Error creating job",
  );
}

export async function updateHiringStatus(supabase, jobId, isOpen) {
  return unwrap(
    await supabase.from("jobs").update({ isOpen }).eq("id", jobId).select(),
    "Error updating job",
  );
}

export async function deleteJob(supabase, jobId) {
  return unwrap(
    await supabase.from("jobs").delete().eq("id", jobId).select(),
    "Error deleting job",
  );
}

export async function getMyJobs(supabase, recruiterId) {
  return unwrap(
    await supabase
      .from("jobs")
      .select(`*,${COMPANY_FIELDS}`)
      .eq("recruiter_id", recruiterId),
    "Error fetching your jobs",
  );
}

export async function getSavedJobs(supabase) {
  return unwrap(
    await supabase
      .from("saved_jobs")
      .select(`*,job:jobs(*,${COMPANY_FIELDS})`),
    "Error fetching saved jobs",
  );
}

/**
 * Saves or un-saves a job.
 * @returns {Promise<Array>} The saved row(s) after saving, or `[]` after un-saving.
 */
export async function toggleSavedJob(supabase, { alreadySaved, user_id, job_id }) {
  if (alreadySaved) {
    unwrap(
      await supabase.from("saved_jobs").delete().eq("job_id", job_id),
      "Error removing saved job",
    );
    return [];
  }

  return unwrap(
    await supabase.from("saved_jobs").insert([{ user_id, job_id }]).select(),
    "Error saving job",
  );
}
