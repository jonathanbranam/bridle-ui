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
	kind:
		| "heading"
		| "item"
		| "code"
		| "para"
		| "table"
		| "quote"
		| "frontmatter";
	/** Source lines of the text itself (0-based, inclusive). */
	start: number;
	end: number;
	/** The text to render: heading markers removed; items and quotes keep their markdown. */
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
const isTable = (l: string) => l.trimStart().startsWith("|");
const isCallout = (l: string) => HEADER.test(l);
const isQuote = (l: string) => l.startsWith(">") && !isCallout(l);

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
	// A leading `---` ... `---` block is front matter, kept as raw lines in `text`.
	if (lines[0]?.trim() === "---") {
		const close = lines.findIndex((l, n) => n > 0 && l.trim() === "---");
		if (close > 0) {
			add("frontmatter", 0, close, lines.slice(1, close).join("\n"));
			i = close + 1;
		}
	}
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
		} else if (isTable(line)) {
			// Kept whole, rows on their own lines, or no markdown parser reads it as a table.
			let j = i;
			while (j + 1 < lines.length && isTable(lines[j + 1])) j++;
			add("table", i, j, lines.slice(i, j + 1).join("\n"));
			i = j + 1;
		} else if (isQuote(line)) {
			let j = i;
			while (j + 1 < lines.length && isQuote(lines[j + 1])) j++;
			add("quote", i, j, lines.slice(i, j + 1).join("\n"));
			i = j + 1;
		} else if (isItem(line)) {
			// One top-level item with everything under it (wrapped lines, nested items, code,
			// blank-separated paragraphs), kept as source: the marker gives the number and the
			// renderer does the nesting.
			let j = i;
			for (;;) {
				let k = j + 1;
				while (k < lines.length && isBlank(lines[k])) k++;
				if (k >= lines.length || !/^\s{2,}\S/.test(lines[k])) break;
				j = k;
			}
			add("item", i, j, lines.slice(i, j + 1).join("\n"));
			i = j + 1;
		} else {
			let j = i;
			while (
				j + 1 < lines.length &&
				!isBlank(lines[j + 1]) &&
				!isFence(lines[j + 1]) &&
				!isHeading(lines[j + 1]) &&
				!isItem(lines[j + 1]) &&
				!isQuote(lines[j + 1]) &&
				!isTable(lines[j + 1]) &&
				!isCallout(lines[j + 1])
			)
				j++;
			const text = lines
				.slice(i, j + 1)
				.map((l) => l.trim())
				.join("\n");
			add("para", i, j, text);
			i = j + 1;
		}
	}
	return blocks;
}

/** Collapses a highlighted passage to one line, safe inside the header's quotes. */
export const quoteOf = (selected: string) =>
	selected.trim().replace(/\s+/g, " ");

const COUNTER = /^next_comment_id:\s*c(\d+)\s*$/;

/** The front matter's closing `---` line, or -1 when the file has none. */
const frontMatterEnd = (lines: string[]) =>
	lines[0]?.trim() === "---"
		? lines.findIndex((l, n) => n > 0 && l.trim() === "---")
		: -1;

/**
 * The next thread ID: the larger of the front matter's `next_comment_id: c<n>` and the highest
 * `c<n>` in any header plus one. The counter is what keeps an ID from coming back after a delete.
 */
export function nextId(content: string): string {
	const lines = content.split("\n");
	let next = 1;
	const close = frontMatterEnd(lines);
	for (let i = 1; i < close; i++) {
		const n = lines[i].match(COUNTER)?.[1];
		if (n) next = Math.max(next, Number(n));
	}
	for (const l of lines) {
		const n = l.match(HEADER)?.[1].match(/^c(\d+)\s/)?.[1];
		if (n) next = Math.max(next, Number(n) + 1);
	}
	return `c${next}`;
}

/** Writes `next_comment_id: c<n+1>` into the front matter, creating it when there is none. */
function bumpCounter(content: string, assigned: string): string {
	const field = `next_comment_id: c${Number(assigned.slice(1)) + 1}`;
	const lines = content.split("\n");
	const close = frontMatterEnd(lines);
	if (close < 0) return `---\n${field}\n---\n\n${content}`;
	const at = lines.findIndex((l, n) => n > 0 && n < close && COUNTER.test(l));
	if (at > 0) lines[at] = field;
	else lines.splice(close, 0, field);
	return lines.join("\n");
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
	const id = nextId(content);
	const callout = [
		`> [!comment] ${id} ${who}, ${when}, on "${quoteOf(quote)}" [pending ${when}]`,
		first,
		...rest,
	];
	const insert = ["", ...callout];
	if (after + 1 < lines.length && !isBlank(lines[after + 1])) insert.push("");
	lines.splice(after + 1, 0, ...insert);
	return bumpCounter(lines.join("\n"), id);
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

/**
 * Removes a resolved thread by ID. The highlight is drawn from the header's quote at render
 * time, so it goes with the callout and the highlighted text is untouched. An unresolved or
 * unknown thread is returned unchanged. The blank line that separated it goes too.
 */
export function deleteThread(content: string, threadId: string): string {
	if (!threadId) return content;
	const lines = content.split("\n");
	const t = parseDocument(content)
		.flatMap((b) => b.threads)
		.find((x) => x.id === threadId);
	if (!t?.resolved) return content;
	let from = t.start;
	let to = t.end;
	if (from > 0 && isBlank(lines[from - 1])) from--;
	else if (to + 1 < lines.length && isBlank(lines[to + 1])) to++;
	lines.splice(from, to - from + 1);
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
