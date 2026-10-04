+++
id = "ui-pmkd"
title = "bnhn + a3yd: render markdown and front matter; link wiki links, docs paths, URLs and ticket IDs everywhere"
kind = "feature"
state = "pending"
created_at = "2026-10-04T22:32:12.091Z"
updated_at = "2026-10-04T22:32:12.091Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
size = "M"
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
