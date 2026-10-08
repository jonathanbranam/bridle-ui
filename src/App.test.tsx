import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, expect, test, vi } from "vitest";
import { App } from "./App";

afterEach(() => vi.unstubAllGlobals());

function route(handlers: Record<string, () => Response>) {
	vi.stubGlobal(
		"fetch",
		vi.fn(
			async (url: string) =>
				handlers[url]?.() ?? new Response(null, { status: 404 }),
		),
	);
}

const json = (status: number, body: unknown) =>
	new Response(JSON.stringify(body), { status });

const live = {
	"/api/v1/session": () => json(200, { username: "jo" }),
	"/api/v1/items": () => json(200, { projects: [], unreachable: [] }),
};

test("shows the login form on 401, then the user and a logout button", async () => {
	route({
		"/api/v1/session": () => json(401, { error: "login required" }),
		"/api/v1/login": () => json(200, { username: "jo" }),
		"/api/v1/logout": () => new Response(null, { status: 204 }),
	});
	const user = userEvent.setup();
	render(
		<MemoryRouter>
			<App />
		</MemoryRouter>,
	);
	await user.type(await screen.findByLabelText("Username"), "jo");
	await user.type(screen.getByLabelText("Password"), "pw");
	await user.click(screen.getByRole("button", { name: "Log in" }));
	await user.click(await screen.findByRole("button", { name: "Log out" }));
	expect(await screen.findByLabelText("Username")).toBeInTheDocument();
});

test("a failed login shows the gateway's message", async () => {
	route({
		"/api/v1/session": () => json(401, { error: "login required" }),
		"/api/v1/login": () => json(401, { error: "wrong username or password" }),
	});
	const user = userEvent.setup();
	render(
		<MemoryRouter>
			<App />
		</MemoryRouter>,
	);
	await user.type(await screen.findByLabelText("Username"), "jo");
	await user.type(screen.getByLabelText("Password"), "pw");
	await user.click(screen.getByRole("button", { name: "Log in" }));
	expect(await screen.findByRole("alert")).toHaveTextContent(
		"wrong username or password",
	);
});

test("a live session skips the form", async () => {
	route(live);
	render(
		<MemoryRouter>
			<App />
		</MemoryRouter>,
	);
	expect(
		await screen.findByRole("button", { name: "Log out" }),
	).toBeInTheDocument();
	expect(screen.queryByLabelText("Username")).toBeNull();
});

const stubDoc = () =>
	json(200, {
		project: "p",
		path: "docs/a.md",
		content: "Hello world.\n",
		hash: "h1",
		branch: "feature",
	});
const at = (url: string) =>
	render(
		<MemoryRouter initialEntries={[url]}>
			<App />
		</MemoryRouter>,
	);

test("the tab comes from the URL", async () => {
	route(live);
	at("/time");
	expect(await screen.findByRole("link", { name: "Time" })).toHaveClass(
		"bg-gray-900",
	);
});

test("an unknown path goes to the default tab", async () => {
	route(live);
	at("/nope");
	await waitFor(() =>
		expect(screen.getByRole("link", { name: "To-dos" })).toHaveClass(
			"bg-gray-900",
		),
	);
});

test("the open document comes from the query, and Open puts it there", async () => {
	route({
		...live,
		"/api/v1/projects": () =>
			json(200, { projects: [{ project: "p", reachable: true }] }),
		"/api/v1/projects/p/documents?q=docs%2Fa.md": () =>
			json(200, { project: "p", paths: ["docs/a.md"] }),
		"/api/v1/projects/p/documents/docs/a.md": stubDoc,
	});
	const user = userEvent.setup();
	at("/document?project=p&path=docs%2Fa.md");
	expect(await screen.findByText(/on feature/)).toBeInTheDocument();
	expect(screen.getByLabelText("Document")).toHaveValue("docs/a.md");
	// Open writes the query, so a refresh reopens the same document.
	await user.clear(screen.getByLabelText("Document"));
	await user.type(screen.getByLabelText("Document"), "docs/a.md");
	await user.click(screen.getByRole("button", { name: "Open" }));
	expect(await screen.findByText(/on feature/)).toBeInTheDocument();
});

