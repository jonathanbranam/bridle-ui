import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
	render(<App />);
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
	render(<App />);
	await user.click(await screen.findByRole("button", { name: "Log in" }));
	expect(await screen.findByRole("alert")).toHaveTextContent(
		"wrong username or password",
	);
});

test("a live session skips the form", async () => {
	route({ "/api/v1/session": () => json(200, { username: "jo" }) });
	render(<App />);
	expect(
		await screen.findByRole("button", { name: "Log out" }),
	).toBeInTheDocument();
	expect(screen.queryByLabelText("Username")).toBeNull();
});
