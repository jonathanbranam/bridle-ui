import { type ReactNode, useCallback, useEffect, useState } from "react";
import { readDocument, requestReview, writeDocument } from "./api/client";
import type { Document } from "./api/generated/Document";
import {
	addComment,
	type Block,
	markRead,
	parseDocument,
	quoteOf,
	type Thread,
} from "./doc/comments";

type Props = { onLoggedOut: () => void };

const stamp = () => {
	const d = new Date();
	const p = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

// Only what the documents use: `code` and **bold**. A real markdown library isn't worth it yet.
function inline(text: string): ReactNode[] {
	return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, i) => {
		const key = `${i}:${part}`;
		if (part.startsWith("`") && part.length > 1)
			return <code key={key}>{part.slice(1, -1)}</code>;
		if (part.startsWith("**") && part.length > 4)
			return <strong key={key}>{part.slice(2, -2)}</strong>;
		return part;
	});
}

function BlockText({ block }: { block: Block }) {
	switch (block.kind) {
		case "heading":
			return (
				<p
					className="font-semibold"
					style={{ fontSize: `${1.6 - block.level * 0.15}rem` }}
				>
					{inline(block.text)}
				</p>
			);
		case "item":
			return <p className="pl-4">• {inline(block.text)}</p>;
		case "code":
			return (
				<pre className="overflow-x-auto rounded bg-gray-100 p-2 text-sm">
					{block.text}
				</pre>
			);
		default:
			return <p>{inline(block.text)}</p>;
	}
}

function ThreadView({
	thread,
	onOpen,
}: {
	thread: Thread;
	onOpen: (t: Thread) => void;
}) {
	// An unread tag stays folded until the human opens the thread; opening is what reads it.
	const [open, setOpen] = useState(!thread.unread);
	return (
		<aside className="rounded border border-amber-300 bg-amber-50 p-2 text-sm">
			<button
				type="button"
				className="w-full text-left"
				aria-expanded={open}
				onClick={() => {
					setOpen(true);
					if (thread.unread) onOpen(thread);
				}}
			>
				<span className="font-medium">{thread.who}</span>
				<span className="ml-2 text-gray-500">{thread.when}</span>
				{thread.sent && (
					<span className="ml-2 text-gray-500">· sent {thread.sent}</span>
				)}
				{thread.unread && (
					<span className="ml-2 rounded bg-red-600 px-1 text-white">
						@human
					</span>
				)}
				{thread.quote && (
					<span className="block italic text-gray-600">“{thread.quote}”</span>
				)}
			</button>
			{open &&
				thread.body.map((l, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: lines have no identity
					<p key={i} className="min-h-2">
						{inline(l)}
					</p>
				))}
		</aside>
	);
}

type Pending = { after: number; quote: string };

export function DocumentView({ onLoggedOut }: Props) {
	const [project, setProject] = useState("");
	const [path, setPath] = useState("");
	const [doc, setDoc] = useState<Document>();
	const [error, setError] = useState<string>();
	const [pending, setPending] = useState<Pending>();
	const [text, setText] = useState("");
	const [resend, setResend] = useState(false);
	const [reviewed, setReviewed] = useState<string>();

	const fail = useCallback(
		(r: { notLoggedIn: boolean; error: string }) => {
			if (r.notLoggedIn) onLoggedOut();
			else setError(r.error);
		},
		[onLoggedOut],
	);

	useEffect(() => {
		// Remember nothing between visits, but let the address bar name a document: ?doc=project:path
		const q = new URLSearchParams(window.location.search).get("doc");
		if (q?.includes(":")) {
			const i = q.indexOf(":");
			setProject(q.slice(0, i));
			setPath(q.slice(i + 1));
		}
	}, []);

	const open = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const r = await readDocument(project, path);
		if (r.ok) {
			setDoc(r.value);
			setError(undefined);
			setPending(undefined);
		} else fail(r);
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

	const select = () => {
		const sel = window.getSelection();
		const el =
			sel?.anchorNode?.parentElement?.closest<HTMLElement>("[data-last]");
		if (!sel || sel.isCollapsed || !el) return;
		const quote = quoteOf(sel.toString());
		if (quote) setPending({ after: Number(el.dataset.last), quote });
	};

	const submit = async () => {
		if (!doc || !pending || !text.trim()) return;
		const next = addComment(
			doc.content,
			pending.after,
			"human",
			stamp(),
			pending.quote,
			text,
		);
		if (await save(next)) {
			setPending(undefined);
			setText("");
		}
	};

	const opened = async (t: Thread) => {
		if (doc) await save(markRead(doc.content, t));
	};

	const blocks = doc ? parseDocument(doc.content) : [];

	return (
		<div className="space-y-4">
			<form className="flex flex-wrap gap-2" onSubmit={open}>
				<input
					aria-label="Project"
					className="rounded border px-2 py-1"
					value={project}
					onChange={(e) => setProject(e.target.value)}
				/>
				<input
					aria-label="Path"
					className="min-w-64 flex-1 rounded border px-2 py-1"
					value={path}
					onChange={(e) => setPath(e.target.value)}
				/>
				<button type="submit" className="rounded border px-3 py-1">
					Open
				</button>
			</form>
			{error && (
				<p role="alert" className="text-red-700">
					{error}
				</p>
			)}
			{doc && (
				<div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
					<p>
						{doc.path} on {doc.branch}. Select text to comment on it.
					</p>
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
			)}
			{pending && (
				<div className="space-y-2 rounded border p-2">
					<p className="text-sm italic">Comment on “{pending.quote}”</p>
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
			{/* biome-ignore lint/a11y/noStaticElementInteractions: mouse selection has no keyboard twin here */}
			<div className="space-y-2" onMouseUp={select}>
				{blocks.map((b) => (
					<div key={b.start} className="grid grid-cols-[3fr_2fr] gap-4">
						<div data-last={b.last}>
							<BlockText block={b} />
						</div>
						<div className="space-y-2">
							{b.threads.map((t) => (
								<ThreadView
									key={`${t.start}:${t.unread}`}
									thread={t}
									onOpen={opened}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
