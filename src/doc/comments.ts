// The document format from bridle ticket x8jt: comments are `> [!comment] who, when, on "quote"`
// callouts right after the line they are on, replies are bold names inside the callout, and a
// tag is `@human` at the start of a reply, marked read by appending `(read)`. Pure functions on
// the file's text; the view never keeps any other copy of a comment.

export type Thread = {
	/** First and last line (0-based, inclusive) of the callout in the file. */
	start: number;
	end: number;
	who: string;
	when: string;
	quote: string;
	/** The callout's lines with the `> ` prefix removed, header excluded. */
	body: string[];
	/** The `· sent` stamp on the header line, "" when the first comment isn't marked sent. */
	sent: string;
	/** An `@human` tag not yet marked `(read)`. */
	unread: boolean;
};

export type Block = {
	kind: "heading" | "item" | "code" | "para";
	/** Source lines of the text itself (0-based, inclusive). */
	start: number;
	end: number;
	/** The text to render: heading markers and list bullets removed. */
	text: string;
	level: number;
	/** Last line of the block including the threads after it: where a new comment goes. */
	last: number;
	threads: Thread[];
};

const HEADER = /^> \[!comment\]\s*(.*)$/;
const HEADER_PARTS = /^(.*?),\s*(.*?),\s*on "(.*)"\s*$/;
// bridle appends `· sent YYYY-MM-DD HH:MM` to the line of a thread's newest human entry,
// which can be the header: it must not end up in the quote.
const SENT_MARK = /\s*·\s*sent\s+(\d{4}-\d\d-\d\d \d\d:\d\d)\s*$/;
const UNREAD_TAG = /(\*\*[^*]+\*\*\s*)@human(?![\w-])(?!\s*\(read\))/;

const isBlank = (l: string) => l.trim() === "";
const isFence = (l: string) => /^\s*(```|~~~)/.test(l);
const isHeading = (l: string) => /^#{1,6}\s/.test(l);
const isItem = (l: string) => /^\s*([-*+]|\d+[.)])\s/.test(l);
const isCallout = (l: string) => HEADER.test(l);

function readThread(lines: string[], start: number): Thread {
	let end = start;
	while (end + 1 < lines.length && lines[end + 1].startsWith(">")) end++;
	const rawHead = (lines[start].match(HEADER)?.[1] ?? "").trim();
	const sent = rawHead.match(SENT_MARK)?.[1] ?? "";
	const head = rawHead.replace(SENT_MARK, "");
	const parts = head.match(HEADER_PARTS);
	const body = lines
		.slice(start + 1, end + 1)
		.map((l) => l.replace(/^> ?/, ""));
	return {
		start,
		end,
		who: parts ? parts[1] : head,
		when: parts ? parts[2] : "",
		quote: parts ? parts[3] : "",
		body,
		sent,
		unread: body.some((l) => UNREAD_TAG.test(l)),
	};
}

export function parseDocument(content: string): Block[] {
	const lines = content.split("\n");
	const blocks: Block[] = [];
	const add = (
		kind: Block["kind"],
		start: number,
		end: number,
		text: string,
		level = 0,
	) => blocks.push({ kind, start, end, text, level, last: end, threads: [] });

	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (isBlank(line)) {
			i++;
		} else if (isCallout(line)) {
			const t = readThread(lines, i);
			if (blocks.length === 0) add("para", i, i, "");
			const b = blocks[blocks.length - 1];
			b.threads.push(t);
			b.last = t.end;
			i = t.end + 1;
		} else if (isFence(line)) {
			let j = i + 1;
			while (j < lines.length && !isFence(lines[j])) j++;
			const end = Math.min(j, lines.length - 1);
			add("code", i, end, lines.slice(i + 1, j).join("\n"));
			i = end + 1;
		} else if (isHeading(line)) {
			const level = line.match(/^#+/)?.[0].length ?? 1;
			add("heading", i, i, line.replace(/^#+\s+/, ""), level);
			i++;
		} else if (isItem(line)) {
			let j = i;
			while (
				j + 1 < lines.length &&
				/^\s+\S/.test(lines[j + 1]) &&
				!isItem(lines[j + 1])
			)
				j++;
			const text = lines
				.slice(i, j + 1)
				.map((l) => l.trim())
				.join(" ")
				.replace(/^([-*+]|\d+[.)])\s+/, "");
			add("item", i, j, text);
			i = j + 1;
		} else {
			let j = i;
			while (
				j + 1 < lines.length &&
				!isBlank(lines[j + 1]) &&
				!isFence(lines[j + 1]) &&
				!isHeading(lines[j + 1]) &&
				!isItem(lines[j + 1]) &&
				!isCallout(lines[j + 1])
			)
				j++;
			const text = lines
				.slice(i, j + 1)
				.map((l) => l.replace(/^>\s?/, "").trim())
				.join(" ");
			add("para", i, j, text);
			i = j + 1;
		}
	}
	return blocks;
}

/** Collapses a highlighted passage to one line, safe inside the header's quotes. */
export const quoteOf = (selected: string) =>
	selected.trim().replace(/\s+/g, " ");

/** Inserts a comment callout after line `after` (a block's `last`), blank-line separated. */
export function addComment(
	content: string,
	after: number,
	who: string,
	when: string,
	quote: string,
	text: string,
): string {
	const lines = content.split("\n");
	const callout = [
		`> [!comment] ${who}, ${when}, on "${quoteOf(quote)}"`,
		...text
			.trim()
			.split("\n")
			.map((l) => (l.trim() === "" ? ">" : `> ${l}`)),
	];
	const insert = ["", ...callout];
	if (after + 1 < lines.length && !isBlank(lines[after + 1])) insert.push("");
	lines.splice(after + 1, 0, ...insert);
	return lines.join("\n");
}

/** Appends `(read)` to every unread `@human` tag in the thread at lines start..end. */
export function markRead(content: string, thread: Thread): string {
	const lines = content.split("\n");
	for (let i = thread.start + 1; i <= thread.end; i++) {
		lines[i] = lines[i].replace(
			new RegExp(UNREAD_TAG.source, "g"),
			"$1@human (read)",
		);
	}
	return lines.join("\n");
}

export type Segment = { text: string; mark: boolean };

/** Splits `text` so the first occurrence of each quote is marked: what a comment is on. */
export function markQuotes(text: string, quotes: string[]): Segment[] {
	const spans = quotes
		.filter((q) => q !== "")
		.map((q) => ({ at: text.indexOf(q), len: q.length }))
		.filter((s) => s.at >= 0)
		.sort((a, b) => a.at - b.at);
	const out: Segment[] = [];
	let pos = 0;
	for (const s of spans) {
		if (s.at < pos) continue; // overlaps an earlier quote
		if (s.at > pos) out.push({ text: text.slice(pos, s.at), mark: false });
		out.push({ text: text.slice(s.at, s.at + s.len), mark: true });
		pos = s.at + s.len;
	}
	if (pos < text.length) out.push({ text: text.slice(pos), mark: false });
	return out.length ? out : [{ text, mark: false }];
}

/**
 * What Open opens: a typed repo path as is, otherwise the best search match (the gateway ranks
 * an exact ticket ID first, then open tickets), so a pasted bare ID works.
 */
export function resolveOpen(
	typed: string,
	matches: string[],
): string | undefined {
	const t = typed.trim();
	if (!t) return undefined;
	if (t.includes("/") || t.endsWith(".md")) return t;
	return matches[0];
}
