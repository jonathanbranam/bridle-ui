// Binds the executable scenarios in design/specs/ to tests (adapter: tools/vitest-bridle).
// Skipped when `bridle` is not on PATH, as `npm run check` skips `check:specs`.
import { execFileSync } from "node:child_process";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, test, vi } from "vitest";
import {
	createSteps,
	registerBridleSpecs,
} from "../tools/vitest-bridle/index.mjs";
import { DocumentView } from "./Document";
import { IdChip } from "./IdChip";
import { SpecsView } from "./SpecPage";

function hasBridle() {
	try {
		execFileSync(process.env.BRIDLE_BIN ?? "bridle", ["--version"], {
			stdio: "ignore",
		});
		return true;
	} catch {
		return false;
	}
}

// The thread highlights "Hello", which leaves "world." as its own text node to select.
const doc = `# T

Hello world.

> [!comment] c1 human, 2026-10-02 14:05 EDT, on "Hello" [sent 2026-10-02 14:06 EDT]
> Why?
`;

function stubGateway() {
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string) => {
			if (url.endsWith("/projects"))
				return new Response(
					JSON.stringify({ projects: [{ project: "p", reachable: true }] }),
				);
			if (url.includes("/documents?"))
				return new Response(JSON.stringify({ project: "p", paths: ["a.md"] }));
			return new Response(
				JSON.stringify({
					project: "p",
					path: "a.md",
					content: doc,
					hash: "h1",
					branch: "feature",
				}),
			);
		}),
	);
}

function renderDocument() {
	stubGateway();
	render(
		<MemoryRouter initialEntries={["/p/p/docs"]}>
			<Routes>
				<Route
					path="/p/:project/docs"
					element={<DocumentView onLoggedOut={() => {}} />}
				/>
			</Routes>
		</MemoryRouter>,
	);
}

// `bridle spec coverage --tests src` finds bound scenarios by their ids in this file:
// s-cc27 (IdChip)
// s-50c7 (IdChip)
// s-839b (Document)
// s-8cdc (Document)
// s-6e3b (Specs)
const steps = createSteps();

steps.given(/^an ID chip showing the ID "(.+)"$/, (w, id) => {
	w.id = id;
});
steps.when(/^the chip is rendered$/, (w) => {
	render(<IdChip id={w.id} />);
});
steps.then(/^the ID is plain selectable text, not inside the button$/, (w) => {
	const text = screen.getByText(w.id);
	expect(text.tagName).toBe("CODE");
	expect(text.closest("button")).toBeNull();
});
steps.when(
	/^the human clicks the button labelled "(.+)"$/,
	async (w, label) => {
		render(<IdChip id={w.id} />);
		w.writeText = vi.spyOn(navigator.clipboard, "writeText");
		await userEvent.setup().click(screen.getByRole("button", { name: label }));
	},
);
steps.then(/^the clipboard receives "(.+)"$/, (w, text) => {
	expect(w.writeText).toHaveBeenCalledWith(text);
});

steps.given(/^the Document page with an empty search box$/, () => {
	renderDocument();
});
steps.when(/^the human types "(.+)" into the search box$/, async (_w, text) => {
	await userEvent.setup().type(screen.getByLabelText("Document"), text);
});
steps.then(/^a "Clear search" button is shown and disabled$/, () => {
	expect(
		(screen.getByRole("button", { name: "Clear search" }) as HTMLButtonElement)
			.disabled,
	).toBe(true);
});
steps.then(/^the "Clear search" button is enabled$/, () => {
	expect(
		(screen.getByRole("button", { name: "Clear search" }) as HTMLButtonElement)
			.disabled,
	).toBe(false);
});

steps.given(/^an opened document$/, async () => {
	renderDocument();
	const user = userEvent.setup();
	await user.type(screen.getByLabelText("Document"), "a.md");
	await user.click(screen.getByRole("button", { name: "Open" }));
	await screen.findByText(/on feature/);
});
steps.when(/^the human selects text inside the body by touch$/, () => {
	vi.spyOn(window, "getSelection").mockReturnValue({
		isCollapsed: false,
		anchorNode: screen.getByText("world.").firstChild,
		toString: () => "world",
	} as unknown as Selection);
	document.dispatchEvent(new Event("selectionchange"));
});
steps.then(/^the \[ \+ \] button shows and no comment box opens$/, async () => {
	await screen.findByRole("button", { name: "Add comment on selection" });
	expect(screen.queryByLabelText("Comment")).toBeNull();
});

steps.given(/^the Specs page$/, () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string) => {
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
					content: "### Requirement: R  {#r-1111}\n",
					hash: "h",
					branch: "main",
				}),
			);
		}),
	);
});
steps.when(
	/^the human opens the capability "(.+)" in project "(.+)"$/,
	(_w, cap, project) => {
		render(
			<MemoryRouter
				initialEntries={[`/specs?project=${project}&capability=${cap}`]}
			>
				<SpecsView onLoggedOut={() => {}} />
			</MemoryRouter>,
		);
	},
);
steps.then(/^the requirement ID "(.+)" is shown as a chip$/, async (_w, id) => {
	expect(await screen.findByText(id)).toBeTruthy();
});

if (hasBridle()) {
	await registerBridleSpecs({ steps });
} else {
	test.skip("bridle is not on PATH: spec scenarios not run", () => {});
}
