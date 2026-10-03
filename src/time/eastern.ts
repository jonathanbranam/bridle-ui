// Dates are `YYYY-MM-DD` strings in US Eastern, the zone the gateway splits days in.
const ZONE = "America/New_York";

const parts = (d: Date) => {
	const out: Record<string, string> = {};
	for (const p of new Intl.DateTimeFormat("en-US", {
		timeZone: ZONE,
		hourCycle: "h23",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).formatToParts(d)) {
		out[p.type] = p.value;
	}
	return out;
};

export function easternDate(d: Date): string {
	const p = parts(d);
	return `${p.year}-${p.month}-${p.day}`;
}

/** Minutes since Eastern midnight, for placing a moment on a day's timeline. */
export function easternMinutes(iso: string): number {
	const p = parts(new Date(iso));
	return Number(p.hour) * 60 + Number(p.minute);
}

export function easternClock(iso: string): string {
	const p = parts(new Date(iso));
	return `${p.hour}:${p.minute}`;
}

// Calendar arithmetic on the date string via UTC, so DST never shifts a day.
const toUtc = (date: string) => new Date(`${date}T00:00:00Z`);
const fromUtc = (d: Date) => d.toISOString().slice(0, 10);

export function addDays(date: string, n: number): string {
	const d = toUtc(date);
	d.setUTCDate(d.getUTCDate() + n);
	return fromUtc(d);
}

/** 0 = Monday ... 6 = Sunday. */
export function weekdayIndex(date: string): number {
	return (toUtc(date).getUTCDay() + 6) % 7;
}

export function weekStart(date: string): string {
	return addDays(date, -weekdayIndex(date));
}

export type Preset = "this-week" | "last-4-weeks" | "custom";
export type DateRange = { from: string; to: string };

/** Ranges are inclusive of `to`. Weeks start Monday, like the gateway's buckets. */
export function presetRange(
	preset: "this-week" | "last-4-weeks",
	today: string,
) {
	const monday = weekStart(today);
	return preset === "this-week"
		? { from: monday, to: addDays(monday, 6) }
		: { from: addDays(monday, -21), to: addDays(monday, 6) };
}

export function datesIn({ from, to }: DateRange): string[] {
	const out: string[] = [];
	for (let d = from; d <= to && out.length < 400; d = addDays(d, 1))
		out.push(d);
	return out;
}

export const DAY_NAMES = [
	"mon",
	"tue",
	"wed",
	"thu",
	"fri",
	"sat",
	"sun",
] as const;
export type DayName = (typeof DAY_NAMES)[number];
export type DayFilter =
	| { kind: "weekday" }
	| { kind: "weekend" }
	| { kind: "days"; days: DayName[] };

/** The `days=` query value. An empty custom selection matches nothing useful, so it means all. */
export function daysParam(f: DayFilter): string {
	if (f.kind !== "days") return f.kind;
	return f.days.length
		? DAY_NAMES.filter((d) => f.days.includes(d)).join(",")
		: DAY_NAMES.join(",");
}

export function toggleDay(f: DayFilter, day: DayName): DayFilter {
	const current: readonly DayName[] =
		f.kind === "days"
			? f.days
			: f.kind === "weekday"
				? DAY_NAMES.slice(0, 5)
				: DAY_NAMES.slice(5);
	const days = current.includes(day)
		? current.filter((d) => d !== day)
		: [...current, day];
	return { kind: "days", days: DAY_NAMES.filter((d) => days.includes(d)) };
}
