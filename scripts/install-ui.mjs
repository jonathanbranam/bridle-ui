import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(scriptDir);
const distDir = join(projectRoot, "dist");
const uiDir = process.env.BRIDLE_UI_DIR || `${process.env.HOME}/.bridle/ui`;

// Run the build
console.log("Building...");
execSync("npm run build", { cwd: projectRoot, stdio: "inherit" });

// Read and verify api-version file was written
const apiVersionFile = join(distDir, "api-version");
const fs = (await import("node:fs/promises")).default;
const apiVersionContent = await fs.readFile(apiVersionFile, "utf-8");
const apiVersion = apiVersionContent.trim();
console.log("api-version file verified:", apiVersion);

// Install to BRIDLE_UI_DIR using atomic rename
console.log(`Installing to ${uiDir}...`);
mkdirSync(dirname(uiDir), { recursive: true });

const tempDir = `${uiDir}.tmp.${Date.now()}`;
const oldDir = `${uiDir}.old`;

cpSync(distDir, tempDir, { recursive: true });

try {
	// Move existing dir to .old, then move temp to target, then clean up .old
	if (process.platform === "win32") {
		// Windows: remove old dir first, then remove existing target, then rename temp
		rmSync(oldDir, { recursive: true, force: true });
		rmSync(uiDir, { recursive: true, force: true });
		renameSync(tempDir, uiDir);
	} else {
		// POSIX: atomic rename with backup
		rmSync(oldDir, { recursive: true, force: true });
		if (existsSync(uiDir)) {
			renameSync(uiDir, oldDir);
		}
		renameSync(tempDir, uiDir);
		rmSync(oldDir, { recursive: true, force: true });
	}
} catch (err) {
	// Clean up temp dir on failure
	rmSync(tempDir, { recursive: true, force: true });
	throw err;
}

console.log("Installation complete");
