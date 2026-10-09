import { expect, test } from "vitest";
import {
	addComment,
	addReply,
	deleteThread,
	easternStamp,
	markRead,
	parseDocument,
	resolveOpen,
	resolveThread,
} from "./comments";

const doc = `# Title

Some text with **bold**.

> [!comment] c2 human, 2026-10-02 14:05 EDT, on "Some text" [sent 2026-10-02 14:06 EDT]
> Why?
>
> **doc-3haz, 2026-10-02 14:06 EDT:** Rewrote it.

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
		["item", "- one\n  continued"],
		["item", "- two"],
		["code", "> [!comment] not a comment"],
	]);
	const t = blocks[1].threads[0];
	expect(t).toMatchObject({
		id: "c2",
		who: "human",
		when: "2026-10-02 14:05 EDT",
		quote: "Some text",
		mark: { state: "sent", stamp: "2026-10-02 14:06 EDT" },
		unread: true,
		resolved: false,
		start: 4,
		end: 7,
	});
	expect(t.body[2].text).toBe(
		"**doc-3haz, 2026-10-02 14:06 EDT:** Rewrote it.",
	);
	expect(blocks[1].last).toBe(7);
	expect(blocks[0].threads).toEqual([]);
});

test("addComment writes a numbered, pending header after the line", () => {
	const out = addComment(
		'a\n\n> [!comment] c4 human, w, on "a"\n> x\n\nb',
		0,
		"human",
		"2026-10-03 09:00 EDT",
		"x  y",
		"hi\n\nthere",
	);
	expect(out).toContain(
		'a\n\n> [!comment] c5 human, 2026-10-03 09:00 EDT, on "x y" [pending 2026-10-03 09:00 EDT]\n> hi\n>\n> there\n\n> [!comment] c4',
	);
	const t = parseDocument(out)[0].threads[0];
	expect(t).toMatchObject({
		id: "c5",
		quote: "x y",
		who: "human",
		mark: { state: "pending" },
	});
});

test("addComment after the last line adds no trailing blank, first thread is c1", () => {
	expect(addComment("a", 0, "human", "w", "q", "c")).toBe(
		'a\n\n> [!comment] c1 human, w, on "q" [pending w]\n> c',
	);
});

test("addReply appends a pending human entry", () => {
	const t = parseDocument(doc)[1].threads[0];
	const out = addReply(doc, t, "human", "2026-10-02 15:00 EDT", "thanks\nmore");
	expect(out).toContain(
		"> **doc-3haz, 2026-10-02 14:06 EDT:** Rewrote it.\n>\n> **human, 2026-10-02 15:00 EDT:** thanks [pending 2026-10-02 15:00 EDT]\n> more\n",
	);
	const body = parseDocument(out)[1].threads[0].body;
	expect(body[4]).toEqual({
		text: "**human, 2026-10-02 15:00 EDT:** thanks",
		mark: { state: "pending", stamp: "2026-10-02 15:00 EDT" },
	});
});

test("markRead marks unmarked agent entries read, in that thread only", () => {
	const t = parseDocument(doc)[1].threads[0];
	const out = markRead(doc, t, "2026-10-02 15:00 EDT");
	expect(out).toContain("Rewrote it. [read 2026-10-02 15:00 EDT]");
	expect(out).not.toContain("Why? [read");
	const again = parseDocument(out)[1].threads[0];
	expect(again.unread).toBe(false);
	expect(markRead(out, again, "later")).toBe(out);
});

test("human and human via <agent> entries are not unread; other names are agents", () => {
	const d = [
		'> [!comment] c1 human, w, on "q"',
		"> **human via doc-3haz, w:** thanks",
		"> **Human, w:** hi",
		"> **advisor, w:** hi",
	].join("\n");
	const [t] = parseDocument(d)[0].threads;
	expect(t.unread).toBe(true);
	const out = markRead(d, t, "s");
	expect(out.split("\n").filter((l) => l.endsWith("[read s]"))).toEqual([
		"> **advisor, w:** hi [read s]",
	]);
});

test("the old middle-dot sent mark is read as sent and kept out of the quote", () => {
	const t = parseDocument(
		'Para.\n\n> [!comment] human, 2026-10-02 14:05, on "Para" \u00b7 sent 2026-10-04 21:14\n> Why?\n',
	)[0].threads[0];
	expect(t.quote).toBe("Para");
	expect(t.id).toBe("");
	expect(t.mark).toEqual({ state: "sent", stamp: "2026-10-04 21:14" });
});

test("a thread with a resolved by line is resolved, never unread", () => {
	const d =
		'> [!comment] c1 human, w, on "q"\n> **a, w:** hi\n>\n> **resolved by human via a, 2026-10-04 11:17 EDT**';
	const t = parseDocument(d)[0].threads[0];
	expect(t).toMatchObject({ resolved: true, unread: false });
});

test("resolveThread appends the closing lines like bridle review resolve", () => {
	const t = parseDocument(doc)[1].threads[0];
	const out = resolveThread(doc, t, "human", "2026-10-04 11:17 EDT");
	expect(out).toContain(
		"Rewrote it.\n>\n> **resolved by human, 2026-10-04 11:17 EDT**\n\n- one",
	);
	expect(parseDocument(out)[1].threads[0].resolved).toBe(true);
});

test("easternStamp is ASCII Eastern with the zone", () => {
	expect(easternStamp(new Date("2026-10-04T15:00:00Z"))).toBe(
		"2026-10-04 11:00 EDT",
	);
	expect(easternStamp(new Date("2026-12-04T05:30:00Z"))).toBe(
		"2026-12-04 00:30 EST",
	);
});

test("a quote and a nested numbered list are whole blocks that keep their markdown", () => {
	const blocks = parseDocument(
		"> Why:\n>\n> 1. a\n>    wrapped\n> 2. b\n\n3. c\n   - nested\n\n   para\n4. d\n",
	);
	expect(blocks.map((b) => [b.kind, b.start, b.end])).toEqual([
		["quote", 0, 4],
		["item", 6, 9],
		["item", 10, 10],
	]);
	expect(blocks[1].text).toBe("3. c\n   - nested\n\n   para");
});

test("a comment after a list item or quote anchors to that block's last line", () => {
	const blocks = parseDocument(
		'> q\n\n> [!comment] c1 human, 2026-10-02 14:05 EDT, on "q"\n> hi\n\n- a\n  - b\n',
	);
	expect(blocks.map((b) => [b.kind, b.last, b.threads.length])).toEqual([
		["quote", 3, 1],
		["item", 6, 0],
	]);
});

test("resolveOpen opens a path as typed and resolves a bare ID to the best match", () => {
	expect(resolveOpen(" docs/a.md ", [])).toBe("docs/a.md");
	expect(
		resolveOpen("x8jt", ["docs/tickets/open/t-x8jt.md", "docs/z.md"]),
	).toBe("docs/tickets/open/t-x8jt.md");
	expect(resolveOpen("x8jt", [])).toBeUndefined();
	expect(resolveOpen("  ", ["a"])).toBeUndefined();
});

test("a run of | lines is one table block, and paragraph lines keep their newlines", () => {
	const blocks = parseDocument(
		"intro\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n> q1\n> q2\n",
	);
	expect(blocks.map((b) => b.kind)).toEqual(["para", "table", "quote"]);
	expect(blocks[1].text).toBe("| a | b |\n|---|---|\n| 1 | 2 |");
	expect([blocks[1].start, blocks[1].end]).toEqual([2, 4]);
	expect(blocks[2].text).toBe("> q1\n> q2");
});

test("deleteThread removes a resolved thread, keeps the text and other threads, refuses open ones", () => {
	const d = `# T

Hello world.

> [!comment] c1 human, w, on "Hello"
> Old.
>
> **resolved by human, 2026-10-04 11:17 EDT**

More text.

> [!comment] c2 human, w, on "More"
> Open.
`;
	const out = deleteThread(d, "c1");
	expect(out).toBe(`# T

Hello world.

More text.

> [!comment] c2 human, w, on "More"
> Open.
`);
	expect(deleteThread(d, "c2")).toBe(d);
	expect(deleteThread(d, "c9")).toBe(d);
	expect(deleteThread(d, "")).toBe(d);
});
