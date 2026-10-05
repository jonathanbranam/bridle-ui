import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { projects as listProjects, readDocument } from "./api/client";
import type { Document } from "./api/generated/Document";
import { IdChip } from "./IdChip";
import { LinkScope, Md } from "./Md";

type Props = { onLoggedOut: () => void };

// `### Requirement: Title {#r-1234 protected}` -> the title and the ID, which the human quotes.
export function parseHeading(line: string) {
	const m = line.match(/^(#{1,6})\s+(.*?)\s*(?:\{#([^\s}]+)[^}]*\})?\s*$/);
	if (!m) return null;
	return { level: m[1].length, title: m[2], id: m[3] };
}

const sizes = [
	"",
	"text-2xl font-semibold",
	"text-xl font-semibold",
	"text-lg font-semibold",
	"font-semibold",
	"font-medium",
	"font-medium",
];

function SpecText({ text }: { text: string }) {
	return text.split("\n").map((line, i) => {
		const h = parseHeading(line);
		const key = `${i}`;
		if (h) {
			return (
				<div key={key} className="mt-4 flex items-center gap-3">
					<p className={sizes[h.level]}>{h.title}</p>
					{h.id && <IdChip id={h.id} />}
				</div>
			);
		}
		return line.trim() ? (
			<p key={key}>
				<Md text={line} />
			</p>
		) : null;
	});
}

// Specs live in design/specs/<capability>.md; until the gateway lists them, the human names the
// capability and the existing document route reads it.
export function SpecsView({ onLoggedOut }: Props) {
	const [params, setParams] = useSearchParams();
	const qProject = params.get("project");
	const qCap = params.get("capability");
	const [project, setProject] = useState(qProject || "");
	const [capability, setCapability] = useState(qCap || "");
	const [known, setKnown] = useState<string[]>([]);
	const [doc, setDoc] = useState<Document>();
	const [error, setError] = useState<string>();

	const fail = useCallback(
		(r: { notLoggedIn: boolean; error: string }) => {
			if (r.notLoggedIn) onLoggedOut();
			else setError(r.error);
		},
		[onLoggedOut],
	);

	useEffect(() => {
		listProjects().then((r) => {
			if (!r.ok) return fail(r);
			const names = r.value.projects.map((p) => p.project);
			setKnown(names);
			setProject((cur) => cur || names[0] || "");
		});
	}, [fail]);

	useEffect(() => {
		if (!qProject || !qCap) return;
		let stale = false;
		readDocument(qProject, `design/specs/${qCap}.md`).then((r) => {
			if (stale) return;
			if (r.ok) {
				setDoc(r.value);
				setError(undefined);
			} else {
				setDoc(undefined);
				fail(r);
			}
		});
		return () => {
			stale = true;
		};
	}, [qProject, qCap, fail]);

	return (
		<section className="space-y-3">
			<form
				className="flex flex-wrap items-center gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					const name = capability.trim().replace(/\.md$/, "");
					if (project && name) setParams({ project, capability: name });
				}}
			>
				<select
					aria-label="Project"
					className="rounded border p-1"
					value={project}
					onChange={(e) => setProject(e.target.value)}
				>
					{known.map((p) => (
						<option key={p} value={p}>
							{p}
						</option>
					))}
				</select>
				<input
					aria-label="Spec"
					placeholder="capability, e.g. document"
					className="min-w-0 flex-1 rounded border p-1"
					value={capability}
					onChange={(e) => setCapability(e.target.value)}
				/>
				<button type="submit" className="rounded border px-3 py-1">
					Open
				</button>
			</form>
			{error && <p role="alert">{error}</p>}
			{doc && (
				<article className="space-y-1">
					<IdChip id={doc.path} />
					<LinkScope project={doc.project} texts={[doc.content]}>
						<SpecText text={doc.content} />
					</LinkScope>
				</article>
			)}
		</section>
	);
}
