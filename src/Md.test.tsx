import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, test, vi } from "vitest";
import { DocumentView } from "./Document";
import { LinkScope, Md } from "./Md";

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

function resolving(map: Record<string, string | null>) {
	vi.stubGlobal(
		"fetch",
		vi.fn(async (_url: string, init?: RequestInit) => {
			const { targets } = JSON.parse(init?.body as string) as {
				targets: string[];
			};
			return new Response(
				JSON.stringify({
					project: "p",
					links: targets.map((t) => ({ target: t, path: map[t] ?? null })),
				}),
			);
		}),
	);
}

const shown = (text: string) =>
	render(
		<LinkScope project="p" texts={[text]}>
			<Md text={text} />
		</LinkScope>,
	);

test("a URL is a link", () => {
	shown("see https://example.com/x now");
	expect(screen.getByRole("link")).toHaveAttribute(
		"href",
		"https://example.com/x",
	);
});

test("a resolved wiki link opens the document, with its label", async () => {
	resolving({ "docs/design/cli": "docs/design/cli.md" });
	shown("read [[docs/design/cli|the CLI]] first");
	const a = await screen.findByRole("link", { name: "the CLI" });
	expect(a).toHaveAttribute("href", "/p/p/docs?path=docs%2Fdesign%2Fcli.md");
});

test("an unresolved wiki link is plain text", async () => {
	resolving({});
	shown("read [[docs/design/cli|the CLI]] first");
	await waitFor(() => expect(fetch).toHaveBeenCalled());
	expect(screen.getByText(/the CLI/)).toBeInTheDocument();
	expect(screen.queryByRole("link")).toBeNull();
});

test("a ticket ID links when resolved; a task ID links to the task page", async () => {
	resolving({ ab3d: "docs/tickets/open/t-ab3d.md" });
	shown("see ab3d and br-zz9k");
	const a = await screen.findByRole("link", { name: "ab3d" });
	expect(a).toHaveAttribute(
		"href",
		"/p/p/docs?path=docs%2Ftickets%2Fopen%2Ft-ab3d.md",
	);
	expect(screen.getByRole("link", { name: "br-zz9k" })).toHaveAttribute(
		"href",
		"/p/p/tasks/br-zz9k",
	);
	expect(screen.getAllByRole("link")).toHaveLength(2);
});

test("front matter is a table with linked values, and comments still anchor over a link", async () => {
	const content = `---
title: T
see: [ab3d]
---

- item with [[docs/a|link]] inside
`;
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string, init?: RequestInit) => {
			if (url.endsWith("/projects"))
				return new Response(
					JSON.stringify({ projects: [{ project: "p", reachable: true }] }),
				);
			if (url.includes("/documents?"))
				return new Response(JSON.stringify({ project: "p", paths: [] }));
			if (url.includes("/links/resolve")) {
				const { targets } = JSON.parse(init?.body as string);
				return new Response(
					JSON.stringify({
						project: "p",
						links: targets.map((t: string) => ({
							target: t,
							path: t === "ab3d" ? "docs/tickets/open/t-ab3d.md" : null,
						})),
					}),
				);
			}
			return new Response(
				JSON.stringify({
					project: "p",
					path: "a.md",
					content,
					hash: "h1",
					branch: "main",
				}),
			);
		}),
	);
	render(
		<MemoryRouter initialEntries={["/document?project=p&path=a.md"]}>
			<DocumentView onLoggedOut={() => {}} />
		</MemoryRouter>,
	);
	expect(await screen.findByText("title")).toBeInTheDocument();
	expect(screen.getByRole("table")).toBeInTheDocument();
	expect(screen.queryByText("---")).toBeNull();
	expect(await screen.findByRole("link", { name: "ab3d" })).toBeInTheDocument();
	expect(screen.getByText(/item with/)).toBeInTheDocument();
});

test("a resolved spec ID links to the Specs page at its heading", async () => {
	resolving({ "r-ab23": "design/specs/thing.md#r-ab23" });
	shown("see r-ab23 now");
	const a = await screen.findByRole("link", { name: "r-ab23" });
	expect(a).toHaveAttribute(
		"href",
		"/p/p/specs?path=design%2Fspecs%2Fthing.md#r-ab23",
	);
});

