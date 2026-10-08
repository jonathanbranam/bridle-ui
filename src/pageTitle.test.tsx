import { render } from "@testing-library/react";
import { act } from "react";
import { MemoryRouter, useNavigate } from "react-router";
import { expect, test } from "vitest";
import { faviconHref, MARKERS, titleFor, usePageTitle } from "./pageTitle";

test("names the open thing first, then the project", () => {
	expect(titleFor("/p/bridle/tasks/br-1", "")).toBe(
		`${MARKERS.task} br-1 - bridle`,
	);
	expect(titleFor("/p/bridle/tickets/qbbk", "")).toBe(
		`${MARKERS.ticket} qbbk - bridle`,
	);
	expect(titleFor("/p/bridle/docs", "?path=docs/a/b.md")).toBe(
		`${MARKERS.doc} b.md - bridle`,
	);
	expect(titleFor("/p/bridle/specs", "?path=design/specs/x.md")).toBe(
		`${MARKERS.spec} x.md - bridle`,
	);
});

test("falls back to the page name when nothing is selected", () => {
	expect(titleFor("/system", "")).toBe("System - bridle");
	expect(titleFor("/", "")).toBe("To-dos - bridle");
	expect(titleFor("/p/bridle", "")).toBe("bridle - bridle");
	expect(titleFor("/p/bridle/docs", "")).toBe("Documents - bridle");
});

test("the title follows route changes", () => {
	let go: (to: string) => void = () => {};
	function Probe() {
		usePageTitle();
		const nav = useNavigate();
		go = (to) => nav(to);
		return null;
	}
	render(
		<MemoryRouter initialEntries={["/system"]}>
			<Probe />
		</MemoryRouter>,
	);
	expect(document.title).toBe("System - bridle");
	act(() => go("/p/x/tasks/x-2"));
	expect(document.title).toBe(`${MARKERS.task} x-2 - x`);
});

test("favicon colour is stable per machine and differs between machines", () => {
	expect(faviconHref("dalek")).toBe(faviconHref("dalek"));
	expect(faviconHref("dalek")).not.toBe(faviconHref("tardis"));
});
