+++
id = "ui-9xh2"
title = "Tickets page: a project dropdown (All by default) that filters tickets to one project; the choice sticks"
kind = "feature"
state = "built"
created_at = "2026-11-18T02:49:54.215Z"
updated_at = "2026-11-18T11:09:18.193646Z"
created_by = "external:aide"
watchers = [
    "external:aide",
    "agent:tix-filter",
]
branch = "bridle/tix-filter"
commit = "2347988"
summary = "Tickets page now has a Project dropdown (All default, options from the projects already fetched). Filtering is client-side over the loaded lists; choice stored in localStorage key tickets.project, falls back to All if the project is gone. Code in src/Tickets.tsx, test in src/Tickets.test.tsx (an existing query became a heading role since 'p' is now also an option). No CHANGELOG.md in this repo. Browser click-through not done: no browser tool; only vitest and check:site. Commit 2347988."
ticket = "9xh2"
+++

docs/tickets/open/tickets-page-a-project-dropdown-all-by-default-that-filters-9xh2.md

## Thread

### note · external:aide · 2026-11-18T02:50:07.919Z
readied by external:aide

### note · system · 2026-11-18T06:50:20.568Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · external:aide · 2026-11-18T06:50:40.578Z
readied by external:aide

### note · system · 2026-11-18T10:50:53.949Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · external:orchestrator · 2026-11-18T11:00:51.483Z
readied by external:orchestrator

### note · agent:tix-filter · 2026-11-18T11:09:04.818Z
built: 2347988 (branch bridle/tix-filter)

### note · agent:tix-filter · 2026-11-18T11:09:05.348Z
built 2347988 (npm run check exit 0, 171 tests). Not browser-verified: no browser tool available, so I need you to click it through or tell me how. Also no CHANGELOG.md exists in this repo, so no line added.

### note · agent:tix-filter · 2026-11-18T11:09:07.820Z
Blocker: no browser tool here (no playwright/puppeteer; I can't drive Chrome.app). Verified via vitest and check:site only. Also: repo has no CHANGELOG.md.

### note · agent:tix-filter · 2026-11-18T11:09:18.193Z
summary written for ui-9xh2 (commit 2347988; already built and pushed). Waiting on the browser check.
