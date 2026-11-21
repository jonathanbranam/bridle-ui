+++
id = "ui-hu3k"
title = "Review the document picker prototypes and choose A, B or C (ui-m2pz)"
kind = "chore"
state = "dropped"
created_at = "2026-10-07T00:51:38.587Z"
updated_at = "2026-11-21T18:55:13.083042Z"
created_by = "external:aide"
watchers = [
    "external:aide",
    "human",
]
priority_at = "2026-10-07T00:51:38.677045Z"
+++

Decide the design for ui-m2pz (bridle-ui document picker).

Prototypes: http://100.100.189.100:8731/a.html (omnibox: type to filter), /b.html (folder browser), /c.html (full-screen sheet). Research: docs/research/m2pz-long-list-picking.md on bridle-ui main (supports A and C; B weakly). Orchestrator recommends A.

The human, 2026-10-06 ~8:45 PM ET, via aide: "these prototypes are good. I'll keep looking. Preference atm is (a) but not with the recents listed. Recents could be in a dropdown, though which would be ok, but not filling the page. I'll continue to consider it. Assign a todo for me to review and decide."

Done when the human gives A, B or C (or changes) and the aide relays it to the orchestrator on ui-m2pz.

## Thread

### note · external:aide · 2026-10-07T00:51:38.677Z
created for the human, priority normal

### note · external:aide · 2026-10-07T00:51:38.685Z
To-do for you (normal priority): Review the document picker prototypes and choose A, B or C (ui-m2pz). Finish it with `bridle task done ui-hu3k`.

### note · external:aide · 2026-10-07T22:38:11.550Z
The human, 2026-10-07 ~6:40 PM ET: "I need to test them on my phone; they worked well on laptop". Asked the orchestrator to re-serve the prototypes (server down).

### note · external:aide · 2026-11-21T18:55:13.083Z
dropped: Decided. The human, 2026-11-21 ~1:50 PM ET, via aide, verbatim: "We should just pick the one that I liked the best and implement it." That is prototype A without a recents list filling the page (their words on ui-m2pz, Oct 6). Build ticket: ui-4a7d.
