import { expect, test } from "vitest";
import {
	addComment,
	markQuotes,
	markRead,
	parseDocument,
	resolveOpen,
} from "./comments";

const doc = `# Title

Some text with **bold**.

> [!comment] human, 2026-10-02 14:05, on "Some text"
> Why?
>
> **docs agent, 14:06:** @human Rewrote it.

- one
  continued
- two

\`\`\`
> [!comment] not a comment
\`\`\`
`;

test("parses blocks and attaches threads to the block they follow", () => {
	const blocks = parseDocument(doc);
	expect(blocks.map((b) => [b.kind, b.text])).toEqual([
		["heading", "Title"],
		["para", "Some text with **bold**."],
		["item", "one continued"],
		["item", "two"],
		["code", "> [!comment] not a comment"],
	]);
	const t = blocks[1].threads[0];
	expect(t).toMatchObject({
		who: "human",
		when: "2026-10-02 14:05",
		quote: "Some text",
		unread: true,
		start: 4,
		end: 7,
	});
	expect(blocks[1].last).toBe(7);
	expect(blocks[0].threads).toEqual([]);
});

test("addComment writes the approved format after the line", () => {
	const out = addComment(
		"a\nb",
		0,
		"human",
		"2026-10-03 09:00",
		"x  y",
		"hi\n\nthere",
	);
	expect(out).toBe(
		'a\n\n> [!comment] human, 2026-10-03 09:00, on "x y"\n> hi\n>\n> there\n\nb',
	);
	const again = parseDocument(out);
	expect(again[0].threads[0]).toMatchObject({ quote: "x y", who: "human" });
	expect(again[1].text).toBe("b");
});

test("addComment after the last line adds no trailing blank", () => {
	expect(addComment("a", 0, "human", "w", "q", "c")).toBe(
		'a\n\n> [!comment] human, w, on "q"\n> c',
	);
});

test("markRead appends (read) to unread tags only, in that thread", () => {
	const t = parseDocument(doc)[1].threads[0];
	const out = markRead(doc, t);
	expect(out).toContain("**docs agent, 14:06:** @human (read) Rewrote it.");
	expect(parseDocument(out)[1].threads[0].unread).toBe(false);
	expect(markRead(out, parseDocument(out)[1].threads[0])).toBe(out);
});

test("a tag to someone else, or mid-sentence, is not unread", () => {
	const d =
		'> [!comment] human, w, on "q"\n> **a, 1:** @docs-agent hi\n> tell @human later';
	expect(parseDocument(d)[0].threads[0].unread).toBe(false);
});

test("a sent mark on the header is not part of the quote; on a reply it leaves (read) alone", () => {
	const t = parseDocument(`Para.

> [!comment] human, 2026-10-02 14:05, on "Para" · sent 2026-10-04 21:14
> Why?
>
> **docs agent, 14:06:** @human Done.
> **human, 14:07:** Thanks. · sent 2026-10-04 21:15
`)[0].threads[0];
	expect(t.quote).toBe("Para");
	expect(t.when).toBe("2026-10-02 14:05");
	expect(t.sent).toBe("2026-10-04 21:14");
	expect(t.unread).toBe(true);
	const read = markRead(
		'> [!comment] human, 2026-10-02 14:05, on "Para" · sent 2026-10-04 21:14\n> **a:** @human Done. · sent 2026-10-04 21:15\n',
		{ ...t, start: 0, end: 1 },
	);
	expect(read).toContain("@human (read) Done. · sent 2026-10-04 21:15");
	expect(parseDocument(read)[0].threads[0].unread).toBe(false);
});

test("markQuotes marks the quote and keeps the rest", () => {
	expect(markQuotes("a big dog ran", ["big dog"])).toEqual([
		{ text: "a ", mark: false },
		{ text: "big dog", mark: true },
		{ text: " ran", mark: false },
	]);
});

test("markQuotes ignores absent quotes and overlaps", () => {
	expect(markQuotes("abc", ["zzz"])).toEqual([{ text: "abc", mark: false }]);
	expect(markQuotes("abcd", ["abc", "bcd"]).filter((s) => s.mark)).toHaveLength(
		1,
	);
});

test("resolveOpen opens a path as typed and resolves a bare ID to the best match", () => {
	expect(resolveOpen(" docs/a.md ", [])).toBe("docs/a.md");
	expect(
		resolveOpen("x8jt", ["docs/tickets/open/t-x8jt.md", "docs/z.md"]),
	).toBe("docs/tickets/open/t-x8jt.md");
	expect(resolveOpen("x8jt", [])).toBeUndefined();
	expect(resolveOpen("  ", ["a"])).toBeUndefined();
});
