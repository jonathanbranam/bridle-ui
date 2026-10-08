import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, expect, test, vi } from "vitest";
import { SystemView, uptime } from "./System";

afterEach(() => vi.unstubAllGlobals());

const status = {
	pid: 1,
	version: "1.2.3",
	started_at: "2026-10-04T00:00:00Z",
	claude_version: null,
	budget_state: "holding",
	rate_limits: [],
	ci: {
		sha: "abcdef123456",
		conclusion: "success",
		url: "https://ci/run/1",
		completed_at: "2026-10-04T00:00:00Z",
	},
	incidents: [],
	sessions: [],
	agents_by_state: { working: 1 },
	unread_human_messages: 0,
	upgrade_waiting: null,
};
const agent = (name: string, stopped: boolean, task: string | null) => ({
	name,
	role: "worker",
	state: stopped ? "stopped" : "working",
	stopped,
	model: "sonnet",
	task,
	branch: null,
	context_tokens: 5000,
	cost_usd_total: 1.5,
	turns: 3,
	exit_reason: null,
	updated: "2026-10-04T00:00:00Z",
});

function mock(routes: Record<string, unknown>) {
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string) => {
			const key = Object.keys(routes).find((k) => String(url).endsWith(k));
			if (!key) return new Response("{}", { status: 404 });
			return new Response(JSON.stringify(routes[key]), { status: 200 });
		}),
	);
}

const show = () =>
	render(
		<MemoryRouter>
			<SystemView onLoggedOut={() => {}} />
		</MemoryRouter>,
	);

test("an up daemon shows its status and the agents, stopped ones behind a toggle", async () => {
	mock({
		"/projects": { projects: [{ project: "p", reachable: true }] },
		"/projects/p/system": {
			project: "p",
			reachable: true,
			error: null,
			status,
		},
		"/projects/p/agents": {
			project: "p",
			agents: [agent("w1", false, "x-1"), agent("w2", true, null)],
		},
	});
	show();
	expect(await screen.findByText(/1\.2\.3/)).toBeInTheDocument();
	expect(screen.getByText("holding")).toBeInTheDocument();
	expect(screen.getByRole("link", { name: "success" })).toHaveAttribute(
		"href",
		"https://ci/run/1",
	);
	expect(screen.getByRole("link", { name: "x-1" })).toHaveAttribute(
		"href",
		"/p/p/tasks/x-1",
	);
	expect(screen.queryByText("w2")).toBeNull();
	await userEvent.click(screen.getByLabelText(/Show stopped/));
	await waitFor(() => expect(screen.getByText("w2")).toBeInTheDocument());
});

test("an unreachable daemon says so and lists no agents", async () => {
	mock({
		"/projects": { projects: [{ project: "p", reachable: false }] },
		"/projects/p/system": {
			project: "p",
			reachable: false,
			error: "connection refused",
			status: null,
		},
	});
	show();
	expect(await screen.findByRole("alert")).toHaveTextContent(
		"Daemon unreachable: connection refused",
	);
	expect(screen.queryByText("Agents")).toBeNull();
});

test("uptime reads in minutes, hours and days", () => {
	const t = Date.parse("2026-10-05T00:00:00Z");
	expect(uptime("2026-10-04T23:30:00Z", t)).toBe("30m");
	expect(uptime("2026-10-04T20:00:00Z", t)).toBe("4h 0m");
	expect(uptime("2026-10-02T12:00:00Z", t)).toBe("2d 12h");
});
