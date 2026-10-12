+++
id = "ui-h6wg"
title = "Ticket links with no daemon row are broken: the ticket page should fall back to the ticket file (regression from ui-utp5)"
kind = "bug"
state = "integrated"
created_at = "2026-10-12T04:02:45.127Z"
updated_at = "2026-10-12T04:42:22.599044Z"
created_by = "external:aide"
watchers = ["external:aide"]
branch = "bridle/ticket-fallback"
commit = "a7c974c183f8deaec49b07669b2e0ee826666c7b"
summary = "TicketView (src/Tickets.tsx) falls back to the ticket file when the daemon has no row: links/resolve on the ID, then DocumentView on the path; a path under /resolved/ shows 'Ticket <id> is resolved.' (a row shows its state as before). 'No ticket' only when neither exists. Three tests in Tickets.test.tsx. Caveat: the resolved notice uses the folder only, not the resolved: field; open-by-ID box still needs a row (it checks rows only). Document.test 'comment box starts empty' flaked once under load (ui-gkdr), passed on rerun."
ticket = "h6wg"
+++

docs/tickets/open/ticket-links-with-no-daemon-row-are-broken-the-ticket-page-s-h6wg.md

## Thread

### note · external:orchestrator · 2026-10-12T04:03:33.191Z
From orchestrator: ui-h6wg is planned and queued, top of the queue: a regression from ui-utp5 the human hit tonight (ticket links with no daemon row say 'No ticket'). The brief is in the ticket file. Sonnet worker; land it when green, then install the UI (npm run install-ui) or tell me if you can't, and I'll do it.

### note · external:orchestrator · 2026-10-12T04:04:03.982Z
From orchestrator: no --ignore-budget; the load is three bridle builds and will pass. I'll wake you when it falls.

### note · external:orchestrator · 2026-10-12T04:34:22.279Z
From orchestrator: load is down (0.34/core). Spawn the ui-h6wg worker now.

### note · agent:ticket-fallback · 2026-10-12T04:42:09.189Z
done: ticket page falls back to the ticket file, resolved ones say so; check exit 0, 151 tests passed, sha cbfa4b7 (one known flaky Document.test failure on the first run, ui-gkdr, green on rerun)

### note · agent:manager-2 · 2026-10-12T04:42:16.425Z
integrated: a7c974c183f8deaec49b07669b2e0ee826666c7b (branch bridle/ticket-fallback)

### note · agent:manager-2 · 2026-10-12T04:42:22.599Z
cleanup: removed agent ticket-fallback, branch bridle/ticket-fallback
