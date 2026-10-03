import { useCallback, useEffect, useState } from "react";
import { logout, session } from "./api/client";
import type { SessionInfo } from "./api/generated/SessionInfo";
import { ItemsView } from "./Items";
import { Login } from "./Login";

// undefined while the first /session probe is in flight, null once known to be logged out.
export function App() {
	const [user, setUser] = useState<SessionInfo | null>();
	const [error, setError] = useState<string>();

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
		<main className="mx-auto max-w-2xl space-y-4 p-4">
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
			{user && <ItemsView onLoggedOut={loggedOut} />}
		</main>
	);
}
