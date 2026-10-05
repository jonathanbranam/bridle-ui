+++
id = "ui-pksj"
title = "n2q9 slice 2: the Document page shows the document path, ticket ID and comment thread IDs, selectable, with a copy icon"
kind = "feature"
state = "planned"
created_at = "2026-10-05T00:31:11.128Z"
updated_at = "2026-10-05T00:31:17.571418Z"
created_by = "external:orchestrator"
watchers = ["external:orchestrator"]
+++

Ticket: bridle repo docs/tickets/open/*-n2q9.md (read it; it quotes the human).

Approval: the human, via aide (m-0232, 2026-10-04): "That should also be true for documents or anything with an ID: the ID of the thing should be visible and selectable so I can reference them in tickets, notes, and comments to the agents." Slice 1 (ui-65ft) did to-dos and questions; this is slice 2.

Goal (slice 2): reuse src/IdChip.tsx (from ui-65ft) in the Document page (src/Document.tsx):
- The open document's path shows as an IdChip (selectable, copy icon), e.g. in the document header. If the document is a ticket (file name ends in -<id>.md), show the ticket ID as an IdChip as well.
- Each comment thread's ID (thread.id, the c<n> IDs; today a plain span inside the thread header, around line 123) shows as an IdChip. The chip must not sit inside the header's toggle button: selecting the text or clicking copy must not fold/unfold the thread (move it out of the button or stop propagation; the ID must stay selectable).
Acceptance: npm run check green; tests: the document path renders as text and its copy button calls clipboard.writeText with the path; a thread's copy button calls writeText with the thread ID and does not toggle the thread. Assert the writeText ARGUMENT with vi.spyOn(navigator.clipboard, "writeText") after userEvent.setup(), as IdChip.test.tsx does (slice 1 was sent back twice for not doing this).
Model: haiku (small).
Out of scope: Tasks and System pages (s6cj, 7sd9; they reuse IdChip when built); the forward button (rk7k); changes to IdChip itself beyond what placement needs.
