import type { UsageSeriesBucket } from "./api/generated/UsageSeriesBucket";

export type Bucket = "hour" | "day";
const STEP = { hour: 3_600_000, day: 86_400_000 } as const;

/** A bucket with plain numbers: the generated type says bigint, JSON.parse gives numbers. */
export type Point = {
	t: number;
	/** null is "not measured" (external sessions), never zero. */
	turns: number | null;
	input: number;
	output: number;
	cacheRead: number;
	cacheWrite: number;
	cost: number;
	busySeconds: number | null;
};

export const toPoint = (b: UsageSeriesBucket): Point => ({
	t: Date.parse(b.start),
	turns: b.turns === null ? null : Number(b.turns),
	input: Number(b.input_tokens),
	output: Number(b.output_tokens),
	cacheRead: Number(b.cache_read_tokens),
	cacheWrite: Number(b.cache_write_tokens),
	cost: Number(b.cost_usd),
	busySeconds: b.busy_seconds === null ? null : Number(b.busy_seconds),
});

const zero = (t: number): Point => ({
	t,
	turns: 0,
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	cost: 0,
	busySeconds: 0,
});

/**
 * The gateway omits empty buckets; draw them as zero so a gap reads as a gap. Runs from the
 * bucket containing `sinceMs` to the one containing `untilMs` (UTC bucket starts).
 */
export function fillBuckets(
	buckets: UsageSeriesBucket[],
	bucket: Bucket,
	sinceMs: number,
	untilMs: number,
): Point[] {
	const step = STEP[bucket];
	const byStart = new Map(
		buckets.map((b) => [Date.parse(b.start), toPoint(b)]),
	);
	const first = Math.floor(sinceMs / step) * step;
	const out: Point[] = [];
	for (let t = first; t <= untilMs; t += step) {
		out.push(byStart.get(t) ?? zero(t));
		byStart.delete(t);
	}
	// A bucket outside the asked range is still data; never drop it silently.
	for (const p of byStart.values()) out.push(p);
	return out.sort((a, b) => a.t - b.t);
}
