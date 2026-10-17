// Logs in to a running `bridle dev site` through its UI port (so the Vite proxy is
// tested too) and asserts the fixture manifest's facts. Fails when UI/gateway and
// the fixture have drifted. Usage: npm run check:site -- <path to site.json>
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
	console.error("usage: npm run check:site -- <site.json>");
	process.exit(2);
}
const site = JSON.parse(readFileSync(file, "utf8"));
const failures = [];
const check = (ok, what) => {
	console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
	if (!ok) failures.push(what);
};

let cookie = "";
const api = async (path, init = {}) => {
	const res = await fetch(`${site.url}/api/v1${path}`, {
		...init,
		headers: { "content-type": "application/json", cookie },
	});
	const text = await res.text();
	return { status: res.status, body: text ? JSON.parse(text) : null, res };
};

const page = await fetch(site.url);
check(page.status === 200, "UI serves the page at /");

const login = await api("/login", {
	method: "POST",
	body: JSON.stringify({ username: site.username, password: site.password }),
});
check(login.status === 200, "login through the UI port");
cookie = (login.res.headers.getSetCookie?.() ?? [])
	.map((c) => c.split(";")[0])
	.join("; ");

const { body: projects } = await api("/projects");
const { body: items } = await api("/items");

for (const fx of site.fixtures) {
	const name = fx.project;
	check(
		projects?.projects?.some((p) => p.project === name && p.reachable),
		`${name}: listed and reachable`,
	);

	const count = async (dir) =>
		(
			await api(`/projects/${name}/documents?q=docs/tickets/${dir}/`)
		).body.paths.filter((p) => p.startsWith(`docs/tickets/${dir}/`));
	const open = await count("open");
	const resolved = await count("resolved");
	check(
		open.length === fx.tickets_open,
		`${name}: ${fx.tickets_open} open tickets (saw ${open.length})`,
	);
	check(
		resolved.length === fx.tickets_resolved,
		`${name}: ${fx.tickets_resolved} resolved tickets (saw ${resolved.length})`,
	);

	if (open[0]) {
		const stem = open[0].split("/").pop().replace(/\.md$/, "");
		const { body } = await api(`/projects/${name}/links/resolve`, {
			method: "POST",
			body: JSON.stringify({ targets: [stem] }),
		});
		check(
			body?.links?.[0]?.path === open[0],
			`${name}: stem link ${stem} resolves`,
		);
	}

	const mine = items?.projects?.find((p) => p.project === name);
	check(
		mine?.decisions?.some((d) => d.question),
		`${name}: the to-do list holds the question`,
	);
}

if (failures.length) {
	console.error(`\n${failures.length} check(s) failed`);
	process.exit(1);
}
console.log("\nsite matches the fixture manifest");
