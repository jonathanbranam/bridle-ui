import { useEffect, useMemo, useState } from "react";
import {
	interactionDay,
	interactionHours,
	interactionReport,
	type Result,
} from "./api/client";
import type { DayReport } from "./api/generated/DayReport";
import type { HoursReport } from "./api/generated/HoursReport";
import type { InteractionReport } from "./api/generated/InteractionReport";
import { fmtMinutes, hourScale, stack, timelineRows } from "./time/chart";
import {
	addDays,
	DAY_NAMES,
	type DateRange,
	type DayName,
	daysParam,
	easternClock,
	easternDate,
	presetRange,
	toggleDay,
} from "./time/eastern";
import { loadPrefs, type Prefs, savePrefs } from "./time/prefs";

const COLORS = [
	"#2563eb",
	"#d97706",
	"#059669",
	"#db2777",
	"#7c3aed",
	"#0891b2",
	"#65a30d",
	"#dc2626",
];
const colorOf = (keys: string[], key: string) =>
	COLORS[keys.indexOf(key) % COLORS.length];

type Load<T> = { data?: T; error?: string };

// Refetches when `key` changes; a stale response from a superseded request is dropped.
function useLoad<T>(
	fetcher: () => Promise<Result<T>>,
	key: string,
	onLoggedOut: () => void,
): Load<T> {
	const [state, setState] = useState<Load<T>>({});
	// biome-ignore lint/correctness/useExhaustiveDependencies: `key` stands for everything the fetcher closes over
	useEffect(() => {
		let live = true;
		setState({});
		fetcher().then((r) => {
			if (!live) return;
			if (r.ok) setState({ data: r.value });
			else if (r.notLoggedIn) onLoggedOut();
			else setState({ error: r.error });
		});
		return () => {
			live = false;
		};
	}, [key]);
	return state;
}

const Unreachable = ({ machines }: { machines: string[] }) =>
	machines.length > 0 && (
		<p role="alert" className="text-sm text-amber-700">
			Unreachable, data missing: {machines.join(", ")}
		</p>
	);

const Status = ({ s }: { s: Load<unknown> }) =>
	s.error ? (
		<p role="alert">{s.error}</p>
	) : s.data ? null : (
		<p className="text-sm text-gray-500">Loading…</p>
	);

export function TimeView({ onLoggedOut }: { onLoggedOut: () => void }) {
	const [prefs, setPrefs] = useState<Prefs>(() => loadPrefs());
	const update = (patch: Partial<Prefs>) =>
		setPrefs((p) => {
			const next = { ...p, ...patch };
			savePrefs(next);
			return next;
		});
	const today = easternDate(new Date());
	const range: DateRange =
		prefs.preset === "custom" && prefs.custom
			? prefs.custom
			: presetRange(
					prefs.preset === "custom" ? "this-week" : prefs.preset,
					today,
				);
	const [day, setDay] = useState(today);

	return (
		<section className="space-y-6">
			<div className="flex flex-wrap items-end gap-4">
				<label className="text-sm">
					Range
					<select
						className="ml-2 rounded border px-1 py-0.5"
						value={prefs.preset}
						onChange={(e) =>
							update({
								preset: e.target.value as Prefs["preset"],
								custom:
									e.target.value === "custom"
										? (prefs.custom ?? range)
										: prefs.custom,
							})
						}
					>
						<option value="this-week">This week</option>
						<option value="last-4-weeks">Last 4 weeks</option>
						<option value="custom">Custom</option>
					</select>
				</label>
				{prefs.preset === "custom" && prefs.custom && (
					<>
						<label className="text-sm">
							From
							<input
								type="date"
								className="ml-2 rounded border px-1"
								value={range.from}
								onChange={(e) =>
									e.target.value &&
									update({ custom: { ...range, from: e.target.value } })
								}
							/>
						</label>
						<label className="text-sm">
							To
							<input
								type="date"
								className="ml-2 rounded border px-1"
								value={range.to}
								onChange={(e) =>
									e.target.value &&
									update({ custom: { ...range, to: e.target.value } })
								}
							/>
						</label>
					</>
				)}
				<label className="text-sm">
					Group by
					<select
						className="ml-2 rounded border px-1 py-0.5"
						value={prefs.group}
						onChange={(e) =>
							update({ group: e.target.value as Prefs["group"] })
						}
					>
						<option value="project">Project</option>
						<option value="agent">Agent</option>
						<option value="machine">Machine</option>
					</select>
				</label>
				<label className="text-sm">
					Bucket
					<select
						className="ml-2 rounded border px-1 py-0.5"
						value={prefs.bucket}
						onChange={(e) =>
							update({ bucket: e.target.value as Prefs["bucket"] })
						}
					>
						<option value="day">Day</option>
						<option value="week">Week</option>
					</select>
				</label>
				<span className="text-xs text-gray-500">US Eastern</span>
			</div>
			<Totals
				range={range}
				prefs={prefs}
				onLoggedOut={onLoggedOut}
				onPickDay={setDay}
			/>
			<DayTimeline
				day={day}
				setDay={setDay}
				today={today}
				onLoggedOut={onLoggedOut}
			/>
			<Hours
				range={range}
				prefs={prefs}
				update={update}
				onLoggedOut={onLoggedOut}
			/>
		</section>
	);
}

