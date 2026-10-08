import { useEffect, useState } from "react";
import {
	Navigate,
	useLocation,
	useParams,
	useSearchParams,
} from "react-router";
import { documentHref, specHref, taskHref, ticketHref } from "./doc/links";
import { findTask } from "./Tasks";

// Old URL forms stay valid forever (links in old agent messages and tickets); each lands on
// the canonical form from src/doc/links.ts. docs/design/url-scheme.md lists them.

/** `/tasks/:project/:id` */
export function OldTaskPath() {
	const { project = "", id = "" } = useParams();
	return <Navigate to={taskHref(project, id)} replace />;
}

/** `/task?id=X[&project=P]`: without a project, ask the gateway which one has the task. */
export function OldTaskQuery({ onLoggedOut }: { onLoggedOut: () => void }) {
	const [params] = useSearchParams();
	const id = params.get("id") ?? "";
	const project = params.get("project") ?? undefined;
	const [to, setTo] = useState<string | undefined>(
		project && id ? taskHref(project, id) : undefined,
	);
	const [error, setError] = useState<string>();
	useEffect(() => {
		if (to) return;
		if (!id) return setError("Missing task ID");
		findTask(id, undefined).then((r) => {
			if (r.ok) setTo(taskHref(r.value.project, r.value.id));
			else if (r.notLoggedIn) onLoggedOut();
			else setError(r.error);
		});
	}, [to, id, onLoggedOut]);
	if (error) return <p role="alert">{error}</p>;
	return to ? <Navigate to={to} replace /> : <p>Loading task...</p>;
}

/** `/ticket?project=P&id=X` */
export function OldTicket() {
	const [params] = useSearchParams();
	const project = params.get("project");
	const id = params.get("id");
	if (!project || !id) return <p role="alert">Missing project or ID</p>;
	return <Navigate to={ticketHref(project, id)} replace />;
}

/**
 * `/document?project=P&path=F` and `/specs?project=P&path=F#X` (or `&capability=C`). Without a
 * project and path these are the pickers, so `picker` renders instead.
 */
export function OldFile({
	kind,
	picker,
}: {
	kind: "document" | "specs";
	picker: React.ReactNode;
}) {
	const [params] = useSearchParams();
	const { hash } = useLocation();
	const project = params.get("project");
	const capability = params.get("capability");
	const path =
		params.get("path") ??
		(kind === "specs" && capability ? `design/specs/${capability}.md` : null);
	if (!project || !path) return <>{picker}</>;
	const to =
		kind === "document"
			? documentHref(project, path)
			: specHref(project, path) + (path.includes("#") ? "" : hash);
	return <Navigate to={to} replace />;
}
