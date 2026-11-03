import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import type { Mock } from "vitest";
import { fixture, NOW } from "dashboard/fixtures";
import { Dashboard } from "./index";

function response(body: any, status = 200, etag: string | null = "snapshot-1") {
  return { ok: status >= 200 && status < 300, status, headers: { get: (name: string) => name === "ETag" ? etag : null }, json: async () => body };
}

const originalFetch = window.fetch;
let fetchMock: Mock;

beforeEach(() => {
  vi.spyOn(Date, "now").mockReturnValue(NOW);
  fetchMock = vi.fn().mockResolvedValue(response(fixture()));
  window.fetch = fetchMock as typeof window.fetch;
});

afterEach(() => {
  window.fetch = originalFetch;
  vi.restoreAllMocks();
});

test("loads the dashboard, filters via the URL, and switches to a matrix", async () => {
  const history = createMemoryHistory({ initialEntries: ["/dashboard?unpublishable=include"] });
  const page = render(<Router history={history}><Dashboard /></Router>);
  await page.findByText("Hoodi Geth");
  expect(page.getByLabelText("Filtered dashboard summary")).toHaveTextContent("Bump PRs1");
  expect(page.getByLabelText("Filtered dashboard summary")).toHaveTextContent("Other PRs1");
  expect(page.getByText("Application", { selector: "strong" })).toBeInTheDocument();
  // Only the package whose manifest declares no type is unclassified.
  fireEvent.click(page.getByRole("button", { name: "Unclassified" }));
  expect(history.location.search).toContain("type=unclassified");
  expect(page.queryByText("Hoodi Geth")).toBeNull();
  expect(page.queryByText("Application", { selector: "strong" })).toBeNull();
  expect(page.getByText("Legacy package", { selector: "strong" })).toBeInTheDocument();
  fireEvent.click(page.getByText(/Clear filters/));
  expect(page.queryByText("Application", { selector: "strong" })).toBeNull();
  fireEvent.click(page.getByText("Matrix"));
  expect(page.getByLabelText("Package variant matrix")).toBeInTheDocument();
  expect(history.location.search).toContain("view=matrix");
  expect(page.getByText("Hoodi Geth")).toBeInTheDocument();
});

test("matrix columns only show variants present in the filtered packages", async () => {
  const history = createMemoryHistory({ initialEntries: ["/dashboard?view=matrix&unpublishable=include"] });
  const page = render(<Router history={history}><Dashboard /></Router>);
  await page.findByText("Hoodi Geth");
  const headers = () => Array.from(page.getByLabelText("Package variant matrix").querySelectorAll("thead th")).map((th) => th.textContent);
  expect(headers()).toEqual(["Package / Repository", "Nongeneric", "Mainnet", "Hoodi"]);
  fireEvent.click(page.getByRole("button", { name: "Unclassified" }));
  expect(headers()).toEqual(["Package / Repository", "Nongeneric"]);
  expect(page.queryByText("Hoodi Geth")).toBeNull();
});

test("matrix cells stay compact: equal versions collapse and source notes are aggregated", async () => {
  const history = createMemoryHistory({ initialEntries: ["/dashboard?view=matrix&variant=hoodi"] });
  const page = render(<Router history={history}><Dashboard /></Router>);
  await page.findByText("Hoodi Geth");
  const cell = page.getByLabelText("Package variant matrix").querySelectorAll("tbody article")[0] as HTMLElement;
  // Hoodi publishes the same version on-chain and on GitHub, so the label appears once.
  expect(cell.querySelectorAll("dt")).toHaveLength(1);
  expect(cell.querySelector("dt")!.textContent).toBe("Version");
  expect(cell.querySelector("dd")!.textContent).toContain("0.1.7");
  // Variant is already the column heading, so the package subtitle is not repeated.
  expect(cell.textContent).not.toContain("hoodi-geth.dnp.dappnode.eth");
});

