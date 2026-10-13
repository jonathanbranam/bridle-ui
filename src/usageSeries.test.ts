import { expect, test } from "vitest";
import { fillBuckets, toPoint } from "./usageSeries";

const b = (start: string, n: number) => ({
	start,
	turns: n,
	input_tokens: n as unknown as bigint,
	output_tokens: 0n,
	cache_read_tokens: 0n,
	cache_write_tokens: 0n,
	cost_usd: n,
	busy_seconds: 0n,
});

test("bigint-typed fields become plain numbers", () => {
	const p = toPoint({ ...b("2026-10-12T00:00:00Z", 3), output_tokens: 5n });
	expect(p.output).toBe(5);
	expect(typeof p.output).toBe("number");
	expect(p.input).toBe(3);
});

test("omitted buckets are filled with zero, not joined", () => {
	const since = Date.parse("2026-10-12T00:30:00Z");
	const until = Date.parse("2026-10-12T04:10:00Z");
	const out = fillBuckets(
		[b("2026-10-12T01:00:00Z", 2), b("2026-10-12T04:00:00Z", 4)],
		"hour",
		since,
		until,
	);
	expect(out.map((p) => p.turns)).toEqual([0, 2, 0, 0, 4]);
	expect(out[0].t).toBe(Date.parse("2026-10-12T00:00:00Z"));
});

test("null turns and busy time stay null, not zero", () => {
	const p = toPoint({
		...b("2026-10-12T00:00:00Z", 3),
		turns: null,
		busy_seconds: null,
	});
	expect(p.turns).toBeNull();
	expect(p.busySeconds).toBeNull();
	expect(p.input).toBe(3);
});
