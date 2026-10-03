import type { InteractionBucket } from "../api/generated/InteractionBucket";
import type { InteractionGroup } from "../api/generated/InteractionGroup";
import {
	DAY_NAMES,
	type DateRange,
	type DayFilter,
	type Preset,
} from "./eastern";

export type Prefs = {
	preset: Preset;
	custom: DateRange | null;
	group: InteractionGroup;
	bucket: InteractionBucket;
	hours: DayFilter;
};

export const PREFS_KEY = "bridle-ui.time";

export const DEFAULT_PREFS: Prefs = {
	preset: "this-week",
	custom: null,
	group: "project",
	bucket: "day",
	hours: { kind: "weekday" },
};

const isDate = (v: unknown): v is string =>
	typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Stored data is untrusted (older versions, hand edits): anything invalid falls back per field. */
export function loadPrefs(
	storage: Pick<Storage, "getItem"> = localStorage,
): Prefs {
	let raw: Record<string, unknown> = {};
	try {
		const parsed = JSON.parse(storage.getItem(PREFS_KEY) ?? "{}");
		if (parsed && typeof parsed === "object") raw = parsed;
	} catch {}
	const d = DEFAULT_PREFS;
	const pick = <T extends string>(v: unknown, ok: readonly T[], fallback: T) =>
		ok.includes(v as T) ? (v as T) : fallback;
	const c = raw.custom as Record<string, unknown> | null | undefined;
	const custom =
		c && isDate(c.from) && isDate(c.to) ? { from: c.from, to: c.to } : null;
	let preset = pick(
		raw.preset,
		["this-week", "last-4-weeks", "custom"],
		d.preset,
	);
	if (preset === "custom" && !custom) preset = d.preset;
	const h = raw.hours as { kind?: unknown; days?: unknown } | undefined;
	let hours: DayFilter = d.hours;
	if (h?.kind === "weekday" || h?.kind === "weekend") hours = { kind: h.kind };
	else if (h?.kind === "days" && Array.isArray(h.days))
		hours = {
			kind: "days",
			days: DAY_NAMES.filter((n) => (h.days as unknown[]).includes(n)),
		};
	return {
		preset,
		custom,
		group: pick(raw.group, ["project", "agent", "machine"], d.group),
		bucket: pick(raw.bucket, ["day", "week"], d.bucket),
		hours,
	};
}

export function savePrefs(
	p: Prefs,
	storage: Pick<Storage, "setItem"> = localStorage,
) {
	try {
		storage.setItem(PREFS_KEY, JSON.stringify(p));
	} catch {} // private mode or quota: choices just don't persist
}
