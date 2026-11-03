import { useEffect, useState } from "react";

export const DEV_GATEWAY = (import.meta.env.REACT_APP_IPFS_DEV_GATEWAY?.trim() || "https://ipfs-gateway-dev.dappnode.net").replace(/\/+$/, "");

export type Availability = "checking" | "available" | "unavailable";

// The gateway answers a missing hash only after its own ~30 s lookup.
const TIMEOUT_MS = 15000;
const MAX_CONCURRENT = 6;

const results = new Map<string, Availability>();
const listeners = new Map<string, Set<(state: Availability) => void>>();
const queue: string[] = [];
let running = 0;

export function gatewayUrl(contentUri: string): string {
  return `${DEV_GATEWAY}${contentUri}`;
}

function settle(contentUri: string, state: Availability) {
  results.set(contentUri, state);
  listeners.get(contentUri)?.forEach((listener) => listener(state));
}

async function check(contentUri: string) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // Every DAppNode release directory holds its manifest; fetching it proves the content resolves.
    const response = await fetch(`${gatewayUrl(contentUri)}/dappnode_package.json`, {
      signal: controller.signal, credentials: "omit", cache: "no-store",
    });
    settle(contentUri, response.ok ? "available" : "unavailable");
  } catch {
    settle(contentUri, "unavailable");
  } finally {
    window.clearTimeout(timeout);
    running--;
    next();
  }
}

function next() {
  while (running < MAX_CONCURRENT && queue.length) {
    running++;
    check(queue.shift()!);
  }
}

function request(contentUri: string) {
  if (results.has(contentUri)) return;
  results.set(contentUri, "checking");
  queue.push(contentUri);
  next();
}

/** Re-check hashes that were missing; available ones stay available. */
export function recheckUnavailable() {
  results.forEach((state, contentUri) => {
    if (state !== "unavailable") return;
    results.delete(contentUri);
    if (listeners.get(contentUri)?.size) {
      request(contentUri);
      settle(contentUri, "checking");
    }
  });
}

/** Availability of a content URI on the dev gateway; checked once per page load and shared by all rows. */
export function useGatewayAvailability(contentUri: string | null | undefined): Availability | null {
  const [state, setState] = useState<Availability | null>(() => contentUri ? results.get(contentUri) || "checking" : null);
  useEffect(() => {
    if (!contentUri) {
      setState(null);
      return;
    }
    const subscribers = listeners.get(contentUri) || new Set();
    listeners.set(contentUri, subscribers);
    subscribers.add(setState);
    request(contentUri);
    setState(results.get(contentUri) || "checking");
    return () => {
      subscribers.delete(setState);
    };
  }, [contentUri]);
  return state;
}
