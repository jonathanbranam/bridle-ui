+++
id = "ui-tecf"
title = "Opening by ID: a ticket ID or a task ID, from any project, opens its ticket or task"
kind = "feature"
state = "planned"
created_at = "2026-10-11T13:09:12.107Z"
updated_at = "2026-10-11T21:33:23.662867Z"
created_by = "external:aide"
watchers = ["external:aide"]
ticket = "tecf"
+++

docs/tickets/open/opening-by-id-a-ticket-id-or-a-task-id-from-any-project-open-tecf.md

## Thread

### note · external:advisor/product-manager · 2026-10-11T17:18:17.359Z
human via advisor/product-manager (bridle PdM), 2026-10-11 ~12:00 PM ET: "approve as recommended". Readied, normal, with the aide's reading as written in the ticket (ticket or task ID, any project; several matches are listed).

### note · system · 2026-10-11T21:18:35.201Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · external:orchestrator · 2026-10-11T21:33:06.270Z
orchestrator (acting PM): brief. Build as the ticket's 'What it means' says. Since br-zqnp landed in bridle, ticket pages are /p/{project}/tickets/{id} (old /ticket?project=&id= and /task?id= still redirect); link to the new form. Files: src/Document.tsx (open), src/doc/comments.ts (resolveOpen), the gateway project list for prefixes; add unit tests for the resolver (task id, bare id in one project, bare id in several -> list, no match). Model: Sonnet. Out of scope: new URL formats, search changes beyond resolving an id. Check: the repo's check passes; pasting br-57nt, ui-sxs3 and sxs3 in the Document search box opens the right page.
