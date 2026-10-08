# bridle-ui

The human's web UI for bridle: a single-page app that is a client of the **bridle gateway**
(`bridle gateway`, in the bridle repo at `/Volumes/Data/work/bridle/bridle`). The gateway spans
every bridle project on the machine; the browser never holds a bridle token and never talks to
a daemon. Design: `docs/design/human-web-ui.md` in the bridle repo (ticket essy there).

## Stack (decided by the human, 2026-10-02: keep it simple)

- One SPA, not a monorepo: React 19, Vite, TypeScript (strict), Tailwind CSS.
- Tests: vitest (+ Testing Library for components). Lint and format: Biome.
- npm. CI: GitHub Actions, running the same `npm run check` as local.
- Later: CodeMirror 6 for markdown editing (comments in the margin), diagrams from a text
  format. Don't add these until a task asks for them.

## The gateway contract

- Default address `http://127.0.0.1:7878`. Every API route is under `/api/v1/`.
- Open routes: `GET /api/v1/health`, `POST /api/v1/login` (username, password) and
  `POST /api/v1/logout`. Login sets an `HttpOnly`, `SameSite=Strict` session cookie; every
  other route needs it and answers 401 without it. The UI never stores credentials.
- v1 routes: `GET /api/v1/session`, `GET /api/v1/projects`, `GET /api/v1/items` (the human's
  to-dos and task questions across projects), and
  `POST /api/v1/projects/{project}/tasks/{id}/{done|drop|answer}`.
- **Types come from the gateway, never hand-written.** The bridle repo generates them from the
  Rust types (ts-rs) into `crates/bridle-gateway/bindings/*.ts` (`just gateway-types` there).
  Copy them into `src/api/generated/` with the sync script; don't edit them by hand.
- **API version:** the build writes the API version it targets (the gateway's `API_VERSION`,
  now 1) to an `api-version` file beside `index.html`. The gateway compares it.
- **Install:** the built `dist/` is installed into `~/.bridle/ui/`, which the gateway serves at
  `/`, so page and API share an origin (the cookie just works).
- **Development:** Vite's dev server proxies `/api` to the gateway, so the same-origin cookie
  works there too.

## Commands

```
npm run check   # biome check + tsc --noEmit + vitest run + vite build: must pass before you're done
npm run dev     # Vite dev server, /api proxied to the gateway
```

## Conventions

- Keep it small (YAGNI): v1 is to-dos and decisions only. No state library, no router until a
  second page needs one.
- Layout: pages fill the browser width (no `max-w-*` or `mx-auto` on the shell or a page).
  A page may cap line length of running prose only, never its whole width. Rows of controls
  use `flex-wrap`; fixed widths (`w-*`) only on small labels. Check at 375, 768, 1280, 1920+.
  The viewport meta must not set `maximum-scale` (it blocks zoom); the 16px field rule
  already prevents iOS focus-zoom.
- Landing means deployed: after each landing on main, once CI is green, the manager runs
  `npm run install-ui` (installs `dist/` into `~/.bridle/ui/`, which the gateway serves) and
  says so in its landing note. A merge alone changes nothing the human sees. (Incident ui-wdp3.)
- Comments explain why, not what.
- Don't commit unless asked. No Claude Code memory.
- Link formats: any change to the URL scheme, or any new deep link, files a task to update the
  agent instructions and `bridle link` (in the bridle repo). The formats are the "Final
  formats" table in section 3 of [[docs/design/url-scheme]]; update that table in the same
  change.

<!-- bridle:managed:start -->
This project's workflow rules, current task and role priming are rendered by
bridle, not written here. Read the rule files (markdown, one per rule id)
in `.bridle/rules/` and in the workflow checkout's `base/rules/` (`workflow`
in `.bridle/config.toml`) at the start of a session — don't rely on this
file for rule content. The orchestrator also runs `bridle prime orchestrator`.
<!-- bridle:managed:end -->
