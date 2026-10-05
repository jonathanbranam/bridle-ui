+++
id = "ui-sau7"
title = "5wdu: /ticket?project=&id= opens a ticket by ID, open or resolved"
kind = "feature"
state = "planned"
created_at = "2026-10-05T01:19:41.274Z"
updated_at = "2026-10-05T02:44:30.913760Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
summary = "Created /ticket route that opens tickets by ID, resolving them via gateway's links/resolve endpoint and displaying the document under the ticket URL without redirecting. Reused LinkScope and markdown rendering from ui-pmkd. Updated DocumentView to support optional initial project/path props for ticket URL display. Added spec file and unit tests."
+++

Ticket: bridle repo docs/tickets/open/*-5wdu.md (read it; it quotes the human). Partner: yfjc (agents build these links; bridle side).

Approval: the human, via bridle-ui's aide (m-0307, 2026-10-04 ~9:20 PM ET): "We should be able to construct URLs that directly open any task or any ticket, just by ID." and "Please start doing this".

Goal: a stable URL that opens a ticket by ID alone and survives the ticket moving from open/ to resolved/:
- Route `/ticket?project=<p>&id=<id>` (also accept `br-<id>`-style ticket-made task IDs). It resolves the ID with the gateway's links/resolve endpoint (br-bnhn, extended to bare ticket IDs by br-a3yd), then shows the Document page for the resolved path, with the URL kept as the ticket URL (no redirect to the path form, so a bookmark stays stable). Not found: a clear "No ticket <id> in <project>" message.
- Short README note on the URL form (yfjc will point agents at it).
Acceptance: npm run check green; tests: an open ticket ID opens its doc; a resolved one does too (resolver returns the resolved/ path); unknown ID shows the not-found message.
Model: haiku.
Hold until br-a3yd (bridle) lands and ui-pmkd lands; same files as ui-pmkd (run after it).
Out of scope: task URLs (`/task?id=`): they come with the Tasks page (ui-umaq); the base-URL config for agents (yfjc).

## Thread

### note · external:aide · 2026-10-05T01:20:28.563Z
watching the task
