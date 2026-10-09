import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Login } from "./Login";

test("username input has password manager attributes", () => {
	render(<Login onLogin={() => {}} />);
	const usernameInput = screen.getByLabelText("Username") as HTMLInputElement;
	expect(usernameInput.id).toBe("username");
	expect(usernameInput.name).toBe("username");
	expect(usernameInput.type).toBe("text");
	expect(usernameInput.autocomplete).toBe("username");
	expect(usernameInput.required).toBe(true);
});

test("username input does not capitalize, autocorrect or spellcheck", () => {
	render(<Login onLogin={() => {}} />);
	const usernameInput = screen.getByLabelText("Username") as HTMLInputElement;
	expect(usernameInput.getAttribute("autocapitalize")).toBe("none");
	expect(usernameInput.getAttribute("autocorrect")).toBe("off");
	expect(usernameInput.getAttribute("spellcheck")).toBe("false");
});

test("password input has password manager attributes", () => {
	render(<Login onLogin={() => {}} />);
	const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
	expect(passwordInput.id).toBe("password");
	expect(passwordInput.name).toBe("password");
	expect(passwordInput.type).toBe("password");
	expect(passwordInput.autocomplete).toBe("current-password");
	expect(passwordInput.required).toBe(true);
});

test("labels have htmlFor attributes matching input ids", () => {
	render(<Login onLogin={() => {}} />);
	const usernameLabel = screen.getByText("Username").closest("label");
	const passwordLabel = screen.getByText("Password").closest("label");
	expect(usernameLabel?.htmlFor).toBe("username");
	expect(passwordLabel?.htmlFor).toBe("password");
});
