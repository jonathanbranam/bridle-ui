import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, expect, test, vi } from "vitest";
import { DocumentView } from "./Document";

afterEach(() => vi.unstubAllGlobals());

const original = `# T

Hello world.

> [!comment] c1 human, 2026-10-02 14:05 EDT, on "Hello" [sent 2026-10-02 14:06 EDT]
> Why?
>
> **docs agent, 2026-10-02 14:06 EDT:** Done.
`;

// The project list and the search, which every test needs; null for the document routes.
function routed(url: string) {
	if (url.endsWith("/projects"))
		return new Response(
			JSON.stringify({ projects: [{ project: "p", reachable: true }] }),
		);
	if (url.includes("/documents?")) {
		const q = new URL(url, "http://x").searchParams.get("q");
		return new Response(
			JSON.stringify({
				project: "p",
				paths: q === "x8jt" ? ["docs/tickets/open/t-x8jt.md"] : ["a.md"],
			}),
		);
	}
	return null;
}

function stub(error?: string) {
	const puts: { content: string; hash: string }[] = [];
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string, init?: RequestInit) => {
			const other = routed(url);
			if (other) return other;
			if (init?.method === "PUT") {
				puts.push(JSON.parse(init.body as string));
				return error
					? new Response(JSON.stringify({ error }), { status: 403 })
					: new Response(JSON.stringify({ hash: "h2" }));
			}
			return new Response(
				JSON.stringify({
					project: "p",
					path: "a.md",
					content: original,
					hash: "h1",
					branch: "feature",
				}),
			);
		}),
	);
	return puts;
}

async function openDoc() {
	const user = userEvent.setup();
	render(
		<MemoryRouter>
			<DocumentView onLoggedOut={() => {}} />
		</MemoryRouter>,
	);
	await user.type(screen.getByLabelText("Document"), "a.md");
	await user.click(screen.getByRole("button", { name: "Open" }));
	await screen.findByText(/on feature/);
	return user;
}

test("opening an unread thread writes [read] back with the hash", async () => {
	const puts = stub();
	const user = await openDoc();
	expect(screen.queryByText("Why?")).toBeNull();
	await user.click(screen.getByRole("button", { name: /human.*Hello/ }));
	expect(screen.getByText("Why?")).toBeTruthy();
	await waitFor(() => expect(puts).toHaveLength(1));
	expect(puts[0].hash).toBe("h1");
	expect(puts[0].content).toMatch(
		/Done\. \[read \d{4}-\d\d-\d\d \d\d:\d\d E[SD]T\]\n/,
	);
});

test("a selection becomes a comment in the approved format; errors are shown", async () => {
	const puts = stub(
		"the working tree is on 'main', which the gateway doesn't commit to",
	);
	const user = await openDoc();
	const text = screen.getByText("world.");
	vi.spyOn(window, "getSelection").mockReturnValue({
		isCollapsed: false,
		anchorNode: text.firstChild,
		toString: () => "world",
	} as unknown as Selection);
	await user.pointer({ target: text, keys: "[MouseLeft]" });
	await user.type(await screen.findByLabelText("Comment"), "Say more");
	await user.click(screen.getByRole("button", { name: "Add comment" }));
	await waitFor(() => expect(puts).toHaveLength(1));
	// After the thread already on that line, not between the line and it.
	expect(puts[0].content).toMatch(
		/Hello world\.\n\n> \[!comment\] c1 human, 2026-10-02[\s\S]*Done\.\n\n> \[!comment\] c2 human, (\d{4}-\d\d-\d\d \d\d:\d\d E[SD]T), on "world" \[pending \1\]\n> Say more\n$/,
	);
	expect((await screen.findByRole("alert")).textContent).toMatch(
		/doesn't commit/,
	);
});

test("a touch selection (selectionchange, no mouseup) opens the comment box only inside the body", async () => {
	stub("unused");
	await openDoc();
	const text = screen.getByText("world.");
	const spy = vi.spyOn(window, "getSelection");
	spy.mockReturnValue({
		isCollapsed: false,
		anchorNode: screen.getByLabelText("Project"),
		toString: () => "outside",
	} as unknown as Selection);
	document.dispatchEvent(new Event("selectionchange"));
	await new Promise((r) => setTimeout(r, 450));
	expect(screen.queryByLabelText("Comment")).toBeNull();
	spy.mockReturnValue({
		isCollapsed: false,
		anchorNode: text.firstChild,
		toString: () => "world",
	} as unknown as Selection);
	document.dispatchEvent(new Event("selectionchange"));
	expect(await screen.findByLabelText("Comment")).toBeTruthy();
});

