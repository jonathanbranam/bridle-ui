import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { resolveLinks } from "./api/client";
import { DocumentView } from "./Document";

type Props = { onLoggedOut: () => void };

export function TicketView({ onLoggedOut }: Props) {
	const { project: qProject, id: qId } = useParams();
	const [resolvedPath, setResolvedPath] = useState<string | null | undefined>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		if (!qProject || !qId) {
			setError("Missing project or ID");
			return;
		}

		let stale = false;
		resolveLinks(qProject, [qId]).then((r) => {
			if (stale) return;
			if (r.ok) {
				const link = r.value.links.find((l) => l.target === qId);
				if (link?.path) {
					setResolvedPath(link.path);
					setError(undefined);
				} else {
					setResolvedPath(null);
					setError(`No ticket ${qId} in ${qProject}`);
				}
			} else if (r.notLoggedIn) {
				onLoggedOut();
			} else {
				setResolvedPath(null);
				setError(r.error);
			}
		});

		return () => {
			stale = true;
		};
	}, [qProject, qId, onLoggedOut]);

	if (!qProject || !qId) {
		return <p role="alert">{error || "Missing project or ID"}</p>;
	}

	if (resolvedPath === undefined) {
		return <p>Loading ticket...</p>;
	}

	if (resolvedPath === null) {
		return <p role="alert">{error || `No ticket ${qId} in ${qProject}`}</p>;
	}

	return (
		<DocumentView
			onLoggedOut={onLoggedOut}
			initialProject={qProject}
			initialPath={resolvedPath}
		/>
	);
}
