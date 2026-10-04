import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
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
	await user.click(await screen.findByRole("button", { name: "Log in" }));
	expect(await screen.findByRole("alert")).toHaveTextContent(
		"wrong username or password",
	);
});

test("a live session skips the form", async () => {
	route({ "/api/v1/session": () => json(200, { username: "jo" }) });
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

const live = { "/api/v1/session": () => json(200, { username: "jo" }) };
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
	route({ ...live, "/api/v1/items": () => json(200, []) });
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
		"/api/v1/projects/p/documents/docs/a.md": stubDoc,
	});
	const user = userEvent.setup();
	at("/document?project=p&path=docs%2Fa.md");
	expect(await screen.findByText(/on feature/)).toBeInTheDocument();
	expect(screen.getByLabelText("Path")).toHaveValue("docs/a.md");
	// Open writes the query, so a refresh reopens the same document.
	await user.clear(screen.getByLabelText("Path"));
	await user.type(screen.getByLabelText("Path"), "docs/a.md");
	await user.click(screen.getByRole("button", { name: "Open" }));
	expect(await screen.findByText(/on feature/)).toBeInTheDocument();
});

test("navigating between tabs works", async () => {
	route({ ...live, "/api/v1/items": () => json(200, []) });
	const user = userEvent.setup();
	at("/time");
	await user.click(await screen.findByRole("link", { name: "Document" }));
	expect(screen.getByRole("link", { name: "Document" })).toHaveClass(
		"bg-gray-900",
	);
	expect(screen.getByLabelText("Project")).toBeInTheDocument();
});
