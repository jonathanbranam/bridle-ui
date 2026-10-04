import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, expect, test, vi } from "vitest";
import { DocumentView } from "./Document";

afterEach(() => vi.unstubAllGlobals());

const original = `# T

Hello world.

> [!comment] human, 2026-10-02 14:05, on "Hello"
> Why?
>
> **docs agent, 14:06:** @human Done.
`;

function stub(error?: string) {
	const puts: { content: string; hash: string }[] = [];
	vi.stubGlobal(
		"fetch",
		vi.fn(async (_url: string, init?: RequestInit) => {
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
	await user.type(screen.getByLabelText("Project"), "p");
	await user.type(screen.getByLabelText("Path"), "a.md");
	await user.click(screen.getByRole("button", { name: "Open" }));
	await screen.findByText(/on feature/);
	return user;
}

test("opening an unread thread writes (read) back with the hash", async () => {
	const puts = stub();
	const user = await openDoc();
	expect(screen.queryByText("Why?")).toBeNull();
	await user.click(screen.getByRole("button", { name: /human.*Hello/ }));
	expect(screen.getByText("Why?")).toBeTruthy();
	await waitFor(() => expect(puts).toHaveLength(1));
	expect(puts[0].hash).toBe("h1");
	expect(puts[0].content).toContain("@human (read) Done.");
});

test("a selection becomes a comment in the approved format; errors are shown", async () => {
	const puts = stub(
		"the working tree is on 'main', which the gateway doesn't commit to",
	);
	const user = await openDoc();
	const text = screen.getByText("Hello world.");
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
		/Hello world\.\n\n> \[!comment\] human, 2026-10-02[\s\S]*Done\.\n\n> \[!comment\] human, \d{4}-\d\d-\d\d \d\d:\d\d, on "world"\n> Say more\n$/,
	);
	expect((await screen.findByRole("alert")).textContent).toMatch(
		/doesn't commit/,
	);
});

test("Request review posts the path with the resend choice, shows the result, and reloads", async () => {
	const posts: { path: string; resend: boolean }[] = [];
	let reads = 0;
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string, init?: RequestInit) => {
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
						'on "Hello"',
						reads > 1 ? 'on "Hello" · sent 2026-10-04 21:14' : 'on "Hello"',
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
	expect(await screen.findByText(/· sent 2026-10-04 21:14/)).toBeTruthy();
	await user.click(screen.getByLabelText(/Resend/));
	await user.click(screen.getByRole("button", { name: "Request review" }));
	await waitFor(() => expect(posts[1]).toEqual({ path: "a.md", resend: true }));
	await user.click(screen.getByRole("button", { name: "Request review" }));
	expect((await screen.findByRole("alert")).textContent).toBe(
		"no agent for a.md",
	);
});
