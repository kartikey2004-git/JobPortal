import { STORAGE_BUCKETS } from "@/config/constants";
import { buildUploadName, getPublicFileUrl, unwrap } from "@/lib/supabase";

export async function getCompanies(supabase) {
  return unwrap(
    await supabase.from("companies").select("*"),
    "Error fetching companies",
  );
}

/** Uploads the logo, then creates the company pointing at it. */
export async function addNewCompany(supabase, { name, logo }) {
  const fileName = buildUploadName("logo", name);

  unwrap(
    await supabase.storage.from(STORAGE_BUCKETS.COMPANY_LOGOS).upload(fileName, logo),
    "Error uploading company logo",
  );

  return unwrap(
    await supabase
      .from("companies")
      .insert([
        { name, logo_url: getPublicFileUrl(STORAGE_BUCKETS.COMPANY_LOGOS, fileName) },
      ])
      .select(),
    "Error creating company",
  );
}
