import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { TimeView } from "./Time";
import { PREFS_KEY } from "./time/prefs";

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

const report = {
	group: "project",
	bucket: "day",
	human_minutes: 75,
	groups: [{ key: "alpha", minutes: 75 }],
	buckets: [
		{
			start: "2026-10-01",
			human_minutes: 75,
			groups: [{ key: "alpha", minutes: 75 }],
		},
	],
	unreachable: ["laptop"],
};
const day = {
	date: "2026-10-01",
	first_start: "2026-10-01T14:00:00Z",
	last_end: "2026-10-01T16:00:00Z",
	human_minutes: 75,
	sessions: [
		{
			machine: "m",
			project: "alpha",
			agent: "orchestrator",
			session: "s",
			intervals: [
				{ start: "2026-10-01T14:00:00Z", end: "2026-10-01T15:00:00Z" },
			],
		},
	],
	overlaps: [],
	peak_concurrency: 1,
	minutes_at_1: 75,
	minutes_at_2: 0,
	minutes_at_3_plus: 0,
	unreachable: [],
};
const hours = {
	day_count: 5,
	minutes_per_hour: new Array(24).fill(1),
	unreachable: [],
};

function stubApi() {
	const fn = vi.fn(async (url: string) => {
		const body = url.includes("/report")
			? report
			: url.includes("/day")
				? day
				: hours;
		return new Response(JSON.stringify(body));
	});
	vi.stubGlobal("fetch", fn);
	return fn;
}

test("renders the three views from fixtures and flags unreachable machines", async () => {
	stubApi();
	render(<TimeView onLoggedOut={() => {}} />);
	expect(
		await screen.findByText(/Started 10:00, stopped 12:00/),
	).toBeInTheDocument();
	expect(
		await screen.findByText(/Average minutes per hour over 5 matching days/),
	).toBeInTheDocument();
	expect(
		(await screen.findAllByText(/Unreachable, data missing: laptop/)).length,
	).toBeGreaterThan(0);
	expect(screen.getAllByText("alpha").length).toBeGreaterThan(0);
});

test("changing a choice refetches and persists it", async () => {
	const fn = stubApi();
	render(<TimeView onLoggedOut={() => {}} />);
	await screen.findByText(/Started 10:00/);
	await userEvent.selectOptions(screen.getByLabelText("Group by"), "agent");
	await waitFor(() =>
		expect(
			fn.mock.calls.some(
				([u]) => u.includes("/report") && u.includes("group=agent"),
			),
		).toBe(true),
	);
	expect(JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}").group).toBe(
		"agent",
	);
});
