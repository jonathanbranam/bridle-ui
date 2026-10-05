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
	isTaskId,
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
				<a className="text-blue-700 underline" href={taskHref(target)}>
					{children}
				</a>
			);
		const path = paths.get(target);
		return path ? (
			<a className="text-blue-700 underline" href={documentHref(project, path)}>
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

/** Inline markdown (one block's text) with auto-linking; paragraphs are the caller's. */
export function Md({ text }: { text: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm, linkify]}
			urlTransform={urlTransform}
			components={{ p: Fragment, a: Anchor }}
		>
			{text}
		</ReactMarkdown>
	);
}