test("Request review posts the path with the resend choice, shows the result, and reloads", async () => {
	const posts: { path: string; resend: boolean }[] = [];
	let reads = 0;
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string, init?: RequestInit) => {
			const other = routed(url);
			if (other) return other;
			if (init?.method === "POST") {
				posts.push(JSON.parse(init.body as string));
				return url.endsWith("/review") && posts.length === 3
					? new Response(JSON.stringify({ error: "no agent for a.md" }), {
							status: 409,
						})
					: new Response(
							JSON.stringify({
								project: "p",
								path: "a.md",
								agent: "docs",
								threads: 1,
							}),
						);
			}
			reads++;
			return new Response(
				JSON.stringify({
					project: "p",
					path: "a.md",
					content: original.replace(
						"[sent 2026-10-02 14:06 EDT]",
						reads > 1
							? "[sent 2026-10-04 21:14 EDT]"
							: "[pending 2026-10-02 14:05 EDT]",
					),
					hash: `h${reads}`,
					branch: "feature",
				}),
			);
		}),
	);
	const user = await openDoc();
	await user.click(screen.getByRole("button", { name: "Request review" }));
	expect((await screen.findByRole("status")).textContent).toBe(
		"Sent 1 thread to docs.",
	);
	expect(posts[0]).toEqual({ path: "a.md", resend: false });
	expect(await screen.findByText(/\[sent 2026-10-04 21:14 EDT\]/)).toBeTruthy();
	await user.click(screen.getByLabelText(/Resend/));
	await user.click(screen.getByRole("button", { name: "Request review" }));
	await waitFor(() => expect(posts[1]).toEqual({ path: "a.md", resend: true }));
	await user.click(screen.getByRole("button", { name: "Request review" }));
	expect((await screen.findByRole("alert")).textContent).toBe(
		"no agent for a.md",
	);
});

test("the project is a dropdown of known projects and a bare ticket ID opens its ticket", async () => {
	stub();
	const user = userEvent.setup();
	render(
		<MemoryRouter>
			<DocumentView onLoggedOut={() => {}} />
		</MemoryRouter>,
	);
	expect((await screen.findByRole("option", { name: "p" })).textContent).toBe(
		"p",
	);
	await user.type(screen.getByLabelText("Document"), "x8jt");
	await user.click(screen.getByRole("button", { name: "Open" }));
	await screen.findByText(/on feature/);
	const urls = vi.mocked(fetch).mock.calls.map((c) => String(c[0]));
	expect(urls).toContain(
		"/api/v1/projects/p/documents/docs/tickets/open/t-x8jt.md",
	);
});

test("the comment box opens at the highlighted block, not above the document", async () => {
	stub();
	const user = await openDoc();
	const text = screen.getByText("world.");
	// The highlight re-renders the text, so take the row now.
	const row = text.closest("[data-last]")?.parentElement;
	vi.spyOn(window, "getSelection").mockReturnValue({
		isCollapsed: false,
		anchorNode: text.firstChild,
		toString: () => "world",
	} as unknown as Selection);
	await user.pointer({ target: text, keys: "[MouseLeft]" });
	const box = await screen.findByLabelText("Comment");
	expect(row?.contains(box)).toBe(true);
});

test("search clear button shows when typing, clears the box and focuses the input", async () => {
	stub();
	const user = userEvent.setup();
	render(
		<MemoryRouter>
			<DocumentView onLoggedOut={() => {}} />
		</MemoryRouter>,
	);
	const searchInput = screen.getByLabelText("Document") as HTMLInputElement;

	// Clear button should not be visible initially (empty search box)
	expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();

	// Type in the search box
	await user.type(searchInput, "test");
	expect(searchInput.value).toBe("test");

	// Clear button should now be visible with correct aria-label
	const clearButton = await screen.findByRole("button", {
		name: "Clear search",
	});
	expect(clearButton).toBeTruthy();

	// Click the clear button
	await user.click(clearButton);

	// Input should be empty and button should be hidden
	await waitFor(() => {
		expect(searchInput.value).toBe("");
		expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
	});

	// Input should be focused
	expect(document.activeElement).toBe(searchInput);
});
