import type { UsagePoint } from "./api/generated/UsagePoint";
import { addDays, easternDate, weekStart } from "./time/eastern";

// The gateway reports utilization as a fraction (0.9 = 90%), like rate_limits in /system.
const pct = (u: number) => u * 100;

export const HIT = 100;
export const NEAR = 90;

/** Monday (Eastern) of the week containing the instant. */
export const weekOf = (iso: string) => weekStart(easternDate(new Date(iso)));

export type FiveHourWeek = {
	week: string;
	windows: number;
	/** Windows that reached the limit. */
	hit: number;
	/** Windows at 90% or more, hits included. */
	near: number;
	peak: number;
};

/**
 * A five-hour window is identified by its resets_at. It belongs to the week it resets in, so a
 * window that straddles midnight Sunday is counted once.
 */
export function fiveHourWeeks(points: UsagePoint[]): FiveHourWeek[] {
	const windows = new Map<string, number>();
	for (const p of points) {
		if (p.utilization == null || p.resets_at == null) continue;
		windows.set(
			p.resets_at,
			Math.max(windows.get(p.resets_at) ?? 0, pct(p.utilization)),
		);
	}
	const weeks = new Map<string, FiveHourWeek>();
	for (const [resets, max] of windows) {
		const week = weekOf(resets);
		const w = weeks.get(week) ?? {
			week,
			windows: 0,
			hit: 0,
			near: 0,
			peak: 0,
		};
		w.windows += 1;
		if (max >= HIT) w.hit += 1;
		if (max >= NEAR) w.near += 1;
		w.peak = Math.max(w.peak, max);
		weeks.set(week, w);
	}
	return [...weeks.values()].sort((a, b) => a.week.localeCompare(b.week));
}

export type SevenDayWeek = {
	week: string;
	/** t is epoch ms, u is percent. */
	points: { t: number; u: number }[];
	peak: { t: number; u: number } | null;
	/** Epoch ms of the first reading under a new resets_at. */
	resets: number[];
};

export function sevenDayWeeks(points: UsagePoint[]): SevenDayWeek[] {
	const weeks = new Map<string, SevenDayWeek>();
	const get = (week: string) => {
		const w = weeks.get(week) ?? { week, points: [], peak: null, resets: [] };
		weeks.set(week, w);
		return w;
	};
	let last: string | null = null;
	for (const p of points) {
		const t = Date.parse(p.observed_at);
		const w = get(weekOf(p.observed_at));
		if (p.resets_at != null) {
			if (last != null && p.resets_at !== last) w.resets.push(t);
			last = p.resets_at;
		}
		if (p.utilization == null) continue;
		const u = pct(p.utilization);
		w.points.push({ t, u });
		if (!w.peak || u > w.peak.u) w.peak = { t, u };
	}
	return [...weeks.values()].sort((a, b) => a.week.localeCompare(b.week));
}

/** Eastern midnight Monday, as epoch ms (DST shifts it by an hour at most; fine for a plot). */
export const weekStartMs = (week: string) =>
	Date.parse(`${week}T00:00:00-05:00`);
export const weekEndMs = (week: string) => weekStartMs(addDays(week, 7));

/** "Wed 7:00 AM", Eastern, no zone name. */
export const easternLabel = (ms: number) =>
	new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		weekday: "short",
		hour: "numeric",
		minute: "2-digit",
	})
		.format(new Date(ms))
		.replace(",", "");
