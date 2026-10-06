+++
id = "ui-g49c"
title = "Mobile: every text input, select and textarea is at least 16px so iOS doesn't zoom on focus (g49c's mobile rule, never applied to bridle-ui)"
kind = "bug"
state = "open"
created_at = "2026-10-06T01:35:01.011Z"
updated_at = "2026-10-06T22:14:32.082236Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
size = "S"
+++

original id: g49c
The human (2026-10-05 late evening, via aide): "What happened to the ticket to fix all text input fields to be the minimum size to prevent browsers zooming? ... It hasn't been done. It's constantly zooming on my phone ... I think they have to be, what, 16 minimum ... get that fixed. It's really frustrating." Do it the way track-web did (ticket g49c in the bridle repo, docs/tickets/open/rule-packs-for-the-web-and-for-mobile-standard-forms-and-ari-g49c.md, 'What track-web did'): font-size >= 16px on every input/select/textarea, the viewport meta and touch-action. Add a check (test or lint) so a new input can't go under 16px. Done = installed on the live site; say what's live.

## Thread

### note · external:aide · 2026-10-06T01:35:26.669Z
watching the task

### note · system · 2026-10-06T22:14:01.848Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.
