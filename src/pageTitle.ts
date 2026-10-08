import { useEffect } from "react";
import { useLocation } from "react-router";

// One marker per kind, the same everywhere (rule web.page-title).
export const MARKERS = {
	todo: "☑️",
	task: "\u{1F4CB}",
	ticket: "\u{1F3AB}",
	doc: "\u{1F4C4}",
	spec: "\u{1F4D0}",
} as const;

const PAGES: Record<string, string> = {
	"/": "To-dos",
	"/tasks": "Tasks",
	"/system": "System",
	"/time": "Time",
	"/document": "Documents",
	"/specs": "Specs",
};

const base = (path: string) => path.split("/").pop() || path;

/** Name first, project after; the page name when nothing is open. */
export function titleFor(pathname: string, search: string): string {
	const m =
		/^\/p\/([^/]+)(?:\/(tasks|tickets|docs|specs)(?:\/([^/]+))?)?\/?$/.exec(
			pathname,
		);
	if (!m) return `${PAGES[pathname] ?? "bridle"} - bridle`;
	const project = decodeURIComponent(m[1]);
	const id = m[3] && decodeURIComponent(m[3]);
	const path = new URLSearchParams(search).get("path");
	switch (m[2]) {
		case "tasks":
			return `${MARKERS.task} ${id} - ${project}`;
		case "tickets":
			return `${MARKERS.ticket} ${id} - ${project}`;
		case "docs":
			return path
				? `${MARKERS.doc} ${base(path)} - ${project}`
				: `Documents - ${project}`;
		case "specs":
			return path
				? `${MARKERS.spec} ${base(path)} - ${project}`
				: `Specs - ${project}`;
		default:
			return `${project} - bridle`;
	}
}

/** The task page knows the task's title once loaded; the route only knows its ID. */
export const taskTitle = (project: string, id: string, title: string) =>
	`${MARKERS.task} ${id} ${title} - ${project}`;

/** Project name in a `/p/{project}` path, if any. */
export function projectOf(pathname: string): string | undefined {
	const m = /^\/p\/([^/]+)/.exec(pathname);
	return m ? decodeURIComponent(m[1]) : undefined;
}

// Hue from the machine name, so a machine always gets the same colour.
function hue(name: string) {
	let h = 0;
	for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
	return h;
}

export function faviconHref(machine: string) {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="hsl(${hue(machine)} 65% 45%)"/><text x="16" y="23" font-size="20" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#fff">b</text></svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function setFavicon(machine: string) {
	let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
	if (!link) {
		link = document.createElement("link");
		link.rel = "icon";
		document.head.append(link);
	}
	link.href = faviconHref(machine);
}

/** Runs on every route change (path or query), not just load. */
export function usePageTitle() {
	const { pathname, search } = useLocation();
	useEffect(() => {
		document.title = titleFor(pathname, search);
	}, [pathname, search]);
}
