import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ticketList } from "./api/client";
import type { TaskSummary } from "./api/generated/TaskSummary";
import { projectHref, ticketHref } from "./doc/links";
import { byState } from "./Tickets";

/** `/p/{project}`: the project's open tickets and the way into its docs and specs. */
export function ProjectView({ onLoggedOut }: { onLoggedOut: () => void }) {
	const { project = "" } = useParams();
	const [tickets, setTickets] = useState<TaskSummary[]>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		let stale = false;
		setTickets(undefined);
		ticketList(project, "open").then((r) => {
			if (stale) return;
			if (r.ok) {
				setTickets(r.value.tickets);
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
			{!error && !tickets && <p>Loading tickets...</p>}
			{tickets?.length === 0 && (
				<p className="text-gray-500">No open tickets.</p>
			)}
			{tickets &&
				byState(tickets).map(([state, group]) => (
					<div key={state} className="space-y-2">
						<h3 className="text-sm font-medium uppercase text-gray-500">
							{state} ({group.length})
						</h3>
						<ul className="space-y-2">
							{group.map((t) => (
								<li key={t.id} className="rounded border p-3">
									<Link
										className="font-medium text-blue-700 underline"
										to={ticketHref(project, t.id)}
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
