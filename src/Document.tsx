import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
	projects as listProjects,
	readDocument,
	requestReview,
	searchDocuments,
	writeDocument,
} from "./api/client";
import type { Document } from "./api/generated/Document";
import {
	addComment,
	addReply,
	type Block,
	easternStamp,
	type Mark,
	markQuotes,
	markRead,
	parseDocument,
	quoteOf,
	resolveOpen,
	resolveThread,
	type Thread,
} from "./doc/comments";
import { documentHref, parseFrontMatter } from "./doc/links";
import { IdChip } from "./IdChip";
import { LinkScope, Md } from "./Md";

type Props = {
	onLoggedOut: () => void;
	initialProject?: string;
	initialPath?: string;
};

function extractTicketId(path: string): string | null {
	const match = path.match(/-([abcdefghjkmnpqrstuvwxyz23456789]{4})\.md$/);
	return match ? match[1] : null;
}

// The text a comment is on is highlighted, like Google Docs. Markup spanning a highlight edge
// shows plain: the quote is rendered text and may not match the source.
function Marked({ text, quotes }: { text: string; quotes: string[] }) {
	return markQuotes(text, quotes).map((s, i) => {
		const key = `${i}:${s.text}`;
		return s.mark ? (
			<mark key={key} className="bg-amber-200">
				<Md text={s.text} />
			</mark>
		) : (
			<span key={key}>
				<Md text={s.text} />
			</span>
		);
	});
}

