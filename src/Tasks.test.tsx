import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, expect, test, vi } from "vitest";
import { LinkScope, Md } from "./Md";
import { TasksView, TaskView } from "./Tasks";

afterEach(() => vi.unstubAllGlobals());

const summary = (id: string, state: string, extra = {}) => ({
	id,
	title: `Title ${id}`,
	kind: "feature",
	state,
	priority: "normal",
	claimed_by: null,
	agent: null,
	updated: "2026-10-04T00:00:00Z",
	...extra,
});

const detail = (id: string, state: string, extra = {}) => ({
	...summary(id, state),
	project: "p",
	body: "The body.",
	thread: [
		{ kind: "note", from: "human", body: "A note", at: "2026-10-04T01:00:00Z" },
	],
	watchers: ["human"],
	branch: "bridle/x",
	blocks: [],
	blocked_by: ["x-2222"],
	...extra,
});

const json = (v: unknown, status = 200) =>
	new Response(JSON.stringify(v), { status });

function gateway(tasks: Record<string, ReturnType<typeof detail>>) {
	const fetchMock = vi.fn(async (url: string, _init?: RequestInit) => {
		if (url.endsWith("/projects"))
			return json({
				projects: [
					{ project: "p", machine: null, url: null, reachable: true },
					{ project: "q", machine: null, url: null, reachable: true },
				],
			});
		const list = url.match(/\/projects\/(\w+)\/tasks\?state=(\w+)/);
		if (list) {
			const all = list[1] === "p" ? Object.values(tasks) : [];
			const closed = (s: string) => s === "integrated" || s === "dropped";
			return json({
				project: list[1],
				tasks: all.filter(
					(t) =>
						list[2] === "all" ||
						list[2] === (closed(t.state) ? "closed" : "open"),
				),
			});
		}
		const one = url.match(/\/projects\/(\w+)\/tasks\/([\w-]+)$/);
		if (one && one[1] === "p" && tasks[one[2]]) return json(tasks[one[2]]);
		return json({ error: "no such task" }, 404);
	});
	vi.stubGlobal("fetch", fetchMock);
	return fetchMock;
}

const app = (path: string) =>
	render(
		<MemoryRouter initialEntries={[path]}>
			<Routes>
				<Route path="/tasks" element={<TasksView onLoggedOut={() => {}} />} />
				<Route
					path="/tasks/:project/:id"
					element={<TaskView onLoggedOut={() => {}} />}
				/>
				<Route path="/task" element={<TaskView onLoggedOut={() => {}} />} />
			</Routes>
		</MemoryRouter>,
	);

test("the list groups open tasks by state and names the worker", async () => {
	gateway({
		"x-1111": detail("x-1111", "working", {
			agent: { name: "wk-1", role: "worker" },
			claimed_by: "agent:wk-1",
		}),
		"x-3333": detail("x-3333", "planned"),
		"x-4444": detail("x-4444", "integrated"),
	});
	app("/tasks");
	expect(await screen.findByText("Title x-1111")).toBeInTheDocument();
	expect(screen.getByText("working (1)")).toBeInTheDocument();
	expect(screen.getByText("planned (1)")).toBeInTheDocument();
	expect(screen.getByText(/wk-1/)).toBeInTheDocument();
	expect(screen.queryByText("Title x-4444")).not.toBeInTheDocument();
});

test("show closed refetches with all", async () => {
	const f = gateway({ "x-4444": detail("x-4444", "integrated") });
	app("/tasks");
	await screen.findByText("p");
	await userEvent.click(screen.getByLabelText("Show closed"));
	expect(await screen.findByText("Title x-4444")).toBeInTheDocument();
	expect(f).toHaveBeenCalledWith(
		expect.stringContaining("/projects/p/tasks?state=all"),
		expect.anything(),
	);
});

test("a closed task opens by ID alone, finding its project", async () => {
	gateway({ "x-4444": detail("x-4444", "integrated") });
	app("/task?id=x-4444");
	expect(await screen.findByText("Title x-4444")).toBeInTheDocument();
	expect(screen.getByText("The body.")).toBeInTheDocument();
	expect(screen.getByText("A note")).toBeInTheDocument();
	expect(screen.getByText("bridle/x")).toBeInTheDocument();
});

test("an unknown ID says so", async () => {
	gateway({});
	app("/task?id=x-9999");
	expect(await screen.findByRole("alert")).toHaveTextContent("No task x-9999");
});

test("edges link to the other task's page", async () => {
	gateway({
		"x-1111": detail("x-1111", "working"),
		"x-2222": detail("x-2222", "planned", { blocked_by: [] }),
	});
	app("/tasks/p/x-1111");
	const link = await screen.findByRole("link", { name: "x-2222" });
	expect(link).toHaveAttribute("href", "/tasks/p/x-2222");
	await userEvent.click(link);
	await waitFor(() =>
		expect(screen.getByText("Title x-2222")).toBeInTheDocument(),
	);
});

test("a task ID in markdown links to /task?id=", async () => {
	const fetchMock = vi.fn(async () => json({ project: "p", links: [] }));
	vi.stubGlobal("fetch", fetchMock);
	render(
		<LinkScope project="p" texts={["see ui-umaq"]}>
			<Md text="see ui-umaq" />
		</LinkScope>,
	);
	expect(screen.getByRole("link", { name: "ui-umaq" })).toHaveAttribute(
		"href",
		"/task?id=ui-umaq",
	);
	// Let the resolve call and its state update finish before the global is
	// unstubbed, or a late call reaches the real fetch.
	await waitFor(() => expect(fetchMock).toHaveBeenCalled());
	await act(async () => {});
});

test("a task ID in the task's title links", async () => {
	gateway({
		"x-1111": detail("x-1111", "working", { title: "follows ui-umaq" }),
	});
	app("/tasks/p/x-1111");
	expect(await screen.findByRole("link", { name: "ui-umaq" })).toHaveAttribute(
		"href",
		"/task?id=ui-umaq",
	);
});

test("a task claimed by the human has Done and Decline, and shows the new state", async () => {
	const tasks = {
		"x-1111": detail("x-1111", "working", { claimed_by: "human" }),
	};
	const fetchMock = gateway(tasks);
	const base = fetchMock.getMockImplementation();
	fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
		if (init?.method === "POST") {
			tasks["x-1111"] = detail("x-1111", "dropped", { claimed_by: "human" });
			return json({});
		}
		return base?.(url) as Promise<Response>;
	});
	app("/tasks/p/x-1111");
	await userEvent.click(
		await screen.findByRole("button", { name: "Decline…" }),
	);
	await userEvent.type(screen.getByLabelText(/Reason for declining/), "no");
	await userEvent.click(screen.getByRole("button", { name: "Decline" }));
	expect(await screen.findByText(/p \/ dropped/)).toBeInTheDocument();
	const post = fetchMock.mock.calls.find(([, i]) => i?.method === "POST");
	expect(post?.[0]).toMatch(/\/projects\/p\/tasks\/x-1111\/drop$/);
});

test("a task claimed by an agent has no Done or Decline", async () => {
	gateway({
		"x-1111": detail("x-1111", "working", { claimed_by: "agent:wk-1" }),
	});
	app("/tasks/p/x-1111");
	await screen.findByText("Title x-1111");
	expect(
		screen.queryByRole("button", { name: "Done" }),
	).not.toBeInTheDocument();
});
