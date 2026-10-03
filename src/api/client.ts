import type { ActionRequest } from "./generated/ActionRequest";
import type { ActionResult } from "./generated/ActionResult";
import type { Credentials } from "./generated/Credentials";
import type { DayReport } from "./generated/DayReport";
import type { HoursReport } from "./generated/HoursReport";
import type { InteractionBucket } from "./generated/InteractionBucket";
import type { InteractionGroup } from "./generated/InteractionGroup";
import type { InteractionReport } from "./generated/InteractionReport";
import type { Items } from "./generated/Items";
import type { SessionInfo } from "./generated/SessionInfo";

const BASE = "/api/v1";

export type Action = "done" | "drop" | "answer";

/** A 401 is an expected state (show the login form), so it is a value, not a throw. */
export type NotLoggedIn = { ok: false; notLoggedIn: true; error: string };
export type Failed = {
	ok: false;
	notLoggedIn: false;
	status: number;
	error: string;
};
export type Ok<T> = { ok: true; value: T };
export type Result<T> = Ok<T> | NotLoggedIn | Failed;

async function call<T>(
	path: string,
	init: { method?: string; body?: unknown } = {},
): Promise<Result<T>> {
	const res = await fetch(BASE + path, {
		method: init.method ?? "GET",
		credentials: "same-origin",
		headers:
			init.body === undefined
				? undefined
				: { "Content-Type": "application/json" },
		body: init.body === undefined ? undefined : JSON.stringify(init.body),
	});
	const text = await res.text();
	const json = text ? JSON.parse(text) : undefined;
	if (res.ok) return { ok: true, value: json as T };
	const error = json?.error ?? res.statusText;
	if (res.status === 401) {
		return { ok: false, notLoggedIn: true, error };
	}
	return { ok: false, notLoggedIn: false, status: res.status, error };
}

export const health = () => call<unknown>("/health");

export const login = (credentials: Credentials) =>
	call<SessionInfo>("/login", { method: "POST", body: credentials });

export const logout = () => call<undefined>("/logout", { method: "POST" });

export const session = () => call<SessionInfo>("/session");

export const items = () => call<Items>("/items");

/** `text` is the reason for drop and the answer for answer; done ignores it. */
export const act = (project: string, id: string, action: Action, text = "") => {
	const body: ActionRequest = { text };
	const path = `/projects/${encodeURIComponent(project)}/tasks/${encodeURIComponent(id)}/${action}`;
	return call<ActionResult>(path, { method: "POST", body });
};

export type InteractionQuery = {
	from: string;
	to: string;
	group: InteractionGroup;
	bucket: InteractionBucket;
};

const qs = (params: Record<string, string>) =>
	new URLSearchParams(params).toString();

export const interactionReport = (q: InteractionQuery) =>
	call<InteractionReport>(`/interactions/report?${qs(q)}`);

export const interactionDay = (date: string) =>
	call<DayReport>(`/interactions/day?${qs({ date })}`);

/** `days` is `weekday`, `weekend` or a comma list like `mon,wed`. */
export const interactionHours = (from: string, to: string, days: string) =>
	call<HoursReport>(`/interactions/hours?${qs({ from, to, days })}`);
