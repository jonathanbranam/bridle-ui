import type { DayReport } from "../api/generated/DayReport";
import type { InteractionReport } from "../api/generated/InteractionReport";
import type { TimeSpan } from "../api/generated/TimeSpan";
import { easternMinutes } from "./eastern";

export type Segment = { key: string; minutes: number; offset: number };
export type Bar = {
	start: string;
	human: number;
	segments: Segment[];
	total: number;
};
export type Stacked = { bars: Bar[]; keys: string[]; max: number };

/**
 * Stacks each bucket's groups. Keys are ordered by range total (biggest at the bottom, so
 * colours line up between bars). The scale covers the human line too, which can exceed the
 * stack... or fall below it, since groups overlap.
 */
export function stack(report: InteractionReport): Stacked {
	const totals = new Map<string, number>();
	for (const g of report.groups) totals.set(g.key, g.minutes);
	for (const b of report.buckets)
		for (const g of b.groups)
			if (!totals.has(g.key)) totals.set(g.key, g.minutes);
	const keys = [...totals.keys()].sort(
		(a, b) => (totals.get(b) ?? 0) - (totals.get(a) ?? 0) || a.localeCompare(b),
	);
	let max = 0;
	const bars = report.buckets.map((b) => {
		const by = new Map(b.groups.map((g) => [g.key, g.minutes]));
		let offset = 0;
		const segments: Segment[] = [];
		for (const key of keys) {
			const minutes = by.get(key) ?? 0;
			if (minutes <= 0) continue;
			segments.push({ key, minutes, offset });
			offset += minutes;
		}
		max = Math.max(max, offset, b.human_minutes);
		return { start: b.start, human: b.human_minutes, segments, total: offset };
	});
	return { bars, keys, max };
}

export const fmtMinutes = (m: number): string => {
	const r = Math.round(m);
	return r < 60
		? `${r}m`
		: `${Math.floor(r / 60)}h ${String(r % 60).padStart(2, "0")}m`;
};

const DAY = 24 * 60;
/** A span as fractions of the day (0..1), clamped; a span past midnight ends at 1. */
export function spanFraction(s: TimeSpan): { left: number; width: number } {
	const a = easternMinutes(s.start);
	let b = easternMinutes(s.end);
	if (b < a) b = DAY;
	return { left: a / DAY, width: Math.max(b - a, 1) / DAY };
}

export type TimelineRow = {
	label: string;
	spans: { left: number; width: number }[];
};
export function timelineRows(day: DayReport): {
	rows: TimelineRow[];
	overlaps: { left: number; width: number }[];
} {
	return {
		rows: day.sessions.map((s) => ({
			label: `${s.project} / ${s.agent}${s.machine ? ` @ ${s.machine}` : ""}`,
			spans: s.intervals.map(spanFraction),
		})),
		overlaps: day.overlaps.map(spanFraction),
	};
}

/** Hour bars scaled to the busiest hour; an all-zero chart scales to 1 to avoid dividing by 0. */
export function hourScale(minutesPerHour: number[]): number {
	return Math.max(1, ...minutesPerHour);
}
