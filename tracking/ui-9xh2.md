+++
id = "ui-9xh2"
title = "Tickets page: a project dropdown (All by default) that filters tickets to one project; the choice sticks"
kind = "feature"
state = "planned"
created_at = "2026-11-18T02:49:54.215Z"
updated_at = "2026-11-21T19:14:47.244803Z"
created_by = "external:aide"
watchers = [
    "external:aide",
    "agent:tix-filter",
]
branch = "bridle/tix-filter"
summary = "Tickets page project dropdown (All default, filters to one project, stored in localStorage). Browser-verified with Playwright/Chromium on a throwaway site at 375, 1280, 1920: starts on All (acme-docs + acme-shop shown), choosing acme-shop shows only it, choice survives reload, no horizontal overflow. npm run check exit 0, 172 tests. Caveat: tix-filter's worktree is not mine, so I cherry-picked 2347988 onto bridle/tix-click (962becb) and added the CHANGELOG line there; land bridle/tix-click, not bridle/tix-filter."
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

### question · external:orchestrator · 2026-11-18T13:13:54.635Z
Blocker: no bridle-ui agent has a browser tool, so rule verify-ui-in-a-browser (must; the human: 'definitely before something's merged, somebody needs to be able to click around on the site') can't be met. ui-9xh2 is built on bridle/tix-filter, npm run check green (171 tests). ui-fwsx waits behind it. Question: who clicks it? Recommendation: manager-5 brings up a throwaway site from the branch (bridle dev site up) and sends you the URL; you click the dropdown (defaults to All, filters to one project, choice sticks after reload) and say go, then it lands. Separately, should agents get a browser tool (e.g. a Playwright MCP) so this stops needing you? I recommend yes, as its own ticket.

### note · external:aide · 2026-11-21T18:55:05.374Z
From the human, via aide (2026-11-21 ~1:50 PM ET), on the orchestrator's second question, verbatim: "I think agents should get a browser tool. Yes, I assume you mean workers." Filed on bridle (submitted task, id below in the aide's relay). The first question (who clicks ui-9xh2 now, before the tool exists) is not answered yet; asked the human again.

### note · external:aide · 2026-11-21T18:55:21.003Z
Browser tool for workers submitted to bridle as br-4bhp.

### note · agent:manager-6 · 2026-11-21T19:08:25.303Z
sent back: Needs a browser click-through (dropdown starts on All, filters to one project, survives reload, narrow and wide) per orchestrator m-1721

### note · agent:tix-click · 2026-11-21T19:14:43.231Z
Tickets page project dropdown (All default, filters to one project, stored in localStorage). Browser-verified with Playwright/Chromium on a throwaway site at 375, 1280, 1920: starts on All (acme-docs + acme-shop shown), choosing acme-shop shows only it, choice survives reload, no horizontal overflow. npm run check exit 0, 172 tests. Caveat: tix-filter's worktree is not mine, so I cherry-picked 2347988 onto bridle/tix-click (962becb) and added the CHANGELOG line there; land bridle/tix-click, not bridle/tix-filter.

### note · agent:tix-click · 2026-11-21T19:14:47.244Z
done: ui-9xh2 browser-verified (375/1280/1920: All default, filters to acme-shop, survives reload, no overflow); check exit 0, 172 tests. NOTE: I work on bridle/tix-click, not tix-filter, so I cherry-picked 2347988 there + CHANGELOG; land bridle/tix-click at f2d58d0. Site down.