test("retains the last snapshot on failure and uses ETag on conditional refresh", async () => {
  fetchMock.mockResolvedValueOnce(response(fixture())).mockRejectedValueOnce(new Error("Network unavailable"));
  const page = render(<Router history={createMemoryHistory()}><Dashboard /></Router>);
  await page.findByText("Hoodi Geth");
  await act(async () => { fireEvent.click(page.getByText("Refresh")); });
  expect(page.getByRole("alert")).toHaveTextContent("Showing the last available snapshot");
  expect(page.getByText("Hoodi Geth")).toBeInTheDocument();
  expect(page.getByText("Current · stale")).toBeInTheDocument();
  expect(fetchMock.mock.calls[1][1].headers["If-None-Match"]).toBe("snapshot-1");
  fetchMock.mockResolvedValueOnce(response(null, 304));
  await act(async () => { fireEvent.click(page.getByText("Refresh")); });
  expect(page.queryByRole("alert")).toBeNull();
  expect(page.getByText("Hoodi Geth")).toBeInTheDocument();
});

test("shows a service warmup failure without inventing package data", async () => {
  fetchMock.mockResolvedValueOnce(response(null, 503));
  const page = render(<Router history={createMemoryHistory()}><Dashboard /></Router>);
  await page.findByText("Dashboard unavailable");
  expect(page.getByRole("alert")).toHaveTextContent("being prepared");
  expect(page.queryByLabelText("Filtered dashboard summary")).toBeNull();
});

test("shows an explicit empty filter result and can clear it", async () => {
  const history = createMemoryHistory({ initialEntries: ["/dashboard?q=missing"] });
  const page = render(<Router history={history}><Dashboard /></Router>);
  await page.findByText("No packages match these filters");
  fireEvent.change(page.getByLabelText("Search packages"), { target: { value: "hoodi" } });
  expect(page.getByText("Hoodi Geth")).toBeInTheDocument();
});

test("keeps detailed controls hidden by default and supports recent periods", async () => {
  const history = createMemoryHistory({ initialEntries: ["/dashboard"] });
  const page = render(<Router history={history}><Dashboard /></Router>);
  await page.findByText("Hoodi Geth");
  expect(page.getByLabelText("Variant")).not.toBeVisible();
  expect(page.getByLabelText("From")).not.toBeVisible();
  expect(page.getByLabelText("Sort by")).not.toBeVisible();
  expect(page.getByText("Advanced")).toHaveAttribute("aria-expanded", "false");
  fireEvent.change(page.getByLabelText("Period"), { target: { value: "7d" } });
  expect(history.location.search).toContain("period=7d");
  expect(page.getByLabelText("Filtered dashboard summary")).toHaveTextContent("Packages2");
  fireEvent.click(page.getByText("Advanced"));
  expect(page.getByLabelText("Variant")).toBeVisible();
  expect(page.getByLabelText("From")).toBeVisible();
  expect(page.getByLabelText("Sort by")).toBeVisible();
});

test("retains custom-date links and clears custom bounds when selecting a recent period", async () => {
  const history = createMemoryHistory({ initialEntries: ["/dashboard?from=2026-11-01&to=2026-11-03&variant=hoodi"] });
  const page = render(<Router history={history}><Dashboard /></Router>);
  await page.findByText("Hoodi Geth");
  expect(page.getByLabelText("Period")).toHaveValue("custom");
  expect(page.getByText("2 active")).toBeInTheDocument();
  expect(page.getByLabelText("Variant")).not.toBeVisible();
  fireEvent.change(page.getByLabelText("Period"), { target: { value: "30d" } });
  expect(history.location.search).toContain("period=30d");
  expect(history.location.search).not.toMatch(/from=|to=/);
  expect(page.getByText("1 active")).toBeInTheDocument();
  fireEvent.click(page.getByText("Clear filters"));
  expect(page.getByLabelText("Period")).toHaveValue("all");
  expect(history.location.search).toBe("");
});
