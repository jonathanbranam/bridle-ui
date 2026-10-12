import { expect, test } from "vitest";
import type { UsagePoint } from "./api/generated/UsagePoint";
import { fiveHourWeeks, sevenDayWeeks, weekOf } from "./usageWeeks";

const pt = (
	utilization: number | null,
	resets_at: string | null,
	observed_at: string,
): UsagePoint => ({ utilization, resets_at, observed_at });

test("a week starts Monday in Eastern, not UTC", () => {
	// Sun 2026-10-11 23:30 EDT is already Mon 03:30 UTC.
	expect(weekOf("2026-10-12T03:30:00Z")).toBe("2026-10-05");
	expect(weekOf("2026-10-12T04:00:00Z")).toBe("2026-10-12");
});

test("five-hour windows count hit, near and peak per week", () => {
	const w = fiveHourWeeks([
		pt(0.5, "2026-10-13T15:00:00Z", "2026-10-13T11:00:00Z"),
		pt(1.0, "2026-10-13T15:00:00Z", "2026-10-13T13:00:00Z"),
		pt(0.2, "2026-10-13T15:00:00Z", "2026-10-13T14:00:00Z"),
		pt(0.93, "2026-10-14T15:00:00Z", "2026-10-14T13:00:00Z"),
		pt(0.4, "2026-10-15T15:00:00Z", "2026-10-15T13:00:00Z"),
		pt(null, "2026-10-15T20:00:00Z", "2026-10-15T19:00:00Z"),
		pt(0.99, "2026-10-06T15:00:00Z", "2026-10-06T13:00:00Z"),
	]);
	expect(w).toEqual([
		{ week: "2026-10-05", windows: 1, hit: 0, near: 1, peak: 99 },
		{ week: "2026-10-12", windows: 3, hit: 1, near: 2, peak: 100 },
	]);
});

test("seven-day weeks keep the peak and mark resets", () => {
	const w = sevenDayWeeks([
		pt(0.3, "2026-10-14T00:00:00Z", "2026-10-12T12:00:00Z"),
		pt(0.8, "2026-10-14T00:00:00Z", "2026-10-13T12:00:00Z"),
		pt(0.1, "2026-10-21T00:00:00Z", "2026-10-14T12:00:00Z"),
	]);
	expect(w).toHaveLength(1);
	expect(w[0].week).toBe("2026-10-12");
	expect(w[0].peak?.u).toBeCloseTo(80);
	expect(w[0].resets).toEqual([Date.parse("2026-10-14T12:00:00Z")]);
});