function FrontMatterTable({ text }: { text: string }) {
	const { rows } = parseFrontMatter(text.split("\n"));
	return (
		<table className="w-full border-collapse text-sm">
			<tbody>
				{rows.map((r) => (
					<tr key={r.key} className="border-b align-top">
						<th className="py-1 pr-3 text-left font-medium text-gray-600">
							{r.key}
						</th>
						<td className="py-1">
							<Md text={r.value} />
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

function BlockText({ block, quotes }: { block: Block; quotes: string[] }) {
	const t = <Marked text={block.text} quotes={quotes} />;
	switch (block.kind) {
		case "heading":
			return (
				<p
					className="font-semibold"
					style={{ fontSize: `${1.6 - block.level * 0.15}rem` }}
				>
					{t}
				</p>
			);
		case "item":
			return <p className="pl-4">• {t}</p>;
		case "frontmatter":
			return <FrontMatterTable text={block.text} />;
		case "code":
			return (
				<pre className="overflow-x-auto rounded bg-gray-100 p-2 text-sm">
					{block.text}
				</pre>
			);
		default:
			return <p>{t}</p>;
	}
}

function MarkView({ mark }: { mark?: Mark }) {
	return mark ? (
		<span className="ml-2 text-gray-500">
			[{mark.state} {mark.stamp}]
		</span>
	) : null;
}

type ThreadActions = {
	onOpen: (t: Thread) => void;
	onReply: (t: Thread, text: string) => Promise<boolean>;
	onResolve: (t: Thread) => void;
};

function ThreadView({
	thread,
	onOpen,
	onReply,
	onResolve,
}: { thread: Thread } & ThreadActions) {
	// An unread agent entry stays folded until the human opens the thread, which reads it;
	// a resolved thread stays collapsed to its header.
	const [open, setOpen] = useState(!thread.unread && !thread.resolved);
	const [reply, setReply] = useState("");
	return (
		<aside
			className={`rounded border p-2 text-sm ${thread.resolved ? "border-gray-300 bg-gray-50 text-gray-500" : "border-amber-300 bg-amber-50"}`}
		>
			<div className="flex items-start justify-between gap-2">
				<button
					type="button"
					className="flex-1 text-left"
					aria-expanded={open}
					onClick={() => {
						setOpen(true);
						if (thread.unread) onOpen(thread);
					}}
				>
					<span className="font-medium">{thread.who}</span>
					<span className="ml-2 text-gray-500">{thread.when}</span>
					<MarkView mark={thread.mark} />
					{thread.resolved && <span className="ml-2">resolved</span>}
					{thread.unread && (
						<span className="ml-2 rounded bg-red-600 px-1 text-white">new</span>
					)}
					{thread.quote && (
						<span className="block italic text-gray-600">"{thread.quote}"</span>
					)}
				</button>
				{thread.id && (
					<>
						{/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: prevent thread toggle when copying ID */}
						<div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
							<IdChip id={thread.id} />
						</div>
					</>
				)}
			</div>
			{open &&
				thread.body.map((l, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: lines have no identity
					<p key={i} className="min-h-2">
						<Md text={l.text} />
						<MarkView mark={l.mark} />
					</p>
				))}
			{open && !thread.resolved && (
				<div className="mt-2 space-y-1">
					<textarea
						aria-label="Reply"
						className="w-full rounded border bg-white p-1"
						value={reply}
						onChange={(e) => setReply(e.target.value)}
					/>
					<div className="flex gap-2">
						<button
							type="button"
							className="rounded border px-2 py-0.5"
							disabled={!reply.trim()}
							onClick={async () => {
								if (await onReply(thread, reply)) setReply("");
							}}
						>
							Reply
						</button>
						<button
							type="button"
							className="rounded border px-2 py-0.5"
							onClick={() => onResolve(thread)}
						>
							Resolve
						</button>
					</div>
				</div>
			)}
		</aside>
	);
}

type Pending = { after: number; quote: string };

export function DocumentView({
	onLoggedOut,
	initialProject,
	initialPath,
}: Props) {
	const [project, setProject] = useState(initialProject || "");
	const [path, setPath] = useState(initialPath || "");
	const [doc, setDoc] = useState<Document>();
	const [error, setError] = useState<string>();
	const [pending, setPending] = useState<Pending>();
	const [text, setText] = useState("");
	const [resend, setResend] = useState(false);
	const [reviewed, setReviewed] = useState<string>();
	const [known, setKnown] = useState<string[]>([]);
	const [matches, setMatches] = useState<string[]>([]);
	const pathInputRef = useRef<HTMLInputElement>(null);

	const fail = useCallback(
		(r: { notLoggedIn: boolean; error: string }) => {
			if (r.notLoggedIn) onLoggedOut();
			else setError(r.error);
		},
		[onLoggedOut],
	);

	// The open document lives in the query (not the path: the gateway 404s paths with an
	// extension), so a refresh or a shared link reopens it.
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const qProject = useParams().project ?? params.get("project");
	const qPath = params.get("path");

	// When initialPath is provided (from TicketView), use it directly.
	// Otherwise, read from query params (Document page with /p/{project}/docs?path=).
	const docProject = initialPath ? initialProject : qProject;
	const docPath = initialPath ? initialPath : qPath;

	useEffect(() => {
		if (!docProject || !docPath) return;
		if (!initialPath) {
			setProject(docProject);
			setPath(docPath);
		}
		let stale = false;
		readDocument(docProject, docPath).then((r) => {
			if (stale) return;
			if (r.ok) {
				setDoc(r.value);
				setError(undefined);
				setPending(undefined);
			} else fail(r);
		});
		return () => {
			stale = true;
		};
	}, [docProject, docPath, fail, initialPath]);

	useEffect(() => {
		listProjects().then((r) => {
			if (!r.ok) return fail(r);
			const names = r.value.projects.map((p) => p.project);
			setKnown(names);
			setProject((cur) => cur || names[0] || "");
		});
	}, [fail]);

	// Inline search while typing; a stale answer for an older query is dropped.
	useEffect(() => {
		if (!project) return;
		let stale = false;
		searchDocuments(project, path).then((r) => {
			if (!stale && r.ok) setMatches(r.value.paths);
		});
		return () => {
			stale = true;
		};
	}, [project, path]);

	const open = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		// A bare ticket ID needs a fresh search: the list above may be for the last keystroke.
		const found = await searchDocuments(project, path.trim());
		if (!found.ok) return fail(found);
		const target = resolveOpen(path, found.value.paths);
		if (target) navigate(documentHref(project, target));
		else setError(`No document matches "${path.trim()}".`);
	};

	// The write carries the hash we read; on success the new hash is the base for the next edit.
	const save = async (content: string) => {
		if (!doc) return false;
		const r = await writeDocument(doc.project, doc.path, content, doc.hash);
		if (!r.ok) {
			fail(r);
			return false;
		}
		setDoc({ ...doc, content, hash: r.value.hash });
		setError(undefined);
		return true;
	};

	// The daemon marks the threads sent in the file, so reload to show the marks and the new hash.
	const review = async () => {
		if (!doc) return;
		const r = await requestReview(doc.project, doc.path, resend);
		if (!r.ok) {
			setReviewed(undefined);
			fail(r);
			return;
		}
		setError(undefined);
		setReviewed(
			r.value.threads === 0
				? "Nothing to send."
				: `Sent ${r.value.threads} thread${r.value.threads === 1 ? "" : "s"} to ${r.value.agent}.`,
		);
		const d = await readDocument(doc.project, doc.path);
		if (d.ok) setDoc(d.value);
		else fail(d);
	};

	// Stable (only reads the DOM and sets state) so the selectionchange effect can depend on it.
	const select = useCallback(() => {
		const sel = window.getSelection();
		const el =
			sel?.anchorNode?.parentElement?.closest<HTMLElement>("[data-last]");
		if (!sel || sel.isCollapsed || !el) return;
		const quote = quoteOf(sel.toString());
		if (quote) setPending({ after: Number(el.dataset.last), quote });
	}, []);

	// Native touch selection (iOS, Android) fires no mouseup, only selectionchange. Debounced so
	// the box opens once the handles settle; the selection itself is never touched.
	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | undefined;
		const onChange = () => {
			clearTimeout(timer);
			timer = setTimeout(select, 300);
		};
		document.addEventListener("selectionchange", onChange);
		return () => {
			clearTimeout(timer);
			document.removeEventListener("selectionchange", onChange);
		};
	}, [select]);

	const submit = async () => {
		if (!doc || !pending || !text.trim()) return;
		const next = addComment(
			doc.content,
			pending.after,
			"human",
			easternStamp(),
			pending.quote,
			text,
		);
		if (await save(next)) {
			setPending(undefined);
			setText("");
		}
	};

	const opened = async (t: Thread) => {
		if (doc) await save(markRead(doc.content, t, easternStamp()));
	};

	const replied = async (t: Thread, reply: string) =>
		doc
			? save(addReply(doc.content, t, "human", easternStamp(), reply))
			: false;

	const resolved = async (t: Thread) => {
		if (doc) await save(resolveThread(doc.content, t, "human", easternStamp()));
	};

	const blocks = doc ? parseDocument(doc.content) : [];

	return (
		<LinkScope
			project={doc?.project ?? ""}
			texts={blocks.flatMap((b) => [
				b.text,
				...b.threads.flatMap((t) => t.body.map((l) => l.text)),
			])}
		>
			<div className="space-y-4">
				{!initialPath && (
					<form className="flex flex-wrap items-end gap-2" onSubmit={open}>
						<label className="flex flex-col text-sm">
							Project
							<select
								className="rounded border px-2 py-1"
								value={project}
								onChange={(e) => setProject(e.target.value)}
							>
								{[...new Set([...known, project])]
									.filter((n) => n !== "")
									.map((n) => (
										<option key={n}>{n}</option>
									))}
							</select>
						</label>
						<label className="flex min-w-64 flex-1 flex-col text-sm">
							Document
							<div className="flex items-center gap-1">
								<input
									ref={pathInputRef}
									className="rounded border px-2 py-1 w-full"
									list="document-matches"
									placeholder="Search tickets and docs, or paste a ticket ID"
									value={path}
									onChange={(e) => setPath(e.target.value)}
								/>
								<button
									type="button"
									aria-label="Clear search"
									disabled={!path}
									onClick={() => {
										setPath("");
										setMatches([]);
										pathInputRef.current?.focus();
									}}
									className="shrink-0 w-11 h-11 flex items-center justify-center rounded border text-red-600 hover:text-red-700 disabled:opacity-40 disabled:hover:text-red-600"
								>
									✕
								</button>
							</div>
							<datalist id="document-matches">
								{matches.map((m) => (
									<option key={m} value={m} />
								))}
							</datalist>
						</label>
						<button type="submit" className="rounded border px-3 py-1">
							Open
						</button>
					</form>
				)}
				{error && (
					<p role="alert" className="text-red-700">
						{error}
					</p>
				)}
				{doc && (
					<div className="space-y-2 text-sm text-gray-500">
						<div className="flex flex-wrap items-center gap-2">
							<IdChip id={doc.path} />
							{(() => {
								const ticketId = extractTicketId(doc.path);
								return ticketId ? <IdChip id={ticketId} /> : null;
							})()}
							<span>on {doc.branch}. Select text to comment on it.</span>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<button
								type="button"
								className="rounded border px-3 py-1 text-black"
								onClick={review}
							>
								Request review
							</button>
							<label className="flex items-center gap-1">
								<input
									type="checkbox"
									checked={resend}
									onChange={(e) => setResend(e.target.checked)}
								/>
								Resend comments already sent
							</label>
							{reviewed && <span role="status">{reviewed}</span>}
						</div>
					</div>
				)}
				{/* biome-ignore lint/a11y/noStaticElementInteractions: mouse selection has no keyboard twin here */}
				<div className="space-y-2" onMouseUp={select}>
					{blocks.map((b) => {
						const here =
							pending && pending.after === b.last ? pending : undefined;
						const quotes = [
							...b.threads.map((t) => t.quote),
							...(here ? [here.quote] : []),
						];
						// Wide: the document column and a right margin, threads level with their text.
						// Narrow: one column, the threads and the comment box right below the block.
						return (
							<div
								key={b.start}
								className="grid gap-x-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]"
							>
								<div data-last={b.last}>
									<BlockText block={b} quotes={quotes} />
								</div>
								<div className="space-y-2">
									{b.threads.map((t) => (
										<ThreadView
											key={`${t.start}:${t.unread}:${t.resolved}`}
											thread={t}
											onOpen={opened}
											onReply={replied}
											onResolve={resolved}
										/>
									))}
									{here && (
										<div className="space-y-2 rounded border bg-white p-2 shadow">
											<p className="text-sm italic">
												Comment on "{here.quote}"
											</p>
											<textarea
												aria-label="Comment"
												className="w-full rounded border p-1"
												value={text}
												onChange={(e) => setText(e.target.value)}
											/>
											<div className="flex gap-2">
												<button
													type="button"
													className="rounded border px-3 py-1"
													onClick={submit}
												>
													Add comment
												</button>
												<button
													type="button"
													className="rounded border px-3 py-1"
													onClick={() => setPending(undefined)}
												>
													Cancel
												</button>
											</div>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</LinkScope>
	);
}
