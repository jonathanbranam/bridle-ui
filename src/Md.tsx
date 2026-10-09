import {
	createContext,
	Fragment,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveLinks } from "./api/client";
import {
	documentHref,
	findLinks,
	isSpecId,
	isTaskId,
	specHref,
	targetsIn,
	taskHref,
} from "./doc/links";

type Resolved = { project: string; paths: Map<string, string | null> };
const Links = createContext<Resolved>({ project: "", paths: new Map() });

/** Resolves every link target in `texts` against `project` once; Md inside links what resolved. */
export function LinkScope({
	project,
	texts,
	children,
}: {
	project: string;
	texts: string[];
	children: ReactNode;
}) {
	const [paths, setPaths] = useState(new Map<string, string | null>());
	const key = `${project}\n${targetsIn(texts).join("\n")}`;
	// biome-ignore lint/correctness/useExhaustiveDependencies: key is the targets and project
	useEffect(() => {
		const targets = targetsIn(texts);
		if (!project || targets.length === 0) return;
		let stale = false;
		resolveLinks(project, targets).then((r) => {
			if (stale || !r.ok) return;
			setPaths(new Map(r.value.links.map((l) => [l.target, l.path])));
		});
		return () => {
			stale = true;
		};
	}, [key]);
	const value = useMemo(() => ({ project, paths }), [project, paths]);
	return <Links.Provider value={value}>{children}</Links.Provider>;
}

// A text node becomes text and links; the gateway's answer decides which candidates are links.
// Not applied inside links or code, which are not text nodes of the paragraph.
type Node = { type: string; value?: string; url?: string; children?: Node[] };
function linkify() {
	const walk = (node: Node) => {
		if (!node.children) return;
		node.children = node.children.flatMap((c) => {
			if (c.type === "text" && c.value) {
				return findLinks(c.value).map((p): Node => {
					if ("text" in p) return { type: "text", value: p.text };
					return {
						type: "link",
						url: `bridle:${encodeURIComponent(p.target)}`,
						children: [{ type: "text", value: p.label }],
					};
				});
			}
			if (c.type !== "link" && c.type !== "inlineCode") walk(c);
			return [c];
		});
	};
	return walk;
}

function Anchor({ href, children }: { href?: string; children?: ReactNode }) {
	const { project, paths } = useContext(Links);
	if (href?.startsWith("bridle:")) {
		const target = decodeURIComponent(href.slice(7));
		// Task IDs always link: the task page says so itself if there is no such task.
		if (isTaskId(target))
			return (
				<a className="text-blue-700 underline" href={taskHref(project, target)}>
					{children}
				</a>
			);
		const path = paths.get(target);
		return path ? (
			<a
				className="text-blue-700 underline"
				href={
					isSpecId(target)
						? specHref(project, path)
						: documentHref(project, path)
				}
			>
				{children}
			</a>
		) : (
			(children ?? null)
		);
	}
	return (
		<a
			className="text-blue-700 underline"
			href={href}
			target="_blank"
			rel="noreferrer"
		>
			{children}
		</a>
	);
}

// Our own `bridle:` scheme must survive react-markdown's URL sanitising.
const urlTransform = (url: string) =>
	url.startsWith("bridle:") || /^(https?|mailto):/i.test(url) ? url : "";

// A comment's quote is rendered text, so it is marked in the rendered tree: a text node's part
// of the quote gets its own <mark> inside whatever element holds it (bold, a link, code), and
// the markup is never cut. Whitespace is collapsed on both sides, as the quote is.
type Hast = { type: string; value?: string; children?: Hast[] } & Record<
	string,
	unknown
>;
function rehypeMarkQuotes(quotes: string[]) {
	return (tree: Hast) => {
		const texts: Hast[] = [];
		const walk = (n: Hast) => {
			if (n.type === "text") texts.push(n);
			else for (const c of n.children ?? []) walk(c);
		};
		walk(tree);
		let flat = "";
		// For each text char: its index in `flat`.
		const index = texts.map((t) =>
			Array.from(t.value ?? "", (ch) => {
				const space = /\s/.test(ch);
				if (space && (flat === "" || flat.endsWith(" ")))
					return Math.max(flat.length - 1, 0);
				flat += space ? " " : ch;
				return flat.length - 1;
			}),
		);
		const hit = new Array<boolean>(flat.length).fill(false);
		for (const q of quotes) {
			const at = q === "" ? -1 : flat.indexOf(q);
			if (at < 0 || hit.slice(at, at + q.length).some(Boolean)) continue;
			hit.fill(true, at, at + q.length);
		}
		if (!hit.some(Boolean)) return;
		const replace = (n: Hast) => {
			if (!n.children) return;
			n.children = n.children.flatMap((c) => {
				const i = texts.indexOf(c);
				if (i < 0) {
					replace(c);
					return [c];
				}
				const value = c.value ?? "";
				const out: Hast[] = [];
				let from = 0;
				for (let k = 1; k <= value.length; k++) {
					if (k < value.length && hit[index[i][k]] === hit[index[i][from]])
						continue;
					const piece: Hast = { type: "text", value: value.slice(from, k) };
					out.push(
						hit[index[i][from]]
							? {
									type: "element",
									tagName: "mark",
									properties: { className: ["bg-amber-200"] },
									children: [piece],
								}
							: piece,
					);
					from = k;
				}
				return out;
			});
		};
		replace(tree);
	};
}

/**
 * Markdown with auto-linking. By default one block's text, inline (paragraphs are the caller's);
 * `block` renders it whole: paragraphs, quotes, lists, code. `quotes` are highlighted.
 */
export function Md({
	text,
	block = false,
	quotes = [],
}: {
	text: string;
	block?: boolean;
	quotes?: string[];
}) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm, linkify]}
			rehypePlugins={quotes.length ? [[rehypeMarkQuotes, quotes]] : []}
			urlTransform={urlTransform}
			components={{
				...(block
					? {
							p: ({ children }) => <p className="my-1">{children}</p>,
							blockquote: ({ children }) => (
								<blockquote className="my-1 border-l-4 border-gray-300 pl-3 text-gray-700">
									{children}
								</blockquote>
							),
							ul: ({ children }) => (
								<ul className="my-1 list-disc pl-6">{children}</ul>
							),
							ol: ({ children, start }) => (
								<ol start={start} className="my-1 list-decimal pl-6">
									{children}
								</ol>
							),
							pre: ({ children }) => (
								<pre className="my-1 overflow-x-auto rounded bg-gray-100 p-2 text-sm">
									{children}
								</pre>
							),
						}
					: { p: Fragment }),
				a: Anchor,
				table: ({ children }) => (
					<div className="my-2 overflow-x-auto">
						<table className="border-collapse text-sm">{children}</table>
					</div>
				),
				th: ({ children, style }) => (
					<th
						style={style}
						className="border border-gray-300 bg-gray-100 px-2 py-1 text-left font-semibold"
					>
						{children}
					</th>
				),
				td: ({ children, style }) => (
					<td style={style} className="border border-gray-300 px-2 py-1">
						{children}
					</td>
				),
			}}
		>
			{text}
		</ReactMarkdown>
	);
}
