import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { IdChip } from "./IdChip";

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

test("renders the ID as text", () => {
	render(<IdChip id="task-123" />);
	expect(screen.getByText("task-123")).toBeInTheDocument();
});

test("renders an aria-labeled copy button", () => {
	render(<IdChip id="my-id" />);
	const button = screen.getByRole("button", { name: "Copy my-id" });
	expect(button).toBeInTheDocument();
	expect(button).toHaveClass("inline-flex");
});

test("shows Copied message when copy button is clicked", async () => {
	const user = userEvent.setup();
	const writeText = vi.spyOn(navigator.clipboard, "writeText");
	render(<IdChip id="test-id-456" />);
	const button = screen.getByRole("button", { name: "Copy test-id-456" });
	await user.click(button);
	expect(writeText).toHaveBeenCalledWith("test-id-456");
});

test("shows checkmark briefly when copy button is clicked", async () => {
	const user = userEvent.setup();
	render(<IdChip id="copied-test" />);
	const button = screen.getByRole("button", { name: "Copy copied-test" });
	const svgs = button.querySelectorAll("svg");
	expect(svgs.length).toBe(1); // Copy icon initially
	await user.click(button);
	// After click, verify the title changes to "Copied!"
	expect(button).toHaveAttribute("title", "Copied!");
	await vi.waitFor(
		() => {
			expect(button).toHaveAttribute("title", "Copy ID");
		},
		{ timeout: 3000 },
	);
});

test("without navigator.clipboard (plain HTTP) it falls back to execCommand", async () => {
	const user = userEvent.setup(); // installs its own clipboard, so stub after it
	vi.stubGlobal("navigator", {});
	const exec = vi.fn(() => true);
	document.execCommand = exec;
	render(<IdChip id="http-id" />);
	const button = screen.getByRole("button", { name: "Copy http-id" });
	await user.click(button);
	expect(exec).toHaveBeenCalledWith("copy");
	expect(button).toHaveAttribute("title", "Copied!");
});

test("when copying fails, a visible message says so", async () => {
	const user = userEvent.setup(); // installs its own clipboard, so stub after it
	vi.stubGlobal("navigator", {});
	document.execCommand = vi.fn(() => false);
	render(<IdChip id="fail-id" />);
	await user.click(screen.getByRole("button", { name: "Copy fail-id" }));
	expect(screen.getByRole("alert")).toHaveTextContent("Copy failed");
});

test("ID remains selectable and not in a button", () => {
	render(<IdChip id="selectable-id" />);
	const idText = screen.getByText("selectable-id");
	expect(idText.tagName).toBe("CODE");
	expect(idText).not.toHaveClass("user-select-none");
});
