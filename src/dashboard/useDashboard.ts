import { useCallback, useEffect, useRef, useState } from "react";
import { DASHBOARD_API_URL, parseSnapshot } from "./api";
import { DashboardSnapshot } from "./types";

export function useDashboard() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [retryAfter, setRetryAfter] = useState<number>();
  const mounted = useRef(false);
  const controller = useRef<AbortController>();
  const etag = useRef<string>();
  const hasSnapshot = useRef(false);

  const refresh = useCallback(async () => {
    if (controller.current) return;
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    const timeout = window.setTimeout(() => request.abort(), 20000);
    try {
      const headers: { [key: string]: string } = { Accept: "application/json" };
      if (etag.current) headers["If-None-Match"] = etag.current;
      const response = await fetch(DASHBOARD_API_URL, {
        headers, signal: request.signal, credentials: "omit",
      });
      if (!mounted.current) return;
      if (response.status === 304) {
        if (!hasSnapshot.current) throw new Error("No cached dashboard data is available.");
      } else {
        if (!response.ok) {
          const retry = response.headers.get("Retry-After");
          const seconds = retry && /^\d+$/.test(retry) ? Number(retry) :
            retry ? (Date.parse(retry) - Date.now()) / 1000 : 30;
          setRetryAfter(Number.isFinite(seconds) ? Math.max(30, Math.min(seconds, 3600)) : 30);
          throw new Error(response.status === 503 ?
            "Dashboard data is being prepared. Please try again shortly." :
            "Dashboard data could not be loaded. Please try again.");
        }
        const data = parseSnapshot(await response.json());
        if (!mounted.current) return;
        etag.current = response.headers.get("ETag") || undefined;
        hasSnapshot.current = true;
        setSnapshot(data);
      }
      setError(undefined);
      setRetryAfter(undefined);
    } catch (failure) {
      if (mounted.current) {
        setError(failure instanceof Error && failure.name !== "AbortError" ? failure.message :
          "The dashboard service did not respond. Please try again.");
        setRetryAfter((previous) => previous || 30);
      }
    } finally {
      window.clearTimeout(timeout);
      if (controller.current === request) controller.current = undefined;
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    return () => {
      mounted.current = false;
      if (controller.current) controller.current.abort();
    };
  }, [refresh]);

  useEffect(() => {
    const seconds = retryAfter || snapshot?.refreshIntervalSeconds || 300;
    const interval = window.setInterval(refresh, Math.max(30, Math.min(seconds, 3600)) * 1000);
    return () => window.clearInterval(interval);
  }, [refresh, retryAfter, snapshot]);

  return { snapshot, error, loading, refresh };
}
