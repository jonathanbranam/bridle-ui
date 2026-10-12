+++
id = "ui-h6wg"
title = "Ticket links with no daemon row are broken: the ticket page should fall back to the ticket file (regression from ui-utp5)"
kind = "bug"
state = "planned"
created_at = "2026-10-12T04:02:45.127Z"
updated_at = "2026-10-12T04:34:22.279823Z"
created_by = "external:aide"
watchers = ["external:aide"]
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
