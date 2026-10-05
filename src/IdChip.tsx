import { useCallback, useState } from "react";

type Props = {
	id: string;
};

export function IdChip({ id }: Props) {
	const [showCopied, setShowCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(id);
			setShowCopied(true);
			setTimeout(() => setShowCopied(false), 2000);
		} catch {
			// Silently ignore clipboard errors; the ID is still selectable
		}
	}, [id]);

	return (
		<div className="flex items-center gap-1">
			<code className="font-mono text-sm">{id}</code>
			<button
				type="button"
				aria-label={`Copy ${id}`}
				onClick={handleCopy}
				className="flex items-center justify-center w-11 h-11 rounded border hover:bg-gray-100 active:bg-gray-200 transition-colors"
				title={showCopied ? "Copied!" : "Copy ID"}
			>
				{showCopied ? (
					<span className="text-xs font-medium text-green-600">Copied</span>
				) : (
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="text-gray-600"
						aria-label="Copy icon"
					>
						<path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M16 3h6v6m-10 5l9-9" />
					</svg>
				)}
			</button>
		</div>
	);
}
