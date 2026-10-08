import { useEffect, useState } from "react";
import { Link } from "react-router";
import { agentList, projects as listProjects, systemView } from "./api/client";
import type { AgentList } from "./api/generated/AgentList";
import type { AgentView } from "./api/generated/AgentView";
import type { SystemView as SystemData } from "./api/generated/SystemView";
import { taskHref } from "./doc/links";
import { easternClock, easternDate } from "./time/eastern";

type Props = { onLoggedOut: () => void };

const when = (iso: string) => {
	const d = new Date(iso);
	return `${easternDate(d)} ${easternClock(iso)}`;
};

export function uptime(startedAt: string, now = Date.now()) {
	const m = Math.max(0, Math.floor((now - Date.parse(startedAt)) / 60000));
	if (m < 60) return `${m}m`;
	if (m < 60 * 24) return `${Math.floor(m / 60)}h ${m % 60}m`;
	return `${Math.floor(m / 1440)}d ${Math.floor((m % 1440) / 60)}h`;
}

const cost = (n: number) => `$${n.toFixed(2)}`;
const tokens = (n: number) =>
	n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);

function Row({ k, children }: { k: string; children: React.ReactNode }) {
	return (
		<div className="flex gap-2">
			<dt className="w-28 shrink-0 text-gray-600">{k}</dt>
			<dd className="min-w-0 break-words">{children}</dd>
		</div>
	);
}

function Daemon({ view }: { view: SystemData }) {
	const s = view.status;
	if (!view.reachable || !s)
		return (
			<p role="alert">
				Daemon unreachable{view.error ? `: ${view.error}` : ""}
			</p>
		);
	const counts = Object.entries(s.agents_by_state)
		.map(([k, n]) => `${n} ${k}`)
		.join(", ");
	return (
		<dl className="space-y-1 text-sm">
			<Row k="Daemon">
				up, {s.version}, uptime {uptime(s.started_at)}
			</Row>
			<Row k="Budget">{s.budget_state}</Row>
			{s.rate_limits.map((r) => (
				<Row key={r.window} k={`Limit ${r.window}`}>
					{r.utilization != null ? `${Math.round(r.utilization * 100)}%` : "?"}
					{r.status ? ` (${r.status})` : ""}
					{r.resets_at ? `, resets ${when(r.resets_at)}` : ""}
				</Row>
			))}
			<Row k="CI">
				{s.ci ? (
					<>
						{s.ci.url ? (
							<a className="underline" href={s.ci.url}>
								{s.ci.conclusion}
							</a>
						) : (
							s.ci.conclusion
						)}{" "}
						on {s.ci.sha.slice(0, 8)}
					</>
				) : (
					"none"
				)}
			</Row>
			<Row k="Upgrade">
				{s.upgrade_waiting
					? `${s.upgrade_waiting} waiting for a quiet point`
					: "none waiting"}
			</Row>
			<Row k="Incidents">
				{s.incidents.length === 0
					? "none open"
					: s.incidents.map((i) => (
							<span key={i.id} className="block">
								{i.id} {i.title} (since {when(i.since)})
							</span>
						))}
			</Row>
			<Row k="Agents">{counts || "none"}</Row>
			<Row k="Unread">{s.unread_human_messages} for the human</Row>
			{s.sessions.length > 0 && (
				<div>
					<h4 className="mt-2 font-medium">Sessions</h4>
					<ul>
						{s.sessions.map((x) => (
							<li key={`${x.identity}${x.started_at}`}>
								{x.identity}
								{x.last_activity ? `, active ${when(x.last_activity)}` : ""}
								{x.tokens != null ? `, ${tokens(x.tokens)} tokens` : ""}
							</li>
						))}
					</ul>
				</div>
			)}
		</dl>
	);
}

function Agent({ a, project }: { a: AgentView; project: string }) {
	return (
		<li className="rounded border p-2 text-sm">
			<div className="flex flex-wrap gap-x-2">
				<span className="font-medium">{a.name}</span>
				<span>{a.role}</span>
				<span>{a.state}</span>
			</div>
			<div className="text-gray-600">
				{a.model}
				{a.context_tokens != null
					? `, ${tokens(a.context_tokens)} context`
					: ""}
				, {cost(a.cost_usd_total)}
			</div>
			{a.task && (
				<div>
					<Link className="underline" to={taskHref(project, a.task)}>
						{a.task}
					</Link>
				</div>
			)}
			{a.exit_reason && <div className="text-gray-600">{a.exit_reason}</div>}
		</li>
	);
}

export function Agents({ list }: { list: AgentList }) {
	const [showStopped, setShowStopped] = useState(false);
	const shown = list.agents.filter((a) => showStopped || !a.stopped);
	const hidden = list.agents.filter((a) => a.stopped).length;
	return (
		<div className="space-y-2">
			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={showStopped}
					onChange={(e) => setShowStopped(e.target.checked)}
				/>
				Show stopped ({hidden})
			</label>
			{shown.length === 0 ? (
				<p className="text-sm">No agents.</p>
			) : (
				<ul className="space-y-2">
					{shown.map((a) => (
						<Agent key={a.name} a={a} project={list.project} />
					))}
				</ul>
			)}
		</div>
	);
}

type ProjectSystem = { project: string; view: SystemData; agents?: AgentList };

export function SystemView({ onLoggedOut }: Props) {
	const [data, setData] = useState<ProjectSystem[]>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		let stale = false;
		(async () => {
			const p = await listProjects();
			if (stale) return;
			if (!p.ok) {
				if (p.notLoggedIn) onLoggedOut();
				else setError(p.error);
				return;
			}
			const out = await Promise.all(
				p.value.projects.map(async (x): Promise<ProjectSystem> => {
					const v = await systemView(x.project);
					const view: SystemData = v.ok
						? v.value
						: {
								project: x.project,
								reachable: false,
								error: v.notLoggedIn ? "not logged in" : v.error,
								status: null,
							};
					if (!view.reachable) return { project: x.project, view };
					const a = await agentList(x.project);
					return {
						project: x.project,
						view,
						agents: a.ok ? a.value : undefined,
					};
				}),
			);
			if (stale) return;
			setError(undefined);
			setData(out);
		})();
		return () => {
			stale = true;
		};
	}, [onLoggedOut]);

	if (error) return <p role="alert">{error}</p>;
	if (!data) return <p>Loading...</p>;
	return (
		<div className="space-y-8">
			{data.map(({ project, view, agents }) => (
				<section key={project} className="space-y-3">
					<h2 className="text-xl font-semibold">{project}</h2>
					<Daemon view={view} />
					{agents && (
						<>
							<h3 className="font-medium">Agents</h3>
							<Agents list={agents} />
						</>
					)}
				</section>
			))}
		</div>
	);
}
