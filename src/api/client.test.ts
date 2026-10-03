import { afterEach, expect, test, vi } from "vitest";
import { act, items, login, logout, session } from "./client";

function mockFetch(status: number, body?: unknown) {
	const fn = vi.fn(
		async () =>
			new Response(body === undefined ? null : JSON.stringify(body), {
				status,
			}),
	);
	vi.stubGlobal("fetch", fn);
	return fn;
}

afterEach(() => vi.unstubAllGlobals());

test("login posts the credentials and returns the session", async () => {
	const fn = mockFetch(200, { username: "jo" });
	const r = await login({ username: "jo", password: "pw" });
	expect(r).toEqual({ ok: true, value: { username: "jo" } });
	const [url, init] = fn.mock.calls[0] as unknown as [string, RequestInit];
	expect(url).toBe("/api/v1/login");
	expect(init.method).toBe("POST");
	expect(init.credentials).toBe("same-origin");
	expect(init.body).toBe('{"username":"jo","password":"pw"}');
});

test("a wrong password is a typed not-logged-in with the gateway's message", async () => {
	mockFetch(401, { error: "wrong username or password" });
	expect(await login({ username: "jo", password: "x" })).toEqual({
		ok: false,
		notLoggedIn: true,
		error: "wrong username or password",
	});
});

test("401 on session is not-logged-in", async () => {
	mockFetch(401, { error: "login required" });
	const r = await session();
	expect(r.ok).toBe(false);
	expect(!r.ok && r.notLoggedIn).toBe(true);
});

test("other failures carry status and message", async () => {
	mockFetch(503, { error: "no login is configured in [gateway]" });
	expect(await items()).toEqual({
		ok: false,
		notLoggedIn: false,
		status: 503,
		error: "no login is configured in [gateway]",
	});
});

test("logout posts and accepts an empty 204", async () => {
	const fn = mockFetch(204);
	expect((await logout()).ok).toBe(true);
	expect((fn.mock.calls[0] as unknown as [string])[0]).toBe("/api/v1/logout");
});

test.each(["done", "drop", "answer"] as const)(
	"%s posts text to the task route",
	async (action) => {
		const fn = mockFetch(200, { project: "p q", task_id: "t-1", action });
		await act("p q", "t-1", action, "because");
		const [url, init] = fn.mock.calls[0] as unknown as [string, RequestInit];
		expect(url).toBe(`/api/v1/projects/p%20q/tasks/t-1/${action}`);
		expect(init.method).toBe("POST");
		expect(init.body).toBe('{"text":"because"}');
	},
);
