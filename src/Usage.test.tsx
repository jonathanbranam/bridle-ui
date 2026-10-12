import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { UsageView } from "./Usage";

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), { status });

const stub = (usage: () => Response) =>
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string) =>
			url.includes("/usage/history")
				? usage()
				: json({ projects: [{ project: "bridle", machine: null }] }),
		),
	);

test("a non-2xx is shown as unreachable with its error, not a chart", async () => {
	stub(() => json({ error: "no token" }, 502));
	render(<UsageView onLoggedOut={() => {}} />);
	expect((await screen.findByRole("alert")).textContent).toContain("no token");
	expect(screen.queryByRole("img")).toBeNull();
});

test("a 200 with reachable:false is shown as unreachable too", async () => {
	stub(() => json({ reachable: false, error: "daemon down", points: [] }));
	render(<UsageView onLoggedOut={() => {}} />);
	expect((await screen.findByRole("alert")).textContent).toContain(
		"daemon down",
	);
	expect(screen.queryByRole("img")).toBeNull();
});

test("readings draw the charts", async () => {
	stub(() =>
		json({
			project: "bridle",
			window: "x",
			points: [
				{
					utilization: 0.95,
					resets_at: "2026-10-13T15:00:00Z",
					observed_at: "2026-10-13T13:00:00Z",
				},
			],
		}),
	);
	render(<UsageView onLoggedOut={() => {}} />);
	expect(await screen.findAllByRole("img")).toHaveLength(2);
});
