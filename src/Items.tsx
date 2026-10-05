import { useCallback, useEffect, useState } from "react";
import { type Action, act, items } from "./api/client";
import type { Items as ItemsData } from "./api/generated/Items";
import { IdChip } from "./IdChip";
import { LinkScope, Md } from "./Md";

type Props = { onLoggedOut: () => void };

export function ItemsView({ onLoggedOut }: Props) {
	const [data, setData] = useState<ItemsData>();
	const [error, setError] = useState<string>();

	const load = useCallback(async () => {
		const r = await items();
		if (r.ok) {
			setData(r.value);
			setError(undefined);
		} else if (r.notLoggedIn) onLoggedOut();
		else setError(r.error);
	}, [onLoggedOut]);

	useEffect(() => {
		load();
	}, [load]);

	// Refetch after every attempt so the list shows the gateway's truth, even on failure.
	const run = async (
		project: string,
		id: string,
		action: Action,
		text?: string,
	) => {
		const r = await act(project, id, action, text);
		if (r.ok) setError(undefined);
		else if (r.notLoggedIn) return onLoggedOut();
		else setError(r.error);
		await load();
	};

	return (
		<div className="space-y-6">
			{error && (
				<p role="alert" className="text-red-700">
					{error}
				</p>
			)}
			{data?.projects.length === 0 && (
				<p className="text-gray-500">Nothing for you.</p>
			)}
			{data?.projects.map((p) => (
				<LinkScope
					key={`${p.machine}/${p.project}`}
					project={p.project}
					texts={[
						...p.decisions.map((d) => d.question),
						...p.todos.map((t) => t.body),
					]}
				>
					<section className="space-y-3">
						<h2 className="text-lg font-semibold">
							{p.project}
							{p.machine && (
								<span className="ml-2 text-sm font-normal text-gray-500">
									{p.machine}
								</span>
							)}
						</h2>
						<ul className="space-y-3">
							{p.decisions.map((d) => (
								<li key={d.task_id} className="rounded border p-3">
									<p className="font-medium">
										{d.title} <Badge priority={d.priority} />
									</p>
									<IdChip id={d.task_id} />
									<p className="text-sm text-gray-500">asked by {d.asked_by}</p>
									<p className="my-2 whitespace-pre-wrap">
										<Md text={d.question} />
									</p>
									<AnswerForm
										label={`Answer ${d.title}`}
										onSubmit={(t) => run(p.project, d.task_id, "answer", t)}
									/>
								</li>
							))}
							{p.todos.map((t) => (
								<li key={t.task_id} className="rounded border p-3">
									<p className="font-medium">
										{t.title} <Badge priority={t.priority} />
									</p>
									<IdChip id={t.task_id} />
									{t.body && (
										<p className="my-2 whitespace-pre-wrap text-sm">
											<Md text={t.body} />
										</p>
									)}
									<TodoActions
										title={t.title}
										onDone={() => run(p.project, t.task_id, "done")}
										onDecline={(reason) =>
											run(p.project, t.task_id, "drop", reason)
										}
									/>
								</li>
							))}
						</ul>
					</section>
				</LinkScope>
			))}
			{data?.unreachable.map((u) => (
				<p
					key={`${u.machine}/${u.project}`}
					className="text-sm text-gray-500"
					data-testid="unreachable"
				>
					{u.project} is unreachable
					{u.reason ? `: ${u.reason}` : ""}
				</p>
			))}
		</div>
	);
}

function Badge({ priority }: { priority: string }) {
	if (priority === "normal") return null;
	return (
		<span className="rounded bg-gray-200 px-1.5 text-xs uppercase">
			{priority}
		</span>
	);
}

const button = "rounded border px-3 py-2";

function AnswerForm({
	label,
	onSubmit,
}: {
	label: string;
	onSubmit: (text: string) => Promise<unknown>;
}) {
	const [text, setText] = useState("");
	return (
		<form
			className="flex flex-col gap-2"
			onSubmit={async (e) => {
				e.preventDefault();
				await onSubmit(text);
				setText("");
			}}
		>
			<textarea
				aria-label={label}
				className="rounded border p-2"
				required
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<button type="submit" className={button}>
				Answer
			</button>
		</form>
	);
}

function TodoActions({
	title,
	onDone,
	onDecline,
}: {
	title: string;
	onDone: () => Promise<unknown>;
	onDecline: (reason: string) => Promise<unknown>;
}) {
	const [declining, setDeclining] = useState(false);
	const [reason, setReason] = useState("");
	if (declining) {
		return (
			<form
				className="flex flex-col gap-2"
				onSubmit={async (e) => {
					e.preventDefault();
					if (!reason.trim()) return;
					await onDecline(reason);
					setDeclining(false);
					setReason("");
				}}
			>
				<textarea
					aria-label={`Reason for declining ${title}`}
					className="rounded border p-2"
					required
					value={reason}
					onChange={(e) => setReason(e.target.value)}
				/>
				<div className="flex gap-2">
					<button type="submit" className={button}>
						Decline
					</button>
					<button
						type="button"
						className={button}
						onClick={() => setDeclining(false)}
					>
						Cancel
					</button>
				</div>
			</form>
		);
	}
	return (
		<div className="flex gap-2">
			<button type="button" className={button} onClick={onDone}>
				Done
			</button>
			<button
				type="button"
				className={button}
				onClick={() => setDeclining(true)}
			>
				Decline…
			</button>
		</div>
	);
}
