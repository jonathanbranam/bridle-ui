import { expect, test } from "vitest";
import { addComment, markRead, parseDocument } from "./comments";

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
