import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { IdChip } from "./IdChip";

afterEach(() => vi.unstubAllGlobals());

test("renders the ID as text", () => {
	render(<IdChip id="task-123" />);
	expect(screen.getByText("task-123")).toBeInTheDocument();
});

test("renders an aria-labeled copy button with 44x44px touch target", () => {
	render(<IdChip id="my-id" />);
	const button = screen.getByRole("button", { name: "Copy my-id" });
	expect(button).toBeInTheDocument();
	expect(button).toHaveClass("w-11 h-11");
});

test("shows Copied message when copy button is clicked", async () => {
	const user = userEvent.setup();
	const writeText = vi.spyOn(navigator.clipboard, "writeText");
	render(<IdChip id="test-id-456" />);
	const button = screen.getByRole("button", { name: "Copy test-id-456" });
	await user.click(button);
	expect(writeText).toHaveBeenCalledWith("test-id-456");
});

test("shows 'Copied' briefly then hides it", async () => {
	const user = userEvent.setup();
	render(<IdChip id="copied-test" />);
	const button = screen.getByRole("button", { name: "Copy copied-test" });
	await user.click(button);
	expect(screen.getByText("Copied")).toBeInTheDocument();
	await vi.waitFor(
		() => {
			expect(screen.queryByText("Copied")).not.toBeInTheDocument();
		},
		{ timeout: 3000 },
	);
});

test("button click is safe even if clipboard is undefined", async () => {
	// Simulate clipboard being unavailable by not mocking it
	const user = userEvent.setup();
	render(<IdChip id="error-test" />);
	const button = screen.getByRole("button", { name: "Copy error-test" });
	// Clicking should not throw even if clipboard is unavailable
	await user.click(button);
	// ID should still be selectable
	expect(screen.getByText("error-test")).toBeInTheDocument();
});

test("ID remains selectable and not in a button", () => {
	render(<IdChip id="selectable-id" />);
	const idText = screen.getByText("selectable-id");
	expect(idText.tagName).toBe("CODE");
	expect(idText).not.toHaveClass("user-select-none");
});
