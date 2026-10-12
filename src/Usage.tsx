import { useEffect, useState } from "react";
import { projects as listProjects, usageHistory } from "./api/client";
import type { UsageHistory } from "./api/generated/UsageHistory";
import { addDays, easternDate, weekStart } from "./time/eastern";
import {
	easternLabel,
	type FiveHourWeek,
	fiveHourWeeks,
	type SevenDayWeek,
	sevenDayWeeks,
	weekEndMs,
	weekStartMs,
} from "./usageWeeks";

type Props = { onLoggedOut: () => void };

// Four full weeks plus the current one, with a day of slack for the Eastern/UTC offset.
const sinceIso = () =>
	`${addDays(weekStart(easternDate(new Date())), -29)}T00:00:00Z`;

type Loaded = { project: string; five: UsageHistory; seven: UsageHistory };
type State =
	| { kind: "loading" }
	| { kind: "unreachable"; error: string }
	| { kind: "ok"; data: Loaded };

// The gateway answers an unreachable daemon either as a non-2xx or as a 200 carrying
// reachable:false and an error; both mean "unreachable", never an empty chart.
const unreachableBody = (v: unknown): string | null => {
	const b = v as { reachable?: boolean; error?: string } | undefined;
	return b && b.reachable === false ? (b.error ?? "daemon unreachable") : null;
};

export function UsageView({ onLoggedOut }: Props) {
	const [state, setState] = useState<State>({ kind: "loading" });

	useEffect(() => {
		let stale = false;
		(async () => {
			const p = await listProjects();
			if (stale) return;
			if (!p.ok) {
				if (p.notLoggedIn) onLoggedOut();
				else setState({ kind: "unreachable", error: p.error });
				return;
			}
			// The limits are account-wide: any one reachable daemon answers for all.
			let error = "no projects";
			for (const { project } of p.value.projects) {
				const since = sinceIso();
				const [five, seven] = await Promise.all([
					usageHistory(project, "five_hour", since),
					usageHistory(project, "seven_day", since),
				]);
				if (stale) return;
				if (!five.ok && five.notLoggedIn) return onLoggedOut();
				if (!seven.ok && seven.notLoggedIn) return onLoggedOut();
				const bad = !five.ok
					? five.error
					: !seven.ok
						? seven.error
						: (unreachableBody(five.value) ?? unreachableBody(seven.value));
				if (bad == null && five.ok && seven.ok) {
					setState({
						kind: "ok",
						data: { project, five: five.value, seven: seven.value },
					});
					return;
				}
				error = `${project}: ${bad}`;
			}
			setState({ kind: "unreachable", error });
		})();
		return () => {
			stale = true;
		};
	}, [onLoggedOut]);

	if (state.kind === "loading") return <p>Loading...</p>;
	if (state.kind === "unreachable")
		return <p role="alert">Usage unreachable: {state.error}</p>;
	const five = fiveHourWeeks(state.data.five.points);
	const seven = sevenDayWeeks(state.data.seven.points);
	return (
		<div className="space-y-8">
			<section className="space-y-2">
				<h2 className="text-xl font-semibold">Five-hour limit</h2>
				<p className="text-sm text-gray-600">
					Windows per week that reached the limit, or came within 10% of it.
				</p>
				{five.length === 0 ? (
					<p>No readings in this period.</p>
				) : (
					<FiveHourChart weeks={five} />
				)}
			</section>
			<section className="space-y-2">
				<h2 className="text-xl font-semibold">Seven-day limit</h2>
				<p className="text-sm text-gray-600">
					Utilization per week (Monday to Sunday); dashed lines are resets.
				</p>
				{seven.length === 0 ? (
					<p>No readings in this period.</p>
				) : (
					<div className="flex flex-wrap gap-4">
						{seven.map((w) => (
							<SevenDayChart key={w.week} w={w} />
						))}
					</div>
				)}
			</section>
		</div>
	);
}

function FiveHourChart({ weeks }: { weeks: FiveHourWeek[] }) {
	const top = Math.max(1, ...weeks.map((w) => w.near));
	const H = 120;
	const colW = 80;
	return (
		<svg
			role="img"
			aria-label="Five-hour windows near or at the limit, by week"
			viewBox={`0 0 ${weeks.length * colW} ${H + 50}`}
			className="w-full max-w-full"
			style={{ maxHeight: 260 }}
		>
			{weeks.map((w, i) => {
				const x = i * colW;
				const near = (w.near / top) * H;
				const hit = (w.hit / top) * H;
				return (
					<g key={w.week}>
						<title>
							{`Week of ${w.week}: ${w.windows} windows, ${w.hit} hit, ${w.near} within 10%, peak ${Math.round(w.peak)}%`}
						</title>
						<rect
							x={x + 12}
							y={H - near}
							width={24}
							height={near}
							fill="#f59e0b"
						/>
						<rect
							x={x + 40}
							y={H - hit}
							width={24}
							height={hit}
							fill="#dc2626"
						/>
						<text x={x + 24} y={H - near - 3} fontSize="11" textAnchor="middle">
							{w.near}
						</text>
						<text x={x + 52} y={H - hit - 3} fontSize="11" textAnchor="middle">
							{w.hit}
						</text>
						<text x={x + 38} y={H + 15} fontSize="11" textAnchor="middle">
							{w.week.slice(5)}
						</text>
						<text x={x + 38} y={H + 28} fontSize="10" textAnchor="middle">
							peak {Math.round(w.peak)}%
						</text>
						<text x={x + 38} y={H + 41} fontSize="10" textAnchor="middle">
							of {w.windows}
						</text>
					</g>
				);
			})}
			<line x1="0" x2={weeks.length * colW} y1={H} y2={H} stroke="#9ca3af" />
		</svg>
	);
}

function SevenDayChart({ w }: { w: SevenDayWeek }) {
	const W = 300;
	const H = 120;
	const t0 = weekStartMs(w.week);
	const span = weekEndMs(w.week) - t0;
	const x = (t: number) => ((t - t0) / span) * W;
	const y = (u: number) => H - (Math.min(u, 100) / 100) * H;
	return (
		<figure className="min-w-0 flex-1 basis-72">
			<figcaption className="text-sm">
				Week of {w.week}
				{w.peak
					? `, peak ${Math.round(w.peak.u)}% ${easternLabel(w.peak.t)}`
					: ""}
			</figcaption>
			<svg
				role="img"
				aria-label={`Seven-day utilization, week of ${w.week}`}
				viewBox={`0 0 ${W} ${H + 4}`}
				className="w-full"
			>
				<rect x="0" y="0" width={W} height={H} fill="none" stroke="#d1d5db" />
				<line
					x1="0"
					x2={W}
					y1={y(100)}
					y2={y(100)}
					stroke="#dc2626"
					strokeDasharray="2 3"
				/>
				{w.resets.map((t) => (
					<g key={t}>
						<title>{`Reset ${easternLabel(t)}`}</title>
						<line
							x1={x(t)}
							x2={x(t)}
							y1="0"
							y2={H}
							stroke="#6b7280"
							strokeDasharray="4 3"
						/>
					</g>
				))}
				<polyline
					fill="none"
					stroke="#2563eb"
					strokeWidth="1.5"
					points={w.points.map((p) => `${x(p.t)},${y(p.u)}`).join(" ")}
				/>
				{w.peak && (
					<circle cx={x(w.peak.t)} cy={y(w.peak.u)} r="3" fill="#dc2626" />
				)}
			</svg>
		</figure>
	);
}