function Totals({
	range,
	prefs,
	onLoggedOut,
	onPickDay,
}: {
	range: DateRange;
	prefs: Prefs;
	onLoggedOut: () => void;
	onPickDay: (d: string) => void;
}) {
	const s = useLoad<InteractionReport>(
		() =>
			interactionReport({ ...range, group: prefs.group, bucket: prefs.bucket }),
		[range.from, range.to, prefs.group, prefs.bucket].join(),
		onLoggedOut,
	);
	const st = useMemo(() => (s.data ? stack(s.data) : undefined), [s.data]);
	const H = 160;
	return (
		<div className="space-y-2">
			<h2 className="text-lg font-semibold">Totals per {prefs.bucket}</h2>
			<Status s={s} />
			{s.data && st && (
				<>
					<Unreachable machines={s.data.unreachable} />
					<p className="text-sm">
						You: <strong>{fmtMinutes(s.data.human_minutes)}</strong> in this
						range. Groups are each counted on their own, so they can add up to
						more than your total when conversations overlap.
					</p>
					{st.bars.length === 0 ? (
						<p className="text-sm text-gray-500">
							No interactions in this range.
						</p>
					) : (
						<div
							className="flex items-end gap-1 overflow-x-auto"
							style={{ height: H + 40 }}
						>
							{st.bars.map((b) => (
								<button
									type="button"
									key={b.start}
									disabled={prefs.bucket !== "day"}
									onClick={() => onPickDay(b.start)}
									className="flex w-12 shrink-0 flex-col items-center text-xs"
									title={`${b.start}: you ${fmtMinutes(b.human)}`}
								>
									<svg
										width="40"
										height={H}
										role="img"
										aria-label={`${b.start} ${fmtMinutes(b.human)}`}
									>
										{b.segments.map((g) => (
											<rect
												key={g.key}
												x="0"
												width="28"
												y={H - ((g.offset + g.minutes) / (st.max || 1)) * H}
												height={(g.minutes / (st.max || 1)) * H}
												fill={colorOf(st.keys, g.key)}
											>
												<title>{`${g.key}: ${fmtMinutes(g.minutes)}`}</title>
											</rect>
										))}
										<rect
											x="30"
											width="8"
											y={H - (b.human / (st.max || 1)) * H}
											height={(b.human / (st.max || 1)) * H}
											fill="#111827"
										>
											<title>{`You (total): ${fmtMinutes(b.human)}`}</title>
										</rect>
									</svg>
									<span>{b.start.slice(5)}</span>
									<span className="text-gray-500">{fmtMinutes(b.human)}</span>
								</button>
							))}
						</div>
					)}
					<ul className="flex flex-wrap gap-3 text-xs">
						{st.keys.map((k) => (
							<li key={k} className="flex items-center gap-1">
								<span
									className="inline-block size-3"
									style={{ background: colorOf(st.keys, k) }}
								/>
								{k}
							</li>
						))}
						<li className="flex items-center gap-1">
							<span className="inline-block size-3 bg-gray-900" />
							You (total, narrow bar)
						</li>
					</ul>
				</>
			)}
		</div>
	);
}

