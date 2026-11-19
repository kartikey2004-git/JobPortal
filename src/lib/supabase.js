import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Creates a Supabase client that authenticates as the current Clerk user.
 * @param {string | null} accessToken Clerk JWT issued from the "supabase" template.
 */
export function createSupabaseClient(accessToken) {
  return createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

/** Public URL of an object stored in a public bucket. */
export function getPublicFileUrl(bucket, fileName) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
}

/** Unique-ish object name for uploads, e.g. `resume-48213-user_123`. */
export function buildUploadName(prefix, suffix) {
  return `${prefix}-${Math.floor(Math.random() * 90000)}-${suffix}`;
}

/**
 * Unwraps a Supabase `{ data, error }` response, throwing on error so that
 * callers (and `useFetch`) can surface failures instead of receiving `null`.
 * @template T
 * @param {{ data: T, error: { message: string } | null }} response
 * @param {string} context Human readable action used in the error message.
 * @returns {T}
 */
export function unwrap({ data, error }, context) {
  if (error) {
    console.error(`${context}:`, error);
    throw new Error(`${context}: ${error.message}`);
  }
  return data;
}
