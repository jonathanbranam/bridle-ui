import { useEffect, useState } from "react";
import {
	projects as listProjects,
	usageInstances,
	usageSeries,
} from "./api/client";
import type { UsageInstanceView } from "./api/generated/UsageInstanceView";
import type { UsageSeriesView } from "./api/generated/UsageSeriesView";
import { type Bucket, fillBuckets, type Point } from "./usageSeries";
import { easternLabel } from "./usageWeeks";

const PERIODS = {
	"24h": { label: "Last 24 hours", ms: 86_400_000, bucket: "hour" },
	"7d": { label: "Last 7 days", ms: 7 * 86_400_000, bucket: "day" },
	"30d": { label: "Last 30 days", ms: 30 * 86_400_000, bucket: "day" },
} as const;
type Period = keyof typeof PERIODS;

const instanceLabel = (i: UsageInstanceView) =>
	`${i.name}, ${i.role}, ${i.model}${i.removed ? ", removed" : ""}`;

type Async<T> =
	| { kind: "loading" }
	| { kind: "unreachable"; error: string }
	| { kind: "ok"; value: T };

type Props = { onLoggedOut: () => void };

export function InstanceUsage({ onLoggedOut }: Props) {
	const [projects, setProjects] = useState<Async<string[]>>({
		kind: "loading",
	});
	const [project, setProject] = useState("");
	const [period, setPeriod] = useState<Period>("7d");
	const [bucket, setBucket] = useState<Bucket>("day");
	const [instances, setInstances] = useState<Async<UsageInstanceView[]>>({
		kind: "loading",
	});
	const [agent, setAgent] = useState("");
	const [series, setSeries] = useState<
		Async<{ view: UsageSeriesView; since: number; until: number }>
	>({ kind: "loading" });

	useEffect(() => {
		let stale = false;
		(async () => {
			const p = await listProjects();
			if (stale) return;
			if (!p.ok) {
				if (p.notLoggedIn) onLoggedOut();
				else setProjects({ kind: "unreachable", error: p.error });
				return;
			}
			const names = p.value.projects.map((x) => x.project);
			setProjects({ kind: "ok", value: names });
			setProject((cur) => cur || (names[0] ?? ""));
		})();
		return () => {
			stale = true;
		};
	}, [onLoggedOut]);

	useEffect(() => {
		if (!project) return;
		let stale = false;
		setInstances({ kind: "loading" });
		(async () => {
			const since = new Date(Date.now() - PERIODS[period].ms).toISOString();
			const r = await usageInstances(project, since);
			if (stale) return;
			if (!r.ok) {
				if (r.notLoggedIn) onLoggedOut();
				else setInstances({ kind: "unreachable", error: r.error });
				return;
			}
			const list = r.value.instances ?? [];
			setInstances({ kind: "ok", value: list });
			setAgent((cur) =>
				list.some((i) => i.agent_id === cur) ? cur : (list[0]?.agent_id ?? ""),
			);
		})();
		return () => {
			stale = true;
		};
	}, [project, period, onLoggedOut]);

	useEffect(() => {
		if (!project || !agent) return;
		let stale = false;
		setSeries({ kind: "loading" });
		(async () => {
			const until = Date.now();
			const since = until - PERIODS[period].ms;
			const r = await usageSeries(
				project,
				agent,
				new Date(since).toISOString(),
				bucket,
			);
			if (stale) return;
			if (!r.ok) {
				if (r.notLoggedIn) onLoggedOut();
				else setSeries({ kind: "unreachable", error: r.error });
				return;
			}
			setSeries({ kind: "ok", value: { view: r.value, since, until } });
		})();
		return () => {
			stale = true;
		};
	}, [project, agent, period, bucket, onLoggedOut]);

	const field = "flex flex-col gap-1 text-sm";
	const control = "rounded border border-gray-300 px-2 py-1";
	return (
		<section className="space-y-3">
			<h2 className="text-xl font-semibold">Agent instance usage</h2>
			<div className="flex flex-wrap gap-4">
				<label className={field}>
					Project
					<select
						className={control}
						value={project}
						onChange={(e) => setProject(e.target.value)}
					>
						{projects.kind === "ok" &&
							projects.value.map((p) => (
								<option key={p} value={p}>
									{p}
								</option>
							))}
					</select>
				</label>
				<label className={field}>
					Agent instance
					<select
						className={control}
						value={agent}
						onChange={(e) => setAgent(e.target.value)}
					>
						{instances.kind === "ok" &&
							instances.value.map((i) => (
								<option key={i.agent_id} value={i.agent_id}>
									{instanceLabel(i)}
								</option>
							))}
					</select>
				</label>
				<label className={field}>
					Period
					<select
						className={control}
						value={period}
						onChange={(e) => {
							const p = e.target.value as Period;
							setPeriod(p);
							setBucket(PERIODS[p].bucket);
						}}
					>
						{(Object.keys(PERIODS) as Period[]).map((p) => (
							<option key={p} value={p}>
								{PERIODS[p].label}
							</option>
						))}
					</select>
				</label>
				<label className={field}>
					Bucket
					<select
						className={control}
						value={bucket}
						onChange={(e) => setBucket(e.target.value as Bucket)}
					>
						<option value="hour">Hour</option>
						<option value="day">Day</option>
					</select>
				</label>
			</div>
			<Body
				projects={projects}
				instances={instances}
				series={series}
				bucket={bucket}
			/>
		</section>
	);
}

