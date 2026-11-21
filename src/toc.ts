/** A ticket longer than this many lines of document gets a table of contents. */
export const TOC_MIN_LINES = 150;

export type TocEntry = { level: number; text: string; slug: string };

export const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

/** The document without its `---` frontmatter block. */
export function stripFrontmatter(text: string) {
	const m = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
	return m ? text.slice(m[0].length) : text;
}

/** Headings (`#` to `###`) outside code fences. */
export function headings(md: string): TocEntry[] {
	const out: TocEntry[] = [];
	let fence = false;
	for (const line of md.split("\n")) {
		if (/^\s*(```|~~~)/.test(line)) fence = !fence;
		if (fence) continue;
		const m = line.match(/^(#{1,3})\s+(.+?)\s*#*\s*$/);
		if (m) out.push({ level: m[1].length, text: m[2], slug: slugify(m[2]) });
	}
	return out;
}