function DayTimeline({
	day,
	setDay,
	today,
	onLoggedOut,
}: {
	day: string;
	setDay: (d: string) => void;
	today: string;
	onLoggedOut: () => void;
}) {
	const s = useLoad<DayReport>(() => interactionDay(day), day, onLoggedOut);
	const tl = useMemo(
		() => (s.data ? timelineRows(s.data) : undefined),
		[s.data],
	);
	const pct = (f: number) => `${f * 100}%`;
	return (
		<div className="space-y-2">
			<h2 className="text-lg font-semibold">One day</h2>
			<div className="flex items-center gap-2 text-sm">
				<button
					type="button"
					className="rounded border px-2"
					onClick={() => setDay(addDays(day, -1))}
				>
					‹
				</button>
				<input
					type="date"
					aria-label="Day"
					className="rounded border px-1"
					value={day}
					max={today}
					onChange={(e) => e.target.value && setDay(e.target.value)}
				/>
				<button
					type="button"
					className="rounded border px-2"
					disabled={day >= today}
					onClick={() => setDay(addDays(day, 1))}
				>
					›
				</button>
			</div>
			<Status s={s} />
			{s.data && tl && (
				<>
					<Unreachable machines={s.data.unreachable} />
					<p className="text-sm">
						{s.data.first_start && s.data.last_end
							? `Started ${easternClock(s.data.first_start)}, stopped ${easternClock(s.data.last_end)}. `
							: "No interactions. "}
						Total <strong>{fmtMinutes(s.data.human_minutes)}</strong>. Peak
						concurrency <strong>{s.data.peak_concurrency}</strong> (1 at once{" "}
						{fmtMinutes(s.data.minutes_at_1)}, 2:{" "}
						{fmtMinutes(s.data.minutes_at_2)}, 3+:{" "}
						{fmtMinutes(s.data.minutes_at_3_plus)}).
					</p>
					{tl.rows.length > 0 && (
						<div className="space-y-1">
							{tl.rows.map((r, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: rows have no stable id beyond the label
								<div key={i} className="flex items-center gap-2 text-xs">
									<span className="w-48 shrink-0 truncate" title={r.label}>
										{r.label}
									</span>
									<div className="relative h-4 flex-1 bg-gray-100">
										{tl.overlaps.map((o, j) => (
											<div
												// biome-ignore lint/suspicious/noArrayIndexKey: positional shading
												key={j}
												className="absolute inset-y-0 bg-amber-200"
												style={{ left: pct(o.left), width: pct(o.width) }}
											/>
										))}
										{r.spans.map((sp, j) => (
											<div
												// biome-ignore lint/suspicious/noArrayIndexKey: positional spans
												key={j}
												className="absolute inset-y-0.5 bg-blue-600"
												style={{ left: pct(sp.left), width: pct(sp.width) }}
											/>
										))}
									</div>
								</div>
							))}
							<div
								className="ml-50 flex justify-between text-xs text-gray-500"
								style={{ marginLeft: "12.5rem" }}
							>
								{[0, 6, 12, 18, 24].map((h) => (
									<span key={h}>{String(h).padStart(2, "0")}:00</span>
								))}
							</div>
							<p className="text-xs text-gray-500">
								Shaded: two or more conversations at once.
							</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}

function Hours({
	range,
	prefs,
	update,
	onLoggedOut,
}: {
	range: DateRange;
	prefs: Prefs;
	update: (p: Partial<Prefs>) => void;
	onLoggedOut: () => void;
}) {
	const days = daysParam(prefs.hours);
	const s = useLoad<HoursReport>(
		() => interactionHours(range.from, range.to, days),
		[range.from, range.to, days].join(),
		onLoggedOut,
	);
	const H = 120;
	const f = prefs.hours;
	const selected =
		f.kind === "days"
			? f.days
			: f.kind === "weekday"
				? DAY_NAMES.slice(0, 5)
				: DAY_NAMES.slice(5);
	return (
		<div className="space-y-2">
			<h2 className="text-lg font-semibold">Time of day</h2>
			<div className="flex flex-wrap items-center gap-2 text-sm">
				{(["weekday", "weekend"] as const).map((k) => (
					<button
						key={k}
						type="button"
						aria-pressed={f.kind === k}
						className={`rounded border px-2 py-0.5 ${f.kind === k ? "bg-gray-900 text-white" : ""}`}
						onClick={() => update({ hours: { kind: k } })}
					>
						{k === "weekday" ? "Weekdays" : "Weekends"}
					</button>
				))}
				{DAY_NAMES.map((d: DayName) => (
					<button
						key={d}
						type="button"
						aria-pressed={selected.includes(d)}
						className={`rounded border px-2 py-0.5 ${selected.includes(d) ? "bg-gray-200" : ""}`}
						onClick={() => update({ hours: toggleDay(f, d) })}
					>
						{d}
					</button>
				))}
			</div>
			<Status s={s} />
			{s.data && (
				<>
					<Unreachable machines={s.data.unreachable} />
					<p className="text-sm text-gray-500">
						Average minutes per hour over {s.data.day_count} matching day
						{s.data.day_count === 1 ? "" : "s"}.
					</p>
					<svg
						width="100%"
						viewBox={`0 0 240 ${H + 14}`}
						role="img"
						aria-label="Minutes per hour of day"
					>
						{s.data.minutes_per_hour.map((m, h) => {
							const bh = (m / hourScale(s.data?.minutes_per_hour ?? [])) * H;
							return (
								// biome-ignore lint/suspicious/noArrayIndexKey: the index is the hour
								<g key={h}>
									<rect
										x={h * 10 + 1}
										width="8"
										y={H - bh}
										height={bh}
										fill="#2563eb"
									>
										<title>{`${String(h).padStart(2, "0")}:00 ${fmtMinutes(m)}`}</title>
									</rect>
									{h % 3 === 0 && (
										<text
											x={h * 10 + 5}
											y={H + 11}
											fontSize="7"
											textAnchor="middle"
										>
											{h}
										</text>
									)}
								</g>
							);
						})}
					</svg>
				</>
			)}
		</div>
	);
}
