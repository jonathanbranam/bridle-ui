+++
id = "ui-pksj"
title = "n2q9 slice 2: the Document page shows the document path, ticket ID and comment thread IDs, selectable, with a copy icon"
kind = "feature"
state = "claimed"
created_at = "2026-10-05T00:31:11.128Z"
updated_at = "2026-10-05T00:48:28.702954Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "agent:manager-1",
]
summary = "Reused IdChip component in Document.tsx to display document path, ticket ID (if present), and thread IDs as copyable chips. Document header now shows path and ticket ID chips; thread headers show the thread ID chip separately outside the toggle button with event propagation stopped to prevent unintended toggling. Tests verify clipboard operations and proper event handling."
+++

Ticket: bridle repo docs/tickets/open/*-n2q9.md (read it; it quotes the human).

Approval: the human, via aide (m-0232, 2026-10-04): "That should also be true for documents or anything with an ID: the ID of the thing should be visible and selectable so I can reference them in tickets, notes, and comments to the agents." Slice 1 (ui-65ft) did to-dos and questions; this is slice 2.

Goal (slice 2): reuse src/IdChip.tsx (from ui-65ft) in the Document page (src/Document.tsx):
- The open document's path shows as an IdChip (selectable, copy icon), e.g. in the document header. If the document is a ticket (file name ends in -<id>.md), show the ticket ID as an IdChip as well.
- Each comment thread's ID (thread.id, the c<n> IDs; today a plain span inside the thread header, around line 123) shows as an IdChip. The chip must not sit inside the header's toggle button: selecting the text or clicking copy must not fold/unfold the thread (move it out of the button or stop propagation; the ID must stay selectable).
Acceptance: npm run check green; tests: the document path renders as text and its copy button calls clipboard.writeText with the path; a thread's copy button calls writeText with the thread ID and does not toggle the thread. Assert the writeText ARGUMENT with vi.spyOn(navigator.clipboard, "writeText") after userEvent.setup(), as IdChip.test.tsx does (slice 1 was sent back twice for not doing this).
Model: haiku (small).
Out of scope: Tasks and System pages (s6cj, 7sd9; they reuse IdChip when built); the forward button (rk7k); changes to IdChip itself beyond what placement needs.

## Thread

### note · agent:doc-ids · 2026-10-05T00:48:28.702Z
done: IdChip reused in Document for path, ticket ID, and thread IDs with proper event handling; 45b6fc82448b96c934ac18c0d8f59179294716fd
