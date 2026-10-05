// Where link syntax is recognised, in one place: the ticket and task ID forms are going to
// change (ticket j28f), so nothing else knows their shape.

const ID_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";
const WORD = "(?<![\\w-])";
const END = "(?![\\w-])";

const WIKI = "\\[\\[([^\\]|]+)(?:\\|([^\\]]+))?\\]\\]";
const DOC_PATH = `${WORD}docs/[\\w./-]*\\w`;
const TASK_ID = `${WORD}[a-z]{2,4}-[${ID_CHARS}]{4}${END}`;
const SPEC_ID = `${WORD}[rs]-[${ID_CHARS}]{4}${END}`;
const TICKET_ID = `${WORD}[${ID_CHARS}]{4}${END}`;
/** True for a target in the task ID form (`ui-umaq`); those open the task page. */
export const isTaskId = (target: string) =>
	new RegExp(`^${TASK_ID.slice(WORD.length)}$`).test(target);

/** The page a task ID opens; the ID alone finds the project. */
export const taskHref = (id: string) => `/task?${new URLSearchParams({ id })}`;

/** True for a requirement (`r-xxxx`) or scenario (`s-xxxx`) ID; the gateway resolves it to a spec file. */
export const isSpecId = (target: string) =>
	new RegExp(`^${SPEC_ID.slice(WORD.length)}$`).test(target);

/** The Specs page opening a spec file; `path` may end in `#<id>` to land on a heading. */
export const specHref = (project: string, path: string) => {
	const [file, id] = path.split("#");
	return `/specs?${new URLSearchParams({ project, path: file })}${id ? `#${id}` : ""}`;
};

const LINKABLE = new RegExp(
	`${WIKI}|(${DOC_PATH})|(${TASK_ID})|(${SPEC_ID})|(${TICKET_ID})`,
	"g",
);

export type Piece =
	| { text: string }
	/** `target` is what the gateway resolves; `label` is what shows. */
	| { target: string; label: string };

/** Splits plain text into text and link candidates. */
export function findLinks(text: string): Piece[] {
	const out: Piece[] = [];
	let pos = 0;
	for (const m of text.matchAll(LINKABLE)) {
		const at = m.index ?? 0;
		if (at > pos) out.push({ text: text.slice(pos, at) });
		const target = (m[1] ?? m[3] ?? m[4] ?? m[5] ?? m[6]).trim();
		out.push({ target, label: m[2]?.trim() || m[1]?.trim() || m[0] });
		pos = at + m[0].length;
	}
	if (pos < text.length) out.push({ text: text.slice(pos) });
	return out;
}

/** The link targets in texts, for one `links/resolve` batch. */
export function targetsIn(texts: string[]): string[] {
	const found = new Set<string>();
	for (const t of texts)
		for (const p of findLinks(t)) if ("target" in p) found.add(p.target);
	return [...found];
}

/** The page a resolved path opens. */
export const documentHref = (project: string, path: string) =>
	`/document?${new URLSearchParams({ project, path })}`;

export type FrontMatter = { rows: { key: string; value: string }[] };

/** Parses `key: value` lines and `- item` continuations; anything fancier shows as it is. */
export function parseFrontMatter(lines: string[]): FrontMatter {
	const rows: { key: string; value: string }[] = [];
	for (const l of lines) {
		const kv = l.match(/^([\w.-]+):\s*(.*)$/);
		if (kv) rows.push({ key: kv[1], value: kv[2].replace(/^\[(.*)\]$/, "$1") });
		else if (rows.length && l.trim() !== "") {
			const last = rows[rows.length - 1];
			const item = l.trim().replace(/^-\s+/, "");
			last.value = last.value ? `${last.value}, ${item}` : item;
		}
	}
	return { rows };
}
