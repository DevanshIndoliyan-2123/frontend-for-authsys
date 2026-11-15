import { useCallback, useState } from "react";
import { ApiError } from "./http";

/** Wraps an async form action with busy / error state. */
export function useSubmit() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  const run = useCallback(async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    setFields({});
    try {
      await action();
    } catch (e) {
      if (e instanceof ApiError) { setError(e.message); setFields(e.fields); }
      else setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  return { busy, error, fields, setError, run };
}
