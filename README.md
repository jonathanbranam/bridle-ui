# bridle-ui

Web UI for bridle: a React 19 + Vite + TypeScript + Tailwind CSS SPA.

## Commands

- `npm run dev` — Start Vite dev server with `/api` proxied to the gateway
- `npm run build` — Build the UI with `vite build`
- `npm run check` — Run all checks: Biome, TypeScript, vitest, and build
- `npm run install-ui` — Build and install the UI to `${BRIDLE_UI_DIR:-~/.bridle/ui}`
- `npm run sync-types` — Sync generated TypeScript types from the gateway

## Installing the UI

The `npm run install-ui` command builds the UI and installs it to `${BRIDLE_UI_DIR}` (defaults to `~/.bridle/ui`). It:

1. Runs the build
2. Writes an `api-version` file containing the gateway API version
3. Atomically replaces the UI directory using a temporary directory and rename (safe even if the gateway is serving from it)

The installed UI is served by the bridle gateway at `/`.
