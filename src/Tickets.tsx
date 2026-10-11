import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AutoTextarea } from "./AutoTextarea";
import {
	type Action,
	act,
	projects as listProjects,
	recipients,
	sendMessage,
	type TicketState,
	ticketDetail,
	ticketList,
} from "./api/client";
import type { TaskDetail } from "./api/generated/TaskDetail";
import type { TaskSummary } from "./api/generated/TaskSummary";
import { ticketHref } from "./doc/links";
import { IdChip } from "./IdChip";
import { TodoActions } from "./Items";
import { LinkScope, Md } from "./Md";
import { ticketTitle } from "./pageTitle";

type Props = { onLoggedOut: () => void };

const worker = (t: TaskSummary) => t.agent?.name ?? t.claimed_by;

/** Groups in order of first appearance; the gateway lists most recently updated first. */
export function byState(tasks: TaskSummary[]) {
	const groups = new Map<string, TaskSummary[]>();
	for (const t of tasks)
		groups.set(t.state, [...(groups.get(t.state) ?? []), t]);
	return [...groups];
}

type ProjectTickets = {
	project: string;
	tickets: TaskSummary[];
	error?: string;
};

export function TicketsView({ onLoggedOut }: Props) {
	const navigate = useNavigate();
	const [showClosed, setShowClosed] = useState(false);
	const [lookup, setLookup] = useState("");
	const [data, setData] = useState<ProjectTickets[]>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		let stale = false;
		const state: TicketState = showClosed ? "all" : "open";
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
				reachable.map(async (x): Promise<ProjectTickets> => {
					const r = await ticketList(x.project, state);
					if (r.ok) return { project: x.project, tickets: r.value.tickets };
					return {
						project: x.project,
						tickets: [],
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
						if (!id) return;
						findTicket(id, undefined).then((r) => {
							if (r.ok) navigate(ticketHref(r.value.project, r.value.id));
							else if (r.notLoggedIn) onLoggedOut();
							else setError(r.error);
						});
					}}
				>
					<input
						aria-label="Ticket ID"
						placeholder="Ticket ID"
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
					{!p.error && p.tickets.length === 0 && (
						<p className="text-gray-500">No tickets.</p>
					)}
					{byState(p.tickets).map(([state, tickets]) => (
						<div key={state} className="space-y-2">
							<h3 className="text-sm font-medium uppercase text-gray-500">
								{state} ({tickets.length})
							</h3>
							<ul className="space-y-2">
								{tickets.map((t) => (
									<li key={t.id} className="rounded border p-3">
										<Link
											className="font-medium text-blue-700 underline"
											to={ticketHref(p.project, t.id)}
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
					to={ticketHref(project, id)}
				>
					{id}
				</Link>
			))}
		</p>
	);
}

const paragraphs = (text: string) =>
	text.split(/\n{2,}/).filter((s) => s.trim());

/** Ticket IDs are globally unique, so with only the ID, ask each project until one has it. */
export async function findTicket(id: string, project: string | undefined) {
	const p = await listProjects();
	if (!p.ok) return p;
	const names = project
		? [project]
		: p.value.projects.filter((x) => x.reachable).map((x) => x.project);
	const found = await Promise.all(names.map((n) => ticketDetail(n, id)));
	const hit = found.find((r) => r.ok);
	if (hit) return hit;
	return (
		found.find((r) => !r.ok && r.notLoggedIn) ?? {
			ok: false as const,
			notLoggedIn: false as const,
			status: 404,
			error: `No ticket ${id}`,
		}
	);
}

function ReplyBox({
	onReply,
}: {
	onReply: (text: string) => Promise<boolean>;
}) {
	const [text, setText] = useState("");
	return (
		<form
			className="flex flex-col gap-2"
			onSubmit={async (e) => {
				e.preventDefault();
				// Keep the text on failure so it isn't lost.
				if (await onReply(text)) setText("");
			}}
		>
			<label htmlFor="ticket-reply">Reply</label>
			<AutoTextarea
				id="ticket-reply"
				className="rounded border p-2"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<div>
				<button
					type="submit"
					className="rounded border px-3 py-2"
					disabled={!text.trim()}
				>
					Reply
				</button>
			</div>
		</form>
	);
}

/** Opens on demand so the recipients are fetched only when the human wants to send. */
function SendToAgent({
	project,
	ticketId,
	onLoggedOut,
}: {
	project: string;
	ticketId: string;
	onLoggedOut: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [names, setNames] = useState<string[]>([]);
	const [to, setTo] = useState("");
	const [text, setText] = useState("");
	const [status, setStatus] = useState<{ error: boolean; text: string }>();

	const toggle = async () => {
		const next = !open;
		setOpen(next);
		setStatus(undefined);
		if (!next) return;
		const r = await recipients(project);
		if (r.ok) {
			setNames(r.value.recipients);
			setTo((t) => t || (r.value.recipients[0] ?? ""));
		} else if (r.notLoggedIn) onLoggedOut();
		else setStatus({ error: true, text: r.error });
	};

	return (
		<div className="space-y-2">
			<button
				type="button"
				className="rounded border px-3 py-2"
				aria-expanded={open}
				onClick={toggle}
			>
				Send to an agent
			</button>
			{open && (
				<form
					className="flex flex-col gap-2"
					onSubmit={async (e) => {
						e.preventDefault();
						const r = await sendMessage(project, { to, text, task: ticketId });
						if (r.ok) {
							// Keep the text on failure so it isn't lost.
							setText("");
							setStatus({ error: false, text: `Sent to ${r.value.to}` });
						} else if (r.notLoggedIn) onLoggedOut();
						else setStatus({ error: true, text: r.error });
					}}
				>
					<label htmlFor="send-to">Send to</label>
					<select
						id="send-to"
						className="rounded border p-2"
						value={to}
						onChange={(e) => setTo(e.target.value)}
					>
						{names.map((n) => (
							<option key={n} value={n}>
								{n}
							</option>
						))}
					</select>
					<label htmlFor="send-text">Message</label>
					<AutoTextarea
						id="send-text"
						className="rounded border p-2"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<div>
						<button
							type="submit"
							className="rounded border px-3 py-2"
							disabled={!to || !text.trim()}
						>
							Send
						</button>
					</div>
				</form>
			)}
			{status && (
				<p
					role={status.error ? "alert" : "status"}
					className={status.error ? "text-red-700" : undefined}
				>
					{status.text}
				</p>
			)}
		</div>
	);
}

/** `/p/{project}/tickets/{id}` */
export function TicketView({ onLoggedOut }: Props) {
	const { id = "", project } = useParams();
	const [ticket, setTicket] = useState<TaskDetail>();
	const [error, setError] = useState<string>();
	const [actionError, setActionError] = useState<string>();

	useEffect(() => {
		let stale = false;
		setTicket(undefined);
		setError(undefined);
		if (!id) {
			setError("Missing ticket ID");
			return;
		}
		findTicket(id, project).then((r) => {
			if (stale) return;
			if (r.ok) setTicket(r.value);
			else if (r.notLoggedIn) onLoggedOut();
			else setError(r.error);
		});
		return () => {
			stale = true;
		};
	}, [id, project, onLoggedOut]);

	useEffect(() => {
		if (ticket)
			document.title = ticketTitle(ticket.project, ticket.id, ticket.title);
	}, [ticket]);

	// Refetch after every attempt so the view shows the gateway's truth, even on failure.
	const run = async (action: Action, text?: string) => {
		if (!ticket) return false;
		const r = await act(ticket.project, ticket.id, action, text);
		if (r.ok) setActionError(undefined);
		else if (r.notLoggedIn) {
			onLoggedOut();
			return false;
		} else setActionError(r.error);
		const fresh = await findTicket(ticket.id, ticket.project);
		if (fresh.ok) setTicket(fresh.value);
		return r.ok;
	};

	if (error) return <p role="alert">{error}</p>;
	if (!ticket) return <p>Loading ticket...</p>;

	return (
		<LinkScope
			project={ticket.project}
			texts={[ticket.title, ticket.body, ...ticket.thread.map((m) => m.body)]}
		>
			<article className="space-y-3">
				<h2 className="text-xl font-semibold">
					<Md text={ticket.title} />
				</h2>
				<IdChip id={ticket.id} />
				<p className="text-sm text-gray-600">
					{ticket.project} / {ticket.state} / {ticket.priority} / {ticket.kind}
				</p>
				{ticket.claimed_by && (
					<p>
						Claimed by: {ticket.agent?.name ?? ticket.claimed_by}
						{ticket.agent && ` (${ticket.agent.role})`}
					</p>
				)}
				{actionError && (
					<p role="alert" className="text-red-700">
						{actionError}
					</p>
				)}
				{ticket.claimed_by === "human" && (
					<TodoActions
						title={ticket.title}
						onDone={() => run("done")}
						onDecline={(reason) => run("drop", reason)}
					/>
				)}
				{ticket.branch && (
					<p>
						Branch: <code>{ticket.branch}</code>
					</p>
				)}
				{ticket.watchers.length > 0 && (
					<p>Watchers: {ticket.watchers.join(", ")}</p>
				)}
				<EdgeList label="Blocks" project={ticket.project} ids={ticket.blocks} />
				<EdgeList
					label="Blocked by"
					project={ticket.project}
					ids={ticket.blocked_by}
				/>
				<div className="space-y-2">
					{paragraphs(ticket.body).map((s) => (
						<p key={s} className="whitespace-pre-wrap">
							<Md text={s} />
						</p>
					))}
				</div>
				<h3 className="font-medium">Thread</h3>
				<ul className="space-y-2">
					{ticket.thread.map((m) => (
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
				<ReplyBox onReply={(text) => run("reply", text)} />
				<SendToAgent
					project={ticket.project}
					ticketId={ticket.id}
					onLoggedOut={onLoggedOut}
				/>
			</article>
		</LinkScope>
	);
}
