import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
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
				: url.includes("/usage/agents")
					? json({ project: "bridle", instances: [] })
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

const instance = (id: string, name: string) => ({
	agent_id: id,
	name,
	role: "worker",
	model: "sonnet",
	removed: id === "a2",
	turns: 3,
	cost_usd: 1.5,
	first_turn_at: "2026-10-12T10:00:00Z",
	last_turn_at: "2026-10-12T12:00:00Z",
});

const instanceStub = (series: () => Response) => {
	const f = vi.fn(async (url: string) =>
		url.includes("/usage/history")
			? json({ project: "bridle", window: "x", points: [] })
			: url.includes("/series")
				? series()
				: url.includes("/usage/agents")
					? json({
							project: "bridle",
							instances: [instance("a1", "alpha"), instance("a2", "beta")],
						})
					: json({ projects: [{ project: "bridle", machine: null }] }),
	);
	vi.stubGlobal("fetch", f);
	return f;
};

test("picking an instance fetches its series and draws it", async () => {
	const f = instanceStub(() =>
		json({
			project: "bridle",
			agent_id: "a1",
			bucket: "day",
			points: [
				{
					start:
						new Date(Date.now() - 86_400_000).toISOString().slice(0, 11) +
						"00:00:00Z",
					turns: 2,
					input_tokens: 100,
					output_tokens: 50,
					cache_read_tokens: 10,
					cache_write_tokens: 5,
					cost_usd: 0.5,
					busy_seconds: 30,
				},
			],
		}),
	);
	render(<UsageView onLoggedOut={() => {}} />);
	expect(
		await screen.findByRole("img", { name: "Tokens per day" }),
	).toBeTruthy();
	fireEvent.change(screen.getByLabelText("Agent instance"), {
		target: { value: "a2" },
	});
	await waitFor(() =>
		expect(
			f.mock.calls.some((c) =>
				String(c[0]).includes("/usage/agents/a2/series"),
			),
		).toBe(true),
	);
	expect(screen.getByText("beta, worker, sonnet, removed")).toBeTruthy();
});

test("a series error is shown as unreachable, not an empty chart", async () => {
	instanceStub(() => json({ error: "no route" }, 404));
	render(<UsageView onLoggedOut={() => {}} />);
	expect((await screen.findByRole("alert")).textContent).toContain("no route");
	expect(screen.queryByRole("img", { name: "Tokens per day" })).toBeNull();
});
