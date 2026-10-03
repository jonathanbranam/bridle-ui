import { useCallback, useEffect, useState } from "react";
import { logout, session } from "./api/client";
import type { SessionInfo } from "./api/generated/SessionInfo";
import { ItemsView } from "./Items";
import { Login } from "./Login";
import { TimeView } from "./Time";

// undefined while the first /session probe is in flight, null once known to be logged out.
export function App() {
	const [user, setUser] = useState<SessionInfo | null>();
	const [error, setError] = useState<string>();
	const [page, setPage] = useState<"todo" | "time">("todo");

	// Stable, or ItemsView would refetch on every App render.
	const loggedOut = useCallback(() => setUser(null), []);

	useEffect(() => {
		session().then((r) => {
			if (r.ok) setUser(r.value);
			else if (r.notLoggedIn) setUser(null);
			else setError(r.error);
		});
	}, []);

	return (
		<main className="mx-auto max-w-3xl space-y-4 p-4">
			<h1 className="text-2xl font-semibold">bridle</h1>
			{error && <p role="alert">{error}</p>}
			{user === null && <Login onLogin={setUser} />}
			{user && (
				<p className="flex items-center gap-3">
					{user.username}
					<button
						type="button"
						className="rounded border px-2 py-1"
						onClick={async () => {
							await logout();
							setUser(null);
						}}
					>
						Log out
					</button>
				</p>
			)}
			{user && (
				<nav className="flex gap-2">
					{(["todo", "time"] as const).map((p) => (
						<button
							key={p}
							type="button"
							aria-pressed={page === p}
							className={`rounded border px-3 py-1 ${page === p ? "bg-gray-900 text-white" : ""}`}
							onClick={() => setPage(p)}
						>
							{p === "todo" ? "To-dos" : "Time"}
						</button>
					))}
				</nav>
			)}
			{user && page === "todo" && <ItemsView onLoggedOut={loggedOut} />}
			{user && page === "time" && <TimeView onLoggedOut={loggedOut} />}
		</main>
	);
}
