/// <reference types="vitest/config" />
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { API_VERSION } from "./src/api/version";

function apiVersionFile(): Plugin {
	let outDir = "dist";
	return {
		name: "api-version-file",
		apply: "build",
		configResolved(config) {
			outDir = resolve(config.root, config.build.outDir);
		},
		closeBundle() {
			writeFileSync(resolve(outDir, "api-version"), `${API_VERSION}\n`);
		},
	};
}

export default defineConfig({
	plugins: [react(), tailwindcss(), apiVersionFile()],
	server: {
		proxy: {
			"/api": process.env.BRIDLE_GATEWAY_URL ?? "http://127.0.0.1:7878",
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/test-setup.ts"],
	},
});
