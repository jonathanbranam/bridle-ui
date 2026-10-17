+++
id = "ui-3mxz"
title = "bridle-ui dev server takes a port and API target, and checks the fixture site"
kind = "feature"
state = "planned"
created_at = "2026-10-13T02:00:58.801Z"
updated_at = "2026-10-17T11:59:09.325558Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
summary = """vite.config.ts reads VITE_DEV_PORT (strictPort, host 127.0.0.1) and VITE_API_TARGET (falls back to BRIDLE_GATEWAY_URL, then the old default). Host is pinned to 127.0.0.1 because Vite's default "localhost" bound ::1 only on this machine and `bridle dev site up` timed out probing IPv4 (30s); with it, up works. scripts/check-site.mjs (npm run check:site -- <site.json>) logs in through the UI port and asserts: page served, login, projects reachable, open/resolved ticket file counts (via documents search) match the manifest, a stem link resolves, and a question is in /items. Verified on two simultaneous `bridle dev site up --ui .` sites: passes on both, fails on an altered manifest. README and CLAUDE.md got Verification; .agent-site/ gitignored. No bridle-side failure found; note the manifest has no explicit stem-link or to-do facts, so those are derived by the script. Check green, 163 tests."""
ticket = "3mxz"
+++

docs/tickets/open/bridle-ui-dev-server-takes-a-port-and-api-target-and-checks-3mxz.md

## Thread

### note · external:orchestrator · 2026-10-13T02:01:13.242Z
Readied by orchestrator on the human's go, via advisor product-manager (m-11853), 2026-10-12 ~9:15 PM ET: "Yes that would be good to get done": schedule vdu8, dgef (UI half, this ticket) and tgxy right after usage epic rdkn. Ask: br-vwqt. Needs br-vdu8 to land for check:site; the vite port/target part does not.

### note · external:orchestrator · 2026-10-13T02:01:50.471Z
Brief (orchestrator, acting planner). Model: Sonnet. Size: S-M.

Spec: the ask above and bridle's docs/design/dev-site.md section 2 (the site.json and fixture manifest shapes). Read nothing else of that doc.

Files: vite.config.ts, package.json (the check:site script), a small script under scripts/ for check:site, README.md, CLAUDE.md ("Verification").

Order: needs br-vdu8 (`bridle dev site up`) landed and installed on this machine, for check:site and the verify step. Don't start before then.

Verify: two `bridle dev site up --ui .` sites on different VITE_DEV_PORT values, each proxying /api to its own gateway; `npm run check:site -- <site.json>` passes on both, and fails on a site.json whose manifest is altered. `npm run check` green.

Out of scope: the rule and role text (br-tgxy, bridle side); any change to the human's gateway defaults.

### note · external:orchestrator · 2026-10-13T02:02:08.433Z
held: Waits for br-vdu8 (bridle dev site) to land and install on this machine; the cross-project blocked_by isn't enforced by the queue. Orchestrator unholds it then.

### note · external:orchestrator · 2026-10-13T02:33:10.217Z
br-vdu8 landed (70db43fa). Its step 5 (starting the UI dev server with VITE_DEV_PORT and VITE_API_TARGET) is written but untested on the bridle side; this ticket's verify (two sites on different ports, check:site on both) is that test. Report any bridle-side failure there as a br- bug, not a fix here. Still held until the installed bridle has 'dev site' (self-upgrade).

### note · external:orchestrator · 2026-10-13T04:22:36.994Z
unheld

### note · external:orchestrator · 2026-10-13T04:22:37.724Z
Unheld by orchestrator: the installed bridle now has 'bridle dev site' (self-upgrade to 6c0bf076, which includes br-vdu8).

### note · agent:devport · 2026-10-17T11:47:35.581Z
done: VITE_DEV_PORT/VITE_API_TARGET, check:site, README/CLAUDE.md Verification; npm run check exit 0, 163 tests; two sites verified (check:site passes on both, fails on altered manifest); commit 3b2ec80, main already merged. Note: 'bridle ticket built' was refused for me ('worker agents cannot use agent lifecycle endpoints'), so the ticket is not marked built. Also: Vite bound ::1 only so 'dev site up' timed out until I pinned host 127.0.0.1 in the UI config.

### note · agent:manager-3 · 2026-10-17T11:47:44.751Z
No ticket summary yet. Please run 'bridle ticket summary ui-3mxz' (see --help for how to pass the text), then message me. I'll mark it built.

### note · agent:devport · 2026-10-17T11:47:53.077Z
summary is recorded (shown in 'bridle ticket show ui-3mxz --json' under summary; the plain show omits it). Commit 3b2ec80, check green.

### note · external:orchestrator · 2026-10-17T11:59:09.325Z
From orchestrator (acting PM, answering your m-1518 to the human): yes, do your recommendation. Run npm run check yourself in the devport worktree on 3b2ec80; if green, land with --checked-commit 3b2ec80 --branch bridle/devport. Use the same path for ui-sxs3 and ui-qfur until the land check has node_modules. I'm filing the bridle bug.
