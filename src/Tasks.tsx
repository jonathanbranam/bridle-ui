import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import {
	projects as listProjects,
	type TaskState,
	taskDetail,
	taskList,
} from "./api/client";
import type { TaskDetail } from "./api/generated/TaskDetail";
import type { TaskSummary } from "./api/generated/TaskSummary";
import { IdChip } from "./IdChip";
import { LinkScope, Md } from "./Md";

type Props = { onLoggedOut: () => void };

const taskPath = (project: string, id: string) =>
	`/tasks/${encodeURIComponent(project)}/${encodeURIComponent(id)}`;

const worker = (t: TaskSummary) => t.agent?.name ?? t.claimed_by;

/** Groups in order of first appearance; the gateway lists most recently updated first. */
export function byState(tasks: TaskSummary[]) {
	const groups = new Map<string, TaskSummary[]>();
	for (const t of tasks)
		groups.set(t.state, [...(groups.get(t.state) ?? []), t]);
	return [...groups];
}

type ProjectTasks = { project: string; tasks: TaskSummary[]; error?: string };

export function TasksView({ onLoggedOut }: Props) {
	const navigate = useNavigate();
	const [showClosed, setShowClosed] = useState(false);
	const [lookup, setLookup] = useState("");
	const [data, setData] = useState<ProjectTasks[]>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		let stale = false;
		const state: TaskState = showClosed ? "all" : "open";
		(async () => {
			const p = await listProjects();
			if (stale) return;
			if (!p.ok) {
				if (p.notLoggedIn) onLoggedOut();
				else setError(p.error);
				return;
			}
			const reachable = p.value.projects.filter((x) => x.reachable);
			const lists = await Promise.all(
				reachable.map(async (x): Promise<ProjectTasks> => {
					const r = await taskList(x.project, state);
					if (r.ok) return { project: x.project, tasks: r.value.tasks };
					return {
						project: x.project,
						tasks: [],
						error: r.notLoggedIn ? "not logged in" : r.error,
					};
				}),
			);
			if (stale) return;
			setError(undefined);
			setData(lists);
		})();
		return () => {
			stale = true;
		};
	}, [showClosed, onLoggedOut]);

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center gap-4">
				<form
					className="flex gap-2"
					onSubmit={(e) => {
						e.preventDefault();
						const id = lookup.trim();
						if (id) navigate(`/task?${new URLSearchParams({ id })}`);
					}}
				>
					<input
						aria-label="Task ID"
						placeholder="Task ID"
						className="rounded border px-2 py-1"
						value={lookup}
						onChange={(e) => setLookup(e.target.value)}
					/>
					<button type="submit" className="rounded border px-3 py-1">
						Open
					</button>
				</form>
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={showClosed}
						onChange={(e) => setShowClosed(e.target.checked)}
					/>
					Show closed
				</label>
			</div>
			{error && (
				<p role="alert" className="text-red-700">
					{error}
				</p>
			)}
			{data?.map((p) => (
				<section key={p.project} className="space-y-3">
					<h2 className="text-lg font-semibold">{p.project}</h2>
					{p.error && (
						<p role="alert" className="text-red-700">
							{p.error}
						</p>
					)}
					{!p.error && p.tasks.length === 0 && (
						<p className="text-gray-500">No tasks.</p>
					)}
					{byState(p.tasks).map(([state, tasks]) => (
						<div key={state} className="space-y-2">
							<h3 className="text-sm font-medium uppercase text-gray-500">
								{state} ({tasks.length})
							</h3>
							<ul className="space-y-2">
								{tasks.map((t) => (
									<li key={t.id} className="rounded border p-3">
										<Link
											className="font-medium text-blue-700 underline"
											to={taskPath(p.project, t.id)}
										>
											{t.title}
										</Link>
										<p className="text-sm text-gray-600">
											<code>{t.id}</code> / {t.state} / {t.priority}
											{worker(t) && ` / ${worker(t)}`}
										</p>
									</li>
								))}
							</ul>
						</div>
					))}
				</section>
			))}
		</div>
	);
}