test("navigating between tabs works", async () => {
	route(live);
	const user = userEvent.setup();
	at("/time");
	await user.click(await screen.findByRole("link", { name: "Document" }));
	expect(screen.getByRole("link", { name: "Document" })).toHaveClass(
		"bg-gray-900",
	);
	expect(screen.getByLabelText("Project")).toBeInTheDocument();
});

function Where() {
	const l = useLocation();
	return <output aria-label="where">{l.pathname + l.search + l.hash}</output>;
}
const where = () => screen.getByLabelText("where").textContent;

// Old URL forms keep working: each lands on the canonical one (docs/design/url-scheme.md).
test.each([
	["/tasks/p/x-1", "/p/p/tasks/x-1"],
	["/task?id=x-1&project=p", "/p/p/tasks/x-1"],
	["/ticket?project=p&id=ab3d", "/p/p/tickets/ab3d"],
	["/document?project=p&path=docs%2Fa.md", "/p/p/docs?path=docs%2Fa.md"],
	[
		"/specs?project=p&path=design%2Fspecs%2Fd.md#r-ab23",
		"/p/p/specs?path=design%2Fspecs%2Fd.md#r-ab23",
	],
	[
		"/specs?project=p&capability=demo",
		"/p/p/specs?path=design%2Fspecs%2Fdemo.md",
	],
])("%s redirects to %s", async (old, canonical) => {
	route(live);
	render(
		<MemoryRouter initialEntries={[old]}>
			<App />
			<Where />
		</MemoryRouter>,
	);
	await waitFor(() => expect(where()).toBe(canonical));
	// Let the landing page's own requests finish before the fetch stub is removed.
	await act(() => new Promise((r) => setTimeout(r, 20)));
});

test("/task?id= alone finds the task's project, then redirects", async () => {
	route({
		...live,
		"/api/v1/projects": () =>
			json(200, {
				projects: [
					{ project: "a", reachable: true },
					{ project: "p", reachable: true },
				],
			}),
		"/api/v1/projects/p/tasks/x-1": () =>
			json(200, { id: "x-1", project: "p" }),
	});
	render(
		<MemoryRouter initialEntries={["/task?id=x-1"]}>
			<App />
			<Where />
		</MemoryRouter>,
	);
	await waitFor(() => expect(where()).toBe("/p/p/tasks/x-1"));
});

test("/task?id= for an unknown task says so", async () => {
	route({
		...live,
		"/api/v1/projects": () =>
			json(200, { projects: [{ project: "p", reachable: true }] }),
	});
	render(
		<MemoryRouter initialEntries={["/task?id=x-9"]}>
			<App />
		</MemoryRouter>,
	);
	expect(await screen.findByRole("alert")).toHaveTextContent("No task x-9");
});

test("/document and /specs without a file stay the project pickers", async () => {
	route(live);
	render(
		<MemoryRouter initialEntries={["/document"]}>
			<App />
			<Where />
		</MemoryRouter>,
	);
	expect(await screen.findByLabelText("Project")).toBeInTheDocument();
	expect(where()).toBe("/document");
});

test("/p/{project} lists the open tasks and links to docs and specs", async () => {
	route({
		...live,
		"/api/v1/projects/p/tasks?state=open": () =>
			json(200, {
				project: "p",
				tasks: [
					{ id: "x-1", title: "First", state: "working", priority: "normal" },
				],
			}),
	});
	render(
		<MemoryRouter initialEntries={["/p/p"]}>
			<App />
		</MemoryRouter>,
	);
	expect(await screen.findByRole("link", { name: "First" })).toHaveAttribute(
		"href",
		"/p/p/tasks/x-1",
	);
	expect(screen.getByRole("link", { name: "Documents" })).toHaveAttribute(
		"href",
		"/p/p/docs",
	);
});
