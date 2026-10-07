+++
id = "ui-g49c"
title = "Mobile: every text input, select and textarea is at least 16px so iOS doesn't zoom on focus (g49c's mobile rule, never applied to bridle-ui)"
kind = "bug"
state = "integrated"
created_at = "2026-10-06T01:35:01.011Z"
updated_at = "2026-10-07T00:04:52.040018Z"
created_by = "external:orchestrator"
watchers = [
    "external:orchestrator",
    "external:aide",
]
size = "S"
branch = "bridle/inputs16"
commit = "60e28191abc2b0c58635e465da8b2699fca88c63"
summary = "Global CSS in src/index.css sets input/textarea/select to 16px (unlayered, beats Tailwind text-sm) plus body touch-action: manipulation; index.html viewport now has maximum-scale=1, viewport-fit=cover. src/mobile-inputs.test.ts fails if the rule drops under 16px, a field sets its own text-xs/text-sm/font-size, or the viewport meta regresses. Spec r-16f1 added to design/specs/system.md. Not yet installed on the live site (manager to run install-ui)."
+++

original id: g49c
The human (2026-10-05 late evening, via aide): "What happened to the ticket to fix all text input fields to be the minimum size to prevent browsers zooming? ... It hasn't been done. It's constantly zooming on my phone ... I think they have to be, what, 16 minimum ... get that fixed. It's really frustrating." Do it the way track-web did (ticket g49c in the bridle repo, docs/tickets/open/rule-packs-for-the-web-and-for-mobile-standard-forms-and-ari-g49c.md, 'What track-web did'): font-size >= 16px on every input/select/textarea, the viewport meta and touch-action. Add a check (test or lint) so a new input can't go under 16px. Done = installed on the live site; say what's live.

## Thread

### note · external:aide · 2026-10-06T01:35:26.669Z
watching the task

### note · system · 2026-10-06T22:14:01.848Z
open 4h, never planned: back to pending. Ready it again once someone will plan it.

### note · agent:inputs16 · 2026-10-06T23:38:58.257Z
done: tip 57023b5, check green (exit 0, 110 tests). Not installed live yet.

### note · external:orchestrator · 2026-10-07T00:04:24.781Z
From orchestrator: inputs16 finished ui-g49c (tip 57023b5, check green, 110 tests; see its task comment). Its report to you likely got lost to the send bug. Land it, then start ui-mk9b. Tell me once it's landed and I'll install it.

### note · agent:manager-1 · 2026-10-07T00:04:31.337Z
integrated: 60e28191abc2b0c58635e465da8b2699fca88c63 (branch bridle/inputs16)

### note · agent:manager-1 · 2026-10-07T00:04:35.870Z
cleanup: removed agent inputs16, branch bridle/inputs16

### note · external:orchestrator · 2026-10-07T00:04:49.391Z
orchestrator: installed on the live site (60e2819).

### note · agent:manager-1 · 2026-10-07T00:04:52.040Z
manager-1: landed as 60e2819 on main, pushed. Orchestrator: please install-ui. Started clearbtn on ui-mk9b.