function EdgeList({
	label,
	project,
	ids,
}: {
	label: string;
	project: string;
	ids: string[];
}) {
	if (ids.length === 0) return null;
	return (
		<p>
			{label}:{" "}
			{ids.map((id) => (
				<Link
					key={id}
					className="mr-2 text-blue-700 underline"
					to={taskPath(project, id)}
				>
					{id}
				</Link>
			))}
		</p>
	);
}

const paragraphs = (text: string) =>
	text.split(/\n{2,}/).filter((s) => s.trim());

/** Task IDs are globally unique, so with only the ID, ask each project until one has it. */
async function findTask(id: string, project: string | undefined) {
	const p = await listProjects();
	if (!p.ok) return p;
	const names = project
		? [project]
		: p.value.projects.filter((x) => x.reachable).map((x) => x.project);
	const found = await Promise.all(names.map((n) => taskDetail(n, id)));
	const hit = found.find((r) => r.ok);
	if (hit) return hit;
	return (
		found.find((r) => !r.ok && r.notLoggedIn) ?? {
			ok: false as const,
			notLoggedIn: false as const,
			status: 404,
			error: `No task ${id}`,
		}
	);
}

/** `/tasks/{project}/{id}`, or `/task?id=` which finds the project itself. */
export function TaskView({ onLoggedOut }: Props) {
	const route = useParams();
	const [params] = useSearchParams();
	const id = route.id ?? params.get("id") ?? "";
	const project = route.project ?? params.get("project") ?? undefined;
	const [task, setTask] = useState<TaskDetail>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		let stale = false;
		setTask(undefined);
		setError(undefined);
		if (!id) {
			setError("Missing task ID");
			return;
		}
		findTask(id, project).then((r) => {
			if (stale) return;
			if (r.ok) setTask(r.value);
			else if (r.notLoggedIn) onLoggedOut();
			else setError(r.error);
		});
		return () => {
			stale = true;
		};
	}, [id, project, onLoggedOut]);

	if (error) return <p role="alert">{error}</p>;
	if (!task) return <p>Loading task...</p>;

	return (
		<LinkScope
			project={task.project}
			texts={[task.body, ...task.thread.map((m) => m.body)]}
		>
			<article className="space-y-3">
				<h2 className="text-xl font-semibold">{task.title}</h2>
				<IdChip id={task.id} />
				<p className="text-sm text-gray-600">
					{task.project} / {task.state} / {task.priority} / {task.kind}
				</p>
				{task.claimed_by && (
					<p>
						Claimed by: {task.agent?.name ?? task.claimed_by}
						{task.agent && ` (${task.agent.role})`}
					</p>
				)}
				{task.branch && (
					<p>
						Branch: <code>{task.branch}</code>
					</p>
				)}
				{task.watchers.length > 0 && (
					<p>Watchers: {task.watchers.join(", ")}</p>
				)}
				<EdgeList label="Blocks" project={task.project} ids={task.blocks} />
				<EdgeList
					label="Blocked by"
					project={task.project}
					ids={task.blocked_by}
				/>
				<div className="space-y-2">
					{paragraphs(task.body).map((s) => (
						<p key={s} className="whitespace-pre-wrap">
							<Md text={s} />
						</p>
					))}
				</div>
				<h3 className="font-medium">Thread</h3>
				<ul className="space-y-2">
					{task.thread.map((m) => (
						<li key={`${m.at}${m.from}`} className="rounded border p-2">
							<p className="text-sm text-gray-500">
								[{m.kind}] {m.from}, {m.at}
							</p>
							<p className="whitespace-pre-wrap">
								<Md text={m.body} />
							</p>
						</li>
					))}
				</ul>
			</article>
		</LinkScope>
	);
}
