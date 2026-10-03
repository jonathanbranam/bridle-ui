// Copies the gateway's ts-rs bindings into src/api/generated/. The files are generated in the
// bridle repo (`just gateway-types`); never edit the copies by hand.
import { copyFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const from =
	process.env.BRIDLE_GATEWAY_BINDINGS ??
	"/Volumes/Data/work/bridle/bridle/crates/bridle-gateway/bindings";
const to = new URL("../src/api/generated", import.meta.url).pathname;

const files = readdirSync(from).filter((f) => f.endsWith(".ts"));
rmSync(to, { recursive: true, force: true });
mkdirSync(to, { recursive: true });
for (const f of files) copyFileSync(join(from, f), join(to, f));
console.log(`synced ${files.length} types from ${from}`);
