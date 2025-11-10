import { useEffect, useState, useCallback } from "react";
import { handleApiError } from "@/lib/api";

interface UseAsyncOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useAsync<T>(
  fn: () => Promise<T>,
  options?: UseAsyncOptions,
): UseAsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fn();
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      options?.onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [fn, options]);

  useEffect(() => {
    fetch();
  }, [fetch, retryCount]);

  return {
    data,
    loading,
    error,
    retry: () => setRetryCount((c) => c + 1),
  };
}
