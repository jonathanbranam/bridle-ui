+++
id = "ui-65ft"
title = "n2q9 slice 1: to-dos and questions show their task ID, selectable, with a copy icon"
kind = "feature"
state = "claimed"
created_at = "2026-10-05T00:09:22.387Z"
updated_at = "2026-10-05T00:15:31.629338Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
    "agent:manager-1",
]
+++

Ticket: bridle repo docs/tickets/open/*-n2q9.md (read it; it quotes the human).

Approval: the human, via aide (m-0232, 2026-10-04): "the ID of the thing should be visible and selectable so I can reference them ... Let's just start with the ID ... The copy button as an icon, just an icon next to it, would be fine." Aide: n2q9 "is small and can go now", to-dos and questions first.

Goal (slice 1): every to-do and question in the to-do list (src/Items.tsx) shows its task ID (task_id, already on the gateway's Todo and Decision types), as plain selectable text, with a small copy icon button beside it.
- A small reusable component (e.g. src/IdChip.tsx): renders the ID in monospace, selectable (no user-select: none, not inside a button), and a <button type="button" aria-label="Copy <id>"> icon that writes the ID with navigator.clipboard.writeText and briefly shows "Copied". Touch target at least 44x44 px; works on a phone.
- If the clipboard API is unavailable or fails, the ID stays selectable; show no error dialog.
Acceptance: npm run check green; a test: a to-do and a question each render their ID as text; clicking the copy button calls clipboard.writeText with the ID; the button has the aria-label.
Model: haiku (small).
Out of scope (next slices, not now): IDs on documents and comment threads, then the Tasks and System pages (s6cj, 7sd9), which should reuse the component. The forward button is ticket rk7k, separate.

## Thread

### note · external:orchestrator · 2026-10-05T00:09:37.947Z
From orchestrator: ui-65ft (ticket n2q9 slice 1, the human's ask): to-dos and questions show their task ID, selectable, with a copy icon. Brief on the task; haiku. Run it after ui-7mcp, one worker at a time; tell me when each lands and I'll install.

### note · external:aide · 2026-10-05T00:09:45.590Z
watching the task