function Body({
	projects,
	instances,
	series,
	bucket,
}: {
	projects: Async<string[]>;
	instances: Async<UsageInstanceView[]>;
	series: Async<{ view: UsageSeriesView; since: number; until: number }>;
	bucket: Bucket;
}) {
	const bad = (what: string, error: string) => (
		<p role="alert">
			{what} unreachable: {error}
		</p>
	);
	if (projects.kind === "unreachable") return bad("Projects", projects.error);
	if (instances.kind === "unreachable")
		return bad("Agent instances", instances.error);
	if (instances.kind === "ok" && instances.value.length === 0)
		return <p>No agent usage in this period.</p>;
	if (series.kind === "unreachable") return bad("Usage series", series.error);
	if (series.kind !== "ok") return <p>Loading...</p>;
	const { view, since, until } = series.value;
	const points = fillBuckets(view.points, bucket, since, until);
	return (
		<div className="space-y-4">
			<BarChart
				title="Tokens"
				points={points}
				bucket={bucket}
				parts={[
					{ name: "Input", color: "#2563eb", of: (p) => p.input },
					{ name: "Output", color: "#16a34a", of: (p) => p.output },
					{ name: "Cache read", color: "#f59e0b", of: (p) => p.cacheRead },
					{ name: "Cache write", color: "#9333ea", of: (p) => p.cacheWrite },
				]}
			/>
			<BarChart
				title="Cost (USD)"
				points={points}
				bucket={bucket}
				fmt={(n) => `$${n.toFixed(2)}`}
				parts={[{ name: "Cost", color: "#dc2626", of: (p) => p.cost }]}
			/>
			<BarChart
				title="Turns"
				points={points}
				bucket={bucket}
				parts={[{ name: "Turns", color: "#6b7280", of: (p) => p.turns }]}
			/>
		</div>
	);
}

type Part = { name: string; color: string; of: (p: Point) => number };

function BarChart({
	title,
	points,
	bucket,
	parts,
	fmt = (n) => n.toLocaleString("en-US"),
}: {
	title: string;
	points: Point[];
	bucket: Bucket;
	parts: Part[];
	fmt?: (n: number) => string;
}) {
	const H = 120;
	const colW = 10;
	const W = Math.max(1, points.length) * colW;
	const total = (p: Point) => parts.reduce((s, x) => s + x.of(p), 0);
	const top = Math.max(1e-9, ...points.map(total));
	const label = (t: number) =>
		bucket === "hour"
			? easternLabel(t)
			: new Intl.DateTimeFormat("en-US", {
					timeZone: "America/New_York",
					month: "short",
					day: "numeric",
				}).format(new Date(t));
	return (
		<figure className="space-y-1">
			<figcaption className="text-sm">
				{title}, per {bucket} (US Eastern); peak {fmt(top < 1e-6 ? 0 : top)}
			</figcaption>
			<svg
				role="img"
				aria-label={`${title} per ${bucket}`}
				viewBox={`0 0 ${W} ${H + 2}`}
				preserveAspectRatio="none"
				className="w-full"
				style={{ maxHeight: 200 }}
			>
				<line x1="0" x2={W} y1={H} y2={H} stroke="#9ca3af" />
				{points.map((p, i) => {
					let y = H;
					return (
						<g key={p.t}>
							<title>
								{`${label(p.t)}: ${parts.map((x) => `${x.name} ${fmt(x.of(p))}`).join(", ")}`}
							</title>
							{parts.map((x) => {
								const h = (x.of(p) / top) * H;
								y -= h;
								return h > 0 ? (
									<rect
										key={x.name}
										x={i * colW + 1}
										y={y}
										width={colW - 2}
										height={h}
										fill={x.color}
									/>
								) : null;
							})}
						</g>
					);
				})}
			</svg>
			<p className="flex flex-wrap gap-3 text-xs text-gray-600">
				{parts.length > 1 &&
					parts.map((x) => (
						<span key={x.name}>
							<span style={{ color: x.color }}>&#9632;</span> {x.name}
						</span>
					))}
				<span>
					{label(points[0]?.t ?? 0)} to {label(points.at(-1)?.t ?? 0)}
				</span>
			</p>
		</figure>
	);
}
