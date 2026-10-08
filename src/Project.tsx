import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { taskList } from "./api/client";
import type { TaskSummary } from "./api/generated/TaskSummary";
import { projectHref, taskHref } from "./doc/links";
import { byState } from "./Tasks";

/** `/p/{project}`: the project's open tasks and the way into its docs and specs. */
export function ProjectView({ onLoggedOut }: { onLoggedOut: () => void }) {
	const { project = "" } = useParams();
	const [tasks, setTasks] = useState<TaskSummary[]>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		let stale = false;
		setTasks(undefined);
		taskList(project, "open").then((r) => {
			if (stale) return;
			if (r.ok) {
				setTasks(r.value.tasks);
				setError(undefined);
			} else if (r.notLoggedIn) onLoggedOut();
			else setError(r.error);
		});
		return () => {
			stale = true;
		};
	}, [project, onLoggedOut]);

	return (
		<section className="space-y-4">
			<h2 className="text-xl font-semibold">{project}</h2>
			<p className="flex flex-wrap gap-3">
				<Link
					className="text-blue-700 underline"
					to={`${projectHref(project)}/docs`}
				>
					Documents
				</Link>
				<Link
					className="text-blue-700 underline"
					to={`${projectHref(project)}/specs`}
				>
					Specs
				</Link>
			</p>
			{error && <p role="alert">{error}</p>}
			{!error && !tasks && <p>Loading tasks...</p>}
			{tasks?.length === 0 && <p className="text-gray-500">No open tasks.</p>}
			{tasks &&
				byState(tasks).map(([state, group]) => (
					<div key={state} className="space-y-2">
						<h3 className="text-sm font-medium uppercase text-gray-500">
							{state} ({group.length})
						</h3>
						<ul className="space-y-2">
							{group.map((t) => (
								<li key={t.id} className="rounded border p-3">
									<Link
										className="font-medium text-blue-700 underline"
										to={taskHref(project, t.id)}
									>
										{t.title}
									</Link>
									<p className="text-sm text-gray-600">
										<code>{t.id}</code> / {t.priority}
									</p>
								</li>
							))}
						</ul>
					</div>
				))}
		</section>
	);
}
