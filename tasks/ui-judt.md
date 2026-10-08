+++
id = "ui-judt"
title = "Build the unified URL scheme (/p/{project}/tasks/{id}, ...), redirects for old URLs, and a /p/{project} overview page"
kind = "feature"
state = "planned"
created_at = "2026-10-08T02:21:44.033Z"
updated_at = "2026-10-08T02:21:50.130984Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
parent = "ui-4u8g"
+++

Build the unified URL scheme from docs/design/url-scheme.md (ui-4u8g, a722a73), with the human's answers (2026-10-07 ~10:20 PM ET, in the orchestrator's session):
1. PLURAL kind segments (the human chose plural over the proposal's singular): /p/{project}/tasks/{id}, /p/{project}/tickets/{id}. Use plural for every kind so the scheme is consistent: /p/{project}/docs?path=..., /p/{project}/specs?path=...#id. (Orchestrator's extension of the answer to docs and specs; keep it unless something breaks.)
2. Yes: 'bridle link' will take a document path and spec ID (done in the bridle repo, separate task; nothing here).
3. Yes, build a /p/{project} overview page now: keep it simple, the project's open tasks and a link to its docs (KISS; no new gateway API unless one is truly missing).
4. Build tonight; no further review before building.

Work: the routes in src/App.tsx; every producer in the UI (taskPath, taskHref, documentHref, specHref, the jump box, System page) emits the new form; client-side redirects from every old form (/task?id=, /tasks/{project}/{id}, /ticket?project=&id=, /document?project=&path=, /specs?project=&path=) to the new one; keep /, /system, /time, /tasks. Update docs/design/url-scheme.md: the decisions above, and the final exact formats in a table (ui-28em uses it). Tests for the redirects. npm checks green.
Model: Sonnet. Out of scope: bridle link and agent rules (bridle repo task), anything beyond routing and the overview page.
After landing: install-ui per CLAUDE.md, and tell the orchestrator so the bridle-side task can land.
