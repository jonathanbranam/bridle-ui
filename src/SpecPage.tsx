import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
	projects as listProjects,
	projectSpecs,
	readDocument,
} from "./api/client";
import type { Document } from "./api/generated/Document";
import type { SpecFile } from "./api/generated/SpecFile";
import { projectHref, specHref } from "./doc/links";
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
				<div
					key={key}
					id={h.id}
					className="mt-4 flex scroll-mt-4 items-center gap-3"
				>
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

// The index lists the project's spec files from the gateway; a file opens at `?path=`, and a
// `#<id>` on the URL scrolls to that requirement or scenario.
export function SpecsView({ onLoggedOut }: Props) {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const qProject = useParams().project ?? params.get("project");
	// `capability` is the older way to name a file; it still opens.
	const qPath =
		params.get("path") ??
		(params.get("capability")
			? `design/specs/${params.get("capability")}.md`
			: null);
	const [project, setProject] = useState(qProject || "");
	const [known, setKnown] = useState<string[]>([]);
	const [files, setFiles] = useState<SpecFile[]>();
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
		if (!project || qPath) return;
		let stale = false;
		setFiles(undefined);
		projectSpecs(project).then((r) => {
			if (stale) return;
			if (r.ok) {
				setFiles(r.value.specs);
				setError(undefined);
			} else fail(r);
		});
		return () => {
			stale = true;
		};
	}, [project, qPath, fail]);

	useEffect(() => {
		if (!qProject || !qPath) {
			setDoc(undefined);
			return;
		}
		let stale = false;
		readDocument(qProject, qPath).then((r) => {
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
	}, [qProject, qPath, fail]);

	useEffect(() => {
		const id = window.location.hash.slice(1);
		if (doc && id) document.getElementById(id)?.scrollIntoView?.();
	}, [doc]);

	return (
		<section className="space-y-3">
			<div className="flex flex-wrap items-center gap-2">
				<select
					aria-label="Project"
					className="rounded border p-1"
					value={project}
					onChange={(e) => {
						setProject(e.target.value);
						navigate(`${projectHref(e.target.value)}/specs`);
					}}
				>
					{known.map((p) => (
						<option key={p} value={p}>
							{p}
						</option>
					))}
				</select>
				{qPath && (
					<button
						type="button"
						className="rounded border px-3 py-1"
						onClick={() => navigate(`${projectHref(project)}/specs`)}
					>
						All specs
					</button>
				)}
			</div>
			{error && <p role="alert">{error}</p>}
			{!qPath && files?.length === 0 && <p>No specs in {project}.</p>}
			{!qPath && files && files.length > 0 && (
				<ul className="space-y-2">
					{files.map((f) => (
						<li key={f.path}>
							<a
								className="text-blue-700 underline"
								href={specHref(project, f.path)}
							>
								{f.title || f.capability}
							</a>{" "}
							<span className="text-sm text-gray-600">
								{f.capability}, {f.requirements.length} requirements
							</span>
							{f.diagnostics.map((d) => (
								<p
									key={`${d.line}:${d.column}`}
									className="text-sm text-red-700"
								>
									line {d.line}: {d.message}
								</p>
							))}
						</li>
					))}
				</ul>
			)}
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
