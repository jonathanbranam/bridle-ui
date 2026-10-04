import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
	render(<DocumentView onLoggedOut={() => {}} />);
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
