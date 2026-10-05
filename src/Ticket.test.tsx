import { render, screen, waitFor } from "@testing-library/react";
import * as router from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as apiClient from "./api/client";
import { TicketView } from "./Ticket";

vi.mock("./api/client");
vi.mock("./Document", () => ({
	DocumentView: ({
		initialProject,
		initialPath,
	}: {
		onLoggedOut: () => void;
		initialProject?: string;
		initialPath?: string;
	}) => (
		<div>
			Document: {initialProject} / {initialPath}
		</div>
	),
}));
vi.mock("react-router", async () => {
	const actual = await vi.importActual<typeof router>("react-router");
	return {
		...actual,
		useSearchParams: vi.fn(),
	};
});

const mockResolveLinks = vi.mocked(apiClient.resolveLinks);
const mockUseSearchParams = vi.mocked(router.useSearchParams);

function createMockSearchParams(
	params: Record<string, string>,
): [URLSearchParams, () => void] {
	const searchParams = new URLSearchParams(params);
	const setParams = vi.fn();
	return [searchParams, setParams];
}

describe("TicketView", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("shows missing project or ID error", () => {
		const [params, setParams] = createMockSearchParams({});
		mockUseSearchParams.mockReturnValue([params, setParams]);

		render(<TicketView onLoggedOut={() => {}} />);
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Missing project or ID",
		);
	});

	it("shows loading while resolving", () => {
		const [params, setParams] = createMockSearchParams({
			project: "test",
			id: "ab3d",
		});
		mockUseSearchParams.mockReturnValue([params, setParams]);
		mockResolveLinks.mockReturnValue(
			new Promise((resolve) => {
				setTimeout(
					() =>
						resolve({
							ok: true,
							value: {
								project: "test",
								links: [{ target: "ab3d", path: "docs/test.md" }],
							},
						}),
					100,
				);
			}),
		);

		render(<TicketView onLoggedOut={() => {}} />);

		expect(screen.getByText("Loading ticket...")).toBeInTheDocument();
	});

	it("shows document for resolved ticket", async () => {
		const [params, setParams] = createMockSearchParams({
			project: "test",
			id: "ab3d",
		});
		mockUseSearchParams.mockReturnValue([params, setParams]);
		mockResolveLinks.mockResolvedValue({
			ok: true,
			value: {
				project: "test",
				links: [{ target: "ab3d", path: "docs/test.md" }],
			},
		});

		render(<TicketView onLoggedOut={() => {}} />);

		await waitFor(() => {
			expect(screen.getByText(/Document: test/)).toBeInTheDocument();
		});
	});

	it("shows not found error for unknown ticket", async () => {
		const [params, setParams] = createMockSearchParams({
			project: "test",
			id: "unknown",
		});
		mockUseSearchParams.mockReturnValue([params, setParams]);
		mockResolveLinks.mockResolvedValue({
			ok: true,
			value: {
				project: "test",
				links: [{ target: "unknown", path: null }],
			},
		});

		render(<TicketView onLoggedOut={() => {}} />);

		await waitFor(() => {
			expect(screen.getByRole("alert")).toHaveTextContent(
				"No ticket unknown in test",
			);
		});
	});

	it("calls onLoggedOut on 401 error", async () => {
		const onLoggedOut = vi.fn();
		const [params, setParams] = createMockSearchParams({
			project: "test",
			id: "ab3d",
		});
		mockUseSearchParams.mockReturnValue([params, setParams]);
		mockResolveLinks.mockResolvedValue({
			ok: false,
			notLoggedIn: true,
			error: "Unauthorized",
		});

		render(<TicketView onLoggedOut={onLoggedOut} />);

		await waitFor(() => {
			expect(onLoggedOut).toHaveBeenCalled();
		});
	});

	it("shows error on API failure", async () => {
		const [params, setParams] = createMockSearchParams({
			project: "test",
			id: "ab3d",
		});
		mockUseSearchParams.mockReturnValue([params, setParams]);
		mockResolveLinks.mockResolvedValue({
			ok: false,
			notLoggedIn: false,
			status: 500,
			error: "Server error",
		});

		render(<TicketView onLoggedOut={() => {}} />);

		await waitFor(() => {
			expect(screen.getByRole("alert")).toHaveTextContent("Server error");
		});
	});
});
