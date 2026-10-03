import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { ItemsView } from "./Items";

afterEach(() => vi.unstubAllGlobals());

const todo = (id: string, title: string) => ({
	task_id: id,
	title,
	body: "",
	priority: "normal",
	created_at: "2026-10-01T00:00:00Z",
});
const decision = (id: string, title: string) => ({
	task_id: id,
	title,
	asked_by: "agent-1",
	question: `Q for ${title}?`,
	priority: "high",
	asked_at: "2026-10-01T00:00:00Z",
});

const data = {
	projects: [
		{
			project: "alpha",
			machine: null,
			decisions: [decision("a-1", "Pick a color")],
			todos: [todo("a-2", "Buy milk"), todo("a-3", "Walk dog")],
		},
		{
			project: "beta",
			machine: null,
			decisions: [],
			todos: [todo("b-1", "Ship")],
		},
	],
	unreachable: [
		{
			project: "gamma",
			machine: "box",
			url: null,
			reachable: false,
			reason: "timed out",
		},
	],
};

function setup() {
	const fetchMock = vi.fn(async (_url: string, init?: RequestInit) =>
		init?.method === "POST"
			? new Response(JSON.stringify({}), { status: 200 })
			: new Response(JSON.stringify(data), { status: 200 }),
	);
	vi.stubGlobal("fetch", fetchMock);
	render(<ItemsView onLoggedOut={() => {}} />);
	const posts = () =>
		fetchMock.mock.calls.filter(([, i]) => i?.method === "POST");
	const gets = () =>
		fetchMock.mock.calls.filter(([, i]) => i?.method !== "POST");
	return { posts, gets };
}

test("groups by project, decisions before to-dos, gateway order kept", async () => {
	setup();
	const alpha = (await screen.findByRole("heading", { name: "alpha" })).closest(
		"section",
	) as HTMLElement;
	const titles = within(alpha)
		.getAllByRole("listitem")
		.map((li) => li.querySelector("p")?.textContent);
	expect(titles[0]).toContain("Pick a color");
	expect(titles[1]).toContain("Buy milk");
	expect(titles[2]).toContain("Walk dog");
	expect(screen.getByRole("heading", { name: "beta" })).toBeInTheDocument();
});

test("unreachable projects are a muted line, not an alert", async () => {
	setup();
	const line = await screen.findByTestId("unreachable");
	expect(line).toHaveTextContent("gamma is unreachable: timed out");
	expect(screen.queryByRole("alert")).toBeNull();
});

test("done calls the client and refetches", async () => {
	const { posts, gets } = setup();
	const user = userEvent.setup();
	await screen.findByText("Buy milk");
	await user.click(screen.getAllByRole("button", { name: "Done" })[0]);
	await vi.waitFor(() => expect(gets()).toHaveLength(2));
	expect(posts()[0][0]).toBe("/api/v1/projects/alpha/tasks/a-2/done");
});

test("decline needs a reason, then drops and refetches", async () => {
	const { posts, gets } = setup();
	const user = userEvent.setup();
	await screen.findByText("Buy milk");
	await user.click(screen.getAllByRole("button", { name: "Decline…" })[0]);
	await user.click(screen.getByRole("button", { name: "Decline" }));
	expect(posts()).toHaveLength(0);
	await user.type(screen.getByLabelText(/Reason for declining/), "not now");
	await user.click(screen.getByRole("button", { name: "Decline" }));
	await vi.waitFor(() => expect(gets()).toHaveLength(2));
	expect(posts()[0][0]).toBe("/api/v1/projects/alpha/tasks/a-2/drop");
	expect(JSON.parse(posts()[0][1]?.body as string)).toEqual({
		text: "not now",
	});
});

test("answer sends the text and refetches", async () => {
	const { posts, gets } = setup();
	const user = userEvent.setup();
	await user.type(await screen.findByLabelText("Answer Pick a color"), "blue");
	await user.click(screen.getByRole("button", { name: "Answer" }));
	await vi.waitFor(() => expect(gets()).toHaveLength(2));
	expect(posts()[0][0]).toBe("/api/v1/projects/alpha/tasks/a-1/answer");
	expect(JSON.parse(posts()[0][1]?.body as string)).toEqual({ text: "blue" });
});
