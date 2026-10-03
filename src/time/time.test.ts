import { expect, test } from "vitest";
import type { InteractionReport } from "../api/generated/InteractionReport";
import { fmtMinutes, hourScale, spanFraction, stack } from "./chart";
import {
	addDays,
	daysParam,
	easternClock,
	easternDate,
	easternMinutes,
	presetRange,
	toggleDay,
	weekStart,
} from "./eastern";
import { DEFAULT_PREFS, loadPrefs, PREFS_KEY, savePrefs } from "./prefs";

test("eastern date and clock follow DST", () => {
	// EDT (UTC-4) and EST (UTC-5)
	expect(easternDate(new Date("2026-10-03T03:30:00Z"))).toBe("2026-10-02");
	expect(easternClock("2026-10-03T14:05:00Z")).toBe("10:05");
	expect(easternClock("2026-12-03T14:05:00Z")).toBe("09:05");
	expect(easternMinutes("2026-10-03T04:00:00Z")).toBe(0);
});

test("week math starts on Monday and crosses month ends", () => {
	expect(weekStart("2026-10-03")).toBe("2026-09-28"); // a Saturday
	expect(weekStart("2026-09-28")).toBe("2026-09-28");
	expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
	expect(addDays("2026-03-08", 1)).toBe("2026-03-09");
});

test("presets", () => {
	expect(presetRange("this-week", "2026-10-03")).toEqual({
		from: "2026-09-28",
		to: "2026-10-04",
	});
	expect(presetRange("last-4-weeks", "2026-10-03")).toEqual({
		from: "2026-09-07",
		to: "2026-10-04",
	});
});

test("day filters", () => {
	expect(daysParam({ kind: "weekday" })).toBe("weekday");
	expect(daysParam({ kind: "days", days: ["wed", "mon"] })).toBe("mon,wed");
	expect(daysParam({ kind: "days", days: [] })).toBe(
		"mon,tue,wed,thu,fri,sat,sun",
	);
	// toggling from a preset starts from that preset's days
	expect(toggleDay({ kind: "weekend" }, "mon")).toEqual({
		kind: "days",
		days: ["mon", "sat", "sun"],
	});
	expect(toggleDay({ kind: "weekday" }, "fri")).toEqual({
		kind: "days",
		days: ["mon", "tue", "wed", "thu"],
	});
});

const report: InteractionReport = {
	group: "project",
	bucket: "day",
	human_minutes: 90,
	groups: [
		{ key: "a", minutes: 30 },
		{ key: "b", minutes: 80 },
	],
	buckets: [
		{
			start: "2026-10-01",
			human_minutes: 60,
			groups: [
				{ key: "a", minutes: 30 },
				{ key: "b", minutes: 40 },
			],
		},
		{
			start: "2026-10-02",
			human_minutes: 30,
			groups: [{ key: "b", minutes: 40 }],
		},
	],
	unreachable: [],
};

test("stack orders groups by total and offsets segments", () => {
	const s = stack(report);
	expect(s.keys).toEqual(["b", "a"]);
	expect(s.bars[0].segments).toEqual([
		{ key: "b", minutes: 40, offset: 0 },
		{ key: "a", minutes: 30, offset: 40 },
	]);
	expect(s.bars[1].segments).toHaveLength(1);
	expect(s.max).toBe(70);
});

test("stack scale covers the human total", () => {
	const r = {
		...report,
		buckets: [{ ...report.buckets[0], human_minutes: 200 }],
	};
	expect(stack(r).max).toBe(200);
});

test("formatting and scales", () => {
	expect(fmtMinutes(45.4)).toBe("45m");
	expect(fmtMinutes(125)).toBe("2h 05m");
	expect(hourScale(new Array(24).fill(0))).toBe(1);
	expect(hourScale([3, 9])).toBe(9);
});

test("span fraction places a span in the day", () => {
	// 14:00Z-15:00Z in October = 10:00-11:00 EDT
	const f = spanFraction({
		start: "2026-10-03T14:00:00Z",
		end: "2026-10-03T15:00:00Z",
	});
	expect(f.left).toBeCloseTo(10 / 24);
	expect(f.width).toBeCloseTo(1 / 24);
	// ends after midnight: clamped to the day's end
	const g = spanFraction({
		start: "2026-10-04T03:50:00Z",
		end: "2026-10-04T04:10:00Z",
	});
	expect(g.left + g.width).toBeCloseTo(1);
});

function memory(initial?: string) {
	const m = new Map<string, string>(initial ? [[PREFS_KEY, initial]] : []);
	return {
		getItem: (k: string) => m.get(k) ?? null,
		setItem: (k: string, v: string) => void m.set(k, v),
	};
}

test("prefs round-trip", () => {
	const st = memory();
	const p = {
		preset: "custom" as const,
		custom: { from: "2026-09-01", to: "2026-09-30" },
		group: "agent" as const,
		bucket: "week" as const,
		hours: { kind: "days" as const, days: ["tue" as const, "thu" as const] },
	};
	savePrefs(p, st);
	expect(loadPrefs(st)).toEqual(p);
});

test("bad or missing stored prefs fall back to defaults", () => {
	expect(loadPrefs(memory())).toEqual(DEFAULT_PREFS);
	expect(loadPrefs(memory("not json"))).toEqual(DEFAULT_PREFS);
	expect(
		loadPrefs(memory(JSON.stringify({ preset: "custom", group: "x" }))),
	).toEqual(DEFAULT_PREFS);
});