test("an unresolved spec ID stays plain text", async () => {
	resolving({});
	shown("see s-zz99 now");
	await waitFor(() => expect(fetch).toHaveBeenCalled());
	expect(screen.queryByRole("link")).toBeNull();
	expect(screen.getByText(/s-zz99/)).toBeTruthy();
});

test("a ticket stem links when the gateway resolves it", async () => {
	resolving({ "some-title-ab3d": "docs/tickets/open/some-title-ab3d.md" });
	shown("some-title-ab3d");
	expect(
		await screen.findByRole("link", { name: "some-title-ab3d" }),
	).toHaveAttribute(
		"href",
		"/p/p/docs?path=docs%2Ftickets%2Fopen%2Fsome-title-ab3d.md",
	);
});

test("a GFM table renders as a table inside a scrolling box", () => {
	shown("| a | b |\n|:--|--:|\n| 1 | 2 |");
	const table = screen.getByRole("table");
	expect(table.parentElement).toHaveClass("overflow-x-auto");
	expect(screen.getByRole("columnheader", { name: "b" })).toHaveStyle({
		textAlign: "right",
	});
	expect(screen.getByRole("cell", { name: "1" })).toBeInTheDocument();
});

test("the Document page renders a markdown table as a table", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string) => {
			if (url.endsWith("/projects"))
				return new Response(
					JSON.stringify({ projects: [{ project: "p", reachable: true }] }),
				);
			if (url.includes("/documents?"))
				return new Response(JSON.stringify({ project: "p", paths: [] }));
			if (url.includes("/links/resolve"))
				return new Response(JSON.stringify({ project: "p", links: [] }));
			return new Response(
				JSON.stringify({
					project: "p",
					path: "a.md",
					content: "intro\n\n| name | idea |\n|---|---|\n| cell-x | cell-y |\n",
					hash: "h1",
					branch: "main",
				}),
			);
		}),
	);
	render(
		<MemoryRouter initialEntries={["/document?project=p&path=a.md"]}>
			<DocumentView onLoggedOut={() => {}} />
		</MemoryRouter>,
	);
	expect(await screen.findByRole("table")).toBeInTheDocument();
	expect(screen.getByRole("cell", { name: "cell-y" })).toBeInTheDocument();
});

test("block mode renders a quote with a numbered, nested list", () => {
	const { container } = render(
		<Md
			block
			text={"> Why:\n>\n> 1. a\n>    wrapped\n> 2. b\n>    - nested"}
		/>,
	);
	expect(container.querySelector("blockquote ol")).not.toBeNull();
	expect(container.querySelectorAll("blockquote ol > li")).toHaveLength(2);
	expect(container.querySelector("ol ul li")).not.toBeNull();
	expect(container.querySelectorAll("p")).toHaveLength(1);
});

test("a numbered item keeps its number", () => {
	const { container } = render(<Md block text={"3. c"} />);
	expect(container.querySelector("ol")).toHaveAttribute("start", "3");
});

test("a highlight keeps bold, links and code intact, partly or wholly inside", () => {
	const text =
		"Ask **Stephen King** about `code here` and https://example.com/x ok";
	const { container } = render(
		<Md
			block
			text={text}
			quotes={["Ask Stephen", "King about code", "example.com/x ok"]}
		/>,
	);
	expect(container.querySelector("strong")?.textContent).toBe("Stephen King");
	expect(container.textContent).not.toContain("*");
	expect(container.textContent).not.toContain("`");
	const marks = [...container.querySelectorAll("mark")].map(
		(m) => m.textContent,
	);
	expect(marks.join("")).toContain("Stephen");
	// The link still links, with the highlight inside it.
	const a = container.querySelector("a");
	expect(a).toHaveAttribute("href", "https://example.com/x");
	expect(a?.querySelector("mark")).not.toBeNull();
	expect(container.querySelector("code mark")?.textContent).toBe("code");
});

test("a re-render keeps the rendered paragraphs mounted (selection survives)", () => {
	const { container, rerender } = render(<Md block text={"one\n\n- two"} />);
	const before = [...container.querySelectorAll("p, ul")];
	rerender(<Md block text={"one\n\n- two"} />);
	const after = [...container.querySelectorAll("p, ul")];
	expect(before.length).toBe(2);
	after.forEach((n, i) => {
		expect(n).toBe(before[i]);
	});
});
