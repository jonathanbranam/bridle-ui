import { afterEach, expect, test, vi } from "vitest";
import {
	act,
	interactionDay,
	interactionHours,
	interactionReport,
	items,
	login,
	logout,
	readDocument,
	requestReview,
	session,
	writeDocument,
} from "./client";

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

test("interaction reports use the gateway's paths and query names", async () => {
	const fn = mockFetch(200, {});
	await interactionReport({
		from: "2026-10-01",
		to: "2026-10-07",
		group: "agent",
		bucket: "week",
	});
	await interactionDay("2026-10-01");
	await interactionHours("2026-10-01", "2026-10-07", "mon,wed");
	const urls = fn.mock.calls.map((c) => (c as unknown as [string])[0]);
	expect(urls).toEqual([
		"/api/v1/interactions/report?from=2026-10-01&to=2026-10-07&group=agent&bucket=week",
		"/api/v1/interactions/day?date=2026-10-01",
		"/api/v1/interactions/hours?from=2026-10-01&to=2026-10-07&days=mon%2Cwed",
	]);
});

test("readDocument encodes each path segment and keeps the slashes", async () => {
	const fn = mockFetch(200, { content: "x", hash: "h" });
	const r = await readDocument("my proj", "docs/a b.md");
	expect(r.ok).toBe(true);
	expect((fn.mock.calls[0] as unknown as [string])[0]).toBe(
		"/api/v1/projects/my%20proj/documents/docs/a%20b.md",
	);
});

test("writeDocument puts content and hash; a 409 is a failure with the message", async () => {
	const fn = mockFetch(409, { error: "the file changed" });
	const r = await writeDocument("p", "a.md", "new", "h1");
	expect(r).toEqual({
		ok: false,
		notLoggedIn: false,
		status: 409,
		error: "the file changed",
	});
	const [, init] = fn.mock.calls[0] as unknown as [string, RequestInit];
	expect(init.method).toBe("PUT");
	expect(JSON.parse(init.body as string)).toEqual({
		content: "new",
		hash: "h1",
	});
});

test.each([false, true])(
	"requestReview posts the path and resend=%s to the project's review route",
	async (resend) => {
		const fn = mockFetch(200, {
			project: "my proj",
			path: "docs/a.md",
			agent: "docs",
			threads: 2,
		});
		const r = await requestReview("my proj", "docs/a.md", resend);
		const [url, init] = fn.mock.calls[0] as unknown as [string, RequestInit];
		expect(url).toBe("/api/v1/projects/my%20proj/review");
		expect(init.method).toBe("POST");
		expect(JSON.parse(init.body as string)).toEqual({
			path: "docs/a.md",
			resend,
		});
		expect(r.ok && r.value.threads).toBe(2);
	},
);

test("requestReview failures carry the gateway's message", async () => {
	mockFetch(409, { error: "no agent is assigned to docs/a.md" });
	const r = await requestReview("p", "docs/a.md", false);
	expect(!r.ok && r.error).toBe("no agent is assigned to docs/a.md");
});
