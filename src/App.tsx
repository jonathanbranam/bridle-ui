import { useCallback, useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes, useLocation } from "react-router";
import { logout, session } from "./api/client";
import type { SessionInfo } from "./api/generated/SessionInfo";
import { DocumentView } from "./Document";
import { ItemsView } from "./Items";
import { Login } from "./Login";
import { SpecsView } from "./SpecPage";
import { SystemView } from "./System";
import { TasksView, TaskView } from "./Tasks";
import { TicketView } from "./Ticket";
import { TimeView } from "./Time";

// undefined while the first /session probe is in flight, null once known to be logged out.
export function App() {
	// The document page uses the browser's width: the margin needs it.
	const wide = useLocation().pathname === "/document";
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
		<main className={`mx-auto space-y-4 p-4 ${wide ? "" : "max-w-3xl"}`}>
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
					{(
						[
							["/", "To-dos"],
							["/tasks", "Tasks"],
							["/system", "System"],
							["/time", "Time"],
							["/document", "Document"],
							["/specs", "Specs"],
						] as const
					).map(([to, label]) => (
						<NavLink
							key={to}
							to={to}
							end
							className={({ isActive }) =>
								`rounded border px-3 py-1 ${isActive ? "bg-gray-900 text-white" : ""}`
							}
						>
							{label}
						</NavLink>
					))}
				</nav>
			)}
			{user && (
				<Routes>
					<Route path="/" element={<ItemsView onLoggedOut={loggedOut} />} />
					<Route path="/time" element={<TimeView onLoggedOut={loggedOut} />} />
					<Route
						path="/document"
						element={<DocumentView onLoggedOut={loggedOut} />}
					/>
					<Route
						path="/specs"
						element={<SpecsView onLoggedOut={loggedOut} />}
					/>
					<Route
						path="/tasks"
						element={<TasksView onLoggedOut={loggedOut} />}
					/>
					<Route
						path="/tasks/:project/:id"
						element={<TaskView onLoggedOut={loggedOut} />}
					/>
					<Route
						path="/system"
						element={<SystemView onLoggedOut={loggedOut} />}
					/>
					<Route path="/task" element={<TaskView onLoggedOut={loggedOut} />} />
					<Route
						path="/ticket"
						element={<TicketView onLoggedOut={loggedOut} />}
					/>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			)}
		</main>
	);
}
