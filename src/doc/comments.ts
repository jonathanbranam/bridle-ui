// The document format from bridle tickets x8jt and ehv6: comments are
// `> [!comment] c<n> who, when, on "quote" [state when]` callouts right after the line they are
// on; replies are `**who, when:** text [state when]` lines inside the callout; a closing line is
// `**resolved by who, when**`. The mark at the end of an entry's first line is its latest status.
// Pure functions on the file's text, matching the daemon's parser (doc_watch.rs); the view never
// keeps any other copy of a comment. Nothing here compares times: state is which mark is present.

export type MarkState = "pending" | "sent" | "read";
export type Mark = { state: MarkState; stamp: string };

export type BodyLine = {
	/** The line with the `> ` prefix and any status mark removed. */
	text: string;
	/** The status mark on an entry's first line. */
	mark?: Mark;
};

export type Thread = {
	/** First and last line (0-based, inclusive) of the callout in the file. */
	start: number;
	end: number;
	/** `c3`, "" for a hand-typed thread the daemon hasn't numbered yet. */
	id: string;
	who: string;
	when: string;
	quote: string;
	/** The status mark on the header line. */
	mark?: Mark;
	/** The callout's lines, header excluded. */
	body: BodyLine[];
	/** An agent's entry the human hasn't opened yet (no `[read]` mark). */
	unread: boolean;
	/** The thread has a `**resolved by` line. */
	resolved: boolean;
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
const HEADER_ID = /^(c\d+)\s+/;
const HEADER_PARTS = /^(.*?),\s*(.*?),\s*on "(.*)"\s*$/;
// `[pending|sent|read 2026-10-04 21:14 EDT]`: the stamp is exactly 20 characters, as in the daemon.
const MARK = /\s\[(pending|sent|read) (.{20})\]$/;
// The old mark, with a U+00B7 middle dot and no zone: read as `sent`.
const LEGACY_MARK = /\s\u00b7 sent (\d{4}-\d\d-\d\d \d\d:\d\d)$/;
const ENTRY = /^\*\*([^,*]+)[,:]/;

const isBlank = (l: string) => l.trim() === "";
const isFence = (l: string) => /^\s*(```|~~~)/.test(l);
const isHeading = (l: string) => /^#{1,6}\s/.test(l);
const isItem = (l: string) => /^\s*([-*+]|\d+[.)])\s/.test(l);
const isCallout = (l: string) => HEADER.test(l);

export const isHuman = (who: string) => {
	const w = who.trim().toLowerCase();
	return w === "human" || w.startsWith("human via ");
};

function splitMark(line: string): { text: string; mark?: Mark } {
	const m = line.match(MARK);
	if (m)
		return {
			text: line.slice(0, m.index),
			mark: { state: m[1] as MarkState, stamp: m[2] },
		};
	const l = line.match(LEGACY_MARK);
	if (l)
		return {
			text: line.slice(0, l.index),
			mark: { state: "sent", stamp: l[1] },
		};
	return { text: line };
}

/** What a callout body line is: a closing line, an entry's first line (with its author), or text. */
function classify(line: string) {
	if (line.startsWith("**resolved by ")) return { resolved: true, author: "" };
	const author = line.match(ENTRY)?.[1];
	return { resolved: false, author };
}

const isUnreadEntry = (line: string) => {
	const c = classify(line);
	return c.author !== undefined && !isHuman(c.author) && !splitMark(line).mark;
};

function readThread(lines: string[], start: number): Thread {
	let end = start;
	while (end + 1 < lines.length && lines[end + 1].startsWith(">")) end++;
	const rawHead = (lines[start].match(HEADER)?.[1] ?? "").trim();
	const { text, mark } = splitMark(rawHead);
	const id = text.match(HEADER_ID)?.[1] ?? "";
	const head = text.replace(HEADER_ID, "");
	const parts = head.match(HEADER_PARTS);
	const raw = lines.slice(start + 1, end + 1).map((l) => l.replace(/^> ?/, ""));
	const resolved = raw.some((l) => classify(l).resolved);
	return {
		start,
		end,
		id,
		who: parts ? parts[1] : head,
		when: parts ? parts[2] : "",
		quote: parts ? parts[3] : "",
		mark,
		body: raw.map((l) =>
			classify(l).author !== undefined ? splitMark(l) : { text: l },
		),
		unread: !resolved && raw.some(isUnreadEntry),
		resolved,
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

/** The next thread ID: the highest `c<n>` in any header, plus one. */
export function nextId(content: string): string {
	let max = 0;
	for (const l of content.split("\n")) {
		const n = l.match(HEADER)?.[1].match(/^c(\d+)\s/)?.[1];
		if (n) max = Math.max(max, Number(n));
	}
	return `c${max + 1}`;
}

/** Text lines for inside a callout: blank lines stay quoted so the callout doesn't break. */
const quoted = (text: string) =>
	text
		.trim()
		.split("\n")
		.map((l) => (l.trim() === "" ? ">" : `> ${l}`));

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
	const [first, ...rest] = quoted(text);
	const callout = [
		`> [!comment] ${nextId(content)} ${who}, ${when}, on "${quoteOf(quote)}" [pending ${when}]`,
		first,
		...rest,
	];
	const insert = ["", ...callout];
	if (after + 1 < lines.length && !isBlank(lines[after + 1])) insert.push("");
	lines.splice(after + 1, 0, ...insert);
	return lines.join("\n");
}

/** Appends a reply entry to the thread, its first line marked `[pending]`. */
export function addReply(
	content: string,
	thread: Thread,
	who: string,
	when: string,
	text: string,
): string {
	const lines = content.split("\n");
	const [first, ...rest] = text.trim().split("\n");
	lines.splice(
		thread.end + 1,
		0,
		">",
		`> **${who}, ${when}:** ${first} [pending ${when}]`,
		...rest.map((l) => (l.trim() === "" ? ">" : `> ${l}`)),
	);
	return lines.join("\n");
}

/** Marks every unmarked agent entry in the thread `[read stamp]`: the human opened it. */
export function markRead(
	content: string,
	thread: Thread,
	stamp: string,
): string {
	const lines = content.split("\n");
	for (let i = thread.start + 1; i <= thread.end; i++) {
		const body = lines[i].replace(/^> ?/, "");
		if (isUnreadEntry(body)) lines[i] = `${lines[i].trimEnd()} [read ${stamp}]`;
	}
	return lines.join("\n");
}

/** Closes the thread the way `bridle review resolve` does. */
export function resolveThread(
	content: string,
	thread: Thread,
	by: string,
	stamp: string,
): string {
	const lines = content.split("\n");
	lines.splice(thread.end + 1, 0, ">", `> **resolved by ${by}, ${stamp}**`);
	return lines.join("\n");
}

/** `YYYY-MM-DD HH:MM EDT`: US Eastern with its zone abbreviation, ASCII, as the daemon writes it. */
export function easternStamp(at: Date = new Date()): string {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		hourCycle: "h23",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		timeZoneName: "short",
	}).formatToParts(at);
	const v = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
	return `${v("year")}-${v("month")}-${v("day")} ${v("hour")}:${v("minute")} ${v("timeZoneName")}`;
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
