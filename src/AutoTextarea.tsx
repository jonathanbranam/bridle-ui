import { type ComponentProps, useLayoutEffect, useRef } from "react";

// Starts at 2 lines, grows with its text to 10 lines, then scrolls inside.
// CSS `field-sizing: content` does it where supported (index.css); elsewhere
// the height follows scrollHeight. Every <textarea> in the app uses this.
const supportsFieldSizing = () =>
	typeof CSS !== "undefined" &&
	typeof CSS.supports === "function" &&
	CSS.supports("field-sizing", "content");

export function AutoTextarea({
	className = "",
	value,
	...rest
}: ComponentProps<"textarea">) {
	const ref = useRef<HTMLTextAreaElement>(null);
	// biome-ignore lint/correctness/useExhaustiveDependencies: resize whenever the text changes
	useLayoutEffect(() => {
		const el = ref.current;
		if (!el || supportsFieldSizing()) return;
		el.style.height = "auto";
		el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`;
	}, [value]);
	return (
		<textarea
			ref={ref}
			rows={2}
			value={value}
			className={`auto-grow ${className}`}
			{...rest}
		/>
	);
}
