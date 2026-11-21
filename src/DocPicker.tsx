import { useId, useRef, useState } from "react";

type Props = {
	value: string;
	onChange: (value: string) => void;
	matches: string[];
	/** A result was chosen: open it at once. */
	onPick: (path: string) => void;
	/** Enter with no result highlighted, or a paste: a typed path or ticket ID. */
	onSubmit: (value: string) => void;
};

const split = (p: string) => {
	const i = p.lastIndexOf("/");
	return { name: p.slice(i + 1), dir: i < 0 ? "/" : p.slice(0, i) };
};

// Omnibox: an always-visible field with its results in a scrolling list right under it
// (WAI-ARIA combobox with a listbox popup, focus stays in the field).
export function DocPicker({
	value,
	onChange,
	matches,
	onPick,
	onSubmit,
}: Props) {
	const id = useId();
	const listId = `${id}-list`;
	const inputRef = useRef<HTMLInputElement>(null);
	const [focused, setFocused] = useState(false);
	// Closed by Escape or a pick until the next keystroke or focus.
	const [dismissed, setDismissed] = useState(false);
	const [active, setActive] = useState(-1);
	const shown = focused && !dismissed && matches.length > 0;
	const optionId = (i: number) => `${id}-opt-${i}`;

	const pick = (path: string) => {
		setDismissed(true);
		setActive(-1);
		onPick(path);
		inputRef.current?.blur();
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			if (!matches.length) return;
			const n = matches.length;
			const down = e.key === "ArrowDown";
			setDismissed(false);
			setActive((a) => (down ? (a + 1) % n : a <= 0 ? n - 1 : a - 1));
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (shown && active >= 0) pick(matches[active]);
			else onSubmit(value);
		} else if (e.key === "Escape") {
			// First Escape closes the list, the next clears the field.
			if (shown) setDismissed(true);
			else onChange("");
			setActive(-1);
		}
	};

	return (
		<div className="relative flex items-center gap-1">
			<input
				ref={inputRef}
				id={`${id}-input`}
				role="combobox"
				aria-label="Document"
				aria-expanded={shown}
				aria-controls={listId}
				aria-autocomplete="list"
				aria-activedescendant={
					shown && active >= 0 ? optionId(active) : undefined
				}
				autoComplete="off"
				className="w-full rounded border px-2 py-2 text-base"
				placeholder="Search tickets and docs, or paste a ticket ID"
				value={value}
				onChange={(e) => {
					onChange(e.target.value);
					setDismissed(false);
					setActive(-1);
				}}
				onFocus={() => {
					setFocused(true);
					setDismissed(false);
				}}
				onBlur={() => setFocused(false)}
				onKeyDown={onKeyDown}
				onPaste={(e) => {
					// A pasted ID or path opens at once.
					const text = e.clipboardData.getData("text").trim();
					if (text && /^[^\s]+$/.test(text)) {
						e.preventDefault();
						onChange(text);
						onSubmit(text);
					}
				}}
			/>
			<button
				type="button"
				aria-label="Clear search"
				disabled={!value}
				onClick={() => {
					onChange("");
					inputRef.current?.focus();
				}}
				className="shrink-0 w-11 h-11 flex items-center justify-center rounded border text-red-600 hover:text-red-700 disabled:opacity-40 disabled:hover:text-red-600"
			>
				✕
			</button>
			{/* Always rendered so aria-controls resolves; hidden when closed. */}
			<div
				id={listId}
				role="listbox"
				aria-label="Matching documents"
				hidden={!shown}
				// Keep focus in the field when a row is pressed.
				onMouseDown={(e) => e.preventDefault()}
				className="absolute left-0 right-12 top-full z-20 mt-1 max-h-[60vh] overflow-y-auto rounded border bg-white shadow"
			>
				{matches.map((m, i) => {
					const { name, dir } = split(m);
					return (
						// biome-ignore lint/a11y/useKeyWithClickEvents: keys are handled on the combobox input (focus stays there)
						<div
							key={m}
							id={optionId(i)}
							role="option"
							aria-selected={i === active}
							tabIndex={-1}
							onClick={() => pick(m)}
							className={`flex min-h-12 cursor-pointer flex-col justify-center border-b px-3 py-1 last:border-b-0 ${i === active ? "bg-blue-100" : "hover:bg-gray-100"}`}
						>
							<span className="break-all font-bold">{name}</span>
							<bdi className="break-all text-sm text-gray-500">{dir}</bdi>
						</div>
					);
				})}
			</div>
		</div>
	);
}
