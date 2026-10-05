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
