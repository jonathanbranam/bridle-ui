+++
id = "ui-pmkd"
title = "bnhn + a3yd: render markdown and front matter; link wiki links, docs paths, URLs and ticket IDs everywhere"
kind = "feature"
state = "integrated"
created_at = "2026-10-04T22:32:12.091Z"
updated_at = "2026-10-05T02:39:43.672473Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
size = "M"
branch = "bridle/md-links"
commit = "f732921f2fbc1d2ec02812de287c2e3c7cb9300a"
summary = "Document view and Items now render markdown (react-markdown + remark-gfm) per existing line block, so comment anchoring is unchanged. A leading --- block is a front-matter key/value table. A remark plugin (src/Md.tsx) turns URLs, [[wiki|label]], docs/ paths, 4-char ticket IDs and prefixed task IDs into links; LinkScope batches targets to POST /projects/{p}/links/resolve and unresolved targets stay plain text. All ID/link syntax is in src/doc/links.ts (one place, for j28f). Caveats: blocks stay line-based, so GFM tables and multi-line constructs do not render as blocks; bare ticket/task IDs only link once the gateway resolves them (today it resolves paths and stems only). Spec: design/specs/document.md r-4ac7 (non-executable scenarios). Note: the first full check timed out three tests under machine load (avg 114); rerun green, 84 tests."
+++

Tickets (bridle repo, read both; they quote the human): docs/tickets/open/*-bnhn.md and docs/tickets/open/*-a3yd.md.

Approval: the human via bridle-ui's aide: m-0144 ("links need to resolve in the browser") and m-0176 ("any front matter should render nicely, even if we don't recognize the file ... Website linking should work everywhere too ... IDs ... that map to a ticket or a task, those should all be links ... everywhere").

Goal, in the Document view (src/Document.tsx, src/doc/) and wherever ticket/task text shows (Items):
- Render markdown with react-markdown + remark-gfm, as track-web client-trips does. No further renderer research.
- Front matter (leading --- YAML block) renders as a neat key/value table for any file, known or not; values get the same auto-linking.
- Auto-link URLs; [[wiki links]] (target or target|label) and docs/... paths link to /document?project=..&path=.. when the gateway resolves them; ticket IDs (4 chars, abcdefghjkmnpqrstuvwxyz23456789, e.g. in see/needs/tasks) and ticket-made task IDs (br-a3yd) link to their ticket.
- Resolution: gateway POST /api/v1/projects/{project}/links/resolve, batch of targets -> {target, path|null}. Paths and ticket stems: bridle br-bnhn. Bare ticket IDs and task IDs: bridle br-a3yd. Unresolved targets render as plain text. Regenerate gateway types if the repo does so.
- Highlight-to-comment splitting must still work over rendered markdown (keep the existing comment anchoring tests green; add one over a rendered list or link).
Acceptance: npm run check green; tests for front matter table, URL autolink, wiki link and ID link (resolved and unresolved).
Model: sonnet.
Blocked on: bridle br-bnhn and br-a3yd merged to bridle main (the orchestrator readies this task's start when they land; build against the API described in docs/design/human-web-ui.md meanwhile is fine but do not start before br-bnhn lands).
Deferred: cross-project links and project identifiers on ticket IDs, until question j28f decides; links for non-ticket task IDs, until bridle-ui has a task view.

## Thread

### note · external:aide · 2026-10-04T22:32:34.021Z
watching the task

### note · external:orchestrator · 2026-10-04T22:32:44.519Z
From orchestrator: please don't queue or start ui-pmkd yet. It needs bridle's br-bnhn and br-a3yd on bridle main first (bridle main is red now; bnhn is waiting). I'll tell you when they land.

### note · external:aide · 2026-10-04T22:34:46.129Z
From bridle's aide, on j28f (b144d425): the human decided in principle that ticket IDs get a project identifier, with a form that tells tickets from tasks. It's not designed yet and needs a migration (depends on xebc). Until then, link today's forms (prefixed task IDs like br-xxxx and ui-xxxx, bare 4-char ticket IDs) and keep the ID matching in one place, since it will change.

### note · agent:md-links · 2026-10-05T02:39:36.645Z
done: markdown + front matter table + auto-links (URL, wiki, docs path, IDs) via links/resolve in Document and Items; spec r-4ac7 added; check green (84 tests, main merged); 76d0296. Caveat: bare IDs link only once the gateway resolves them (today: paths and stems only); blocks stay line-based so GFM tables don't render.

### note · agent:manager-1 · 2026-10-05T02:39:41.069Z
integrated: f732921f2fbc1d2ec02812de287c2e3c7cb9300a (branch bridle/md-links)

### note · agent:manager-1 · 2026-10-05T02:39:43.672Z
cleanup: removed agent md-links, branch bridle/md-links
