import { useSession } from "@clerk/clerk-react";
import { useCallback, useRef, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";

/**
 * Runs an API function against Supabase as the signed-in user.
 *
 * `request` receives an authenticated Supabase client followed by whatever is
 * passed to `fn(...args)`. It should return data and throw on failure.
 *
 * `fn` is referentially stable, so it is safe to use in effect dependencies.
 * Only the most recent call updates state, so a slow earlier request can never
 * overwrite the result of a newer one.
 *
 * It resolves with the data on success and `undefined` on failure (the failure
 * is exposed through `error`), so callers can write `if (await fn(...))`.
 *
 * @template TArgs, TData
 * @param {(supabase: import("@supabase/supabase-js").SupabaseClient, ...args: TArgs[]) => Promise<TData>} request
 * @returns {{ fn: (...args: TArgs[]) => Promise<TData | undefined>, data: TData | undefined, loading: boolean, error: Error | null }}
 */
const useFetch = (request) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { session } = useSession();

  // Keep the latest values in refs so `fn` can stay stable between renders.
  const requestRef = useRef(request);
  const sessionRef = useRef(session);
  const latestCallRef = useRef(0);
  requestRef.current = request;
  sessionRef.current = session;

  const fn = useCallback(async (...args) => {
    const callId = ++latestCallRef.current;
    const isLatest = () => callId === latestCallRef.current;

    setLoading(true);
    setError(null);

    try {
      const token = await sessionRef.current.getToken({ template: "supabase" });
      const result = await requestRef.current(createSupabaseClient(token), ...args);
      if (isLatest()) setData(result);
      return result;
    } catch (err) {
      if (isLatest()) setError(err);
      return undefined;
    } finally {
      if (isLatest()) setLoading(false);
    }
  }, []);

  return { fn, data, loading, error };
};

export default useFetch;
