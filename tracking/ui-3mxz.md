+++
id = "ui-3mxz"
title = "bridle-ui dev server takes a port and API target, and checks the fixture site"
kind = "feature"
state = "planned"
created_at = "2026-10-13T02:00:58.801Z"
updated_at = "2026-10-13T02:02:01.345221Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
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
