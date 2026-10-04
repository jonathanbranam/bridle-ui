import { type FormEvent, useState } from "react";
import { login } from "./api/client";
import type { SessionInfo } from "./api/generated/SessionInfo";

export function Login({ onLogin }: { onLogin: (s: SessionInfo) => void }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string>();

	async function submit(e: FormEvent) {
		e.preventDefault();
		setError(undefined);
		const r = await login({ username, password });
		if (r.ok) onLogin(r.value);
		else setError(r.error);
	}

	return (
		<form onSubmit={submit} className="flex max-w-xs flex-col gap-3">
			<label htmlFor="username" className="flex flex-col gap-1">
				Username
				<input
					id="username"
					name="username"
					className="rounded border px-2 py-1"
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					autoComplete="username"
					required
				/>
			</label>
			<label htmlFor="password" className="flex flex-col gap-1">
				Password
				<input
					id="password"
					name="password"
					className="rounded border px-2 py-1"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="current-password"
					required
				/>
			</label>
			{error && <p role="alert">{error}</p>}
			<button type="submit" className="rounded border px-2 py-1">
				Log in
			</button>
		</form>
	);
}
