import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, test, vi } from "vitest";
import { parseHeading, SpecsView } from "./SpecPage";

afterEach(() => vi.unstubAllGlobals());

test("parseHeading takes the id out of the title", () => {
	expect(parseHeading("### Requirement: A thing  {#r-1111 protected}")).toEqual(
		{
			level: 3,
			title: "Requirement: A thing",
			id: "r-1111",
		},
	);
	expect(parseHeading("## Requirements")?.id).toBeUndefined();
	expect(parseHeading("plain")).toBeNull();
});

test("opens design/specs/<capability>.md and shows IDs as chips", async () => {
	const urls: string[] = [];
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string) => {
			urls.push(url);
			if (url.endsWith("/projects"))
				return new Response(
					JSON.stringify({ projects: [{ project: "p", reachable: true }] }),
				);
			if (url.includes("/links/resolve"))
				return new Response(JSON.stringify({ links: [] }));
			return new Response(
				JSON.stringify({
					project: "p",
					path: "design/specs/demo.md",
					content:
						"# Demo\n\n### Requirement: R  {#r-1111}\n\nThe page SHALL.\n",
					hash: "h",
					branch: "main",
				}),
			);
		}),
	);
	render(
		<MemoryRouter initialEntries={["/specs?project=p&capability=demo"]}>
			<SpecsView onLoggedOut={() => {}} />
		</MemoryRouter>,
	);
	expect(await screen.findByText("r-1111")).toBeTruthy();
	expect(screen.getByText("Requirement: R")).toBeTruthy();
	// Md resolves link targets once the document shows; let that finish before the stub goes.
	await waitFor(() =>
		expect(urls.some((u) => u.includes("/links/resolve"))).toBe(true),
	);
	expect(urls.some((u) => u.endsWith("/documents/design/specs/demo.md"))).toBe(
		true,
	);
});

test("without a path it lists the project's specs", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string) => {
			if (url.endsWith("/projects"))
				return new Response(
					JSON.stringify({ projects: [{ project: "p", reachable: true }] }),
				);
			return new Response(
				JSON.stringify({
					project: "p",
					specs: [
						{
							path: "design/specs/demo.md",
							capability: "demo",
							title: "Demo thing",
							requirements: [
								{
									id: "r-1111",
									heading: "R",
									protected: false,
									line: 3,
									scenarios: [],
								},
							],
							diagnostics: [],
						},
						{
							path: "design/specs/bad.md",
							capability: "bad",
							title: null,
							requirements: [],
							diagnostics: [{ line: 2, column: 1, message: "no heading" }],
						},
					],
				}),
			);
		}),
	);
	render(
		<MemoryRouter initialEntries={["/specs"]}>
			<SpecsView onLoggedOut={() => {}} />
		</MemoryRouter>,
	);
	const link = await screen.findByRole("link", { name: "Demo thing" });
	expect(link.getAttribute("href")).toBe(
		"/specs?project=p&path=design%2Fspecs%2Fdemo.md",
	);
	expect(screen.getByText("demo, 1 requirements")).toBeTruthy();
	expect(screen.getByText("line 2: no heading")).toBeTruthy();
});
