import { useCallback, useState } from "react";

/** Plain HTTP has no navigator.clipboard, so fall back to a hidden textarea and execCommand. */
export async function copyText(text: string): Promise<boolean> {
	try {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch {
		// fall through to the textarea
	}
	const area = document.createElement("textarea");
	area.value = text;
	area.setAttribute("readonly", "");
	area.style.position = "fixed";
	area.style.opacity = "0";
	document.body.appendChild(area);
	area.select();
	area.setSelectionRange(0, text.length);
	try {
		return document.execCommand("copy");
	} catch {
		return false;
	} finally {
		document.body.removeChild(area);
	}
}

type Props = {
	id: string;
};

export function IdChip({ id }: Props) {
	const [showCopied, setShowCopied] = useState(false);
	const [failed, setFailed] = useState(false);

	const handleCopy = useCallback(async () => {
		const ok = await copyText(id);
		setFailed(!ok);
		setShowCopied(ok);
		setTimeout(() => {
			setShowCopied(false);
			setFailed(false);
		}, 2000);
	}, [id]);

	return (
		<div className="flex items-center gap-2">
			<code className="font-mono text-sm">{id}</code>
			<button
				type="button"
				aria-label={`Copy ${id}`}
				onClick={handleCopy}
				className="inline-flex items-center justify-center transition-colors hover:text-gray-800"
				title={showCopied ? "Copied!" : "Copy ID"}
			>
				{showCopied ? (
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="text-green-600"
						aria-label="Copied"
					>
						<title>Copied</title>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				) : (
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="text-gray-600"
						aria-label="Copy icon"
					>
						<title>Copy icon</title>
						<path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M16 3h6v6m-10 5l9-9" />
					</svg>
				)}
			</button>
			{failed && (
				<span role="alert" className="text-sm text-red-700">
					Copy failed: select the ID
				</span>
			)}
		</div>
	);
}
