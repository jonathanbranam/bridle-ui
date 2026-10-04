import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { API_VERSION } from "../api/version";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(dirname(scriptDir));

describe("install-ui script", () => {
	let tempUiDir: string;

	beforeEach(() => {
		tempUiDir = mkdtempSync(join(tmpdir(), "bridle-ui-test-"));
	});

	afterEach(() => {
		rmSync(tempUiDir, { recursive: true, force: true });
	});

	it("installs UI to temp directory with correct api-version", async () => {
		const env = { ...process.env, BRIDLE_UI_DIR: tempUiDir };
		execSync("npm run install-ui", {
			cwd: projectRoot,
			env,
			stdio: "pipe",
		});

		// Verify api-version file
		const apiVersionFile = join(tempUiDir, "api-version");
		const content = readFileSync(apiVersionFile, "utf-8");
		expect(content.trim()).toBe(`${API_VERSION}`);

		// Verify dist contents were copied
		const indexHtml = join(tempUiDir, "index.html");
		expect(() => readFileSync(indexHtml)).not.toThrow();
	}, 60000); // Real build + bundle can take 30-45s on a loaded machine
});
