import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { AutoTextarea } from "./AutoTextarea";

function Box() {
	const [v, setV] = useState("");
	return (
		<AutoTextarea
			aria-label="box"
			value={v}
			onChange={(e) => setV(e.target.value)}
		/>
	);
}

describe("AutoTextarea", () => {
	it("starts at 2 rows with the auto-grow class", () => {
		render(<Box />);
		const el = screen.getByLabelText("box") as HTMLTextAreaElement;
		expect(el.rows).toBe(2);
		expect(el.className).toContain("auto-grow");
	});

	it("sets height from scrollHeight when field-sizing is unsupported", () => {
		render(<Box />);
		const el = screen.getByLabelText("box") as HTMLTextAreaElement;
		Object.defineProperty(el, "scrollHeight", {
			configurable: true,
			value: 120,
		});
		fireEvent.change(el, { target: { value: "a\nb\nc" } });
		expect(el.style.height).toBe("120px");
	});
});
